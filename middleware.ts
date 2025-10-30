import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-server';

// Environment variables
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
const NODE_ENV = process.env.NODE_ENV;

/**
 * Rate limiting store (in-memory for now, use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting configuration
 */
const RATE_LIMIT_CONFIG = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
};

/**
 * Protected route patterns
 */
const PROTECTED_ROUTES = {
  admin: /^\/admin(?!\/access-denied)/, // Re-enable admin gate
  api: {
    admin: /^\/api\/admin\b/,
    protected: /^\/api\/(progress|user)/,
  },
} as const;

/**
 * Public route patterns (bypass authentication)
 */
const PUBLIC_ROUTES = {
  api: /^\/api\/(health|courses$|contact|subscribe)/,
  pages: /^\/($|academy|marketplace|ramps)/,
} as const;

/**
 * Apply rate limiting
 */
function applyRateLimit(request: NextRequest): NextResponse | null {
  const clientId = getClientId(request);
  const now = Date.now();
  const key = `${clientId}:${now}`;
  
  const current = rateLimitStore.get(clientId);
  
  // Clean up expired entries
  if (current && now > current.resetTime) {
    rateLimitStore.delete(clientId);
  }
  
  const existing = rateLimitStore.get(clientId);
  
  if (existing) {
    if (existing.count >= RATE_LIMIT_CONFIG.maxRequests) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: Math.ceil((existing.resetTime - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((existing.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': existing.resetTime.toString(),
          },
        }
      );
    }
    
    existing.count += 1;
  } else {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
  }
  
  return null;
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] ?? realIp ?? 'unknown';
  
  // Include user agent for better identification
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  const hash = simpleHash(`${ip}:${userAgent}`);
  
  return hash;
}

/**
 * Simple hash function for rate limiting keys
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Validate authentication token and check admin role using Privy server API
 */
async function validateUserAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any;
  error?: string;
}> {
  try {
    const authResult = await getAuthenticatedUser(request);
    return authResult;
  } catch (error) {
    console.error('Authentication validation error:', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}


/**
 * Create unauthorized response
 */
function createUnauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Unauthorized',
      message,
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Bearer',
      },
    }
  );
}

/**
 * Create forbidden response
 */
function createForbiddenResponse(message = 'Forbidden'): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Forbidden',
      message,
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Log security events
 */
function logSecurityEvent(event: string, request: NextRequest, details?: any) {
  const clientId = getClientId(request);
  const timestamp = new Date().toISOString();
  
  console.warn(`[SECURITY] ${timestamp} - ${event}`, {
    clientId,
    path: request.nextUrl.pathname,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
    ...details,
  });
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets and Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // Static assets with extensions
  ) {
    return NextResponse.next();
  }
  
  // Do not bypass admin checks in production. Allow login page to proceed.
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }
  
  // Apply rate limiting to all requests
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', request);
    return rateLimitResponse;
  }
  
  // Check if route requires authentication
  const isAdminPage = PROTECTED_ROUTES.admin.test(pathname);
  const isAdminAPI = PROTECTED_ROUTES.api.admin.test(pathname);
  const isProtectedAPI = PROTECTED_ROUTES.api.protected.test(pathname);
  const isPublicAPI = PUBLIC_ROUTES.api.test(pathname);
  const isPublicPage = PUBLIC_ROUTES.pages.test(pathname);
  
  // Allow public routes to pass through
  if (isPublicAPI || isPublicPage) {
    return NextResponse.next();
  }
  
  // Check authentication for protected routes
  if (isAdminPage || isAdminAPI || isProtectedAPI) {
    console.log(`[DEBUG] Checking auth for protected route: ${pathname}`);
    console.log(`[DEBUG] isAdminPage: ${isAdminPage}, isAdminAPI: ${isAdminAPI}, isProtectedAPI: ${isProtectedAPI}`);
    
    const authResult = await validateUserAuth(request);
    console.log(`[DEBUG] Auth result:`, {
      isAuthenticated: authResult.isAuthenticated,
      isAdmin: authResult.isAdmin,
      error: authResult.error,
      hasUser: !!authResult.user
    });
    
    if (!authResult.isAuthenticated) {
      logSecurityEvent('AUTHENTICATION_FAILED', request, { error: authResult.error });
      
      if (isAdminPage) {
        console.log(`[DEBUG] Redirecting to login for admin page: ${pathname}`);
        // Redirect to login page with explicit admin-required error
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('error', 'admin_required');
        return NextResponse.redirect(loginUrl);
      }
      
      return createUnauthorizedResponse(authResult.error || 'Authentication required');
    }
    
    // Check admin role for admin routes
    if (isAdminPage || isAdminAPI) {
      if (!authResult.isAdmin) {
        console.log(`[DEBUG] User authenticated but not admin. Redirecting to home.`);
        logSecurityEvent('INSUFFICIENT_PERMISSIONS', request, { 
          requiredRole: 'admin',
          userId: authResult.user?.id 
        });
        
        if (isAdminPage) {
          // Redirect to login with a clear error message for admin-only area
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          loginUrl.searchParams.set('error', 'admin_required');
          return NextResponse.redirect(loginUrl);
        }
        
        return createForbiddenResponse('Admin role required');
      }
    }
    
    console.log(`[DEBUG] Authentication successful, allowing access to: ${pathname}`);
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP header (restrictive for security)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://auth.privy.io https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // Allow images from common CDNs and YouTube thumbnails used in course previews
    "img-src 'self' data: blob: https://i.postimg.cc https://res.cloudinary.com https://images.unsplash.com https://via.placeholder.com https://img.youtube.com https://i.ytimg.com",
    // Allow on-chain/RPC and auth connections required for web3 + Privy + WalletConnect
    "connect-src 'self' https://auth.privy.io https://api.privy.io wss://relay.walletconnect.com https://rpc.walletconnect.com https://alfajores-forno.celo-testnet.org https://forno.celo.org https://*.celo.org https://*.celoscan.io",
    // Allow embedded frames for Privy and video providers used in course pages
    "frame-src https://auth.privy.io https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
    // Allow media streams if used outside iframes
    "media-src 'self' https: data: blob:",
  ].join('; ');
  
  if (NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
}

/**
 * Configure which routes should run middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/health (health checks)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. Static files (those with a file extension)
     */
    '/((?!api/health|_next|_static|favicon.ico|.*\\..*).*)',
  ],
};