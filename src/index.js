import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const assetManifest = JSON.parse(manifestJSON);

const HOME_REFDA = { lat: -6.346833, lng: 106.814806 };
const HOME_TIARA = { lat: -6.295991, lng: 106.863323 };

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;

    if (url.pathname.startsWith("/api/")) {
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };

      if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

      if (url.pathname === "/api/venues" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM venues").all();
        return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/venues" && method === "POST") {
        const { name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax } = await request.json();
        await env.DB.prepare("INSERT INTO venues (name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const venueIdMatch = url.pathname.match(/^\/api\/venues\/(\d+)$/);
      if (venueIdMatch && method === "PUT") {
        const { name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax } = await request.json();
        await env.DB.prepare("UPDATE venues SET name=?, lat=?, lng=?, price=?, practicality=?, parking=?, capacity=?, worship=?, accessibility=?, pax=? WHERE id=?")
          .bind(name, lat, lng, price, practicality, parking, capacity, worship, accessibility, pax, venueIdMatch[1]).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (venueIdMatch && method === "DELETE") {
        await env.DB.prepare("DELETE FROM venues WHERE id=?").bind(venueIdMatch[1]).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/calculate" && method === "POST") {
        const { weights } = await request.json();
        const { results: rows } = await env.DB.prepare("SELECT * FROM venues").all();

        let processed = rows.filter(v => v.price <= 70000000).map(v => ({
          ...v,
          distRefda: haversine(v.lat, v.lng, HOME_REFDA.lat, HOME_REFDA.lng),
          distTiara: haversine(v.lat, v.lng, HOME_TIARA.lat, HOME_TIARA.lng)
        }));

        if (processed.length === 0) return new Response(JSON.stringify([]), { headers: corsHeaders });

        const mins = {
          price: Math.min(...processed.map(v => v.price)),
          distRefda: Math.min(...processed.map(v => v.distRefda)),
          distTiara: Math.min(...processed.map(v => v.distTiara))
        };
        const maxs = {
          practicality: Math.max(...processed.map(v => v.practicality)),
          parking: Math.max(...processed.map(v => v.parking)),
          capacity: Math.max(...processed.map(v => v.capacity)),
          worship: Math.max(...processed.map(v => v.worship)),
          accessibility: Math.max(...processed.map(v => v.accessibility)),
          pax: Math.max(...processed.map(v => v.pax))
        };

        const ranked = processed.map(v => {
          const r = {
            price: mins.price / v.price,
            distRefda: mins.distRefda / v.distRefda,
            distTiara: mins.distTiara / v.distTiara,
            practicality: v.practicality / maxs.practicality,
            parking: v.parking / maxs.parking,
            capacity: v.capacity / maxs.capacity,
            worship: v.worship / maxs.worship,
            accessibility: v.accessibility / maxs.accessibility,
            pax: v.pax / maxs.pax
          };

          const score = (r.price * weights.price) +
                        (r.distRefda * weights.distRefda) +
                        (r.distTiara * weights.distTiara) +
                        (r.practicality * weights.practicality) +
                        (r.parking * weights.parking) +
                        (r.capacity * weights.capacity) +
                        (r.worship * weights.worship) +
                        (r.accessibility * weights.accessibility) +
                        (r.pax * (weights.pax || 0));
          
          return { ...v, score: score.toFixed(4) };
        }).sort((a, b) => b.score - a.score);

        return new Response(JSON.stringify(ranked), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/resolve-maps" && method === "POST") {
        const { mapsUrl } = await request.json();
        try {
          const response = await fetch(mapsUrl, { redirect: "follow", method: "HEAD" });
          return new Response(JSON.stringify({ finalUrl: response.url }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: "Failed to resolve URL" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      if (url.pathname === "/api/tasks" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM tasks ORDER BY category, id").all();
        return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/tasks" && method === "POST") {
        const { category, task, pic = 'Bersama', priority = 'Normal', notes = '' } = await request.json();
        await env.DB.prepare("INSERT INTO tasks (category, task, done, pic, priority, notes) VALUES (?, ?, 0, ?, ?, ?)")
          .bind(category, task, pic, priority, notes).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const taskIdMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
      if (taskIdMatch && method === "PATCH") {
        const body = await request.json();
        if (body.done !== undefined) {
          await env.DB.prepare("UPDATE tasks SET done = ? WHERE id = ?").bind(body.done ? 1 : 0, taskIdMatch[1]).run();
        }
        if (body.task !== undefined) {
          await env.DB.prepare("UPDATE tasks SET task = ? WHERE id = ?").bind(body.task, taskIdMatch[1]).run();
        }
        if (body.category !== undefined) {
          await env.DB.prepare("UPDATE tasks SET category = ? WHERE id = ?").bind(body.category, taskIdMatch[1]).run();
        }
        if (body.pic !== undefined) {
          await env.DB.prepare("UPDATE tasks SET pic = ? WHERE id = ?").bind(body.pic, taskIdMatch[1]).run();
        }
        if (body.priority !== undefined) {
          await env.DB.prepare("UPDATE tasks SET priority = ? WHERE id = ?").bind(body.priority, taskIdMatch[1]).run();
        }
        if (body.notes !== undefined) {
          await env.DB.prepare("UPDATE tasks SET notes = ? WHERE id = ?").bind(body.notes, taskIdMatch[1]).run();
        }
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (taskIdMatch && method === "DELETE") {
        await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(taskIdMatch[1]).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/comments" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM comments ORDER BY id DESC").all();
        return new Response(JSON.stringify(results || []), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/comments" && method === "POST") {
        const { name, message } = await request.json();
        if (!name || !message) return new Response(JSON.stringify({ error: "Nama dan pesan wajib diisi" }), { status: 400, headers: corsHeaders });
        await env.DB.prepare("INSERT INTO comments (name, message) VALUES (?, ?)").bind(name, message).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    try {
      return await getAssetFromKV({ request, waitUntil: ctx.waitUntil.bind(ctx) }, { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest });
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
