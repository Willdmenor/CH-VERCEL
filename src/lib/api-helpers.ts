// Helpers CORS + JSON para rotas /api
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
} as const;

export function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  try {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS,
        ...(init.headers || {}),
      },
    });
  } catch (err) {
    console.error("[jsonResponse] Serialization error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error during serialization" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
}

export function errorResponse(message: string, status = 400, extra?: unknown): Response {
  return jsonResponse({ 
    success: false,
    error: message, 
    details: extra ?? null,
    timestamp: new Date().toISOString()
  }, { status });
}

export function optionsResponse(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
