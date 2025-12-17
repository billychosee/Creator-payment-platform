import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_REQUESTS = 100;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

const BLOCKED_IPS = new Set(["192.168.1.100"]);

const BLOCKED_USER_AGENTS = [
  "bot",
  "crawler",
  "spider",
  "scraper",
  "wget",
  "curl",
  "python-requests",
  "http-client",
  "httpie",
  "postman",
];

const BLOCKED_PATHS = [
  "/wp-admin",
  "/wp-login.php",
  "/admin",
  "/administrator",
  "/phpmyadmin",
  "/mysql",
  "/.env",
  "/.git",
  "/config",
  "/api/config",
];

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "";
  const path = request.nextUrl.pathname;

  if (BLOCKED_IPS.has(clientIP)) {
    console.warn(`Blocked IP: ${clientIP}`);
    return createSecurityResponse("Access denied", 403, startTime);
  }

  const userAgentLower = userAgent.toLowerCase();
  if (BLOCKED_USER_AGENTS.some((agent) => userAgentLower.includes(agent))) {
    console.warn(`Blocked user agent: ${userAgent}`);
    return createSecurityResponse("Access denied", 403, startTime);
  }

  if (BLOCKED_PATHS.some((blockedPath) => path.startsWith(blockedPath))) {
    console.warn(`Blocked path: ${path}`);
    return createSecurityResponse("Access denied", 403, startTime);
  }

  const rateLimitResult = checkRateLimit(clientIP, request.method);
  if (!rateLimitResult.allowed) {
    const response = NextResponse.json(
      {
        error: "Too Many Requests",
        message: "Rate limit exceeded",
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Limit": RATE_LIMIT_REQUESTS.toString(),
          "X-RateLimit-Remaining": Math.max(
            0,
            RATE_LIMIT_REQUESTS - rateLimitResult.count
          ).toString(),
          "X-RateLimit-Reset": new Date(
            rateLimitResult.resetTime
          ).toISOString(),
        },
      }
    );
    return addSecurityHeaders(response, startTime);
  }

  const headerValidation = validateHeaders(request);
  if (!headerValidation.valid) {
    return createSecurityResponse("Bad Request", 400, startTime);
  }

  if (
    containsSQLInjection(request.nextUrl.searchParams) ||
    containsXSS(request.nextUrl.searchParams)
  ) {
    return createSecurityResponse("Bad Request", 400, startTime);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response, startTime);
}

function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  return xRealIP || cfConnectingIP || "127.0.0.1";
}

function checkRateLimit(
  ip: string,
  method: string
): { allowed: boolean; count: number; resetTime: number } {
  const now = Date.now();
  const key = `${ip}:${method}`;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    const newRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(key, newRecord);
    return { allowed: true, ...newRecord };
  }

  if (existing.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, ...existing };
  }

  existing.count++;
  rateLimitStore.set(key, existing);
  return { allowed: true, ...existing };
}

function validateHeaders(request: NextRequest): {
  valid: boolean;
  reason?: string;
} {
  const headerSize = Array.from(request.headers.entries()).reduce(
    (total, [key, value]) => total + key.length + value.length,
    0
  );

  if (headerSize > 8192) {
    return { valid: false, reason: "Headers too large" };
  }

  for (const [key, value] of request.headers.entries()) {
    if (value.includes("\n") || value.includes("\r")) {
      return { valid: false, reason: "Header injection attempt" };
    }

    if (key.toLowerCase() === "content-type" && value.includes("text/html")) {
      if (!request.nextUrl.pathname.startsWith("/api/")) {
        return { valid: false, reason: "Suspicious content type" };
      }
    }
  }

  return { valid: true };
}

function containsSQLInjection(params: URLSearchParams): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(\b(UNION|JOIN|WHERE|OR|AND)\b)/i,
    /('|"|;|--|\/\*|\*\/)/,
    /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
  ];

  for (const [key, value] of params.entries()) {
    for (const pattern of sqlPatterns) {
      if (pattern.test(key) || pattern.test(value)) {
        return true;
      }
    }
  }

  return false;
}

function containsXSS(params: URLSearchParams): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]*on\w+[^>]*>/gi,
    /<[^>]*javascript:[^>]*>/gi,
  ];

  for (const [key, value] of params.entries()) {
    for (const pattern of xssPatterns) {
      if (pattern.test(key) || pattern.test(value)) {
        return true;
      }
    }
  }

  return false;
}

function addSecurityHeaders(
  response: NextResponse,
  startTime: number
): NextResponse {
  const responseTime = Date.now() - startTime;

  if (process.env.NODE_ENV !== "production") {
    response.headers.set("X-Response-Time", `${responseTime}ms`);
  }

  response.headers.set("X-Request-ID", generateRequestId());
  return response;
}

function createSecurityResponse(
  message: string,
  status: number,
  startTime: number
): NextResponse {
  const response = NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
    { status }
  );

  return addSecurityHeaders(response, startTime);
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|svg|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
