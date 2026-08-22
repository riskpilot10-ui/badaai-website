export async function onRequest(context) {
  const kv = context.env.BADAAI_KV;

  if (!kv) {
    return new Response(JSON.stringify({ error: "KV namespace not found" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const stats = await kv.get("stats", "json");
    return new Response(JSON.stringify(stats || { 
      total_visits: 0, 
      unique_visitors: 0, 
      page_views: {} 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
