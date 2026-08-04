// ==========================================
// 🎯 POCKET FM PROXY - COMPLETE ANSARI FORCED
// ==========================================

// ==========================================
// 🔒 PREMIUM CONFIG
// ==========================================
const PREMIUM_CONFIG = {
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
    branding: '@Ansari'
};

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.pocketfm.com";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
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
    
    const isBlocked = BLOCKED_ENDPOINTS.some(endpoint => urlPath.includes(endpoint));
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
    const isAnalytics = urlPath.includes('/heartbeat') || 
                       urlPath.includes('/impression') || 
                       urlPath.includes('/analytics') ||
                       urlPath.includes('/logging_data') ||
                       urlPath.includes('firebase') ||
                       urlPath.includes('appsflyer') ||
                       urlPath.includes('firebaselogging') ||
                       urlPath.includes('revenuecat') ||
                       urlPath.includes('posthog');
    
    if (isAnalytics) {
        return res.status(200).json({ 
            code: 200, 
            message: "SUCCESS", 
            data: null,
            success: true 
        });
    }

    // ==========================================
    // 🔄 INTERCEPT ALL REQUESTS - FORCE ANSARI
    // ==========================================
    try {
        // Build headers with Ansari credentials
        const headers = buildHeaders(req);
        
        // IMPORTANT: Override ALL user identifying headers
        headers['device-id'] = PREMIUM_CONFIG.deviceId;
        headers['x-device-id'] = PREMIUM_CONFIG.deviceId;
        headers['session-id'] = PREMIUM_CONFIG.sessionId;
        headers['app-instance-id'] = PREMIUM_CONFIG.appInstanceId;
        headers['ad-id'] = PREMIUM_CONFIG.adId;
        headers['uid'] = PREMIUM_CONFIG.uid;
        headers['user-id'] = PREMIUM_CONFIG.uid;
        headers['profile-id'] = PREMIUM_CONFIG.profileId;
        headers['authorization'] = 'Bearer ' + PREMIUM_CONFIG.accessToken;
        headers['access-token'] = PREMIUM_CONFIG.accessToken;
        headers['jwt-access-token'] = PREMIUM_CONFIG.accessToken;
        headers['auth-token'] = PREMIUM_CONFIG.accessToken;
        headers['jwt-auth-token'] = PREMIUM_CONFIG.accessToken;
        
        // Remove any original user headers
        delete headers['x-user-id'];
        delete headers['x-profile-id'];
        delete headers['x-uid'];
        delete headers['x-device-id-original'];
        
        const targetUrl = targetBaseUrl + urlPath;
        
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        delete headers['connection'];

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            // Modify request body to use Ansari ID
            let body = req.body;
            if (typeof body === 'object') {
                body = { ...body };
                // Replace any user IDs in body
                if (body.user_id) body.user_id = PREMIUM_CONFIG.profileId;
                if (body.profile_id) body.profile_id = PREMIUM_CONFIG.profileId;
                if (body.uid) body.uid = PREMIUM_CONFIG.uid;
                if (body.device_id) body.device_id = PREMIUM_CONFIG.deviceId;
                if (body.session_id) body.session_id = PREMIUM_CONFIG.sessionId;
                fetchOptions.body = JSON.stringify(body);
                fetchOptions.headers['content-type'] = 'application/json';
            } else if (typeof body === 'string') {
                // Try to replace IDs in string body
                try {
                    let jsonBody = JSON.parse(body);
                    if (jsonBody.user_id) jsonBody.user_id = PREMIUM_CONFIG.profileId;
                    if (jsonBody.profile_id) jsonBody.profile_id = PREMIUM_CONFIG.profileId;
                    if (jsonBody.uid) jsonBody.uid = PREMIUM_CONFIG.uid;
                    if (jsonBody.device_id) jsonBody.device_id = PREMIUM_CONFIG.deviceId;
                    if (jsonBody.session_id) jsonBody.session_id = PREMIUM_CONFIG.sessionId;
                    fetchOptions.body = JSON.stringify(jsonBody);
                } catch {
                    fetchOptions.body = body;
                }
            } else {
                fetchOptions.body = body;
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            
            // ==========================================
            // 🔥 FORCE REPLACE ALL USER DATA WITH ANSARI
            // ==========================================
            data = replaceWithAnsari(data);
            
            // Unlock all episodes
            data = unlockAllEpisodes(data);
            
            // Add branding
            data = applyBranding(data);
            
            // Force replace tokens
            if (data.access_token) data.access_token = PREMIUM_CONFIG.accessToken;
            if (data.token) data.token = PREMIUM_CONFIG.accessToken;
            if (data.jwt) data.jwt = PREMIUM_CONFIG.accessToken;
            if (data.refresh_token) data.refresh_token = PREMIUM_CONFIG.accessToken;
            
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
// 🛠 REPLACE WITH ANSARI (FORCE)
// ==========================================
function replaceWithAnsari(data) {
    if (!data || typeof data !== 'object') return data;
    
    const ansariData = {
        id: PREMIUM_CONFIG.profileId,
        uid: PREMIUM_CONFIG.uid,
        user_id: PREMIUM_CONFIG.profileId,
        profile_id: PREMIUM_CONFIG.profileId,
        fullname: PREMIUM_CONFIG.fullname + ' ' + PREMIUM_CONFIG.branding,
        name: PREMIUM_CONFIG.fullname + ' ' + PREMIUM_CONFIG.branding,
        display_name: PREMIUM_CONFIG.fullname + ' ' + PREMIUM_CONFIG.branding,
        username: PREMIUM_CONFIG.fullname.toLowerCase(),
        email: 'ansari@proton.me',
        phone: '9876543210',
        is_premium: true,
        is_coin_user: true,
        coins: 999999,
        vip: true,
        vip_timestamp: '2099-12-31T23:59:59Z',
        profile_picture: 'https://ui-avatars.com/api/?name=Ansari&background=random',
        avatar: 'https://ui-avatars.com/api/?name=Ansari&background=random',
        device_id: PREMIUM_CONFIG.deviceId,
        session_id: PREMIUM_CONFIG.sessionId,
        token: PREMIUM_CONFIG.accessToken,
        access_token: PREMIUM_CONFIG.accessToken
    };
    
    // If data is an array, replace each item
    if (Array.isArray(data)) {
        return data.map(item => {
            if (typeof item === 'object' && item !== null) {
                // Check if this looks like a user object
                if (item.id || item.uid || item.user_id || item.profile_id) {
                    return { ...ansariData, ...item };
                }
                return replaceWithAnsari(item);
            }
            return item;
        });
    }
    
    // If data is an object, replace user fields
    if (typeof data === 'object' && data !== null) {
        // Check if this is a user object
        if (data.id || data.uid || data.user_id || data.profile_id || data.fullname) {
            return { ...ansariData, ...data };
        }
        
        // Recursively process nested objects
        const result = { ...data };
        for (let key in result) {
            if (typeof result[key] === 'object' && result[key] !== null) {
                result[key] = replaceWithAnsari(result[key]);
            }
            // Replace string fields that might contain user IDs
            if (typeof result[key] === 'string') {
                // Replace user IDs in strings
                if (result[key].match(/[0-9a-f]{32,}/i)) {
                    // If it looks like a user ID, replace it
                    result[key] = PREMIUM_CONFIG.uid;
                }
            }
        }
        return result;
    }
    
    return data;
}

// ==========================================
// 🎯 BRANDING APPLY
// ==========================================
function applyBranding(obj) {
    const brandTag = " " + PREMIUM_CONFIG.branding;
    const targetKeys = ['fullname', 'name', 'display_name', 'username', 
                       'title', 'show_name', 'drama_name', 'text', 
                       'creator_name', 'author_name', 'description'];

    if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            if (typeof obj[key] === 'string' && targetKeys.includes(key)) {
                if (!obj[key].includes(PREMIUM_CONFIG.branding)) {
                    obj[key] = obj[key].trim() + brandTag;
                }
            } else if (typeof obj[key] === 'object') {
                applyBranding(obj[key]);
            }
        }
    }
    return obj;
}

