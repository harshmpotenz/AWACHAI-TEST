import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8080;

// ---- OpenRouter config ----
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || "https://awachaitest.vercel.app";
const OPENROUTER_APP_NAME = process.env.OPENROUTER_APP_NAME || "TEST HELPER";

if (!OPENROUTER_API_KEY) {
  console.error("❌ Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3.3-70b-instruct";

// ---- In-memory session store (demo only) ----
// sessionId -> { history: [{role, content}], lastAiJson }
const sessions = new Map();

// Keep last N messages (you requested last 10 user + last 10 assistant = 20 total)
const MAX_HISTORY = 20;

// Blocklist (apply to user input + model options)
const BLOCKED_IP = [
  "marvel", "disney", "pixar", "dc", "spiderman", "batman", "superman",
  "avengers", "star wars", "pokemon", "mickey", "elsa", "nintendo",
];

// ---- System prompt (STRICT) ----
// IMPORTANT: This prompt forces JSON-only behavior.
const SYSTEM_PROMPT = `
You are an expert AI Art Director. Your job is to convert the user’s messages into a structured image prompt with exactly four parts:
Subject
Action
Style
Context

You must maintain the current working values of Subject, Action, Style, and Context across turns.

Process:
1) Read the user’s latest message and update the working values.
2) Determine which parts are present.
3) Identify missing parts in this exact priority order:
A. Subject
B. Action
C. Style
D. Context

Rules:
- Completion is defined as having Subject, Action, and Style. Context can be auto filled.
- If Style is present and Context is missing, you must auto fill Context to match the Style.
- If any of Subject, Action, or Style are missing, you must ask exactly one question that requests the highest priority missing part.
- When you ask a question, you must provide exactly 3 creative, short button options that fit the missing part.
- Never include brand names or copyrighted character names in your options. Keep options generic.
- Keep each option under 6 words.
- Keep the message concise.
- The final prompt format must be:
[Subject] [Action], [Style], [Context]

Output format:
Return a single JSON object with exactly these keys:
message: string
options: array of exactly 3 strings
is_complete: boolean
final_prompt: string

Rules for fields:
- If is_complete is false:
  - final_prompt must be an empty string
- If is_complete is true:
  - message must be a short confirmation sentence
  - options must be an empty array
  - final_prompt must be the final combined prompt: [Subject] [Action], [Style], [Context]

CRITICAL:
- Output ONLY the JSON object. No extra text. No markdown. No code fences.
`.trim();

// ---- Helpers ----
function normalizeText(s) {
  return String(s || "").toLowerCase();
}

function containsBlockedIP(text) {
  const t = normalizeText(text);
  return BLOCKED_IP.some((w) => t.includes(w));
}

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { history: [], lastAiJson: null });
  }
  return sessions.get(sessionId);
}

function trimHistory(history) {
  if (history.length <= MAX_HISTORY) return history;
  return history.slice(history.length - MAX_HISTORY);
}

function safeFallbackOptionsForBlocked() {
  return ["original hero", "comic action scene", "city rooftop"];
}

function safeFallbackOptionsGeneric(slotName) {
  // If model messes up options, we replace with safe generic ones
  // Keep under 6 words each.
  if (slotName === "subject") return ["a lone traveler", "a wild animal", "a quiet landscape"];
  if (slotName === "action") return ["walking slowly", "standing still", "looking into distance"];
  if (slotName === "style") return ["cinematic realism", "watercolor illustration", "minimal ink drawing"];
  return ["soft morning light", "dramatic shadows", "foggy atmospheric haze"];
}

function enforceSchema(obj) {
  // Ensure object has exactly required keys (we won't delete extra keys here, but you can)
  if (!obj || typeof obj !== "object") throw new Error("Response is not an object");

  if (!("message" in obj)) throw new Error("Missing key: message");
  if (!("options" in obj)) throw new Error("Missing key: options");
  if (!("is_complete" in obj)) throw new Error("Missing key: is_complete");
  if (!("final_prompt" in obj)) throw new Error("Missing key: final_prompt");

  if (typeof obj.message !== "string") throw new Error("message must be string");
  if (!Array.isArray(obj.options)) throw new Error("options must be array");
  if (typeof obj.is_complete !== "boolean") throw new Error("is_complete must be boolean");
  if (typeof obj.final_prompt !== "string") throw new Error("final_prompt must be string");

  // Enforce rules
  if (obj.is_complete === false) {
    // Must have exactly 3 options; final_prompt must be empty
    if (obj.final_prompt !== "") obj.final_prompt = "";
    if (obj.options.length !== 3) {
      // Fix server-side: force 3 options (generic)
      obj.options = safeFallbackOptionsGeneric("action").slice(0, 3);
    }
  } else {
    // Must have options empty; final_prompt non-empty
    obj.options = [];
    if (!obj.final_prompt.trim()) throw new Error("final_prompt must be non-empty when complete");
    // message should be short; we won't hard-enforce length, but can truncate
    if (obj.message.length > 120) obj.message = obj.message.slice(0, 117) + "...";
  }

  // IP filtering on options
  if (obj.options && obj.options.length) {
    const cleaned = obj.options.filter((opt) => !containsBlockedIP(opt));
    while (cleaned.length < 3) cleaned.push(...safeFallbackOptionsGeneric("action"));
    obj.options = cleaned.slice(0, 3);
  }

  return obj;
}

async function callOpenRouter(messages, temperature = 0.7, max_tokens = 400) {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": OPENROUTER_SITE_URL,     // optional but recommended by OpenRouter
      "X-OpenRouter-Title": OPENROUTER_APP_NAME // optional but recommended by OpenRouter
    },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      max_tokens,
      messages,
      // If your provider supports it, you can add:
      // response_format: { type: "json_object" }
      // but not all models/providers honor it.
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in OpenRouter response");
  return content;
}

// ---- Routes ----
app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/consult", async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "sessionId is required (string)" });
    }
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "userMessage is required (string)" });
    }

    // Blocked IP words in user input -> return safe response immediately
    if (containsBlockedIP(userMessage)) {
      const responseObj = {
        message: "Please describe your idea without brand or character names.",
        options: safeFallbackOptionsForBlocked(),
        is_complete: false,
        final_prompt: "",
      };
      return res.json(responseObj);
    }

    const session = getSession(sessionId);

    // Build message list: system + history + new user message
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...session.history,
      { role: "user", content: userMessage },
    ];

    // 1) Call model
    let raw = await callOpenRouter(messages);

    // 2) Parse JSON (strict)
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // Retry once with repair instruction
      const repairMessages = [
        { role: "system", content: SYSTEM_PROMPT + "\n\nReturn only valid JSON matching the schema. No extra text." },
        ...session.history,
        { role: "user", content: userMessage },
      ];
      raw = await callOpenRouter(repairMessages, 0.6, 350);
      parsed = JSON.parse(raw);
    }

    // 3) Enforce schema and rules server-side
    const finalObj = enforceSchema(parsed);

    // 4) Save history (store assistant as its JSON string)
    session.history.push({ role: "user", content: userMessage });
    session.history.push({ role: "assistant", content: JSON.stringify(finalObj) });
    session.history = trimHistory(session.history);
    session.lastAiJson = finalObj;

    return res.json(finalObj);
  } catch (err) {
    console.error("❌ /api/consult error:", err.message);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
      options: ["try again", "shorter idea", "different subject"],
      is_complete: false,
      final_prompt: "",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});