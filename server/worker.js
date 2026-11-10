/* Bedroom Mebel order relay for Cloudflare Workers (free plan).
   The site POSTs {m: "<order text>", l: "uz|ru|en"} here; the worker forwards
   the text to the shop's Telegram chat(s) through the bot and answers {ok:true}.

   Secrets (Cloudflare dashboard → Worker → Settings → Variables and Secrets):
     BOT_TOKEN  the bot token from @BotFather            (type: Secret)
     CHAT_IDS   chat id(s), comma separated, e.g. 111,222 (type: Text)
   Optional:
     ALLOWED_ORIGINS  comma separated site origins; default below. */
const DEFAULT_ORIGINS = 'https://isroilovmuhammadjon.github.io';
const HEAD = { uz: 'Saytdan yangi buyurtma', ru: 'Новый заказ с сайта', en: 'New order from the website' };

/* light spam guard: at most 5 orders per visitor IP per 10 minutes (per worker instance) */
const hits = new Map();
function tooMany(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

export default {
  async fetch(req, env) {
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map(s => s.trim()).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ ok: true, service: 'bedroom-mebel orders' });
    if (!allowed.includes(origin)) return json({ ok: false, error: 'origin' }, 403);
    if (tooMany(req.headers.get('CF-Connecting-IP') || '?')) return json({ ok: false, error: 'rate' }, 429);

    let body;
    try { body = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400); }
    const m = typeof body.m === 'string' ? body.m.trim().slice(0, 3900) : '';
    const l = HEAD[body.l] ? body.l : 'uz';
    if (m.length < 10) return json({ ok: false, error: 'empty' }, 400);
    if (!env.BOT_TOKEN || !env.CHAT_IDS) return json({ ok: false, error: 'config' }, 500);

    const text = `🛏 ${HEAD[l]}\n\n${m}`;
    const ids = String(env.CHAT_IDS).split(',').map(s => s.trim()).filter(Boolean);
    const results = await Promise.all(ids.map(chat_id =>
      fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, disable_web_page_preview: true }),
      }).then(r => r.ok).catch(() => false)));
    return results.some(Boolean) ? json({ ok: true }) : json({ ok: false, error: 'telegram' }, 502);
  },
};
