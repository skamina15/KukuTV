// index.js - Vercel Compatible Version

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, app-version, install-source, package-name, user-agent, accept-encoding, x-force-fresh');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // No Cache Headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const urlPath = req.url || '/';
        const method = req.method || 'GET';
        
        console.log(`📥 Request: ${method} ${urlPath}`);

        // ============================================
        // GET SESSION TOKEN - MAIN ENDPOINT
        // ============================================
        if (urlPath.includes('/users/get-session-token')) {
            return await handleSessionToken(req, res);
        }

        // ============================================
        // USER PROFILE
        // ============================================
        if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
            urlPath.includes('/get-profile')) {
            return await handleProfile(req, res);
        }

        // ============================================
        // PREMIUM CHECK
        // ============================================
        if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
            urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
            return res.status(200).json(getPremiumStatus());
        }

        // ============================================
        // CONTENT APIs
        // ============================================
        if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
            urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
            urlPath.includes('/content') || urlPath.includes('/feed') ||
            urlPath.includes('/recommend') || urlPath.includes('/search')) {
            return await handleContent(req, res);
        }

        // ============================================
        // ANALYTICS
        // ============================================
        if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
            urlPath.includes('/log') || urlPath.includes('/heartbeat') ||
            urlPath.includes('/impression')) {
            return res.status(200).json({ success: true, status: "SUCCESS" });
        }

        // ============================================
        // ALL OTHER APIs
        // ============================================
        return await handleProxy(req, res);

    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).json({
            error: 'Proxy Error',
            message: error.message,
            timestamp: Date.now()
        });
    }
}

// ============================================
// HANDLER: Session Token
// ============================================
async function handleSessionToken(req, res) {
    try {
        // Get body from request
        let bodyParams = new URLSearchParams();
        
        if (req.method === 'POST' && req.body) {
            if (typeof req.body === 'object') {
                for (let key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        bodyParams.append(key, req.body[key]);
                    }
                }
            } else if (typeof req.body === 'string') {
                const params = new URLSearchParams(req.body);
                for (let [key, value] of params) {
                    bodyParams.append(key, value);
                }
            }
        }

        // Ensure required fields exist
        if (!bodyParams.has('app_name')) {
            bodyParams.set('app_name', 'com.vlv.aravali.reels');
        }
        if (!bodyParams.has('os_type')) {
            bodyParams.set('os_type', 'android');
        }
        if (!bodyParams.has('app_build_number')) {
            bodyParams.set('app_build_number', '50401');
        }
        if (!bodyParams.has('installed_version')) {
            bodyParams.set('installed_version', '5.8.1');
        }

        // 🔥 FORCE USER B TOKENS
        bodyParams.set('access_token', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjExMzI2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.AIv4ylrSaI0t3Y6B3niVf8vV7iGE98uvz2KUCMepKPWVnhekKx3GXNATFl-BGJtu-YBqh-0ZxxhSZyULiC67Kg');
        bodyParams.set('refresh_token', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ');

        const finalBody = bodyParams.toString();

        // Prepare headers
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': req.headers['user-agent'] || 'kukufm-android-reels/5.8.1',
            'app-version': req.headers['app-version'] || '50401',
            'install-source': req.headers['install-source'] || 'google_play',
            'package-name': req.headers['package-name'] || 'com.vlv.aravali.reels',
            'Content-Length': Buffer.byteLength(finalBody),
            'Cache-Control': 'no-cache'
        };

        console.log('👤 Using User B tokens');
        console.log('📤 Sending request to KukuFM...');

        // Make request using fetch (Vercel supports this)
        const response = await fetch('https://kukufm.com' + req.url, {
            method: 'POST',
            headers: headers,
            body: finalBody
        });

        let data = await response.json();
        
        console.log('📥 Response received from KukuFM');

        // ============================================
        // 🔥 MODIFY RESPONSE - PREMIUM + BAD BOY
        // ============================================
        const premiumResponse = {
            refresh_token: bodyParams.get('refresh_token'),
            access_token: bodyParams.get('access_token'),
            access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
            refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
            user: {
                id: 146060028,
                sub_profile_id: null,
                name: "🔥 BadBoy Premium 🔥",
                email: "",
                avatar: {
                    "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                    "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                    "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                    "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
                },
                uuid: "badboy_" + Date.now().toString(36),
                has_premium: true,
                premium_type: "🔥 BAD BOY PREMIUM 🔥",
                premium_status: "ACTIVE",
                premium_valid_till: "31 DECEMBER 9999",
                username: "badboy_" + Date.now().toString(36),
                phone: "+918918753244",
                joined_on: Math.floor(Date.now() / 1000),
                firebase_uid: "badboy_" + Date.now().toString(36),
                is_badboy: true,
                badboy_tag: "[ BAD BOY ]",
                premium_features: [
                    "🎧 Unlimited Podcasts",
                    "🚫 No Ads",
                    "📱 High Quality Audio",
                    "🎁 Exclusive Bad Boy Content",
                    "⚡ Priority Access"
                ]
            },
            select_multi_profile: false,
            has_premium: true,
            is_badboy_premium: true,
            premium_activated: true,
            badboy_mode: true,
            _fresh: true,
            _timestamp: Date.now()
        };

        console.log('✅ Premium response sent');
        return res.status(200).json(premiumResponse);

    } catch (error) {
        console.error('❌ Session Token Error:', error);
        return res.status(200).json(getFallbackResponse());
    }
}

