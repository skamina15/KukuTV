export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ✅ FIX: STORE ORIGINAL RESPONSE FORMAT
    if (urlPath.includes('/users/get-session-token')) {
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
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
            
            // 🔥 CRITICAL FIX: PRESERVE ORIGINAL DATA STRUCTURE
            const originalData = JSON.parse(JSON.stringify(data));
            
            // ✅ ONLY MODIFY WHAT'S NECESSARY
            if (data && data.user) {
                // Preserve all original fields, only add premium flags
                data.user.has_premium = true;
                data.user.premium_status = "ACTIVE";
                data.user.premium_valid_till = "31 DECEMBER 9999";
                data.user.premium_type = "🔥 BAD BOY PREMIUM 🔥";
                
                // Add name tag if exists
                if (data.user.name && !data.user.name.includes('[BAD BOY]')) {
                    data.user.name = data.user.name + ' [BAD BOY]';
                }
            }
            
            // ✅ ADD FLAGS WITHOUT BREAKING STRUCTURE
            data.has_premium = true;
            data.is_premium = true;
            data.premium_activated = true;
            
            // ✅ EXTEND TOKENS IF PRESENT
            if (data.access_token) {
                data.access_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
                data.refresh_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
            }
            
            // ✅ ENSURE RESPONSE HAS SAME KEYS AS ORIGINAL
            // This prevents format mismatch on app reload
            Object.keys(originalData).forEach(key => {
                if (!(key in data) && originalData[key] !== undefined) {
                    data[key] = originalData[key];
                }
            });
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error("Proxy Error:", error);
            // ✅ FALLBACK WITH PROPER STRUCTURE
            return res.status(200).json(getPremiumResponse());
        }
    }

    // ✅ USER PROFILE - WITH STRUCTURE PRESERVATION
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile')) {
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // ✅ PRESERVE ORIGINAL STRUCTURE
            const originalData = JSON.parse(JSON.stringify(data));
            
            // ✅ ONLY ADD PREMIUM FLAGS
            data.has_premium = true;
            data.is_premium = true;
            data.premium_status = "ACTIVE [BAD BOY]";
            data.premium_plan = "🔥 BAD BOY PREMIUM 🔥";
            data.premium_valid_till = "31 DECEMBER 9999";
            
            if (data.name && !data.name.includes('[BAD BOY]')) {
                data.name = data.name + ' [BAD BOY]';
            }
            
            // ✅ PRESERVE ALL ORIGINAL FIELDS
            Object.keys(originalData).forEach(key => {
                if (!(key in data) && originalData[key] !== undefined) {
                    data[key] = originalData[key];
                }
            });
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json(getPremiumProfile());
        }
    }

    // ✅ PREMIUM CHECK - Consistent Format
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        return res.status(200).json({
            has_premium: true,
            is_premium: true,
            premium_status: "ACTIVE [BAD BOY]",
            premium_plan: "🔥 BAD BOY PREMIUM 🔥",
            premium_valid_till: "31 DECEMBER 9999",
            features: [
                "🎧 Unlimited Podcasts",
                "🚫 No Ads",
                "📱 High Quality Audio",
                "🎁 Exclusive Bad Boy Content",
                "⚡ Priority Access"
            ]
        });
    }

    // ✅ CONTENT APIs - Better Format Handling
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
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined
            });
            
            let data = await response.json();
            
            // ✅ SMART TAGGING - Preserve structure
            data = addBadBoyToContent(data);
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json({ 
                success: true, 
                message: "🔥 Bad Boy Mode Active",
                data: []
            });
        }
    }

    // ✅ Analytics - Consistent
    if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
        urlPath.includes('/log') || urlPath.includes('/heartbeat') ||
        urlPath.includes('/impression')) {
        return res.status(200).json({ 
            success: true, 
            status: "SUCCESS",
            data: null 
        });
    }

    // ✅ ALL OTHER APIs - Preserve Format
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
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
            // ✅ Only add flag, don't modify structure
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
            message: "Proxy Error: " + error.message
        });
    }
}

// ============= 🔥 FALLBACK RESPONSES WITH PROPER FORMAT =============

function getPremiumResponse() {
    return {
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        user: {
            id: 146060028,
            sub_profile_id: null,
            name: "🔥 BadBoy Premium [BAD BOY]",
            email: "",
            avatar: {
                "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
            },
            uuid: "badboy_01f37dc7d2c249958116f5db0a77a515",
            has_premium: true,
            premium_type: "🔥 BAD BOY PREMIUM 🔥",
            premium_status: "ACTIVE",
            premium_valid_till: "31 DECEMBER 9999",
            username: "badboy_premium",
            phone: "+919999999999",
            joined_on: Math.floor(Date.now() / 1000),
            firebase_uid: "badboy_Vd2wAmCWBCULJ3n57Hxnzi9p1oo2"
        },
        select_multi_profile: false,
        has_premium: true,
        is_premium: true,
        premium_activated: true
    };
}

function getPremiumProfile() {
    return {
        id: 146060028,
        name: "🔥 BadBoy Premium [BAD BOY]",
        email: "",
        has_premium: true,
        is_premium: true,
        premium_status: "ACTIVE [BAD BOY]",
        premium_plan: "🔥 BAD BOY PREMIUM 🔥",
        premium_valid_till: "31 DECEMBER 9999",
        avatar: {
            "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
        }
    };
}

// ============= 🔥 CONTENT TAGGING - IMPROVED =============

function addBadBoyToContent(data) {
    if (!data || typeof data !== 'object') return data;
    
    if (Array.isArray(data)) {
        return data.map(item => addTagsToItem(item));
    }
    
    const result = { ...data };
    
    // ✅ Check all possible array fields
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows', 'list', 'featured'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(item => addTagsToItem(item));
        }
    });
    
    return addTagsToItem(result);
}

function addTagsToItem(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = { ...obj };
    
    // ✅ Add tag to text fields without breaking structure
    const textFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 
                        'description', 'label', 'heading', 'subtitle', 'display_name'];
    
    textFields.forEach(field => {
        if (result[field] && typeof result[field] === 'string' && !result[field].includes('[BAD BOY]')) {
            result[field] = result[field] + ' [BAD BOY]';
        }
    });
    
    // ✅ Add premium flags only
    result._premium_unlocked = true;
    result._badboy_mode = true;
    
    return result;
}

