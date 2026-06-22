export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    
    const KUKUFM_BASE_URL = "https://kukufm.com";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ✅ Get Session Token - Premium Injection
    if (urlPath.includes('/users/get-session-token')) {
        const realApiUrl = KUKUFM_BASE_URL + urlPath;
        
        // Original headers forward karo
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        // Body ko properly forward karo
        let body = req.body;
        
        // Agar body object hai toh form data mein convert karo
        if (typeof body === 'object' && !(body instanceof URLSearchParams)) {
            const params = new URLSearchParams();
            for (let key in body) {
                if (body.hasOwnProperty(key)) {
                    params.append(key, body[key]);
                }
            }
            body = params.toString();
        }
        
        // Agar body string hai toh use karo
        if (typeof body === 'string') {
            // Already form data format mein hai
        }

        try {
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: body
            });
            
            let data = await response.json();
            
            // 🔥 Bad Boy Premium Injection with original data
            data = injectKukuFMPremium(data);
            
            // Return with proper headers
            return res.status(200).json(data);
            
        } catch (error) {
            console.error("Proxy Error:", error);
            // Fallback response with premium
            return res.status(200).json(getKukuFMPremiumResponse(req));
        }
    }

    // ✅ Premium Check Endpoints
    if (urlPath.includes('/premium') || urlPath.includes('/subscription')) {
        const realApiUrl = KUKUFM_BASE_URL + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        try {
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined
            });
            
            let data = await response.json();
            data = addBadBoyPremiumStatus(data);
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json(getPremiumStatusResponse());
        }
    }

    // ✅ Content APIs - Add Bad Boy Tag
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
        urlPath.includes('/content') || urlPath.includes('/feed')) {
        const realApiUrl = KUKUFM_BASE_URL + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        try {
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
            status: "SUCCESS [ BAD BOY ]",
            data: null 
        });
    }

    // ✅ All Other APIs - Pass through
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

// ============= 🔥 KUKUFM PREMIUM INJECTION =============

function injectKukuFMPremium(data) {
    if (!data || typeof data !== 'object') {
        // Agar data null hai toh premium response banao
        return getKukuFMPremiumResponse({});
    }
    
    const result = { ...data };
    
    // ✅ Ensure user object exists
    if (!result.user) {
        result.user = {};
    }
    
    // ✅ Premium settings with original data preserved
    result.user = {
        ...result.user,
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
    
    // ✅ Name mein Bad Boy tag
    if (result.user.name && !result.user.name.includes('[ BAD BOY ]')) {
        result.user.name = result.user.name + ' 🔥[ BAD BOY ]';
    }
    
    // ✅ Global premium flags
    result.has_premium = true;
    result.is_badboy_premium = true;
    result.premium_activated = true;
    result.badboy_mode = true;
    result.badboy_version = "2.0";
    
    // ✅ Tokens valid karo
    if (result.access_token) {
        result.access_token_timestamp = Math.floor(Date.now() / 1000) + 31536000; // 1 year
        result.refresh_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
        result.badboy_token = true;
    }
    
    return result;
}

function getKukuFMPremiumResponse(req) {
    // Extract user ID from request if available
    let userId = 146060028;
    let userName = "BadBoy";
    
    if (req && req.body) {
        const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        const match = body.match(/user_id[=:]["']?(\d+)["']?/);
        if (match) {
            userId = parseInt(match[1]);
        }
    }
    
    return {
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        user: {
            id: userId,
            sub_profile_id: null,
            name: "BadBoy_User 🔥[ BAD BOY ]",
            email: "",
            avatar: {
                "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
            },
            uuid: "01f37dc7d2c249958116f5db0a77a515",
            has_premium: true,
            premium_type: "🔥 BAD BOY PREMIUM 🔥",
            premium_status: "ACTIVE",
            premium_valid_till: "31 DECEMBER 9999",
            premium_features: [
                "🎧 Unlimited Podcasts",
                "🚫 No Ads",
                "📱 High Quality Audio",
                "🎁 Exclusive Bad Boy Content",
                "⚡ Priority Access"
            ],
            username: "badboy_user",
            phone: "+918918753244",
            joined_on: Math.floor(Date.now() / 1000),
            firebase_uid: "Vd2wAmCWBCULJ3n57Hxnzi9p1oo2",
            is_badboy: true,
            badboy_tag: "[ BAD BOY ]"
        },
        select_multi_profile: false,
        has_premium: true,
        is_badboy_premium: true,
        premium_activated: true,
        badboy_mode: true
    };
}

function getPremiumStatusResponse() {
    return {
        is_premium: true,
        premium_status: "ACTIVE [ BAD BOY ]",
        premium_plan: "🔥 BAD BOY PREMIUM 🔥",
        valid_till: "31 DECEMBER 9999",
        features: [
            "🎧 Unlimited Access",
            "🚫 No Ads",
            "📱 High Quality",
            "🎁 Exclusive Content"
        ],
        badboy_mode: true
    };
}

function addBadBoyPremiumStatus(data) {
    if (!data || typeof data !== 'object') return getPremiumStatusResponse();
    
    return {
        ...data,
        has_premium: true,
        is_premium: true,
        premium_status: "ACTIVE [ BAD BOY ]",
        premium_plan: "🔥 BAD BOY PREMIUM 🔥",
        premium_valid_till: "31 DECEMBER 9999",
        badboy_mode: true
    };
}

function addBadBoyToKukuContent(data) {
    if (!data || typeof data !== 'object') return data;
    
    const badBoyFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 'description'];
    
    if (Array.isArray(data)) {
        return data.map(item => addBadBoyToKukuObject(item, badBoyFields));
    }
    
    // Handle common response formats
    if (data.data && Array.isArray(data.data)) {
        data.data = data.data.map(item => addBadBoyToKukuObject(item, badBoyFields));
    }
    if (data.results && Array.isArray(data.results)) {
        data.results = data.results.map(item => addBadBoyToKukuObject(item, badBoyFields));
    }
    if (data.items && Array.isArray(data.items)) {
        data.items = data.items.map(item => addBadBoyToKukuObject(item, badBoyFields));
    }
    
    return addBadBoyToKukuObject(data, badBoyFields);
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
    
    return result;
}

function addBadBoyToResponse(data) {
    if (!data || typeof data !== 'object') return data;
    
    return {
        ...data,
        badboy_mode: true,
        badboy_version: "2.0",
        source: "BadBoy Proxy v2.0"
    };
}
