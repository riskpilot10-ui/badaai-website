export async function onRequest(context) {
  // Gamitin ang SUBSCRIPTIONS KV
  const kv = context.env.SUBSCRIPTIONS;

  if (!kv) {
    return new Response(JSON.stringify({ error: "KV namespace not found" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await context.request.json();
    const { event, page } = body;

    let stats = await kv.get("stats", "json");
    if (!stats) {
      stats = { total_visits: 0, unique_visitors: 0, page_views: {} };
    }

    stats.total_visits = (stats.total_visits || 0) + 1;
    
    if (page) {
      stats.page_views = stats.page_views || {};
      stats.page_views[page] = (stats.page_views[page] || 0) + 1;
    }

    await kv.put("stats", JSON.stringify(stats));

    return new Response(JSON.stringify({ success: true, stats }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
