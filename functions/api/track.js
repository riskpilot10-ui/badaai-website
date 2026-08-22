// functions/api/track.js - Cloudflare Pages Function
// Simpleng counter para sa page views at download button clicks.
const ALLOWED_EVENTS = ['pageview', 'download_apk', 'download_exe'];

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const event = body.event;

        if (!ALLOWED_EVENTS.includes(event)) {
            return new Response(JSON.stringify({ error: 'Invalid event' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!env.SITE_STATS) {
            return new Response(JSON.stringify({ error: 'Storage not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const key = 'stats:' + event;
        const current = await env.SITE_STATS.get(key);
        const count = (parseInt(current, 10) || 0) + 1;
        await env.SITE_STATS.put(key, String(count));

        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
