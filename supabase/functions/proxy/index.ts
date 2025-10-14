// 

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// List allowed origins (frontend URLs)
const ALLOWED_ORIGINS = [
  "http://localhost:8080",          // Development
  "https://your-production-site.com" // Replace with your live frontend URL
];

const SERVICES: Record<string, string> = {
  demand_forecast: "https://material-forecast.onrender.com/forecast",
  multifactor_forecast: "https://multifactor-forecast.onrender.com/forecast/material-demand",
  inventory_optimization: "https://inventory-optimization-s9dq.onrender.com/optimize_inventory",
  procurement_recommendation: "https://procurement-recommendation.onrender.com/recommend-procurement",
  scenario_planning: "https://scenario-planning.onrender.com/forecast",
  cost_optimization: "https://cost-optimization.onrender.com/optimize-cost",
  anomaly_detection: "https://anomaly-detection-55ys.onrender.com/detect-anomalies",
  risk_analysis: "https://risk-analysis-rq2k.onrender.com/analyze-risk",
};

// Function to generate proper CORS headers per request
function getCorsHeaders(origin?: string) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, X-Client-Info, APIKey, Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") || undefined;
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { service, payload } = await req.json();

    const url = SERVICES[service as keyof typeof SERVICES];
    if (!url) {
      return new Response(JSON.stringify({ error: "Unknown service" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? {}),
    });

    const text = await upstream.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }

    return new Response(JSON.stringify(body), {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
