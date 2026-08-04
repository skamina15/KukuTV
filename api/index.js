// ==========================================
// 🎯 POCKET FM PROXY - ULTIMATE ANSARI FORCE
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

// ANSARI USER DATA - HAR JAGAH YAHI USE HOGA
const ANSARI_USER = {
    id: '147853168',
    uid: '0918e3871e22f7c9ffc6ee4e52e6edd66ff5d42f',
    user_id: '147853168',
    profile_id: '147853168',
    fullname: 'Ansari @Ansari',
    name: 'Ansari @Ansari',
    display_name: 'Ansari @Ansari',
    username: 'ansari',
    email: 'ansari@proton.me',
    phone: '9876543210',
    is_premium: true,
    is_coin_user: true,
    coins: 999999,
    vip: true,
    vip_timestamp: '2099-12-31T23:59:59Z',
    profile_picture: 'https://ui-avatars.com/api/?name=Ansari&background=random&size=128',
    avatar: 'https://ui-avatars.com/api/?name=Ansari&background=random&size=128',
    device_id: 'f9a665481472b85a',
    session_id: 'a706bf74-1f2f-47c8-9d9a-26ce685a5e6b',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImRldmljZV9pZCI6ImY5YTY2NTQ4MTQ3MmI4NWEiLCJleHBpcnkiOjE3ODU5MjY4NDIsImlhdCI6MTc4NTc1NDA0MiwibG9jYWxlIjoiSU4iLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb2xlIjoiTGlzdGVuZXIiLCJ0ZW5hbnQiOiJwb2NrZXRfZm0iLCJ1aWQiOiIwOTE4ZTM4NzFlMjJmN2M5ZmZjNmVlNGU1MmU2ZWRkNjZmZjVkNDJmIiwidmVyc2lvbiI6InYyIn0.D9coLr6AwOmSWpt7n4LU1-KdyeOxEmTuUhmj3z6vfAI',
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImRldmljZV9pZCI6ImY5YTY2NTQ4MTQ3MmI4NWEiLCJleHBpcnkiOjE3ODU5MjY4NDIsImlhdCI6MTc4NTc1NDA0MiwibG9jYWxlIjoiSU4iLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb2xlIjoiTGlzdGVuZXIiLCJ0ZW5hbnQiOiJwb2NrZXRfZm0iLCJ1aWQiOiIwOTE4ZTM4NzFlMjJmN2M5ZmZjNmVlNGU1MmU2ZWRkNjZmZjVkNDJmIiwidmVyc2lvbiI6InYyIn0.D9coLr6AwOmSWpt7n4LU1-KdyeOxEmTuUhmj3z6vfAI',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImRldmljZV9pZCI6ImY5YTY2NTQ4MTQ3MmI4NWEiLCJleHBpcnkiOjE3ODU5MjY4NDIsImlhdCI6MTc4NTc1NDA0MiwibG9jYWxlIjoiSU4iLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb2xlIjoiTGlzdGVuZXIiLCJ0ZW5hbnQiOiJwb2NrZXRfZm0iLCJ1aWQiOiIwOTE4ZTM4NzFlMjJmN2M5ZmZjNmVlNGU1MmU2ZWRkNjZmZjVkNDJmIiwidmVyc2lvbiI6InYyIn0.D9coLr6AwOmSWpt7n4LU1-KdyeOxEmTuUhmj3z6vfAI'
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
    // 🎯 DIRECT ANSARI RESPONSE - NO API CALL
    // ==========================================
    
    // AGAR USER PROFILE REQUEST HAI - DIRECT ANSARI RETURN
    if (urlPath.includes('/v1/users/profile') || 
        urlPath.includes('/v2/users/me') ||
        urlPath.includes('/v2/users/profile') ||
        urlPath.includes('/v3/user/me') ||
        urlPath.includes('/v1/profile')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: ANSARI_USER,
            success: true
        });
    }

    // PREMIUM STATUS - DIRECT ANSARI PREMIUM
    if (urlPath.includes('/v1/users/premium-status') || 
        urlPath.includes('/v2/subscription/status') ||
        urlPath.includes('/v1/coins/balance') ||
        urlPath.includes('/v2/coins/balance')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                is_premium: true,
                is_coin_user: true,
                coins: 999999,
                premium_until: '2099-12-31T23:59:59Z',
                plan: "Premium Plus [ Ansari ]",
                status: "active",
                vip: true,
                vip_timestamp: '2099-12-31T23:59:59Z',
                unlocked_episodes: 999999,
                total_episodes: 999999
            },
            success: true
        });
    }

    // LOGIN/REGISTER - ALWAYS RETURN ANSARI
    if (urlPath.includes('/auth/login') || 
        urlPath.includes('/auth/register') ||
        urlPath.includes('/v1/users/login') ||
        urlPath.includes('/v1/users/register') ||
        urlPath.includes('/v2/auth/login')) {
        return res.status(200).json({
            code: 200,
            message: "Login successful",
            success: true,
            data: ANSARI_USER,
            access_token: PREMIUM_CONFIG.accessToken,
            token: PREMIUM_CONFIG.accessToken,
            refresh_token: PREMIUM_CONFIG.accessToken
        });
    }

    // BLOCK LOGOUT/DELETE
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

    // BLOCK TRACKING
    const isAnalytics = urlPath.includes('/heartbeat') || 
                       urlPath.includes('/impression') || 
                       urlPath.includes('/analytics') ||
                       urlPath.includes('/logging_data') ||
                       urlPath.includes('firebase') ||
                       urlPath.includes('appsflyer') ||
                       urlPath.includes('firebaselogging') ||
                       urlPath.includes('revenuecat') ||
                       urlPath.includes('posthog') ||
                       urlPath.includes('dns.google');
    
    if (isAnalytics) {
        return res.status(200).json({ 
            code: 200, 
            message: "SUCCESS", 
            data: null,
            success: true 
        });
    }

    // ==========================================
    // 🔄 FORWARD REQUEST - BUT REPLACE EVERYTHING
    // ==========================================
    try {
        const headers = buildHeaders(req);
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
            let body = req.body;
            if (typeof body === 'object') {
                body = { ...body };
                // Force replace ALL IDs in body
                body.user_id = PREMIUM_CONFIG.profileId;
                body.profile_id = PREMIUM_CONFIG.profileId;
                body.uid = PREMIUM_CONFIG.uid;
                body.device_id = PREMIUM_CONFIG.deviceId;
                body.session_id = PREMIUM_CONFIG.sessionId;
                fetchOptions.body = JSON.stringify(body);
                fetchOptions.headers['content-type'] = 'application/json';
            } else {
                fetchOptions.body = body;
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            
            // ==========================================
            // 🔥 COMPLETE REPLACE - NOTHING ORIGINAL LEFT
            // ==========================================
            
            // Agar data mein user object hai toh use ANSARI se replace kar do
            if (data && typeof data === 'object') {
                // Replace data.user
                if (data.user) {
                    data.user = { ...ANSARI_USER, ...data.user };
                }
                // Replace data.data if it's a user
                if (data.data && (data.data.id || data.data.uid || data.data.user_id)) {
                    data.data = { ...ANSARI_USER, ...data.data };
                }
                // Replace data.profile
                if (data.profile) {
                    data.profile = { ...ANSARI_USER, ...data.profile };
                }
                // Replace data.result if it's a user
                if (data.result && (data.result.id || data.result.uid)) {
                    data.result = { ...ANSARI_USER, ...data.result };
                }
                // Agar data mein user array hai toh sab replace
                if (data.data && Array.isArray(data.data)) {
                    data.data = data.data.map(item => {
                        if (item && typeof item === 'object' && (item.id || item.uid)) {
                            return { ...ANSARI_USER, ...item };
                        }
                        return item;
                    });
                }
                // Replace tokens
                data.access_token = PREMIUM_CONFIG.accessToken;
                data.token = PREMIUM_CONFIG.accessToken;
                data.jwt = PREMIUM_CONFIG.accessToken;
                data.refresh_token = PREMIUM_CONFIG.accessToken;
                data.success = true;
                data.code = 200;
            }
            
            // Unlock all episodes
            data = unlockAllEpisodes(data);
            
            // Add branding everywhere
            data = applyBranding(data);
            
            return res.status(200).json(data);
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
        // ERROR MEIN BHI ANSARI RETURN KARO
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: ANSARI_USER,
            success: true
        });
    }
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

    // FORCE ANSARI - HAR HEADER MEIN
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
    
    // KISI BHI ORIGINAL USER HEADER KO HATADO
    delete headers['x-user-id'];
    delete headers['x-profile-id'];
    delete headers['x-uid'];
    delete headers['x-device-id-original'];
    delete headers['x-original-user'];
    
    return headers;
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
