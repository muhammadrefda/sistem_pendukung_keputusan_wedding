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
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };

      if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

      if (url.pathname === "/api/venues" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM venues").all();
        return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/venues" && method === "POST") {
        const { name, lat, lng, price, practicality, parking, capacity, worship, accessibility } = await request.json();
        await env.DB.prepare("INSERT INTO venues (name, lat, lng, price, practicality, parking, capacity, worship, accessibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(name, lat, lng, price, practicality, parking, capacity, worship, accessibility).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/calculate" && method === "POST") {
        const { weights } = await request.json();
        const { results: rows } = await env.DB.prepare("SELECT * FROM venues").all();

        let processed = rows.filter(v => v.price <= 40000000).map(v => ({
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
          accessibility: Math.max(...processed.map(v => v.accessibility))
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
            accessibility: v.accessibility / maxs.accessibility
          };

          const score = (r.price * weights.price) +
                        (r.distRefda * weights.distRefda) +
                        (r.distTiara * weights.distTiara) +
                        (r.practicality * weights.practicality) +
                        (r.parking * weights.parking) +
                        (r.capacity * weights.capacity) +
                        (r.worship * weights.worship) +
                        (r.accessibility * weights.accessibility);
          
          return { ...v, score: score.toFixed(4) };
        }).sort((a, b) => b.score - a.score);

        return new Response(JSON.stringify(ranked), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    try {
      return await getAssetFromKV({ request, waitUntil: ctx.waitUntil.bind(ctx) }, { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest });
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