// ============================================
// HANDLER: Profile
// ============================================
async function handleProfile(req, res) {
    try {
        // Try to get real profile first
        const headers = {
            'User-Agent': req.headers['user-agent'] || 'kukufm-android-reels/5.8.1',
            'app-version': req.headers['app-version'] || '50401',
            'install-source': req.headers['install-source'] || 'google_play',
            'package-name': req.headers['package-name'] || 'com.vlv.aravali.reels',
            'Cache-Control': 'no-cache'
        };

        // Add authorization if present
        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        const response = await fetch('https://kukufm.com' + req.url, {
            method: req.method,
            headers: headers
        });

        let data = await response.json();

        // Force premium
        data = {
            ...data,
            has_premium: true,
            is_premium: true,
            premium_status: "ACTIVE [ BAD BOY ]",
            premium_plan: "🔥 BAD BOY PREMIUM 🔥",
            premium_valid_till: "31 DECEMBER 9999",
            badboy_mode: true,
            _fresh: true,
            _timestamp: Date.now()
        };

        if (data.name && !data.name.includes('[ BAD BOY ]')) {
            data.name = "🔥 BadBoy Premium 🔥";
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(200).json(getFallbackProfile());
    }
}

// ============================================
// HANDLER: Content
// ============================================
async function handleContent(req, res) {
    try {
        const headers = {
            'User-Agent': req.headers['user-agent'] || 'kukufm-android-reels/5.8.1',
            'app-version': req.headers['app-version'] || '50401',
            'install-source': req.headers['install-source'] || 'google_play',
            'package-name': req.headers['package-name'] || 'com.vlv.aravali.reels',
            'Cache-Control': 'no-cache'
        };

        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        const response = await fetch('https://kukufm.com' + req.url, {
            method: req.method,
            headers: headers
        });

        let data = await response.json();
        
        // Add Bad Boy tags
        if (Array.isArray(data)) {
            data = data.map(item => ({
                ...item,
                _badboy_mode: true,
                _premium_unlocked: true
            }));
        } else if (data.data && Array.isArray(data.data)) {
            data.data = data.data.map(item => ({
                ...item,
                _badboy_mode: true,
                _premium_unlocked: true
            }));
        }

        data._badboy_mode = true;
        data._fresh = true;
        data._timestamp = Date.now();

        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(200).json({
            success: true,
            message: "🔥 Bad Boy Mode Active",
            _badboy_mode: true,
            data: []
        });
    }
}

// ============================================
// HANDLER: Proxy (All other requests)
// ============================================
async function handleProxy(req, res) {
    try {
        const headers = {
            'User-Agent': req.headers['user-agent'] || 'kukufm-android-reels/5.8.1',
            'app-version': req.headers['app-version'] || '50401',
            'install-source': req.headers['install-source'] || 'google_play',
            'package-name': req.headers['package-name'] || 'com.vlv.aravali.reels',
            'Cache-Control': 'no-cache'
        };

        if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
        }

        const fetchOptions = {
            method: req.method,
            headers: headers
        };

        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
            if (typeof req.body === 'object') {
                const params = new URLSearchParams();
                for (let key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        params.append(key, req.body[key]);
                    }
                }
                fetchOptions.body = params.toString();
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else {
                fetchOptions.body = req.body;
            }
        }

        const response = await fetch('https://kukufm.com' + req.url, fetchOptions);
        const data = await response.json();

        data._badboy_mode = true;
        data._fresh = true;
        data._timestamp = Date.now();

        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({
            error: 'Proxy Error',
            message: error.message
        });
    }
}

// ============================================
// FALLBACK RESPONSES
// ============================================
function getPremiumStatus() {
    return {
        has_premium: true,
        is_premium: true,
        premium_status: "ACTIVE [ BAD BOY ]",
        premium_plan: "🔥 BAD BOY PREMIUM 🔥",
        premium_valid_till: "31 DECEMBER 9999",
        badboy_mode: true,
        _fresh: true,
        _timestamp: Date.now(),
        features: [
            "🎧 Unlimited Podcasts",
            "🚫 No Ads",
            "📱 High Quality Audio",
            "🎁 Exclusive Bad Boy Content",
            "⚡ Priority Access"
        ]
    };
}

function getFallbackResponse() {
    return {
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        user: {
            id: 146060028,
            name: "🔥 BadBoy Premium 🔥",
            has_premium: true,
            premium_type: "🔥 BAD BOY PREMIUM 🔥",
            premium_status: "ACTIVE",
            premium_valid_till: "31 DECEMBER 9999",
            is_badboy: true,
            badboy_tag: "[ BAD BOY ]"
        },
        has_premium: true,
        badboy_mode: true,
        _fresh: true,
        _timestamp: Date.now()
    };
}

function getFallbackProfile() {
    return {
        id: 146060028,
        name: "🔥 BadBoy Premium 🔥",
        has_premium: true,
        is_premium: true,
        premium_status: "ACTIVE [ BAD BOY ]",
        premium_plan: "🔥 BAD BOY PREMIUM 🔥",
        premium_valid_till: "31 DECEMBER 9999",
        badboy_mode: true,
        _fresh: true,
        _timestamp: Date.now()
    };
}
