// Assistant coach — la coach lui parle en langage naturel ("Zoé a fait de la
// course lundi, ajoute-le" / "retire les squats de mercredi pour Camille")
// et il modifie directement la fiche cliente concernée. Appelé depuis
// generateur.html via supabaseClient.functions.invoke("assistant-coach", ...),
// qui transmet automatiquement le jeton de session de la coach — toutes les
// opérations sur la base tournent donc SOUS SON PROPRE COMPTE (RLS "authenticated
// full access"), jamais avec une clé service_role : l'assistant n'a jamais
// plus de droits que la coach elle-même n'en a déjà dans l'app.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS_HEADERS, "content-type": "application/json" } });
}

const TOOLS = [
  {
    name: "ajouter_activite_libre",
    description: "Enregistre une activité que la cliente a faite de son côté, en dehors du planning prévu (course, vélo, marche, cours de danse...).",
    input_schema: {
      type: "object",
      properties: {
        jour: { type: "string", enum: ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"] },
        description: { type: "string", description: "Ex : \"Course à pied 30 min\"" },
      },
      required: ["jour", "description"],
    },
  },
  {
    name: "ajouter_exercice",
    description: "Ajoute un exercice de la bibliothèque à la séance d'un jour donné du planning sport actuel de la cliente.",
    input_schema: {
      type: "object",
      properties: {
        jour: { type: "string", enum: ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"] },
        nom_exercice: { type: "string", description: "Nom (même partiel) de l'exercice à ajouter, ex : \"squat\", \"hip thrust\"" },
      },
      required: ["jour", "nom_exercice"],
    },
  },
  {
    name: "retirer_exercice",
    description: "Retire un exercice de la séance d'un jour donné du planning sport actuel de la cliente.",
    input_schema: {
      type: "object",
      properties: {
        jour: { type: "string", enum: ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"] },
        nom_exercice: { type: "string", description: "Nom (même partiel) de l'exercice à retirer" },
      },
      required: ["jour", "nom_exercice"],
    },
  },
  {
    name: "lire_suivi_recent",
    description: "Consulte les derniers check-ins hebdomadaires et l'historique de performances (poids/répétitions) de la cliente, pour répondre à une question sur sa progression.",
    input_schema: { type: "object", properties: {} },
  },
];

function planResume(row: any) {
  const plan = row.dernier_planning_sport;
  if (!plan) return "Aucun planning sport généré pour l'instant.";
  const seances = (plan.seances || []).map((s: any) =>
    `- ${s.jour} (${s.typeJour}) : ${(s.exercices || []).map((e: any) => `${e.nom} [${e.zone}, ${e.format}]`).join(", ") || "aucun exercice"}`
  ).join("\n");
  const repos = (plan.reposJours || []).map((r: any) => `- ${r.jour} : repos`).join("\n");
  return `${seances}\n${repos}`;
}

function systemPrompt(row: any) {
  return `Tu es l'assistant d'une coach sportive et nutrition indépendante ("Coaching Sur-Mesure"). Elle te parle en langage naturel pour ajuster le planning d'UNE cliente à la fois, en direct, pendant qu'elle travaille. Réponds toujours en français, de façon brève et concrète (2-3 phrases max sauf si elle demande un détail). Utilise les outils fournis pour agir réellement sur la fiche plutôt que de décrire ce qu'il faudrait faire.

Fiche de la cliente actuellement ouverte :
- Prénom : ${row.prenom}
- Objectif : ${row.objectif || "non renseigné"}${row.objectif_secondaire ? " / " + row.objectif_secondaire : ""}
- Niveau : ${row.niveau || "non renseigné"}
- Zones prioritaires : ${(row.zones_prioritaires || []).join(", ") || "aucune"}
- Matériel disponible : ${row.materiel || "non renseigné"}

Planning sport actuel de la semaine :
${planResume(row)}

Si la coach te demande d'ajouter/retirer un exercice qui n'existe pas clairement dans la bibliothèque ou sur le jour demandé, dis-le clairement plutôt que d'inventer un résultat. Si elle te pose une question sur la progression de la cliente (poids, assiduité...), utilise l'outil "lire_suivi_recent" avant de répondre — ne devine jamais ces chiffres.`;
}

async function executeTool(name: string, input: any, ctx: { supabase: any; clienteId: string; row: any }) {
  if (name === "ajouter_activite_libre") {
    const { error } = await ctx.supabase.from("activites_libres").insert({
      cliente_id: ctx.clienteId, jour: input.jour, description: String(input.description).slice(0, 300),
    });
    return { output: error ? { ok: false, erreur: error.message } : { ok: true }, planModifie: false };
  }

  if (name === "ajouter_exercice") {
    const { data: exercices } = await ctx.supabase.from("exercices").select("*");
    const nomCherche = String(input.nom_exercice).toLowerCase();
    const candidat = (exercices || []).find((e: any) => e.nom.toLowerCase().includes(nomCherche));
    if (!candidat) return { output: { ok: false, erreur: "Aucun exercice de la bibliothèque ne correspond à ce nom." }, planModifie: false };
    const plan = ctx.row.dernier_planning_sport;
    const seance = (plan?.seances || []).find((s: any) => s.jour === input.jour);
    if (!seance) return { output: { ok: false, erreur: "Pas de séance de sport ce jour-là (jour de repos ou hors planning)." }, planModifie: false };
    seance.exercices = seance.exercices || [];
    seance.exercices.push(candidat);
    const { error } = await ctx.supabase.from("clientes").update({ dernier_planning_sport: plan }).eq("id", ctx.clienteId);
    return { output: error ? { ok: false, erreur: error.message } : { ok: true, exercice_ajoute: candidat.nom }, planModifie: !error };
  }

  if (name === "retirer_exercice") {
    const plan = ctx.row.dernier_planning_sport;
    const seance = (plan?.seances || []).find((s: any) => s.jour === input.jour);
    if (!seance) return { output: { ok: false, erreur: "Pas de séance de sport ce jour-là." }, planModifie: false };
    const nomCherche = String(input.nom_exercice).toLowerCase();
    const idx = (seance.exercices || []).findIndex((e: any) => e.nom.toLowerCase().includes(nomCherche));
    if (idx === -1) return { output: { ok: false, erreur: "Cet exercice n'est pas dans la séance de ce jour." }, planModifie: false };
    const [retire] = seance.exercices.splice(idx, 1);
    const { error } = await ctx.supabase.from("clientes").update({ dernier_planning_sport: plan }).eq("id", ctx.clienteId);
    return { output: error ? { ok: false, erreur: error.message } : { ok: true, exercice_retire: retire.nom }, planModifie: !error };
  }

  if (name === "lire_suivi_recent") {
    const [{ data: checkins }, { data: performances }, { data: activites }] = await Promise.all([
      ctx.supabase.from("checkins").select("*").eq("cliente_id", ctx.clienteId).order("created_at", { ascending: false }).limit(4),
      ctx.supabase.from("performances").select("*").eq("cliente_id", ctx.clienteId).order("created_at", { ascending: false }).limit(20),
      ctx.supabase.from("activites_libres").select("*").eq("cliente_id", ctx.clienteId).order("created_at", { ascending: false }).limit(10),
    ]);
    return { output: { checkins: checkins || [], performances: performances || [], activites_libres: activites || [] }, planModifie: false };
  }

  return { output: { ok: false, erreur: "Outil inconnu." }, planModifie: false };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

  try {
    const { cliente_id, message, history } = await req.json();
    if (!cliente_id || !message) return json({ error: "cliente_id et message sont requis." }, 400);

    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: row, error: rowErr } = await supabase.from("clientes").select("*").eq("id", cliente_id).single();
    if (rowErr || !row) return json({ error: "Cliente introuvable, ou tu n'es pas connectée." }, 404);

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) return json({ error: "ANTHROPIC_API_KEY n'est pas configurée sur ce projet Supabase." }, 500);

    const messages: any[] = [...(history || []), { role: "user", content: message }];
    let finalText = "";
    let planModifie = false;

    for (let i = 0; i < 6; i++) {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 1024,
          system: systemPrompt(row),
          messages,
          tools: TOOLS,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        return json({ error: `Erreur Anthropic API : ${errText}` }, 502);
      }
      const data = await resp.json();
      const toolUses = (data.content || []).filter((b: any) => b.type === "tool_use");
      const textBlocks = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
      if (textBlocks) finalText = textBlocks;
      if (!toolUses.length) break;

      messages.push({ role: "assistant", content: data.content });
      const toolResults = [];
      for (const tu of toolUses) {
        const result = await executeTool(tu.name, tu.input, { supabase, clienteId: cliente_id, row });
        if (result.planModifie) planModifie = true;
        toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(result.output) });
      }
      messages.push({ role: "user", content: toolResults });
    }

    // On ne garde dans l'historique renvoyé que les échanges texte simples
    // (question de la coach / réponse finale) — pas les blocs tool_use/tool_result
    // intermédiaires, qui n'ont plus d'utilité une fois l'action exécutée et
    // gonfleraient inutilement chaque requête suivante.
    messages.push({ role: "assistant", content: finalText || "C'est fait." });

    return json({
      reply: finalText || "C'est fait.",
      plan_modifie: planModifie,
      history: messages.filter((m) => typeof m.content === "string").slice(-20),
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
