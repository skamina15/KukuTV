// ==========================================
// 🎯 POCKET FM PROXY - FIXED VERSION
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
    branding: ' @Ansari'
};

// Premium endpoints ko bypass karne ke liye
const PREMIUM_ENDPOINTS = [
    '/v2/content_api/show.play_details',
    '/v3/feed/player',
    '/v2/content_api/story.detail',
    '/v2/content_api/episode.detail',
    '/v2/content_api/show.detail',
    '/v2/content_api/chapter.detail',
    '/v2/content_api/track.detail',
    '/v2/content_api/playlist.detail',
    '/v2/content_api/audio.detail',
    '/v2/content_api/media.detail',
    '/v1/content_api/show.play_details',
    '/v1/content_api/story.detail',
    '/v1/content_api/episode.detail'
];

// DRM content bypass
const DRM_PATHS = [
    '/drm-aac/',
    '/DASH/',
    '/HLS/',
    '.m3u8',
    '.mpd',
    '.ts',
    '.aac'
];

export default async function handler(req, res) {
    let urlPath = req.headers['x-invoke-path'] || req.url || '';
    const cleanPath = urlPath.split('?')[0];
    const method = req.method;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 🔥 PREMIUM CONTENT UNLOCK
    // ==========================================
    const isPremiumEndpoint = PREMIUM_ENDPOINTS.some(endpoint => cleanPath.includes(endpoint));
    const isDrmContent = DRM_PATHS.some(path => urlPath.includes(path));

    if (isPremiumEndpoint || isDrmContent) {
        try {
            const headers = buildHeaders(req);
            const targetUrl = getTargetUrl(cleanPath);
            
            console.log('🔄 Fetching:', targetUrl + urlPath);
            
            const response = await fetch(targetUrl + urlPath, {
                method: method,
                headers: headers,
                body: method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined
            });

            let data = await response.json();
            
            // Premium unlock
            data = unlockAllContent(data);
            
            // Branding add
            data = addBrandingToAll(data);
            
            // Extra headers for premium access
            res.setHeader('X-Premium-Access', 'true');
            res.setHeader('X-Unlocked', 'true');
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('❌ Premium fetch error:', error);
            // Fallback: fake premium data
            return res.status(200).json({
                status: 200,
                message: "Success",
                data: {
                    is_premium: false,
                    locked: false,
                    free: true,
                    episodes: []
                }
            });
        }
    }

    // ==========================================
    // 🔄 ALL OTHER REQUESTS
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
            data = unlockAllContent(data);
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
// 🔓 UNLOCK ALL CONTENT - IMPROVED
// ==========================================
function unlockAllContent(data) {
    if (!data || typeof data !== 'object') return data;

    const unlockObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        // Premium flags remove
        const premiumKeys = [
            'isPremium', 'is_premium', 'locked', 'paid', 
            'is_paid', 'is_locked', 'premium', 'vip',
            'is_vip', 'is_coin_user', 'is_subscriber',
            'has_premium_access', 'requires_payment'
        ];
        
        premiumKeys.forEach(key => {
            if (key in obj) {
                obj[key] = false;
            }
        });

        // Free access flags
        const freeKeys = ['free', 'is_free', 'available', 'is_available'];
        freeKeys.forEach(key => {
            if (key in obj) {
                obj[key] = true;
            }
        });

        // Episode counts unlimited
        const countKeys = [
            'episodes_count', 'unlocked_episodes_count', 
            'total_episodes', 'story_count', 'chapter_count',
            'available_episodes', 'free_episodes'
        ];
        countKeys.forEach(key => {
            if (key in obj) {
                obj[key] = 999999;
            }
        });

        // VIP timestamp extend
        if ('vip_timestamp' in obj) {
            obj.vip_timestamp = '2099-12-31T23:59:59Z';
        }
        if ('expiry_date' in obj) {
            obj.expiry_date = '2099-12-31T23:59:59Z';
        }

        // Arrays mein unlock
        if (Array.isArray(obj)) {
            obj.forEach(item => unlockObject(item));
        } else {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    unlockObject(obj[key]);
                }
            });
        }

        return obj;
    };

    return unlockObject(data);
}

