// index.js - Complete proxy with hardcoded tokens for User B

// User B ke tokens (jo aapne diye hain)
const USER_B_TOKENS = {
  access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjExMzI2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.AIv4ylrSaI0t3Y6B3niVf8vV7iGE98uvz2KUCMepKPWVnhekKx3GXNATFl-BGJtu-YBqh-0ZxxhSZyULiC67Kg",
  refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
  user_id: 146060028,
  user_name: "History_Maestro999L",
  phone: "+918918753244"
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, app-version, install-source, package-name, user-agent, accept-encoding, x-requested-with');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const baseUrl = 'https://kukufm.com';
    const targetPath = req.url;
    const targetUrl = `${baseUrl}${targetPath}`;
    
    // Get original request body
    let requestBody = '';
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      requestBody = await getRawBody(req);
    }
    
    // Parse original body if it's form data
    let parsedBody = {};
    if (requestBody) {
      try {
        const params = new URLSearchParams(requestBody);
        for (let [key, value] of params) {
          parsedBody[key] = value;
        }
      } catch (e) {
        console.log('Could not parse body as form data');
      }
    }
    
    // Prepare headers - forward original headers but override with User B tokens
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': req.headers['user-agent'] || 'kukufm-android-reels/5.8.1',
      'Accept-Encoding': req.headers['accept-encoding'] || 'gzip',
      'app-version': req.headers['app-version'] || '50401',
      'install-source': req.headers['install-source'] || 'google_play',
      'package-name': req.headers['package-name'] || 'com.vlv.aravali.reels',
    };
    
    // Modify body to use User B tokens
    let modifiedBody = new URLSearchParams(parsedBody);
    
    // Replace tokens with User B's tokens
    modifiedBody.set('access_token', USER_B_TOKENS.access_token);
    modifiedBody.set('refresh_token', USER_B_TOKENS.refresh_token);
    
    // For get-session-token endpoint, add additional tracking
    if (targetPath.includes('/get-session-token/')) {
      console.log(`🔄 Session request - Using User B: ${USER_B_TOKENS.user_name} (ID: ${USER_B_TOKENS.user_id})`);
      
      // Add custom headers to identify proxy usage
      headers['x-proxy-user'] = USER_B_TOKENS.user_name;
      headers['x-proxy-user-id'] = String(USER_B_TOKENS.user_id);
    }
    
    // Get final body string
    const finalBody = modifiedBody.toString();
    headers['Content-Length'] = Buffer.byteLength(finalBody);
    
    console.log(`📤 Proxying to: ${targetUrl}`);
    console.log(`👤 Using User: ${USER_B_TOKENS.user_name}`);
    console.log(`📦 Body: ${finalBody}`);
    
    // Make request with User B tokens
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? finalBody : undefined,
    });
    
    // Get response
    let responseBody = await response.text();
    console.log(`📥 Response status: ${response.status}`);
    
    // Parse and modify response if JSON
    let finalResponse = responseBody;
    try {
      const jsonData = JSON.parse(responseBody);
      
      // Ensure response contains User B data
      if (jsonData.user) {
        // Double-check user data matches User B
        jsonData.user.id = USER_B_TOKENS.user_id;
        jsonData.user.name = USER_B_TOKENS.user_name;
        jsonData.user.phone = USER_B_TOKENS.phone;
        jsonData.user.username = USER_B_TOKENS.phone;
        
        console.log(`✅ Response modified - User: ${jsonData.user.name}`);
      }
      
      // If tokens in response, ensure they match User B
      if (jsonData.access_token) {
        // Keep original token from response, but log it
        console.log(`🔑 New access token received for User B`);
      }
      
      finalResponse = JSON.stringify(jsonData);
    } catch (e) {
      // Not JSON, pass through
      console.log('Response is not JSON');
    }
    
    // Forward response with CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    res.status(response.status).send(finalResponse);
    
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Helper: Read raw body
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}

// Local development server
if (require.main === module) {
  const http = require('http');
  const url = require('url');
  
  const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    req.url = parsedUrl.pathname + (parsedUrl.search || '');
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await getRawBody(req);
      if (body) req.body = body;
    }
    
    await module.exports(req, res);
  });
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Proxy running on http://localhost:${PORT}`);
    console.log(`👤 Using User B: ${USER_B_TOKENS.user_name} (ID: ${USER_B_TOKENS.user_id})`);
    console.log(`📱 App will automatically use User B tokens`);
  });
}
