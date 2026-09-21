// KV: links — CRUD, short-code/URL generation. deleteLinkKV also cascades to orphaned dynamic-QR records.

import { normalizeCustomDomain } from "../config/constants.js";
import { listAllQrRecords, deleteQrRecord } from "./qr.js";

export async function getLink(env, code) {
  const raw = await env.LINKS_KV.get("link:" + code);
  return raw ? JSON.parse(raw) : null;
}

export async function putLink(env, link) {
  await env.LINKS_KV.put("link:" + link.code, JSON.stringify(link));
}

export async function deleteLinkKV(env, code) {
  await env.LINKS_KV.delete("link:" + code);
  await env.LINKS_KV.delete("clicks:" + code);
  // A Dynamic QR (see "KV: DYNAMIC QR" below) only stores a reference to this link's code and
  // resolves everything else live via getLink — without this, purging the link leaves an
  // orphaned "qr:" record that can never resolve (shows as a broken row forever).
  const orphanedQr = (await listAllQrRecords(env)).filter(q => q.code === code);
  await Promise.all(orphanedQr.map(q => deleteQrRecord(env, q.id)));
}

export async function listAllLinks(env) {
  if (env._linksCache && env._linksCacheTime && (Date.now() - env._linksCacheTime < 30000)) { return env._linksCache; }
  const links = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "link:", cursor });
    // Đọc song song tất cả link trong trang này (cùng lúc thay vì lần lượt)
    const pageLinks = await Promise.all(page.keys.map(k => env.LINKS_KV.get(k.name)));
    for (const raw of pageLinks) {
      if (raw) links.push(JSON.parse(raw));
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  env._linksCache = links; env._linksCacheTime = Date.now(); return links;
}

export function generateCode(len) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  let res = "";
  for (let i = 0; i < len; i++) res += chars[arr[i] % chars.length];
  return res;
}

export function shortUrlFor(url, code, customDomain) {
  var d = normalizeCustomDomain(customDomain);
  if (d) {
    return `https://${d}/${code}`;
  }
  return `${url.origin}/${code}`;
}
