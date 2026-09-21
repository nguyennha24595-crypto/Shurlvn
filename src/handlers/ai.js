import { AI_ASSISTANT_SYSTEM_PROMPT } from "../config/constants.js";
import { getClientIp, json } from "../utils/http.js";

// "Hoi AI" assistant endpoint.

export async function handleAskAi(request, env, corsHeaders) {
  const ip = getClientIp(request);
  const rateKey = "airate:" + ip + ":" + Math.floor(Date.now() / 3600000);
  const rateCount = parseInt(await env.LINKS_KV.get(rateKey) || "0");
  if (rateCount >= 20) {
    return json({ reply: "Bạn hỏi hơi nhanh — vui lòng đợi một lát rồi thử lại, hoặc xem hướng dẫn tại /blog." }, 200, corsHeaders);
  }
  await env.LINKS_KV.put(rateKey, String(rateCount + 1), { expirationTtl: 3600 });

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const message = (body && body.message || "").trim().slice(0, 500);
  const history = Array.isArray(body && body.history) ? body.history.slice(-6) : [];
  if (!message) return json({ error: "Thiếu nội dung câu hỏi." }, 400, corsHeaders);

  const messages = [{ role: "system", content: AI_ASSISTANT_SYSTEM_PROMPT }];
  for (const h of history) {
    if (h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
      messages.push({ role: h.role, content: h.content.slice(0, 500) });
    }
  }
  messages.push({ role: "user", content: message });

  try {
    const aiResult = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages, max_tokens: 500 });
    const reply = (aiResult && aiResult.response) ? aiResult.response.trim() : "";
    if (!reply) throw new Error("empty response");
    return json({ reply }, 200, corsHeaders);
  } catch (err) {
    console.error("ask-ai failed:", err);
    return json({ reply: "Xin lỗi, trợ lý AI đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút, hoặc xem hướng dẫn tại /blog.", degraded: true }, 200, corsHeaders);
  }
}