// ==========================================
// 🏷️ BRANDING ADD
// ==========================================
function addBrandingToAll(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => addBrandingToAll(item));
    }

    const brandingFields = [
        'fullname', 'name', 'display_name', 'username', 
        'creator_name', 'author_name', 'artist_name',
        'title', 'description', 'bio', 'about'
    ];

    Object.keys(obj).forEach(key => {
        if (brandingFields.includes(key) && typeof obj[key] === 'string') {
            if (!obj[key].includes(APP_CONFIG.branding)) {
                obj[key] = obj[key] + APP_CONFIG.branding;
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            addBrandingToAll(obj[key]);
        }
    });

    return obj;
}

// ==========================================
// 🛠 BUILD HEADERS
// ==========================================
function buildHeaders(req) {
    const headers = {};

    // Original headers copy
    if (req.headers) {
        Object.keys(req.headers).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (!['accept-encoding', 'content-length', 'host', 'connection'].includes(lowerKey)) {
                headers[key] = req.headers[key];
            }
        });
    }

    // Auth headers
    headers['authorization'] = 'Bearer ' + APP_CONFIG.accessToken;
    headers['access-token'] = APP_CONFIG.accessToken;
    headers['jwt-access-token'] = APP_CONFIG.accessToken;
    headers['auth-token'] = APP_CONFIG.accessToken;
    headers['jwt-auth-token'] = APP_CONFIG.accessToken;
    headers['x-access-token'] = APP_CONFIG.accessToken;
    
    // Device headers
    headers['device-id'] = APP_CONFIG.deviceId;
    headers['x-device-id'] = APP_CONFIG.deviceId;
    headers['session-id'] = APP_CONFIG.sessionId;
    headers['app-instance-id'] = APP_CONFIG.appInstanceId;
    headers['ad-id'] = APP_CONFIG.adId;
    headers['uid'] = APP_CONFIG.uid;
    headers['user-id'] = APP_CONFIG.uid;
    headers['profile-id'] = APP_CONFIG.profileId;
    
    // App headers
    headers['app-version'] = APP_CONFIG.appVersion;
    headers['version-name'] = APP_CONFIG.versionName;
    headers['platform'] = APP_CONFIG.platform;
    headers['platform-version'] = APP_CONFIG.platformVersion;
    headers['user-agent'] = APP_CONFIG.userAgent;
    
    // Content headers
    headers['accept'] = 'application/json';
    headers['content-type'] = 'application/json';
    headers['accept-language'] = 'en-IN';
    
    // Premium bypass headers
    headers['x-premium'] = 'true';
    headers['x-unlock'] = 'true';
    headers['x-bypass'] = 'true';

    // Fullname in base64
    headers['fullname'] = Buffer.from(APP_CONFIG.fullname + ' (Premium)').toString('base64');
    
    return headers;
}

// ==========================================
// 🛠 GET TARGET URL
// ==========================================
function getTargetUrl(cleanPath) {
    if (cleanPath.includes('api.pocketfm.com') || 
        cleanPath.includes('/v2/') || 
        cleanPath.includes('/v3/') ||
        cleanPath.includes('/v1/')) {
        return 'https://api.pocketfm.com';
    }
    if (cleanPath.includes('analytics.pocketfm.com')) {
        return 'https://analytics.pocketfm.com';
    }
    if (cleanPath.includes('cloudfront.net')) {
        return 'https://' + cleanPath.split('/')[2];
    }
    if (cleanPath.includes('firebase')) {
        return 'https://firebaselogging-pa.googleapis.com';
    }
    return 'https://api.pocketfm.com';
}
