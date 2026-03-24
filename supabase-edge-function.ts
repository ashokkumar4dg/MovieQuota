import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return json({ error: "Missing Supabase env vars" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "titles";

  if (mode === "titles") {
    const { data, error } = await supabase.from("daily_titles_api").select("*");

    if (error) {
      return json({ error: error.message }, 500);
    }

    const titles = (data || []).map((item) => ({
      id: item.id,
      source_id: item.source_id,
      title: item.title,
      content_type: item.type?.toLowerCase() || "movie",
      industry: item.industry,
      release_date: item.year ? `${item.year}-01-01` : null,
      runtime: item.duration,
      imdb_rating: Number(item.imdb_rating || 0),
      tmdb_rating: Number(item.tmdb_rating || 0),
      genres: item.genres || ["Trending"],
      overview: item.overview,
      poster_url: item.poster_url
    }));

    return json({ titles });
  }

  if (mode === "action" && request.method === "POST") {
    const body = await request.json();
    const deviceToken = request.headers.get("x-device-token") || body.deviceToken;

    if (!deviceToken) {
      return json({ error: "Missing device token" }, 400);
    }

    const { data: user, error: userError } = await supabase
      .from("anonymous_users")
      .upsert(
        {
          device_token: deviceToken,
          last_seen_at: new Date().toISOString()
        },
        { onConflict: "device_token" }
      )
      .select("id")
      .single();

    if (userError || !user) {
      return json({ error: userError?.message || "Failed to create user" }, 500);
    }

    const { error: actionError } = await supabase.from("user_actions").upsert(
      {
        user_id: user.id,
        title_id: body.titleId,
        action_date: new Date().toISOString().slice(0, 10),
        swipe_direction: body.swipeDirection || null,
        liked: Boolean(body.liked),
        rating: body.rating || null,
        acted_at: new Date().toISOString()
      },
      { onConflict: "user_id,title_id,action_date" }
    );

    if (actionError) {
      return json({ error: actionError.message }, 500);
    }

    return json({ ok: true });
  }

  return json({ error: "Unsupported mode" }, 400);
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*"
    }
  });
}
