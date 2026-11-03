const MAX_BYTES = 24_000;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply = (status, message, extra = {}) => Response.json({ message, ...extra }, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

export function validateContact(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const limits = { name: [1, 120], email: [3, 254], organization: [0, 160], message: [10, 5000], website: [0, 200] };
  const data = {};
  for (const [key, [min, max]] of Object.entries(limits)) {
    const raw = value[key] ?? (min === 0 ? '' : undefined);
    if (typeof raw !== 'string') return null;
    data[key] = raw.trim();
    if (data[key].length < min || data[key].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(data[key])) return null;
  }
  if (!EMAIL.test(data.email) || /[\r\n]/.test(data.name + data.email + data.organization)) return null;
  return data;
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const chunks = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Best-effort per-isolate throttle. Use a gateway/WAF for a distributed limit.
export function createContactHandler({ fetcher = fetch, now = Date.now, timeoutMs = 8000, logger = console } = {}) {
  const clients = new Map();
  return async function handleContact(request, env = {}) {
    if (request.method !== 'POST') {
      const response = reply(405, 'Use POST to send a message.'); response.headers.set('Allow', 'POST'); return response;
    }
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return reply(403, 'Please submit the form from this website.');
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, 'Send JSON form data.');
    let raw;
    try { raw = await readBody(request); }
    catch (error) { return reply(error instanceof RangeError ? 413 : 400, error instanceof RangeError ? 'Your message is too large.' : 'The form data could not be read.'); }
    const data = validateContact(raw);
    if (!data || data.website) return reply(400, 'Check your name, email, and message (10–5,000 characters).');
    const key = request.headers.get('Idempotency-Key');
    if (!key || !UUID.test(key)) return reply(400, 'Refresh the page and try again.');
    const ip = request.headers.get('cf-connecting-ip');
    if (ip) {
      const time = now();
      for (const [address, entry] of clients) if (entry.until <= time) clients.delete(address);
      const entry = clients.get(ip) ?? { count: 0, until: time + 60_000 };
      if (entry.count >= 5 || (!clients.has(ip) && clients.size >= 10_000)) {
        const response = reply(429, 'Too many attempts. Wait a minute and try again.'); response.headers.set('Retry-After', '60'); return response;
      }
      entry.count++; clients.set(ip, entry);
    }
    if (!env.RESEND_API_KEY || !EMAIL.test(env.CONTACT_FROM_EMAIL ?? '') || !EMAIL.test(env.CONTACT_TO_EMAIL ?? '')) {
      logger.error('contact_configuration_missing');
      return reply(503, 'Message delivery is temporarily unavailable. Please contact Leo on LinkedIn.');
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${key}` },
        body: JSON.stringify({
          from: `Fred Loves AI <${env.CONTACT_FROM_EMAIL}>`, to: [env.CONTACT_TO_EMAIL], reply_to: data.email,
          subject: 'Fred Loves AI: new contact message',
          text: `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization || '(not provided)'}\n\n${data.message}`,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.id !== 'string' || !result.id) {
        logger.error('contact_provider_rejected', { status: response.status });
        return reply(502, 'The email service could not accept your message. Please try again later or contact Leo on LinkedIn.');
      }
      return reply(200, 'Your message was accepted for delivery. Thanks for reaching out!', { ok: true });
    } catch {
      logger.error('contact_provider_unreachable');
      return reply(504, 'Delivery could not be confirmed. Please retry with the same message or contact Leo on LinkedIn.');
    } finally { clearTimeout(timer); }
  };
}
export const handleContact = createContactHandler();
