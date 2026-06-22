export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // 🔥 2ND ID KA HARDCODED RESPONSE (BILKUL WAISA HI JAISA TUMNE DIYA)
    const SECOND_USER_RESPONSE = {
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

    // ✅ GET SESSION TOKEN - 2nd ID ka exact response return karo
    if (urlPath.includes('/users/get-session-token')) {
        return res.status(200).json(SECOND_USER_RESPONSE);
    }

    // ✅ USER PROFILE - 2nd ID ka profile return karo
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile')) {
        return res.status(200).json(SECOND_USER_RESPONSE.user);
    }

    // ✅ PREMIUM CHECK - 2nd ID ka exact premium status (false)
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        return res.status(200).json({
            has_premium: false,
            is_premium: false,
            premium_status: "INACTIVE",
            user_id: SECOND_USER_RESPONSE.user.id
        });
    }

    // ✅ CONTENT APIs - Real API se data fetch + User ID replace karo
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
            headers['authorization'] = `Bearer ${SECOND_USER_RESPONSE.access_token}`;
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined
            });
            
            let data = await response.json();
            
            // 🔥 RESPONSE MEIN 2ND ID KA DATA ADD KARO (TAKE APP USE KARE)
            data._user_id = SECOND_USER_RESPONSE.user.id;
            data._user_name = SECOND_USER_RESPONSE.user.name;
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json({ 
                success: true, 
                user_id: SECOND_USER_RESPONSE.user.id,
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

    // ✅ ALL OTHER APIs - Proxy with 2nd ID token
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        
        // 🔥 HAR REQUEST MEIN 2ND ID KA TOKEN USE KARO
        if (headers['authorization']) {
            headers['authorization'] = `Bearer ${SECOND_USER_RESPONSE.access_token}`;
        }
        
        // 🔥 BODY MEIN USER_ID REPLACE KARO
        let body = req.body;
        if (body && typeof body === 'object') {
            body = { ...body };
            body.user_id = SECOND_USER_RESPONSE.user.id;
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
            // 🔥 2ND ID FLAG ADD KARO
            data._user_id = SECOND_USER_RESPONSE.user.id;
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
