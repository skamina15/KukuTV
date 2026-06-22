export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    
    // 🔥 CACHE CONTROL HEADERS - Force app to fetch fresh data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // ✅ GET SESSION TOKEN - ALWAYS RETURN 2ND ID
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

            // REAL API SE DATA FETCH KARO
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: body
            });
            
            let data = await response.json();
            
            // 🔥 HAR REQUEST MEIN FRESH 2ND ID DATA RETURN KARO
            if (data && data.user) {
                // ✅ 2ND ID KA DATA - PREMIUM BANAYE BINA
                data.user = {
                    ...data.user,
                    has_premium: false,  // 🔥 Original status
                    // premium_type: "🔥 BAD BOY PREMIUM 🔥",  // COMMENTED - No premium
                    // premium_status: "ACTIVE",               // COMMENTED
                    // premium_valid_till: "31 DECEMBER 9999", // COMMENTED
                    // premium_features: [...]                  // COMMENTED
                };
                
                // ✅ NAME MEIN BAD BOY TAG NAHI - Keep original
                // if (data.user.name && !data.user.name.includes('[ BAD BOY ]')) {
                //     data.user.name = data.user.name + ' 🔥[ BAD BOY ]';
                // }
            }
            
            // ✅ TOKENS ORIGINAL RAHENGE
            // data.has_premium = false;  // Original status
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error("Proxy Error:", error);
            return res.status(200).json(getSecondUserResponse());
        }
    }

    // ✅ USER PROFILE - Always 2nd ID
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
            
            // 🔥 2ND ID KA DATA (NO PREMIUM)
            data = {
                ...data,
                has_premium: false,  // Original status
                // No premium fields added
            };
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json(getSecondUserProfile());
        }
    }

    // ✅ PREMIUM CHECK - 2nd ID ka original status (false)
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        return res.status(200).json({
            has_premium: false,
            is_premium: false,
            premium_status: "INACTIVE",
            user_id: 146060028
        });
    }

    // ✅ CONTENT APIs - Real Data (No Bad Boy Tag)
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
            // No Bad Boy tagging - Original data
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json({ 
                success: true, 
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

// ============= 🔥 2ND ID FALLBACK RESPONSES =============

function getSecondUserResponse() {
    return {
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        access_token_timestamp: 1782155790,
        refresh_token_timestamp: 1784698069,
        user: {
            id: 146060028,
            sub_profile_id: null,
            name: "History_Maestro999L",
            email: "",
            avatar: {
                "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
            },
            uuid: "01f37dc7d2c249958116f5db0a77a515",
            has_premium: false,
            username: "+918918753244",
            phone: "+918918753244",
            joined_on: 1752074486,
            firebase_uid: "Vd2wAmCWBCULJ3n57Hxnzi9p1oo2"
        },
        select_multi_profile: false
    };
}

function getSecondUserProfile() {
    return {
        id: 146060028,
        sub_profile_id: null,
        name: "History_Maestro999L",
        email: "",
        avatar: {
            "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
        },
        uuid: "01f37dc7d2c249958116f5db0a77a515",
        has_premium: false,
        username: "+918918753244",
        phone: "+918918753244",
        joined_on: 1752074486,
        firebase_uid: "Vd2wAmCWBCULJ3n57Hxnzi9p1oo2"
    };
}
