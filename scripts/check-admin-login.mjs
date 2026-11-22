import { createClient } from '@supabase/supabase-js';
import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY in env'); process.exit(1); }

const rl = readline.createInterface({ input, output });
const ask = (q) => new Promise((res) => rl.question(q, res));
const email = (await ask('Email: ')).trim();
output.write('Password (will be visible): ');
const password = (await ask('')).trim();
rl.close();

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: login, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
if (loginErr) { console.error('LOGIN_ERR', loginErr.message); process.exit(1); }
console.log('USER_ID', login.user?.id);
console.log('USER_EMAIL', login.user?.email);

const { data: rpc, error: rpcErr } = await supabase.rpc('is_admin');
console.log('RPC_IS_ADMIN', rpc, rpcErr?.message ?? null);

const { data: row, error: rowErr } = await supabase.from('admins').select('user_id,email,created_at').eq('user_id', login.user.id).maybeSingle();
console.log('ADMIN_ROW', row, rowErr?.message ?? null);

const { data: all, error: allErr } = await supabase.from('admins').select('user_id,email').limit(5);
console.log('ADMINS_VISIBLE', all, allErr?.message ?? null);

await supabase.auth.signOut();