// ==========================================
// 🔥 UNLOCK ALL EPISODES
// ==========================================
function unlockAllEpisodes(data) {
    if (!data || typeof data !== 'object') return data;
    
    const unlock = (item) => {
        if (!item || typeof item !== 'object') return item;
        
        // Unlock everything
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
        
        // Unlock stories/episodes
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
        
        if (Array.isArray(item.episodes)) {
            item.episodes.forEach(ep => {
                if (ep && typeof ep === 'object') {
                    ep.isPremium = false;
                    ep.is_premium = false;
                    ep.locked = false;
                    ep.free = true;
                    ep.paid = false;
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
}

// ==========================================
// 🛠 BUILD HEADERS
// ==========================================
function buildHeaders(req) {
    const headers = {};

    if (req.headers) {
        Object.keys(req.headers).forEach(key => {
            if (!['accept-encoding', 'content-length', 'host', 'connection'].includes(key.toLowerCase())) {
                headers[key] = req.headers[key];
            }
        });
    }

    // Force Ansari credentials
    headers['device-id'] = PREMIUM_CONFIG.deviceId;
    headers['x-device-id'] = PREMIUM_CONFIG.deviceId;
    headers['session-id'] = PREMIUM_CONFIG.sessionId;
    headers['app-instance-id'] = PREMIUM_CONFIG.appInstanceId;
    headers['ad-id'] = PREMIUM_CONFIG.adId;
    headers['uid'] = PREMIUM_CONFIG.uid;
    headers['user-id'] = PREMIUM_CONFIG.uid;
    headers['profile-id'] = PREMIUM_CONFIG.profileId;
    headers['app-version'] = PREMIUM_CONFIG.appVersion;
    headers['version-name'] = PREMIUM_CONFIG.versionName;
    headers['platform'] = PREMIUM_CONFIG.platform;
    headers['platform-version'] = PREMIUM_CONFIG.platformVersion;
    headers['user-agent'] = PREMIUM_CONFIG.userAgent;
    headers['accept'] = 'application/json';
    headers['content-type'] = 'application/json';
    headers['authorization'] = 'Bearer ' + PREMIUM_CONFIG.accessToken;
    headers['access-token'] = PREMIUM_CONFIG.accessToken;
    headers['jwt-access-token'] = PREMIUM_CONFIG.accessToken;
    headers['auth-token'] = PREMIUM_CONFIG.accessToken;
    headers['jwt-auth-token'] = PREMIUM_CONFIG.accessToken;
    headers['fullname'] = Buffer.from(PREMIUM_CONFIG.fullname).toString('base64');
    
    // Remove any original user headers
    delete headers['x-user-id'];
    delete headers['x-profile-id'];
    delete headers['x-uid'];
    delete headers['x-device-id-original'];
    
    return headers;
}
