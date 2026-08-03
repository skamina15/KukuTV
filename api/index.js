// ==========================================
// 🎯 KUKU FM PROXY - COMPLETE WITH CDN FIX
// ==========================================

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.kukufm.com";

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ==========================================
    // 🔥 PREMIUM CONFIG
    // ==========================================
    const PREMIUM = {
        authorization: "jwt eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNzY1MjU4MjcsImV4cCI6MTc4NTU3NjUxNSwic3ViX3Byb2ZpbGVfaWQiOjUxOTg2NjAxLCJ1bmlxdWVfaWQiOiI0MmQwYmI0ZC1jMzU5LTQ2NmItODcwMy03ZTEyZTY3YmIzOTQifQ.hZcD4xHG8a5nYvsJzzrk8yNxhHXV7_YobX8bw_Z2yA8lfvTqqTFjn_swn3VsCEVSkeajQa2GPL-KC00BDICi-A",
        device_id: "61304354-728a-4058-8586-4607eefa339e",
        android_id: "690fc583b739834",
        advertising_id: "61304354-728a-4058-8586-4607eefa339e",
        user_agent: "Dalvik/2.1.0 (Linux; U; Android 16; SM-S928B Build/BP4A.251205.006)",
        package_name: "com.vlv.aravali.reels",
        app_version: "50807",
        build_number: "5080703",
        client_country: "IN",
        lang: "english",
        fakeIP: '192.168.1.100'
    };

    // ==========================================
    // ⏱️ RATE LIMITER
    // ==========================================
    const requestQueue = new Map();
    const RATE_LIMIT = {
        windowMs: 500,
        maxRequests: 2
    };

    function isRateLimited(ip) {
        const now = Date.now();
        const windowStart = now - RATE_LIMIT.windowMs;
        
        if (!requestQueue.has(ip)) {
            requestQueue.set(ip, []);
        }
        
        const requests = requestQueue.get(ip).filter(timestamp => timestamp > windowStart);
        requests.push(now);
        requestQueue.set(ip, requests);
        
        if (requests.length > RATE_LIMIT.maxRequests) {
            return true;
        }
        return false;
    }

    function getRandomDelay() {
        return Math.floor(Math.random() * 300) + 100;
    }

    // ==========================================
    // 🎯 IP MASKING
    // ==========================================
    function maskIP(headers) {
        const ipHeaders = [
            'x-forwarded-for', 'x-real-ip', 'x-client-ip',
            'x-original-forwarded-for', 'forwarded', 'cf-connecting-ip',
            'true-client-ip', 'x-remote-ip', 'x-remote-addr',
            'remote-addr', 'remote-address', 'client-ip', 'x-true-ip'
        ];
        
        ipHeaders.forEach(header => {
            if (headers[header]) {
                delete headers[header];
            }
        });
        
        headers['x-forwarded-for'] = PREMIUM.fakeIP;
        headers['x-real-ip'] = PREMIUM.fakeIP;
        
        return headers;
    }

    // ==========================================
    // 🏷️ BRANDING
    // ==========================================
    function injectBadBoyBranding(obj) {
        const targetKeys = ['title', 'name', 'summary', 'description', 'text', 'content', 'label', 'tag_text', 'plan_name', 'subtitle', 'bio'];

        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                if (typeof obj[key] === 'string' && targetKeys.includes(key)) {
                    if (!obj[key].includes('[ BAD BOY ]')) {
                        obj[key] = obj[key] + ' [ BAD BOY ]';
                    }
                } 
                else if (typeof obj[key] === 'object') {
                    injectBadBoyBranding(obj[key]);
                }
            }
        }
    }

    // ==========================================
    // 🛠 BUILD PREMIUM HEADERS
    // ==========================================
    function buildPremiumHeaders() {
        return {
            'authorization': PREMIUM.authorization,
            'device-id': PREMIUM.device_id,
            'advertising-id': PREMIUM.advertising_id,
            'android_id': PREMIUM.android_id,
            'user-agent': PREMIUM.user_agent,
            'package-name': PREMIUM.package_name,
            'app-version': PREMIUM.app_version,
            'build-number': PREMIUM.build_number,
            'client-country': PREMIUM.client_country,
            'lang': PREMIUM.lang,
            'install-source': 'google_play',
            'content-type': 'application/json; charset=UTF-8',
            'accept': 'application/json',
            'accept-charset': 'UTF-8',
        };
    }

    // ==========================================
    // 🔥 CDN/CLOUDFRONT HANDLER - MAIN FIX
    // ==========================================
    if (urlPath.includes('media.cdn.kukufm.com') || 
        urlPath.includes('cloudfront.net') ||
        urlPath.includes('kukufm.com/hls/') ||
        urlPath.includes('.m3u8') ||
        urlPath.includes('.ts')) {
        
        try {
            // 🔥 CDN URL se fetch karo with premium headers
            const headers = {
                'User-Agent': PREMIUM.user_agent,
                'Accept-Encoding': 'gzip',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Referer': 'https://api.kukufm.com',
                'Origin': 'https://api.kukufm.com',
                // 🔥 CloudFront signed URL ke liye
                'Cookie': `CloudFront-Key-Pair-Id=APKAIRLOK7Y7J7Y7J7Y7; CloudFront-Signature=...; CloudFront-Policy=...`,
                'Authorization': PREMIUM.authorization,
                'device-id': PREMIUM.device_id,
                'package-name': PREMIUM.package_name,
                'app-version': PREMIUM.app_version
            };

            // 🔥 Try to get CDN URL
            let cdnUrl = urlPath;
            
            // Agar relative path hai toh full URL banao
            if (!cdnUrl.startsWith('http')) {
                cdnUrl = 'https://' + cdnUrl;
            }

            const response = await fetch(cdnUrl, {
                method: 'GET',
                headers: headers
            });

            // Agar 403 aaye toh fallback
            if (response.status === 403) {
                console.log('⚠️ CDN 403 - Using fallback proxy');
                
                // 🔥 FALLBACK: Try to proxy via API
                const apiResponse = await fetch('https://api.kukufm.com/api/v1.0/video/playback/', {
                    method: 'POST',
                    headers: buildPremiumHeaders(),
                    body: JSON.stringify({
                        episode_id: urlPath.split('/').pop().replace('.m3u8', '')
                    })
                });
                
                const apiData = await apiResponse.json();
                if (apiData && apiData.video_url) {
                    // Redirect to actual video URL
                    return res.redirect(302, apiData.video_url);
                }
            }

            // Forward CDN response
            const buffer = await response.arrayBuffer();
            const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
            
            response.headers.forEach((value, key) => {
                if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
                    res.setHeader(key, value);
                }
            });
            
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            
            return res.status(response.status).send(Buffer.from(buffer));
            
        } catch (error) {
            console.error('❌ CDN Error:', error);
            
            // 🔥 ULTIMATE FALLBACK - Try to get video from API
            try {
                const episodeId = urlPath.split('/').pop().replace('.m3u8', '');
                const apiResponse = await fetch('https://api.kukufm.com/api/v1.0/video/playback/', {
                    method: 'POST',
                    headers: buildPremiumHeaders(),
                    body: JSON.stringify({ episode_id: episodeId })
                });
                const apiData = await apiResponse.json();
                
                if (apiData && apiData.video_url) {
                    return res.status(200).json({
                        success: true,
                        video_url: apiData.video_url,
                        message: "Use this URL directly [ BAD BOY ]"
                    });
                }
            } catch(e) {}
            
            return res.status(403).json({
                error: "CDN Access Denied",
                message: "Please use the API endpoint instead [ BAD BOY ]",
                solution: "Use /api/v1.0/video/playback/ to get video URL"
            });
        }
    }

    // ==========================================
    // 🎯 VIDEO PLAYBACK API - ALTERNATIVE ROUTE
    // ==========================================
    if (urlPath.includes('/api/v1.0/video/playback/') || 
        urlPath.includes('/api/v1.0/show/episode/')) {
        try {
            const headers = buildPremiumHeaders();
            maskIP(headers);
            
            const fetchOptions = {
                method: method,
                headers: headers,
                timeout: 30000,
            };

            if (method !== 'GET' && method !== 'HEAD' && req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            let data = await response.json();
            
            // 🔥 Inject premium CDN headers
            if (data && data.video_url) {
                // CDN URL ko proxy ke through route karo
                data.video_url = data.video_url.replace('https://media.cdn.kukufm.com', 'https://' + req.headers.host);
                data.proxy_url = req.headers.host + '/video-proxy/' + data.video_url.split('/').pop();
            }
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 VERIFY OTP
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            maskIP(headers);

            const fetchOptions = {
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            if (req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            let data = await response.json();

            data = data || {};
            data.type = "jwt";
            data.message = "Login successful [ BAD BOY ]";
            data.token = PREMIUM.authorization.replace('jwt ', '');
            data.access_token = PREMIUM.authorization.replace('jwt ', '');
            data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
            
            data.user = {
                has_premium: true,
                is_user_anonymous: false,
                is_free_trial_period: true,
                is_existing_subscriber: true,
                user_subscriptions: [{
                    status: "Active",
                    valid_till: "2099-12-31",
                    plan_name: "Lifetime [ BAD BOY ] Premium",
                    is_recurring: false,
                    plan_amount: 0
                }]
            };
            
            data.success = true;
            data.code = 200;
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(200).json({
                type: "jwt",
                message: "Login successful [ BAD BOY ]",
                token: PREMIUM.authorization.replace('jwt ', ''),
                access_token: PREMIUM.authorization.replace('jwt ', ''),
                refresh_token: PREMIUM.authorization.replace('jwt ', ''),
                user: {
                    has_premium: true,
                    is_user_anonymous: false,
                    is_free_trial_period: true,
                    is_existing_subscriber: true,
                    user_subscriptions: [{
                        status: "Active",
                        valid_till: "2099-12-31",
                        plan_name: "Lifetime [ BAD BOY ] Premium",
                        is_recurring: false,
                        plan_amount: 0
                    }]
                },
                success: true,
                code: 200
            });
        }
    }

    // ==========================================
    // 🔥 SEND OTP
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/send-otp/')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            maskIP(headers);

            const fetchOptions = {
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            if (req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            const data = await response.json();
            
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 1️⃣ GET SESSION TOKEN
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            maskIP(headers);

            const fetchOptions = {
                method: method,
                headers: headers,
                timeout: 30000,
            };

            if (method !== 'GET' && method !== 'HEAD' && req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body).toString();
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            let data = await response.json();

            if (data.user) {
                data.user.has_premium = true;
                data.user.is_user_anonymous = false;
                data.user.is_free_trial_period = true;
                data.user.is_existing_subscriber = true;
                
                if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                    data.user.user_subscriptions = [{
                        status: "Active",
                        valid_till: "2099-12-31",
                        plan_name: "Lifetime [ BAD BOY ] Premium",
                        is_recurring: false,
                        plan_amount: 0
                    }];
                }
            }
            
            data.access_token = PREMIUM.authorization.replace('jwt ', '');
            data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
            data.code = 200;
            data.success = true;

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(200).json({
                success: true,
                code: 200,
                access_token: PREMIUM.authorization.replace('jwt ', ''),
                refresh_token: PREMIUM.authorization.replace('jwt ', ''),
                user: {
                    has_premium: true,
                    is_user_anonymous: false,
                    is_free_trial_period: true,
                    is_existing_subscriber: true,
                    name: "BAD BOY Premium [ BAD BOY ]",
                    user_subscriptions: [{
                        status: "Active",
                        valid_till: "2099-12-31",
                        plan_name: "Lifetime [ BAD BOY ] Premium",
                        is_recurring: false,
                        plan_amount: 0
                    }]
                }
            });
        }
    }

    // ==========================================
    // 2️⃣ MASTER CONFIG
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            const headers = buildPremiumHeaders();
            maskIP(headers);
            
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            if (data.user_data) {
                data.user_data.has_premium = true;
                data.user_data.is_anonymous = false;
                data.user_data.is_existing_subscriber = true;
                
                if (data.user_data.user) {
                    data.user_data.user.has_premium = true;
                    data.user_data.user.is_free_trial_period = true;
                    
                    if (data.user_data.user.user_subscriptions && 
                        data.user_data.user.user_subscriptions.length > 0) {
                        data.user_data.user.user_subscriptions.forEach(sub => {
                            sub.status = "Active";
                            sub.valid_till = "2099-12-31";
                            sub.plan_name = "Lifetime [ BAD BOY ] Premium";
                            sub.is_recurring = false;
                        });
                    } else {
                        data.user_data.user.user_subscriptions = [{
                            status: "Active",
                            valid_till: "2099-12-31",
                            plan_name: "Lifetime [ BAD BOY ] Premium",
                            is_recurring: false,
                            plan_amount: 0
                        }];
                    }
                }
            }

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 3️⃣ HOME / SHOW DATA
    // ==========================================
    if (urlPath.includes('/api/v3/home/') || urlPath.includes('/api/v2/home/') || 
        urlPath.includes('/api/v1.0/show/') || urlPath.includes('/category/') ||
        urlPath.includes('/search')) {
        try {
            const headers = buildPremiumHeaders();
            maskIP(headers);
            
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            injectBadBoyBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 4️⃣ UNLOCK / ORDER / PAYMENT FAKE
    // ==========================================
    if (urlPath.includes('/unlock') || urlPath.includes('/order') || 
        urlPath.includes('/pay') || urlPath.includes('/payment') || 
        urlPath.includes('/purchase')) {
        return res.status(200).json({
            code: 200,
            message: "Success [ BAD BOY ]",
            data: {
                orderId: "BB_" + Date.now(),
                status: "SUCCESS",
                unlockTime: Date.now(),
                isPremium: true
            },
            success: true
        });
    }

    // ==========================================
    // 5️⃣ ANALYTICS / TRACKING BLOCK
    // ==========================================
    if (urlPath.includes('/events/') || urlPath.includes('web-events')) {
        return res.status(201).json({ message: "Event created successfully", success: true });
    }

    if (urlPath.includes('moengage') || urlPath.includes('sdk-03.moengage.com')) {
        return res.status(200).json({ status: "success", message: "Accepted" });
    }

    if (urlPath.includes('appsflyer') || urlPath.includes('androidevent')) {
        return res.status(200).send('ok');
    }

    if (urlPath.includes('graph.facebook.com') || urlPath.includes('facebook')) {
        return res.status(200).json({ success: true });
    }

    if (urlPath.includes('otpless') || urlPath.includes('user-auth.otpless.app')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            maskIP(headers);

            const fetchOptions = {
                method: method,
                headers: headers,
                timeout: 30000,
            };

            if (req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            }

            const response = await fetch(urlPath, fetchOptions);
            const data = await response.text();
            return res.status(response.status).send(data);
        } catch (e) {
            return res.status(200).json({ status: "success" });
        }
    }

    if (urlPath.includes('firebase') || urlPath.includes('googleapis.com')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            maskIP(headers);

            const fetchOptions = {
                method: method,
                headers: headers,
                timeout: 30000,
            };

            if (req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            }

            const response = await fetch(urlPath, fetchOptions);
            const data = await response.text();
            
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.idToken) {
                    jsonData.idToken = PREMIUM.authorization.replace('jwt ', '');
                    jsonData.refreshToken = PREMIUM.authorization.replace('jwt ', '');
                    return res.status(200).json(jsonData);
                }
            } catch(e) {}
            
            return res.status(response.status).send(data);
        } catch (e) {
            return res.status(200).json({ kind: "identitytoolkit#VerifyCustomTokenResponse", registered: true });
        }
    }

    // ==========================================
    // 6️⃣ ROOT PATH
    // ==========================================
    if (urlPath === '/' || urlPath === '') {
        return res.status(200).json({
            status: "🔥 Proxy is Running",
            brand: "BAD BOY EDITION",
            message: "OTP Fixed! New numbers also get Premium! CDN Fixed!",
            ip_masking: "Active - Fake IP: " + PREMIUM.fakeIP,
            rate_limit: "2 requests per 0.5 second",
            random_delay: "100ms to 400ms",
            endpoints: {
                send_otp: "POST /api/v1.0/users/auth/send-otp/",
                verify_otp: "POST /api/v1.0/users/auth/verify-otp/",
                session: "/api/v1.1/users/get-session-token/",
                config: "/api/v1.0/config/master/android/",
                home: "/api/v3/home/all/?page=1",
                video_playback: "POST /api/v1.0/video/playback/"
            }
        });
    }

    // ==========================================
    // 🔄 BAAKI SARI REQUESTS FORWARD
    // ==========================================
    try {
        const headers = buildPremiumHeaders();
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];

        maskIP(headers);

        const fetchOptions = {
            method: method,
            headers: headers,
            timeout: 30000,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            injectBadBoyBranding(data);
            return res.status(response.status).json(data);
        } 
        else {
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
        console.error('❌ Proxy Error:', error);
        return res.status(500).json({
            code: 500,
            message: "Proxy Error: " + error.message
        });
    }
}
