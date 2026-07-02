export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    
    const KUKUFM_BASE_URL = "https://kukufm.com";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // 🔥 HARDCODED PREMIUM USER DATA
    const BADBOY_USER = {
        id: 146060028,
        name: "🔥 BadBoy Premium 🔥",
        email: "badboy@premium.com",
        username: "badboy_premium",
        phone: "+919999999999",
        has_premium: true,
        premium_type: "🔥 BAD BOY PREMIUM 🔥",
        premium_status: "ACTIVE",
        premium_valid_till: "31 DECEMBER 9999",
        is_badboy: true,
        badboy_tag: "[ BAD BOY ]",
        premium_features: [
            "🎧 Unlimited Podcasts",
            "🚫 No Ads",
            "📱 High Quality Audio",
            "🎁 Exclusive Bad Boy Content",
            "⚡ Priority Access"
        ],
        avatar: {
            "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
        },
        uuid: "badboy_01f37dc7d2c249958116f5db0a77a515",
        joined_on: Math.floor(Date.now() / 1000),
        firebase_uid: "badboy_Vd2wAmCWBCULJ3n57Hxnzi9p1oo2"
    };

    const BADBOY_TOKENS = {
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000
    };

    // ✅ GET SESSION TOKEN - REAL API se fetch karo + Premium inject karo
    if (urlPath.includes('/users/get-session-token')) {
        try {
            const realApiUrl = KUKUFM_BASE_URL + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            // Body forward karo
            let body = req.body;
            if (typeof body === 'object' && !(body instanceof URLSearchParams)) {
                const params = new URLSearchParams();
                for (let key in body) {
                    if (body.hasOwnProperty(key)) {
                        params.append(key, body[key]);
                    }
                }
                body = params.toString();
            }

            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: body
            });
            
            let data = await response.json();
            
            // ✅ Agar response successful hai toh premium inject karo
            if (data && data.user) {
                // ✅ Original user data preserve karo but premium true karo
                data.user = {
                    ...data.user,
                    has_premium: true,
                    premium_type: "🔥 BAD BOY PREMIUM 🔥",
                    premium_status: "ACTIVE",
                    premium_valid_till: "31 DECEMBER 9999",
                    is_badboy: true,
                    badboy_tag: "[ BAD BOY ]",
                    premium_features: [
                        "🎧 Unlimited Podcasts",
                        "🚫 No Ads",
                        "📱 High Quality Audio",
                        "🎁 Exclusive Bad Boy Content",
                        "⚡ Priority Access"
                    ]
                };
                
                // Name mein Bad Boy tag
                if (data.user.name && !data.user.name.includes('[ BAD BOY ]')) {
                    data.user.name = data.user.name + ' 🔥[ BAD BOY ]';
                }
                
                data.has_premium = true;
                data.badboy_mode = true;
                data.badboy_version = "2.0";
                
                return res.status(200).json(data);
            }
            
            // Agar data invalid hai toh hardcoded response
            return res.status(200).json({
                ...BADBOY_TOKENS,
                user: BADBOY_USER,
                select_multi_profile: false,
                has_premium: true,
                is_badboy_premium: true,
                premium_activated: true,
                badboy_mode: true
            });
            
        } catch (error) {
            console.error("Proxy Error:", error);
            // Fallback hardcoded response
            return res.status(200).json({
                ...BADBOY_TOKENS,
                user: BADBOY_USER,
                select_multi_profile: false,
                has_premium: true,
                is_badboy_premium: true,
                premium_activated: true,
                badboy_mode: true
            });
        }
    }

    // ✅ Users/Me - REAL API se fetch + Premium inject
    if (urlPath.includes('/users/me') || urlPath.includes('/profile')) {
        try {
            const realApiUrl = KUKUFM_BASE_URL + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            if (data) {
                data.has_premium = true;
                data.is_premium = true;
                data.premium_status = "ACTIVE [ BAD BOY ]";
                data.premium_plan = "🔥 BAD BOY PREMIUM 🔥";
                data.badboy_mode = true;
                
                if (data.name && !data.name.includes('[ BAD BOY ]')) {
                    data.name = data.name + ' 🔥[ BAD BOY ]';
                }
            }
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json({
                ...BADBOY_USER,
                success: true
            });
        }
    }

    // ✅ PREMIUM CHECK - Real API se check + force true
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium')) {
        try {
            const realApiUrl = KUKUFM_BASE_URL + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Force premium true
            data.has_premium = true;
            data.is_premium = true;
            data.premium_status = "ACTIVE [ BAD BOY ]";
            data.badboy_mode = true;
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json({
                has_premium: true,
                is_premium: true,
                premium_status: "ACTIVE [ BAD BOY ]",
                premium_plan: "🔥 BAD BOY PREMIUM 🔥",
                premium_valid_till: "31 DECEMBER 9999",
                badboy_mode: true,
                features: [
                    "🎧 Unlimited Podcasts",
                    "🚫 No Ads",
                    "📱 High Quality Audio",
                    "🎁 Exclusive Bad Boy Content",
                    "⚡ Priority Access"
                ]
            });
        }
    }

    // ✅ CONTENT APIs - Real API + Bad Boy Tag
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
        urlPath.includes('/content') || urlPath.includes('/feed')) {
        
        try {
            const realApiUrl = KUKUFM_BASE_URL + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined
            });
            
            let data = await response.json();
            data = addBadBoyToKukuContent(data);
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json({ 
                success: true, 
                message: "Bad Boy Mode Active",
                data: []
            });
        }
    }

    // ✅ Analytics - Always success
    if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
        urlPath.includes('/log') || urlPath.includes('/heartbeat') ||
        urlPath.includes('/impression')) {
        return res.status(200).json({ 
            success: true, 
            status: "SUCCESS",
            data: null 
        });
    }

    // ✅ ALL OTHER APIs - Simple Proxy
    try {
        const targetUrl = KUKUFM_BASE_URL + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            if (typeof req.body === 'object') {
                const params = new URLSearchParams();
                for (let key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        params.append(key, req.body[key]);
                    }
                }
                fetchOptions.body = params.toString();
            } else {
                fetchOptions.body = req.body;
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            return res.status(response.status).json(data);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            response.headers.forEach((value, key) => {
                if (key !== 'content-encoding' && key !== 'content-length') {
                    res.setHeader(key, value);
                }
            });
            return res.status(response.status).send(buffer);
        }

    } catch (error) {
        return res.status(500).json({ 
            code: 500, 
            message: "Proxy Error: " + error.message,
            status: "ERROR"
        });
    }
}

// ============= 🔥 HELPER FUNCTIONS =============

function addBadBoyToKukuContent(data) {
    if (!data || typeof data !== 'object') return data;
    
    const badBoyFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 'description', 'label', 'heading'];
    
    if (Array.isArray(data)) {
        return data.map(item => addBadBoyToObject(item, badBoyFields));
    }
    
    const result = { ...data };
    
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(item => addBadBoyToObject(item, badBoyFields));
        }
    });
    
    // Bad Boy flag
    result._badboy = true;
    result._premium_only = true;
    
    return addBadBoyToObject(result, badBoyFields);
}

function addBadBoyToObject(obj, fields) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = { ...obj };
    
    fields.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
            if (!result[field].includes('[ BAD BOY ]')) {
                result[field] = result[field] + ' [ BAD BOY ]';
            }
        }
    });
    
    return result;
}
