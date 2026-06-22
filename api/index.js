export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    
    const KUKUFM_BASE_URL = "https://kukufm.com";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // 🔥 HARDCODED PREMIUM USER DATA (Yehi use hoga app mein)
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

    // 🔥 HARDCODED TOKENS (Yehi use honge)
    const BADBOY_TOKENS = {
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000
    };

    // ✅ GET SESSION TOKEN - Directly Hardcoded Response Return Karo
    if (urlPath.includes('/users/get-session-token')) {
        return res.status(200).json({
            ...BADBOY_TOKENS,
            user: BADBOY_USER,
            select_multi_profile: false,
            has_premium: true,
            is_badboy_premium: true,
            premium_activated: true,
            badboy_mode: true,
            badboy_version: "2.0"
        });
    }

    // ✅ PROFILE/ME - Hardcoded User Return Karo
    if (urlPath.includes('/users/me') || urlPath.includes('/profile')) {
        return res.status(200).json({
            ...BADBOY_USER,
            success: true,
            badboy_mode: true
        });
    }

    // ✅ PREMIUM CHECK - Always True
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium')) {
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

    // ✅ CONTENT APIs - Pass through with Bad Boy Tag
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
        urlPath.includes('/content') || urlPath.includes('/feed')) {
        
        try {
            const realApiUrl = KUKUFM_BASE_URL + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            // ❌ Original Headers Hatao - Token replace karo
            headers['authorization'] = `Bearer ${BADBOY_TOKENS.access_token}`;
            
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
                message: "Bad Boy Mode Active [ PREMIUM ]",
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
            status: "SUCCESS [ BAD BOY ]",
            data: null 
        });
    }

    // ✅ ALL OTHER APIs - Proxy with Token Replacement
    try {
        const targetUrl = KUKUFM_BASE_URL + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        // 🔥 Token ko hardcoded token se replace karo
        if (headers['authorization']) {
            headers['authorization'] = `Bearer ${BADBOY_TOKENS.access_token}`;
        }
        
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
            data = addBadBoyToResponse(data);
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

// ============= 🔥 CONTENT BAD BOY TAGGING =============

function addBadBoyToKukuContent(data) {
    if (!data || typeof data !== 'object') return data;
    
    const badBoyFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 'description', 'label', 'heading'];
    
    if (Array.isArray(data)) {
        return data.map(item => addBadBoyToKukuObject(item, badBoyFields));
    }
    
    // Handle common response formats
    const result = { ...data };
    
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(item => addBadBoyToKukuObject(item, badBoyFields));
        }
    });
    
    return addBadBoyToKukuObject(result, badBoyFields);
}

function addBadBoyToKukuObject(obj, fields) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = { ...obj };
    
    fields.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
            if (!result[field].includes('[ BAD BOY ]')) {
                result[field] = result[field] + ' [ BAD BOY ]';
            }
        }
    });
    
    // Bad Boy flag add karo har object mein
    result._badboy = true;
    result._premium_only = true;
    
    return result;
}

function addBadBoyToResponse(data) {
    if (!data || typeof data !== 'object') return data;
    
    return {
        ...data,
        badboy_mode: true,
        badboy_version: "2.0",
        source: "BadBoy Proxy v2.0",
        _badboy: true,
        _premium_unlocked: true
    };
}
