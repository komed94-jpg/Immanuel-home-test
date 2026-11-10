import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(path, mocks = {}, extra = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, { exports, require: (id) => mocks[id] ?? require(id), Response, Date, URL, process, AbortSignal, ...extra });
  return exports;
}

const schema = { members: { id: 'id', email: 'email' }, memberPasswordResetTokens: { id: 'id', memberId: 'memberId', tokenHash: 'tokenHash', createdAt: 'createdAt', expiresAt: 'expiresAt' } };
const operators = Object.fromEntries(['and', 'desc', 'eq', 'gt'].map((name) => [name, (...args) => ({ name, args })]));
async function scenario({ configured = true, member = true, recent = false, sent = true, throws = false, origin = true } = {}) {
  const calls = { select: 0, insert: 0, delete: 0, send: 0 };
  const db = {
    select: () => {
      const rows = ++calls.select === 1 ? (member ? [{ id: 1, name: 'Test', email: 'test@example.invalid', accountStatus: 'active' }] : []) : (recent ? [{ id: 2 }] : []);
      const chain = { from: () => chain, where: () => chain, orderBy: () => chain, limit: async () => rows };
      return chain;
    },
    insert: () => ({ values: async () => { calls.insert++; } }),
    delete: () => ({ where: async () => { calls.delete++; } }),
  };
  const { POST } = load('app/api/member/password-reset/request/route.ts', {
    'drizzle-orm': operators,
    '@/db': { getDb: () => db }, '@/db/schema': schema,
    '@/lib/member-auth': { createOpaqueToken: () => 'opaque-test-token', normalizeEmail: (v) => String(v).toLowerCase(), sameOrigin: () => origin, tokenHash: () => 'hash-only' },
    '@/lib/member-email': { passwordResetEmailConfigured: () => configured, sendPasswordResetEmail: async () => { calls.send++; if (throws) throw Error('provider unavailable'); return { configured, sent }; } },
  });
  const response = await POST(new Request('https://example.invalid/api/member/password-reset/request', { method: 'POST', body: JSON.stringify({ email: 'test@example.invalid' }) }));
  return { status: response.status, body: await response.json(), calls };
}
let result = await scenario({ configured: false });
assert.equal(result.status, 503); assert.equal(result.calls.select, 0); assert.equal(result.calls.insert, 0);
result = await scenario({ sent: false });
assert.equal(result.status, 502); assert.equal(result.calls.delete, 1);
result = await scenario({ throws: true });
assert.equal(result.status, 502); assert.equal(result.calls.delete, 1);
result = await scenario();
assert.equal(result.status, 200); assert.equal(result.calls.send, 1); assert.equal(result.calls.delete, 0);
assert.equal(result.body.token, undefined);
result = await scenario({ member: false });
assert.equal(result.status, 200); assert.equal(result.calls.insert, 0);
result = await scenario({ recent: true });
assert.equal(result.status, 200); assert.equal(result.calls.send, 0);
result = await scenario({ origin: false });
assert.equal(result.status, 403); assert.equal(result.calls.select, 0);

const saved = { key: process.env.RESEND_API_KEY, from: process.env.MEMBER_EMAIL_FROM };
try {
  process.env.RESEND_API_KEY = 'test-only'; process.env.MEMBER_EMAIL_FROM = 'test@example.invalid';
  let payload;
  const email = load('lib/member-email.ts', {}, { fetch: async (url, options) => { assert.equal(url, 'https://api.resend.com/emails'); assert.ok(options.signal); payload = JSON.parse(options.body); return { ok: false }; } });
  assert.equal((await email.sendPasswordResetEmail({ email: 'test@example.invalid', name: '<Test>', resetUrl: 'https://example.invalid/reset-password?token=example' })).sent, false);
  assert.ok(payload.html.includes('&lt;Test&gt;')); assert.ok(payload.text.includes('30분')); assert.equal(payload.to[0], 'test@example.invalid');
  delete process.env.RESEND_API_KEY;
  assert.equal(email.passwordResetEmailConfigured(), false);
} finally {
  for (const [key, value] of Object.entries({ RESEND_API_KEY: saved.key, MEMBER_EMAIL_FROM: saved.from })) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
}
console.log('Password reset: 8 mocked regression scenarios passed; no real email or database used.');
