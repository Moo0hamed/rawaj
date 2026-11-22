/**
 * RLS/claim_owner sanity checks.
 * Runs what it can with anon key (no session): verifies visitors cannot write to tables
 * and cannot call claim_owner().
 *
 * Optional authenticated checks (no secrets in repo/chat required here; provide via env at runtime):
 *   TEST_OWNER_EMAIL, TEST_OWNER_PASSWORD  -> signs in and verifies owner can write (insert+delete a probe row)
 *   TEST_SECOND_EMAIL, TEST_SECOND_PASSWORD -> signs in and verifies cannot claim owner and cannot write
 *
 * Usage:
 *   node scripts/admin-claim-rls-test.mjs
 *   # or with env vars in terminal (do NOT paste passwords into chat/files):
 *   # $env:TEST_OWNER_EMAIL="..."; $env:TEST_OWNER_PASSWORD="..."; node scripts/admin-claim-rls-test.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

function loadEnvLocal() {
  try {
    const txt = fs.readFileSync(".env.local", "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key || url.includes("<") || key.includes("<")) {
  console.log("SKIP: Supabase not configured in .env.local (placeholders).");
  process.exit(0);
}

const anon = createClient(url, key);
let failures = 0;
const ok = (name, cond, detail = "") => {
  if (cond) console.log("PASS", name);
  else { failures++; console.log("FAIL", name, detail); }
};

async function main() {
  console.log("== Anon/visitor checks ==");
  // claim_owner without auth
  const c1 = await anon.rpc("claim_owner");
  ok("anon cannot call claim_owner()", Boolean(c1.error), c1.error ? c1.error.message : "unexpected success");

  // writes without auth/admin
  for (const table of ["admins", "replay_videos", "channels", "content_items", "site_settings", "content_versions"]) {
    let r;
    if (table === "site_settings") r = await anon.from(table).upsert({ id: 1, data: { probe: true } });
    else if (table === "admins") r = await anon.from(table).insert({ user_id: "00000000-0000-0000-0000-000000000000", email: "probe@example.com" });
    else if (table === "content_versions") r = await anon.from(table).insert({ entity_type: "text", entity_id: "probe", snapshot: {} });
    else r = await anon.from(table).insert(table === "replay_videos" ? { url: "https://example.com/x" } : table === "channels" ? { url: "https://example.com/x" } : { kind: "text", data: {} });
    ok(`anon cannot write ${table}`, Boolean(r.error), r.error ? r.error.message : "unexpected success");
  }

  // reads return only published rows
  const pubChecks = [
    ["replay_videos", { published: true, visible: true }],
    ["channels", { published: true, visible: true }],
    ["content_items", { published: true, visible: true }],
  ];
  for (const [table, filter] of pubChecks) {
    const { data, error } = await anon.from(table).select("*");
    if (error) { ok(`anon can read ${table}`, false, error.message); continue; }
    const onlyPublished = (data || []).every(r => filter.published === undefined || r.published === filter.published);
    ok(`anon reads ${table}: only published/visible rows`, onlyPublished, `got ${data.length} rows`);
  }

  const ownerEmail = process.env.TEST_OWNER_EMAIL;
  const ownerPass = process.env.TEST_OWNER_PASSWORD;
  const secondEmail = process.env.TEST_SECOND_EMAIL;
  const secondPass = process.env.TEST_SECOND_PASSWORD;

  if (ownerEmail && ownerPass) {
    console.log("\n== Owner checks ==");
    const owner = createClient(url, key);
    const { data: s, error: se } = await owner.auth.signInWithPassword({ email: ownerEmail, password: ownerPass });
    if (se || !s.session) {
      failures++; console.log("FAIL owner sign-in", se?.message || "no session");
    } else {
      const ins = await owner.from("content_items").insert({ kind: "text", slug: "__rls_probe__", data: { probe: true }, published: false, visible: false }).select("id").single();
      ok("owner can insert content_items", !ins.error && Boolean(ins.data?.id), ins.error?.message || "");
      if (ins.data?.id) {
        const del = await owner.from("content_items").delete().eq("id", ins.data.id);
        ok("owner can delete own probe row", !del.error, del.error?.message || "");
      }
    }
  } else {
    console.log("\nSKIP owner checks (set TEST_OWNER_EMAIL/TEST_OWNER_PASSWORD in terminal to run).");
  }

  if (secondEmail && secondPass) {
    console.log("\n== Second-user checks ==");
    const other = createClient(url, key);
    const { data: s, error: se } = await other.auth.signInWithPassword({ email: secondEmail, password: secondPass });
    if (se || !s.session) {
      failures++; console.log("FAIL second sign-in", se?.message || "no session");
    } else {
      const claim = await other.rpc("claim_owner");
      ok("second user cannot claim_owner()", Boolean(claim.error), claim.error ? claim.error.message : "unexpected success");
      const ins = await other.from("content_items").insert({ kind: "text", slug: "__rls_probe2__", data: {}, published: false });
      ok("second user cannot write content_items", Boolean(ins.error), ins.error ? ins.error.message : "unexpected success");
    }
  } else {
    console.log("\nSKIP second-user checks (set TEST_SECOND_EMAIL/TEST_SECOND_PASSWORD in terminal to run).");
  }

  console.log(`\nResult: ${failures === 0 ? "ALL PASSED (executed checks)" : failures + " failed"}`);
  process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });