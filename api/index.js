export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // 🔥🔥🔥 2ND ID KA COMPLETE DATA (Yehi return hoga app ko) 🔥🔥🔥
    const SECOND_USER = {
        id: 146060028,
        sub_profile_id: null,
        name: "🔥 BadBoy Premium 🔥",
        email: "badboy@premium.com",
        avatar: {
            "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
        },
        uuid: "badboy_2nd_01f37dc7d2c249958116f5db0a77a515",
        has_premium: true,
        premium_type: "🔥 BAD BOY PREMIUM 🔥",
        premium_status: "ACTIVE",
        premium_valid_till: "31 DECEMBER 9999",
        username: "badboy_2nd_premium",
        phone: "+919999999999",
        joined_on: Math.floor(Date.now() / 1000),
        firebase_uid: "badboy_2nd_Vd2wAmCWBCULJ3n57Hxnzi9p1oo2",
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

    // 🔥 2ND ID KE TOKENS
    const SECOND_TOKENS = {
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000
    };

    // ============================================================
    // ✅ SABHI REQUEST KO 2ND ID KA DATA RETURN KARO
    // ============================================================

    // 1️⃣ GET SESSION TOKEN - 2nd ID ka response
    if (urlPath.includes('/users/get-session-token')) {
        return res.status(200).json({
            ...SECOND_TOKENS,
            user: SECOND_USER,
            select_multi_profile: false,
            has_premium: true,
            is_badboy_premium: true,
            premium_activated: true,
            badboy_mode: true,
            badboy_version: "2.0",
            message: "✅ 2nd ID Premium Active [ BAD BOY ]"
        });
    }

    // 2️⃣ USER PROFILE - 2nd ID ka data
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile') || urlPath.includes('/user')) {
        return res.status(200).json({
            ...SECOND_USER,
            success: true,
            message: "🔥 2nd ID Bad Boy Profile",
            badboy_mode: true
        });
    }

    // 3️⃣ PREMIUM CHECK - Always Premium True
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        return res.status(200).json({
            has_premium: true,
            is_premium: true,
            premium_status: "ACTIVE [ BAD BOY ]",
            premium_plan: "🔥 BAD BOY PREMIUM 🔥",
            premium_valid_till: "31 DECEMBER 9999",
            badboy_mode: true,
            user_id: SECOND_USER.id,
            user_name: SECOND_USER.name,
            features: SECOND_USER.premium_features
        });
    }

    // 4️⃣ CONTENT APIs - Real API se data + Bad Boy Tag + User ID change
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
        urlPath.includes('/content') || urlPath.includes('/feed') ||
        urlPath.includes('/recommend') || urlPath.includes('/search')) {
        
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            // 🔥 TOKEN KO 2ND ID KE TOKEN SE REPLACE KARO
            headers['authorization'] = `Bearer ${SECOND_TOKENS.access_token}`;
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined
            });
            
            let data = await response.json();
            
            // Bad Boy Tag + 2nd ID flag
            data = addBadBoyToContent(data);
            data._user_id = SECOND_USER.id;
            data._user_name = SECOND_USER.name;
            data._badboy_mode = true;
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json({ 
                success: true, 
                message: "🔥 2nd ID Bad Boy Mode Active",
                user_id: SECOND_USER.id,
                data: []
            });
        }
    }

    // 5️⃣ ANALYTICS - Always success
    if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
        urlPath.includes('/log') || urlPath.includes('/heartbeat') ||
        urlPath.includes('/impression') || urlPath.includes('/event')) {
        return res.status(200).json({ 
            success: true, 
            status: "SUCCESS",
            user_id: SECOND_USER.id,
            data: null 
        });
    }

    // 6️⃣ AUTH CHECK / TOKEN VERIFY
    if (urlPath.includes('/verify-token') || urlPath.includes('/auth') || 
        urlPath.includes('/validate')) {
        return res.status(200).json({
            valid: true,
            user_id: SECOND_USER.id,
            has_premium: true,
            badboy_mode: true
        });
    }

    // 7️⃣ ALL OTHER APIs - Proxy with 2nd ID token
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        // 🔥 HAR REQUEST MEIN 2ND ID KA TOKEN USE KARO
        if (headers['authorization']) {
            headers['authorization'] = `Bearer ${SECOND_TOKENS.access_token}`;
        }
        
        // Agar body mein user_id hai toh replace karo
        let body = req.body;
        if (body && typeof body === 'object') {
            body = { ...body };
            body.user_id = SECOND_USER.id;
        }
        
        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && body) {
            if (typeof body === 'object') {
                const params = new URLSearchParams();
                for (let key in body) {
                    if (body.hasOwnProperty(key)) {
                        params.append(key, body[key]);
                    }
                }
                fetchOptions.body = params.toString();
            } else {
                fetchOptions.body = body;
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            // Har response mein 2nd ID ka flag
            data._badboy_user_id = SECOND_USER.id;
            data._badboy_mode = true;
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
            status: "ERROR",
            user_id: SECOND_USER.id
        });
    }
}

// ============= 🔥 HELPER FUNCTIONS =============

function addBadBoyToContent(data) {
    if (!data || typeof data !== 'object') return data;
    
    const badBoyFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 
                          'description', 'label', 'heading', 'subtitle', 'display_name'];
    
    if (Array.isArray(data)) {
        return data.map(item => addTags(item, badBoyFields));
    }
    
    const result = { ...data };
    
    // Common array fields
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows', 'list'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(item => addTags(item, badBoyFields));
        }
    });
    
    return addTags(result, badBoyFields);
}

function addTags(obj, fields) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = { ...obj };
    
    fields.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
            if (!result[field].includes('[ BAD BOY ]')) {
                result[field] = result[field] + ' [ BAD BOY ]';
            }
        }
    });
    
    // 2nd ID flag
    result._user_id = 146060028;
    result._badboy_premium = true;
    
    return result;
}
