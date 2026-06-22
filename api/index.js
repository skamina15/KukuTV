export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.url === '/' || req.url === '') {
    return res.status(200).json({ message: 'Kuku FM API Proxy – use with app headers.' });
  }

  // Guard clause - FIXED
  const pkg = req.headers['package-name'];
  const ua = req.headers['user-agent'];
  if (!pkg || !pkg.includes('com.vlv.aravali.reels') || !ua || !ua.includes('kukufm-android-reels')) {
    return res.status(403).json({ error: 'Forbidden – missing required headers' });
  }

  const BASE_URL = 'https://kukufm.com';

  // Your valid tokens (user 354030384)
  const validAccessToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTQwMzAzODQsImV4cCI6MTc4MjAzODI4NSwidW5pcXVlX2lkIjoiMTIyNWVlOWEtNjM3Yi00ODU0LTgyNzktMDU5YWE0NDYwZGQ4In0.0EkSVEotyTMnuk3IjF4lYypCBKDMSpis-w4tfqG8I5n_nCnvmeRqcHT5hkaj_dWpKHMfIjr0BYrbf4DcXqHBzQ';
  const validRefreshToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTQwMzAzODQsImV4cCI6MTc4NDYyMzA4NSwidW5pcXVlX2lkIjoiMTIyNWVlOWEtNjM3Yi00ODU0LTgyNzktMDU5YWE0NDYwZGQ4In0.tBNEygngKYWBmpQHNXslSnAjuQ_h4FNacErGyw9mA-3HBvN2EzEiTjvD3C2hKP-hdz5wwNOSVO4j4CFvlAhjFA';

  const fixedHeaders = {
    'client-country': 'IN',
    'install-source': 'google_play',
    'lang': 'english',
    'app-version': '50401',
    'user-agent': 'kukufm-android-reels/5.4.1',
    'package-name': 'com.vlv.aravali.reels',
  };

  const noAuthEndpoints = ['/api/v1.1/users/get-session-token/', '/v1.1/users/get-session-token/'];
  const cacheEndpoints = ['/api/v2/payments', '/api/v3/home'];

  const targetUrl = new URL(req.url, BASE_URL).toString();
  const isNoAuth = noAuthEndpoints.some(p => req.url.startsWith(p));
  const useCache = cacheEndpoints.some(p => req.url.includes(p));

  const headers = { ...fixedHeaders };

  if (!isNoAuth) {
    const clientAuth = req.headers.authorization || req.headers.Authorization;
    headers['Authorization'] = clientAuth || `Bearer ${validAccessToken}`;
  }

  if (useCache && !isNoAuth) {
    headers['cache-control'] = 'max-age=5';
  }

  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }
  headers['Accept'] = 'application/json';

  // Read raw body
  let bodyBuffer = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    bodyBuffer = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  // ==========================================
  // INTERCEPT & MODIFY REQUEST BODY
  // ==========================================
  let isSessionTokenRequest = false;
  if (bodyBuffer && isNoAuth && req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
    let bodyStr = bodyBuffer.toString();
    const params = new URLSearchParams(bodyStr);
    
    // Check if this is a session token request
    if (params.has('access_token') && params.has('refresh_token')) {
      isSessionTokenRequest = true;
      
      // Replace with your valid tokens
      params.set('access_token', validAccessToken);
      params.set('refresh_token', validRefreshToken);
      
      bodyStr = params.toString();
      bodyBuffer = Buffer.from(bodyStr);
      
      // Update content-length
      delete headers['content-length'];
      delete headers['Content-Length'];
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
      
      console.log('✅ Token interception: Replaced tokens in request');
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: bodyBuffer,
    });

    let responseBody = await response.text();
    let statusCode = response.status;

    // ==========================================
    // INTERCEPT & MODIFY RESPONSE BODY
    // ==========================================
    if (isSessionTokenRequest && statusCode === 200) {
      try {
        const jsonResponse = JSON.parse(responseBody);
        
        // Replace tokens in the response with YOUR valid tokens
        jsonResponse.access_token = validAccessToken;
        jsonResponse.refresh_token = validRefreshToken;
        
        // Also update the timestamps (optional - set to match your tokens)
        // Your tokens expire in 2026, so set timestamps accordingly
        jsonResponse.access_token_timestamp = 1782038285; // From your token
        jsonResponse.refresh_token_timestamp = 1784623085; // From your token
        
        // IMPORTANT: Also change the user data to match YOUR user
        if (jsonResponse.user) {
          jsonResponse.user.id = 354030384; // Your user ID
          // Optionally update other user fields
          jsonResponse.user.name = "ProxyUser";
          jsonResponse.user.uuid = "1225ee9a-637b-4854-8279-059aa4460dd8";
        }
        
        responseBody = JSON.stringify(jsonResponse);
        console.log('✅ Token interception: Replaced tokens in response');
      } catch (e) {
        console.error('Failed to parse response JSON:', e);
      }
    }

    // Send modified response
    const contentType = response.headers.get('content-type') || 'application/json';
    res.status(statusCode);
    res.setHeader('Content-Type', contentType);
    
    // Forward other important headers
    if (response.headers.get('cache-control')) {
      res.setHeader('Cache-Control', response.headers.get('cache-control'));
    }
    
    return res.send(responseBody);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal proxy error', 
      message: error.message 
    });
  }
}
