export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // 🔥 2ND ID KA COMPLETE DATA (EXACT RESPONSE)
    const SECOND_USER = {
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

    const SECOND_TOKENS = {
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        access_token_timestamp: 1782155790,
        refresh_token_timestamp: 1784698069
    };

    // ============================================================
    // ✅ GET SESSION TOKEN - COMPLETE RESPONSE
    // ============================================================
    if (urlPath.includes('/users/get-session-token')) {
        // ✅ Body se app_name check karo
        let body = req.body;
        if (typeof body === 'string') {
            const params = new URLSearchParams(body);
            const appName = params.get('app_name');
            const accessToken = params.get('access_token');
            
            console.log("📱 App:", appName);
            console.log("🔑 Token:", accessToken ? "Present" : "Missing");
        }

        return res.status(200).json({
            refresh_token: SECOND_TOKENS.refresh_token,
            access_token: SECOND_TOKENS.access_token,
            access_token_timestamp: SECOND_TOKENS.access_token_timestamp,
            refresh_token_timestamp: SECOND_TOKENS.refresh_token_timestamp,
            user: SECOND_USER,
            select_multi_profile: false
        });
    }

    // ============================================================
    // ✅ USER PROFILE
    // ============================================================
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile') || urlPath.includes('/user')) {
        return res.status(200).json(SECOND_USER);
    }

    // ============================================================
    // ✅ PREMIUM CHECK
    // ============================================================
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        return res.status(200).json({
            has_premium: false,
            is_premium: false,
            premium_status: "INACTIVE",
            user_id: SECOND_USER.id
        });
    }

    // ============================================================
    // ✅ CONTENT APIs - PROXY WITH 2ND ID TOKEN
    // ============================================================
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
        urlPath.includes('/content') || urlPath.includes('/feed') ||
        urlPath.includes('/recommend') || urlPath.includes('/search') ||
        urlPath.includes('/discover') || urlPath.includes('/trending')) {
        
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            // ✅ 2nd ID ka token use karo
            headers['authorization'] = `Bearer ${SECOND_TOKENS.access_token}`;
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined
            });
            
            let data = await response.json();
            
            // ✅ Response mein user_id add karo
            if (typeof data === 'object' && data !== null) {
                data._user_id = SECOND_USER.id;
            }
            
            return res.status(response.status).json(data);
            
        } catch (error) {
            console.error("Content API Error:", error);
            return res.status(200).json({ 
                success: true,
                user_id: SECOND_USER.id,
                data: []
            });
        }
    }

    // ============================================================
    // ✅ ANALYTICS
    // ============================================================
    if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
        urlPath.includes('/log') || urlPath.includes('/heartbeat') ||
        urlPath.includes('/impression') || urlPath.includes('/event')) {
        return res.status(200).json({ 
            success: true, 
            status: "SUCCESS",
            data: null 
        });
    }

    // ============================================================
    // ✅ ALL OTHER APIs
    // ============================================================
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        // ✅ Token replace karo
        if (headers['authorization']) {
            headers['authorization'] = `Bearer ${SECOND_TOKENS.access_token}`;
        }
        
        // ✅ Body mein user_id replace karo
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
            if (typeof data === 'object' && data !== null) {
                data._user_id = SECOND_USER.id;
            }
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
        console.error("Proxy Error:", error);
        return res.status(500).json({ 
            code: 500, 
            message: "Proxy Error: " + error.message
        });
    }
}
