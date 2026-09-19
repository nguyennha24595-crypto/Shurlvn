// Danh sách công cụ trình duyệt. Thêm công cụ mới: tạo src/tools/<ten>.js (xem charCounter.js) rồi thêm vào TOOLS.

import { charCounter } from "./charCounter.js";
import { utmBuilder } from "./utmBuilder.js";
import { slugTool } from "./slugTool.js";

export const TOOLS = [charCounter, utmBuilder, slugTool];

export function listTools() {
  return TOOLS;
}

export function getToolBySlug(lang, slug) {
  for (const t of TOOLS) {
    if (t[lang] && t[lang].slug === slug) return t;
  }
  return null;
}

// Đường dẫn công khai của 1 công cụ theo ngôn ngữ: /tools/<slug> (vi) hoặc /en/tools/<slug> (en).
export function toolPath(tool, lang) {
  return (lang === "en" ? "/en/tools/" : "/tools/") + tool[lang].slug;
}

export function toolsIndexPath(lang) {
  return lang === "en" ? "/en/tools" : "/tools";
}
