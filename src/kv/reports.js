// KV: link reports (abuse/safety reports submitted by visitors).

export async function putReport(env, report) {
  await env.LINKS_KV.put("report:" + report.id, JSON.stringify(report));
}

export async function listReports(env) {
  const reports = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "report:", cursor });
    for (const k of page.keys) {
      const raw = await env.LINKS_KV.get(k.name);
      if (raw) reports.push(JSON.parse(raw));
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  return reports.sort((a, b) => b.reportedAt.localeCompare(a.reportedAt));
}

export async function deleteReport(env, id) {
  await env.LINKS_KV.delete("report:" + id);
}
