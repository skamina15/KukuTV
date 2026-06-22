export const config = {
  api: { bodyParser: false },
};

// Valid tokens (2026 tak valid)
const VALID_ACCESS_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTQwMzAzODQsImV4cCI6MTc4MjAzODI4NSwidW5pcXVlX2lkIjoiMTIyNWVlOWEtNjM3Yi00ODU0LTgyNzktMDU5YWE0NDYwZGQ4In0.0EkSVEotyTMnuk3IjF4lYypCBKDMSpis-w4tfqG8I5n_nCnvmeRqcHT5hkaj_dWpKHMfIjr0BYrbf4DcXqHBzQ';
const VALID_REFRESH_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTQwMzAzODQsImV4cCI6MTc4NDYyMzA4NSwidW5pcXVlX2lkIjoiMTIyNWVlOWEtNjM3Yi00ODU0LTgyNzktMDU5YWE0NDYwZGQ4In0.tBNEygngKYWBmpQHNXslSnAjuQ_h4FNacErGyw9mA-3HBvN2EzEiTjvD3C2hKP-hdz5wwNOSVO4j4CFvlAhjFA';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.url === '/' || req.url === '') {
    return res.status(200).json({ 
      message: 'Kuku FM API Proxy – use with app headers.',
      status: 'active'
    });
  }

  // ----- Guard: Required Headers Check -----
  const pkg = req.headers['package-name'];
  const ua = req.headers['user-agent'];
  
  if (!pkg || !pkg.includes('com.vlv.aravali.reels') || !ua || !ua.includes('kukufm-android-reels')) {
    return res.status(403).json({ 
      error: 'Forbidden – missing or invalid required headers',
      required: ['package-name: com.vlv.aravali.reels', 'user-agent: kukufm-android-reels/*']
    });
  }

  const BASE_URL = 'https://kukufm.com';
  const targetUrl = new URL(req.url, BASE_URL).toString();

  // Endpoints Configuration
  const noAuthEndpoints = ['/api/v1.1/users/get-session-token/', '/v1.1/users/get-session-token/'];
  const cacheEndpoints = ['/api/v2/payments', '/api/v3/home'];
  
  const isNoAuth = noAuthEndpoints.some(p => req.url.startsWith(p));
  const isSessionTokenEndpoint = req.url.includes('/users/get-session-token/');
  const useCache = cacheEndpoints.some(p => req.url.includes(p));

  // ----- Build Headers -----
  const headers = {
    'client-country': 'IN',
    'install-source': 'google_play',
    'lang': 'english',
    'app-version': '50401',
    'user-agent': 'kukufm-android-reels/5.8.1',
    'package-name': 'com.vlv.aravali.reels',
    'Accept': 'application/json',
  };

  // Add Authorization if needed
  if (!isNoAuth) {
    const clientAuth = req.headers.authorization || req.headers.Authorization;
    headers['Authorization'] = clientAuth || `jwt ${VALID_ACCESS_TOKEN}`;
  }

  // Cache control for specific endpoints
  if (useCache && !isNoAuth) {
    headers['cache-control'] = 'max-age=5';
  }

  // Copy content-type from request
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }

  // ----- Read Raw Body -----
  let bodyBuffer = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    bodyBuffer = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  // ==========================================
  // INTERCEPT & REWRITE TOKENS IN REQUEST
  // ==========================================
  if (bodyBuffer && isSessionTokenEndpoint) {
    const contentType = req.headers['content-type'] || '';
    
    // Handle application/x-www-form-urlencoded
    if (contentType.includes('application/x-www-form-urlencoded')) {
      let bodyStr = bodyBuffer.toString();
      const params = new URLSearchParams(bodyStr);
      
      // Replace with valid tokens
      if (params.has('access_token')) {
        params.set('access_token', VALID_ACCESS_TOKEN);
        console.log('✅ Replaced access_token in request');
      }
      if (params.has('refresh_token')) {
        params.set('refresh_token', VALID_REFRESH_TOKEN);
        console.log('✅ Replaced refresh_token in request');
      }
      
      bodyStr = params.toString();
      bodyBuffer = Buffer.from(bodyStr);
      
      // Update content-length
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
      delete headers['content-length']; // Remove duplicate if exists
      
    } 
    // Handle application/json
    else if (contentType.includes('application/json')) {
      try {
        let bodyObj = JSON.parse(bodyBuffer.toString());
        let modified = false;
        
        if (bodyObj.access_token) {
          bodyObj.access_token = VALID_ACCESS_TOKEN;
          modified = true;
        }
        if (bodyObj.refresh_token) {
          bodyObj.refresh_token = VALID_REFRESH_TOKEN;
          modified = true;
        }
        
        if (modified) {
          const newBody = JSON.stringify(bodyObj);
          bodyBuffer = Buffer.from(newBody);
          headers['Content-Length'] = Buffer.byteLength(newBody);
          delete headers['content-length'];
          console.log('✅ Replaced tokens in JSON request');
        }
      } catch (error) {
        console.warn('⚠️ Could not parse JSON body:', error.message);
      }
    }
  }

  // ==========================================
  // MAKE REQUEST TO KUKU FM
  // ==========================================
  try {
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    // Only add body for non-GET/HEAD requests
    if (bodyBuffer && req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = bodyBuffer;
    }

    console.log(`📤 Proxying ${req.method} ${targetUrl}`);
    
    const response = await fetch(targetUrl, fetchOptions);
    
    // Read response
    const responseBody = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    // ==========================================
    // INTERCEPT & MODIFY RESPONSE TOKENS
    // ==========================================
    let finalBody = responseBody;
    
    if (isSessionTokenEndpoint && responseBody) {
      try {
        const responseObj = JSON.parse(responseBody);
        let modified = false;
        
        // Replace tokens in response with our valid tokens
        if (responseObj.access_token && responseObj.access_token !== VALID_ACCESS_TOKEN) {
          responseObj.access_token = VALID_ACCESS_TOKEN;
          modified = true;
          console.log('✅ Replaced access_token in response');
        }
        if (responseObj.refresh_token && responseObj.refresh_token !== VALID_REFRESH_TOKEN) {
          responseObj.refresh_token = VALID_REFRESH_TOKEN;
          modified = true;
          console.log('✅ Replaced refresh_token in response');
        }
        
        // Also update timestamps if needed (add 1 year from now)
        if (modified) {
          const oneYearFromNow = Math.floor(Date.now() / 1000) + 31536000; // 1 year
          responseObj.access_token_timestamp = oneYearFromNow;
          responseObj.refresh_token_timestamp = oneYearFromNow;
          finalBody = JSON.stringify(responseObj);
          console.log('✅ Updated token timestamps');
        }
      } catch (error) {
        console.warn('⚠️ Could not parse response JSON:', error.message);
      }
    }

    // Send response
    res.status(response.status);
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.send(finalBody);

  } catch (error) {
    console.error('❌ Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Internal proxy error',
      message: error.message 
    });
  }
}
