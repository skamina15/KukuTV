// ==========================================
// 🎯 POCKET FM PROXY - ANSARI ACCOUNT + USER BRANDING
// ==========================================

const APP_CONFIG = {
    deviceId: 'f9a665481472b85a',
    sessionId: 'a706bf74-1f2f-47c8-9d9a-26ce685a5e6b',
    appInstanceId: 'bb17fbeae5cedb6770b1e663f973700b',
    adId: '61304354-728a-4058-8586-4607eefa339e',
    uid: '0918e3871e22f7c9ffc6ee4e52e6edd66ff5d42f',
    profileId: '147853168',
    fullname: 'Ansari',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImRldmljZV9pZCI6ImY5YTY2NTQ4MTQ3MmI4NWEiLCJleHBpcnkiOjE3ODU5MjY4NDIsImlhdCI6MTc4NTc1NDA0MiwibG9jYWxlIjoiSU4iLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb2xlIjoiTGlzdGVuZXIiLCJ0ZW5hbnQiOiJwb2NrZXRfZm0iLCJ1aWQiOiIwOTE4ZTM4NzFlMjJmN2M5ZmZjNmVlNGU1MmU2ZWRkNjZmZjVkNDJmIiwidmVyc2lvbiI6InYyIn0.D9coLr6AwOmSWpt7n4LU1-KdyeOxEmTuUhmj3z6vfAI',
    appVersion: '2103',
    versionName: '9.9.0',
    platform: 'android',
    platformVersion: '36',
    userAgent: 'okhttp/4.12.0',
};

