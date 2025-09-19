// Enhanced security headers for edge functions
export const getSecurityHeaders = (origin?: string) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://lovable.app',
    'https://*.lovable.app',
    // Add your production domain here
  ];

  const corsOrigin = origin && allowedOrigins.some(allowed => 
    allowed === '*' || origin === allowed || 
    (allowed.includes('*') && origin.includes(allowed.replace('*.', '')))
  ) ? origin : 'https://lovable.app';

  return {
    // CORS headers
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400', // 24 hours
    
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    
    // Content type
    'Content-Type': 'application/json',
  };
};

export const handleCorsPreflightWithSecurity = (request: Request) => {
  const origin = request.headers.get('origin');
  const headers = getSecurityHeaders(origin);
  return new Response(null, { headers });
};