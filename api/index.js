export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    // ✅ ADD THESE HEADERS TO PREVENT CACHING
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // ✅ ADD TIMESTAMP TO EACH REQUEST
    const requestId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // ✅ GET SESSION TOKEN - Exact response format with Premium
    if (urlPath.includes('/users/get-session-token')) {
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            // ✅ FORCE NO-CACHE ON ORIGIN REQUEST
            headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            headers['Pragma'] = 'no-cache';
            
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

            // 🔥 REAL API SE DATA FETCH KARO
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: body,
                // ✅ ADD THIS TO PREVENT CACHING
                cache: 'no-store'
            });
            
            let data = await response.json();
            
            // ✅ ADD FRESH TIMESTAMP TO BREAK CACHE
            const timestamp = Date.now();
            
            // ============================================================
            // 🔥🔥🔥 2ND ID KO PREMIUM BANAO + BAD BOY BRANDING 🔥🔥🔥
            // ============================================================
            
            if (data && data.user) {
                // ✅ USER OBJECT - Premium + Bad Boy
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
                
                if (data.user.name && !data.user.name.includes('[ BAD BOY ]')) {
                    data.user.name = data.user.name + ' 🔥[ BAD BOY ]';
                }
            }
            
            // ✅ GLOBAL PREMIUM FLAGS
            data.has_premium = true;
            data.is_badboy_premium = true;
            data.premium_activated = true;
            data.badboy_mode = true;
            data.badboy_version = "2.0";
            
            // ✅ TOKENS EXTEND KARO
            if (data.access_token) {
                data.access_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
                data.refresh_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
            }
            
            // ✅ ADD UNIQUE ID TO EACH RESPONSE TO BREAK CACHE
            data._response_id = requestId;
            data._timestamp = timestamp;
            data._fresh = true;
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error("Proxy Error:", error);
            // ✅ FALLBACK - Premium Response
            return res.status(200).json({
                ...getPremiumResponse(),
                _timestamp: Date.now(),
                _fresh: true
            });
        }
    }

    // ✅ USER PROFILE - Premium Force
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile')) {
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                cache: 'no-store'
            });
            
            let data = await response.json();
            
            // 🔥 PREMIUM FORCE
            data = {
                ...data,
                has_premium: true,
                is_premium: true,
                premium_status: "ACTIVE [ BAD BOY ]",
                premium_plan: "🔥 BAD BOY PREMIUM 🔥",
                premium_valid_till: "31 DECEMBER 9999",
                badboy_mode: true,
                _response_id: requestId,
                _timestamp: Date.now()
            };
            
            if (data.name && !data.name.includes('[ BAD BOY ]')) {
                data.name = data.name + ' 🔥[ BAD BOY ]';
            }
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json({
                ...getPremiumProfile(),
                _timestamp: Date.now()
            });
        }
    }

    // ✅ PREMIUM CHECK - Always True
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        return res.status(200).json({
            has_premium: true,
            is_premium: true,
            premium_status: "ACTIVE [ BAD BOY ]",
            premium_plan: "🔥 BAD BOY PREMIUM 🔥",
            premium_valid_till: "31 DECEMBER 9999",
            badboy_mode: true,
            _timestamp: Date.now(),
            _fresh: true,
            features: [
                "🎧 Unlimited Podcasts",
                "🚫 No Ads",
                "📱 High Quality Audio",
                "🎁 Exclusive Bad Boy Content",
                "⚡ Priority Access"
            ]
        });
    }

    // ✅ CONTENT APIs - Real Data + Bad Boy Tag
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
            headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? req.body : undefined,
                cache: 'no-store'
            });
            
            let data = await response.json();
            data = addBadBoyToContent(data);
            data._timestamp = Date.now();
            data._fresh = true;
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(200).json({ 
                success: true, 
                message: "🔥 Bad Boy Mode Active",
                _timestamp: Date.now(),
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
            _timestamp: Date.now(),
            data: null 
        });
    }

    // ✅ ALL OTHER APIs
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        
        const fetchOptions = {
            method: method,
            headers: headers,
            cache: 'no-store'
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
            data._badboy_mode = true;
            data._timestamp = Date.now();
            data._fresh = true;
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
            _timestamp: Date.now()
        });
    }
}

// 🔥 REST OF THE CODE REMAINS SAME (FUNCTIONS getPremiumResponse, getPremiumProfile, addBadBoyToContent, addTags)...
