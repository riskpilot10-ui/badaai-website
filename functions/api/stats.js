// functions/api/stats.js - Cloudflare Pages Function
export async function onRequestGet(context) {
    const { env } = context;

    if (!env.SITE_STATS) {
        return new Response(JSON.stringify({ error: 'Storage not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const pageviews = parseInt(await env.SITE_STATS.get('stats:pageview'), 10) || 0;
    const downloadApk = parseInt(await env.SITE_STATS.get('stats:download_apk'), 10) || 0;
    const downloadExe = parseInt(await env.SITE_STATS.get('stats:download_exe'), 10) || 0;

    return new Response(JSON.stringify({
        pageviews,
        download_apk: downloadApk,
        download_exe: downloadExe,
        total_downloads: downloadApk + downloadExe
    }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
    });
}
