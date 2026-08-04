// ==========================================
// 🎯 POCKET FM PROXY - STORY MAX STYLE
// ==========================================

// ==========================================
// 🔒 PREMIUM CONFIG
// ==========================================
const PREMIUM_CONFIG = {
    // Ansari Account Credentials
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
    // 🎯 FAKE PREMIUM RESPONSES (Story Max Style)
    // ==========================================
    
    // 1. FAKE USER PROFILE - Always show as Premium Ansari
    if (urlPath.includes('/v1/users/profile') || urlPath.includes('/v2/users/me')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                id: PREMIUM_CONFIG.profileId,
                uid: PREMIUM_CONFIG.uid,
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
            },
            success: true
        });
    }

    // 2. FAKE PREMIUM STATUS - Always Premium
    if (urlPath.includes('/v1/users/premium-status') || 
        urlPath.includes('/v2/subscription/status') ||
        urlPath.includes('/v1/coins/balance')) {
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

    // 3. FAKE SHOW DETAILS - Unlock everything
    if (urlPath.includes('/v2/content_api/show.play_details') || 
        urlPath.includes('/v3/feed/player') ||
        urlPath.includes('/v1/shows/detail')) {
        
        try {
            const headers = buildHeaders(req);
            const targetUrl = targetBaseUrl + urlPath;
            
            const response = await fetch(targetUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined
            });
            
            let data = await response.json();
            
            // Unlock all episodes
            data = unlockAllEpisodes(data);
            
            // Add branding
            data = applyBranding(data);
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: {
                    show: {
                        id: "123",
                        title: "Premium Show " + PREMIUM_CONFIG.branding,
                        is_premium: false,
                        episodes: Array(100).fill(null).map((_, i) => ({
                            id: `ep_${i}`,
                            title: `Episode ${i+1}`,
                            is_premium: false,
                            locked: false,
                            free: true
                        }))
                    }
                }
            });
        }
    }

    // 4. FAKE ANALYTICS - Block all tracking
    const isAnalytics = urlPath.includes('/heartbeat') || 
                       urlPath.includes('/impression') || 
                       urlPath.includes('/analytics') ||
                       urlPath.includes('/logging_data') ||
                       urlPath.includes('firebase') ||
                       urlPath.includes('appsflyer');
    
    if (isAnalytics) {
        return res.status(200).json({ 
            code: 200, 
            message: "SUCCESS", 
            data: null,
            success: true 
        });
    }

    // 5. FAKE WATCHED STATUS
    if (urlPath.includes('/v1/history/update') || 
        urlPath.includes('/v2/episodes/watched')) {
        return res.status(200).json({ 
            code: 200, 
            message: "Updated successfully", 
            data: null,
            success: true 
        });
    }

    // 6. FAKE LOGIN - Always return Ansari
    if (urlPath.includes('/auth/login') || 
        urlPath.includes('/auth/register') ||
        urlPath.includes('/v1/users/login') ||
        urlPath.includes('/v1/users/register')) {
        return res.status(200).json({
            code: 200,
            message: "Login successful",
            success: true,
            data: {
                id: PREMIUM_CONFIG.profileId,
                uid: PREMIUM_CONFIG.uid,
                fullname: PREMIUM_CONFIG.fullname + ' ' + PREMIUM_CONFIG.branding,
                name: PREMIUM_CONFIG.fullname + ' ' + PREMIUM_CONFIG.branding,
                email: 'ansari@proton.me',
                is_premium: true,
                coins: 999999,
                vip: true
            },
            access_token: PREMIUM_CONFIG.accessToken,
            token: PREMIUM_CONFIG.accessToken,
            refresh_token: PREMIUM_CONFIG.accessToken
        });
    }

    // ==========================================
    // 🎯 BRANDING APPLY (Story Max Style)
    // ==========================================
    const applyBranding = (obj) => {
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
    };

    // ==========================================
    // 🔥 UNLOCK ALL EPISODES
    // ==========================================
    const unlockAllEpisodes = (data) => {
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
                        
                        // Fix URLs
                        ['video_url', 'media_url', 'media_url_enc', 'hls_url'].forEach(field => {
                            if (story[field]) {
                                story[field] = story[field].replace('http://', 'https://');
                            }
                        });
                    }
                });
            }
            
            // Unlock episodes array
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
    };

    // ==========================================
    // 🔄 FORWARD ALL OTHER REQUESTS
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
            if (typeof req.body === 'string') {
                fetchOptions.body = req.body;
            } else if (Buffer.isBuffer(req.body)) {
                fetchOptions.body = req.body;
            } else if (typeof req.body === 'object') {
                fetchOptions.body = JSON.stringify(req.body);
                fetchOptions.headers['content-type'] = 'application/json';
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            
            // Unlock everything
            data = unlockAllEpisodes(data);
            
            // Apply branding
            data = applyBranding(data);
            
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
// 🛠 BUILD HEADERS (Story Max Style)
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

    // Premium credentials
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
    
    // Story Max style headers
    headers['ts'] = Math.floor(Date.now() / 1000).toString();
    headers['network_type'] = 'WIFI';
    headers['x-forwarded-for'] = '122.168.2.40';
    headers['x-real-ip'] = '122.168.2.40';
    headers['x-client-ip'] = '122.168.2.40';
    
    delete headers['x-request-id'];
    delete headers['x-b3-traceid'];
    delete headers['x-cloud-trace-context'];
    
    return headers;
}
