import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler } from '../server/contact.mjs';

const data = { name: 'Test Visitor', email: 'visitor@example.com', organization: 'CU Boulder', message: 'I would like to compare notes about AI.', website: '' };
const env = { RESEND_API_KEY: 'test-secret', CONTACT_FROM_EMAIL: 'contact@example.com', CONTACT_TO_EMAIL: 'leo@example.com' };
const key = 'bf983733-d55f-4eab-bb44-c9ce31496bc9';
const request = (body = data, headers = {}) => new Request('https://fredlovesai.com/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://fredlovesai.com', 'Idempotency-Key': key, ...headers }, body: JSON.stringify(body),
});
const logger = { error() {} };
const handler = (fetcher, extra = {}) => createContactHandler({ fetcher, logger, ...extra });

test('accepted delivery sends fixed recipient, safe text and visitor Reply-To', async () => {
  let outbound;
  const send = handler(async (url, init) => { outbound = { url, ...init }; return Response.json({ id: 'email-123' }); });
  const response = await send(request({ ...data, name: ' <script>test</script> ' }), env);
  assert.equal(response.status, 200); assert.equal((await response.json()).ok, true);
  assert.equal(outbound.url, 'https://api.resend.com/emails');
  const payload = JSON.parse(outbound.body);
  assert.deepEqual(payload.to, ['leo@example.com']); assert.equal(payload.reply_to, data.email);
  assert.equal(payload.html, undefined); assert.match(payload.text, /<script>test<\/script>/);
  assert.equal(outbound.headers['Idempotency-Key'], `contact/${key}`);
});

test('invalid, whitespace, non-string and oversized fields never call provider', async () => {
  const send = handler(() => assert.fail('provider called'));
  for (const fields of [{ name: ' ' }, { email: 'bad' }, { email: 'x@y.com\r\nBcc: victim@example.com' }, { message: 'short' }, { message: ' '.repeat(12) }, { message: 'x'.repeat(5001) }, { organization: {} }, { website: 'spam' }, { name: 'bad\nheader' }]) {
    assert.equal((await send(request({ ...data, ...fields }), env)).status, 400);
  }
  assert.equal((await send(request(null), env)).status, 400);
});

test('rejects malformed JSON, oversized streaming bodies, media type, cross-origin and wrong method', async () => {
  const send = handler(() => assert.fail('provider called'));
  assert.equal((await send(new Request('https://fredlovesai.com/api/contact'), env)).status, 405);
  assert.equal((await send(request(data, { Origin: 'https://evil.example' }), env)).status, 403);
  assert.equal((await send(request(data, { 'Content-Type': 'text/plain' }), env)).status, 415);
  assert.equal((await send(request(data, { 'Idempotency-Key': 'invalid' }), env)).status, 400);
  assert.equal((await send(new Request('https://fredlovesai.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }), env)).status, 400);
  assert.equal((await send(request({ ...data, message: 'x'.repeat(25000) }), env)).status, 413);
});

test('missing configuration fails visibly without sending or disclosing secrets', async () => {
  const response = await handler(() => assert.fail('provider called'))(request(), {});
  assert.equal(response.status, 503); assert.match((await response.json()).message, /unavailable/);
});

for (const [name, fetcher, status] of [
  ['provider rejection', async () => Response.json({ message: 'private provider detail' }, { status: 403 }), 502],
  ['invalid provider success', async () => Response.json({}), 502],
  ['non-JSON provider response', async () => new Response('<html>oops</html>', { status: 502 }), 502],
  ['network failure', async () => { throw new Error('test-secret'); }, 504],
  ['timeout', (_, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })), 504],
]) {
  test(name, async () => {
    const response = await handler(fetcher, { timeoutMs: 10 })(request(), env);
    assert.equal(response.status, status);
    assert.doesNotMatch(await response.text(), /test-secret|private provider detail/);
  });
}

test('per-isolate throttle returns Retry-After and expires', async () => {
  let time = 0, calls = 0;
  const send = handler(async () => { calls++; return Response.json({ id: 'accepted' }); }, { now: () => time });
  for (let i = 0; i < 5; i++) assert.equal((await send(request(data, { 'cf-connecting-ip': '192.0.2.1' }), env)).status, 200);
  const response = await send(request(data, { 'cf-connecting-ip': '192.0.2.1' }), env);
  assert.equal(response.status, 429); assert.equal(response.headers.get('Retry-After'), '60'); assert.equal(calls, 5);
  time = 61000;
  assert.equal((await send(request(data, { 'cf-connecting-ip': '192.0.2.1' }), env)).status, 200);
});
