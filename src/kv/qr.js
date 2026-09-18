// KV: dynamic QR records — a QR is just a saved mapping to a link code; destination always resolves live via getLink.

import { randomHex } from "../utils/crypto.js";
import { shortUrlFor } from "./links.js";

export async function getQrRecord(env, qrId) {
  const raw = await env.LINKS_KV.get("qr:" + qrId);
  return raw ? JSON.parse(raw) : null;
}

export async function putQrRecord(env, qr) {
  await env.LINKS_KV.put("qr:" + qr.id, JSON.stringify(qr));
}

export async function deleteQrRecord(env, qrId) {
  await env.LINKS_KV.delete("qr:" + qrId);
}

export async function listAllQrRecords(env) {
  const list = await env.LINKS_KV.list({ prefix: "qr:" });
  const raws = await Promise.all(list.keys.map(k => env.LINKS_KV.get(k.name)));
  return raws.filter(Boolean).map(r => JSON.parse(r));
}

export function generateQrId() {
  return "q" + randomHex(10);
}

export function qrRecordToResponse(qr, link, url, viewerRole) {
  const resp = {
    id: qr.id,
    title: qr.title || "",
    code: qr.code,
    shortUrl: link ? shortUrlFor(url, link.code, link.customDomain) : null,
    targetUrl: link ? link.url : null,
    scanCount: link ? (link.totalClicks || 0) : 0,
    linkExists: !!link,
    color: qr.color || "#000000",
    bgcolor: qr.bgcolor || "",
    size: qr.size || 200,
    margin: qr.margin,
    dotStyle: qr.dotStyle || "square",
    logoDataUrl: qr.logoDataUrl || "",
    createdAt: qr.createdAt
  };
  if (viewerRole === "admin") resp.owner = qr.owner;
  return resp;
}