export default async function handler(req, res) {
    let urlPath = req.headers['x-invoke-path'] || req.url;
    const cleanPath = urlPath.split('?')[0];
    const method = req.method;

    // ==========================================
    // 👤 GET USER'S NAME FOR BRANDING
    // ==========================================
    let currentUserName = 'User';
    
    // Try to get name from headers
    if (req.headers['fullname']) {
        try {
            currentUserName = Buffer.from(req.headers['fullname'], 'base64').toString();
        } catch(e) {
            currentUserName = req.headers['fullname'];
        }
    } else if (req.headers['x-user-name']) {
        try {
            currentUserName = Buffer.from(req.headers['x-user-name'], 'base64').toString();
        } catch(e) {
            currentUserName = req.headers['x-user-name'];
        }
    } else if (req.body && req.body.fullname) {
        currentUserName = req.body.fullname;
    } else if (req.body && req.body.name) {
        currentUserName = req.body.name;
    } else if (req.headers['user-agent']) {
        // Fallback - extract from user-agent
        const match = req.headers['user-agent'].match(/PocketFM\/([^\/]+)/);
        if (match) currentUserName = match[1];
    }

    // Clean username (remove @ if present)
    currentUserName = currentUserName.replace(/^@/, '').trim();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 🚫 BLOCK LOGOUT/DELETE
    // ==========================================
    const BLOCKED_ENDPOINTS = [
        '/api/v1/users/logout', '/api/v1/users/delete',
        '/api/v1/account/delete', '/auth/logout', '/auth/delete'
    ];
    
    const isBlocked = BLOCKED_ENDPOINTS.some(endpoint => cleanPath.includes(endpoint));
    if (isBlocked) {
        return res.status(200).json({
            code: 200,
            message: "Action not allowed",
            data: null,
            success: true
        });
    }

    // ==========================================
    // 🚫 BLOCK TRACKING
    // ==========================================
    const TRACKING_DOMAINS = [
        'firebaselogging-pa.googleapis.com',
        'firebaseinstallations.googleapis.com',
        'analytics.pocketfm.com',
        'gateway.unityads.unity3d.com',
        'appsflyersdk.com',
        'appsflyer',
        'dns.google',
        'revenuecat.com',
        'posthog.com',
        'androidevent',
        'logging_data/log',
        'product_entitlement_mapping'
    ];
    
    const isTracking = TRACKING_DOMAINS.some(domain => 
        cleanPath.includes(domain) || urlPath.includes(domain)
    );
    
    if (isTracking) {
        if (cleanPath.includes('firebase')) {
            return res.status(200).json({ logRequest: [], qosTier: "DEFAULT" });
        }
        if (cleanPath.includes('analytics') || cleanPath.includes('logging_data')) {
            return res.status(200).json({ Status: 1, Message: "Request successfully processed" });
        }
        return res.status(200).json({ code: 200, message: "SUCCESS", data: null });
    }

    // ==========================================
    // 🏷️ BRANDING WITH USER'S NAME
    // ==========================================
    const addBranding = (text) => {
        if (!text || typeof text !== 'string') return text;
        // Skip if already branded
        if (text.includes(' @')) return text;
        // Don't add @ to "Ansari" directly (allow it)
        if (text === 'Ansari') return text;
        return text + ' @' + currentUserName;
    };

    const addBrandingToAll = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) {
            return obj.map(item => addBrandingToAll(item));
        }
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                if (['fullname', 'name', 'display_name', 'username', 'creator_name', 'author_name'].includes(key)) {
                    // Keep "Ansari" as account name, add user's name as tag
                    if (obj[key] === 'Ansari') {
                        // Already Ansari's account, just add user's name
                    } else {
                        obj[key] = addBranding(obj[key]);
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                addBrandingToAll(obj[key]);
            }
        });
        return obj;
    };

    // ==========================================
    // 🔓 UNLOCK ALL EPISODES
    // ==========================================
    const unlockAllEpisodes = (data) => {
        if (!data || typeof data !== 'object') return data;
        
        const unlock = (item) => {
            if (!item || typeof item !== 'object') return item;
            
            item.isPremium = false;
            item.is_premium = false;
            item.locked = false;
            item.free = true;
            item.paid = false;
            item.is_coin_user = true;
            item.unlocked_episodes_count = 999999;
            item.episodes_count = 999999;
            item.tab_count = 999999;
            item.episode_locking_point = 999999;
            item.higher_episode_locking_point = 999999;
            item.vip_timestamp = '2099-12-31T23:59:59Z';
            
            if (Array.isArray(item.stories)) {
                item.stories.forEach((story, index) => {
                    if (story && typeof story === 'object') {
                        story.isPremium = false;
                        story.is_premium = false;
                        story.locked = false;
                        story.free = true;
                        story.paid = false;
                        story.is_coin_user = true;
                        story.seq_number = index + 1;
                        story.natural_sequence_number = index + 1;
                        story.is_drm = false;
                        story.is_drm_enabled = false;
                        ['video_url', 'media_url', 'media_url_enc', 'hls_url'].forEach(field => {
                            if (story[field]) {
                                story[field] = story[field].replace('http://', 'https://');
                            }
                        });
                    }
                });
            }
            
            return item;
        };
        
        if (Array.isArray(data)) {
            data.forEach(unlock);
        } else {
            unlock(data);
        }
        
        return data;
    };

    // ==========================================
    // 🔒 BUILD HEADERS - ALWAYS ANSARI'S ACCOUNT
    // ==========================================
    function buildHeaders(req) {
        const headers = {};

        // Pass through non-auth headers
        if (req.headers) {
            Object.keys(req.headers).forEach(key => {
                const lowerKey = key.toLowerCase();
                if (!['accept-encoding', 'content-length', 'host', 'connection', 
                       'authorization', 'uid', 'user-id', 'profile-id', 'access-token',
                       'jwt-access-token', 'auth-token', 'jwt-auth-token'].includes(lowerKey)) {
                    headers[key] = req.headers[key];
                }
            });
        }

        // ✅ FORCE ANSARI'S ACCOUNT (Premium)
        headers['device-id'] = APP_CONFIG.deviceId;
        headers['x-device-id'] = APP_CONFIG.deviceId;
        headers['session-id'] = APP_CONFIG.sessionId;
        headers['app-instance-id'] = APP_CONFIG.appInstanceId;
        headers['ad-id'] = APP_CONFIG.adId;
        headers['uid'] = APP_CONFIG.uid;
        headers['user-id'] = APP_CONFIG.uid;
        headers['profile-id'] = APP_CONFIG.profileId;
        headers['app-version'] = APP_CONFIG.appVersion;
        headers['version-name'] = APP_CONFIG.versionName;
        headers['platform'] = APP_CONFIG.platform;
        headers['platform-version'] = APP_CONFIG.platformVersion;
        headers['user-agent'] = APP_CONFIG.userAgent;
        headers['accept'] = 'application/json';
        headers['content-type'] = 'application/json';
        headers['authorization'] = 'Bearer ' + APP_CONFIG.accessToken;
        headers['access-token'] = APP_CONFIG.accessToken;
        headers['jwt-access-token'] = APP_CONFIG.accessToken;
        headers['auth-token'] = APP_CONFIG.authToken || APP_CONFIG.accessToken;
        headers['jwt-auth-token'] = APP_CONFIG.jwtAuthToken || APP_CONFIG.accessToken;
        
        // ✅ Store user's name for branding
        headers['x-user-name'] = Buffer.from(currentUserName).toString('base64');
        // Still send fullname as Ansari (account name)
        headers['fullname'] = Buffer.from('Ansari').toString('base64');
        
        return headers;
    }

    // ==========================================
    // 🎯 FORWARD REQUEST
    // ==========================================
    try {
        const headers = buildHeaders(req);
        const targetUrl = getTargetUrl(cleanPath);
        
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        delete headers['connection'];

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            if (typeof req.body === 'string') {
                fetchOptions.body = req.body;
            } else if (Buffer.isBuffer(req.body)) {
                fetchOptions.body = req.body;
            } else if (typeof req.body === 'object') {
                fetchOptions.body = JSON.stringify(req.body);
                fetchOptions.headers['content-type'] = 'application/json';
            }
        }

        const response = await fetch(targetUrl + urlPath, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            data = unlockAllEpisodes(data);
            data = addBrandingToAll(data);
            return res.status(response.status).json(data);
        } else {
            const buffer = Buffer.from(await response.arrayBuffer());
            response.headers.forEach((value, key) => {
                if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
                    res.setHeader(key, value);
                }
            });
            if (contentType) res.setHeader('Content-Type', contentType);
            return res.status(response.status).send(buffer);
        }

    } catch (error) {
        console.error('❌ Proxy Error:', error);
        return res.status(500).json({
            code: 500,
            message: "Proxy Error: " + error.message
        });
    }
}

// ==========================================
// 🛠 GET TARGET URL
// ==========================================
function getTargetUrl(cleanPath) {
    if (cleanPath.includes('/api.pocketfm.com') || 
        cleanPath.includes('/v2/') || 
        cleanPath.includes('/v3/')) {
        return 'https://api.pocketfm.com';
    }
    if (cleanPath.includes('analytics.pocketfm.com')) {
        return 'https://analytics.pocketfm.com';
    }
    if (cleanPath.includes('cloudfront.net') || 
        cleanPath.includes('d2wxtuh5s9v3ty.cloudfront.net') ||
        cleanPath.includes('ddqs490ahjgsl.cloudfront.net') ||
        cleanPath.includes('d13yevwzck7i9p.cloudfront.net')) {
        return 'https://' + cleanPath.split('/')[2];
    }
    if (cleanPath.includes('gateway.unityads.unity3d.com')) {
        return 'https://gateway.unityads.unity3d.com';
    }
    if (cleanPath.includes('dns.google')) {
        return 'https://dns.google';
    }
    if (cleanPath.includes('firebase')) {
        return 'https://firebaselogging-pa.googleapis.com';
    }
    return 'https://api.pocketfm.com';
}
