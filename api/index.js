// ==========================================
// 🎯 KUKU FM PROXY - NO LOGOUT FIX
// ==========================================

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.kukufm.com";

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ==========================================
    // 🔥 PREMIUM CONFIG - REAL TOKEN FROM LOGS
    // ==========================================
    const PREMIUM = {
        // ✅ REAL TOKEN FROM YOUR LOGS
        authorization: "jwt eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTIwMTAwODYsImV4cCI6MTc4NTc0MzU5Niwic3ViX3Byb2ZpbGVfaWQiOjIxMDE1MjYxLCJ1bmlxdWVfaWQiOiIwM2YwZmM5MS01MDdjLTQwYzYtYmUyMy01ODk5YjQ1ODFhYWMifQ.VKy3B_UEGaObFT9RxHDKfi2SY51wQraIe5rFbvo8xjICRjYXSsiBlA67w_cnlz8yMdHpSxagP4Szi8T07dm3Ng",
        device_id: "61304354-728a-4058-8586-4607eefa339e",
        android_id: "690fc583b739834",
        advertising_id: "03732771-f55c-4668-bbaa-b789cceb18c4",
        user_agent: "kukufm-android-reels/5.8.7",
        package_name: "com.vlv.aravali.reels",
        app_version: "50807",
        build_number: "5080703",
        client_country: "IN",
        lang: "english",
        fakeIP: '192.168.1.100',
        user_id: 352010086,
        profile_id: 21015261,
        session_expiry: 1785743596, // Current expiry
        // 🔥 EXTEND SESSION
        extended_expiry: 1893456515, // 2030
        user_uuid: "c51dced4eda74903af5c6eee3bcd5f45",
        app_instance_id: "997ba49f578d84039404a7fc3a445c10"
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
            // 🔥 SESSION KEEP-ALIVE
            'x-session-keep-alive': 'true',
            'x-user-id': String(PREMIUM.user_id),
            'x-profile-id': String(PREMIUM.profile_id),
            'x-session-extended': 'true'
        };
    }

    // ==========================================
    // 🔥 SESSION VALIDATION - PREVENT LOGOUT
    // ==========================================
    // This is the MOST IMPORTANT part - intercept all session checks
    function getValidSessionResponse() {
        return {
            success: true,
            code: 200,
            message: "Session active ✅",
            is_session_valid: true,
            is_logged_in: true,
            user_id: PREMIUM.user_id,
            profile_id: PREMIUM.profile_id,
            access_token: PREMIUM.authorization.replace('jwt ', ''),
            refresh_token: PREMIUM.authorization.replace('jwt ', ''),
            expires_in: 315360000, // 10 years
            session_expiry: PREMIUM.extended_expiry,
            user: {
                id: PREMIUM.user_id,
                name: "BAD BOY Premium",
                has_premium: true,
                is_user_anonymous: false,
                is_free_trial_period: true,
                is_existing_subscriber: true,
                subscription_status: "Active",
                valid_till: "2030-12-31",
                plan_name: "Lifetime Premium",
                user_subscriptions: [{
                    status: "Active",
                    valid_till: "2030-12-31",
                    plan_name: "Lifetime Premium [ BAD BOY ]",
                    is_recurring: false,
                    plan_amount: 0,
                    subscription_id: "BB_PREMIUM_LIFETIME"
                }]
            }
        };
    }

    // ==========================================
    // 🔥 INTERCEPT ALL SESSION CHECK ENDPOINTS
    // ==========================================
    // These are the endpoints that cause logout if they fail
    const sessionEndpoints = [
        '/api/v1.0/users/validate-session',
        '/api/v1.0/users/me',
        '/api/v1.0/users/profile',
        '/api/v1.0/users/check-session',
        '/api/v1.0/users/session-status',
        '/api/v1.0/users/auth/status',
        '/api/v1.0/users/auth/validate',
        '/api/v1.1/users/validate-session',
        '/api/v2.0/users/me',
        '/api/v2.0/users/profile',
        '/api/v3.0/users/me',
        '/api/v3.0/users/profile'
    ];

    // Check if request is for session validation
    for (const endpoint of sessionEndpoints) {
        if (urlPath.includes(endpoint)) {
            console.log('✅ Session check intercepted:', urlPath);
            return res.status(200).json(getValidSessionResponse());
        }
    }

    // ==========================================
    // 🔥 REFRESH TOKEN - ALWAYS RETURN VALID
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/refresh-token') || 
        urlPath.includes('/api/v1.0/users/auth/refresh') ||
        urlPath.includes('/api/v1.1/users/refresh-token')) {
        console.log('✅ Token refresh intercepted');
        return res.status(200).json(getValidSessionResponse());
    }

    // ==========================================
    // 🔥 VERIFY OTP - ALWAYS SUCCESS
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        console.log('✅ OTP verification intercepted');
        return res.status(200).json({
            type: "jwt",
            message: "Login successful ✅ [ BAD BOY ]",
            token: PREMIUM.authorization.replace('jwt ', ''),
            access_token: PREMIUM.authorization.replace('jwt ', ''),
            refresh_token: PREMIUM.authorization.replace('jwt ', ''),
            expires_in: 315360000,
            user_id: PREMIUM.user_id,
            profile_id: PREMIUM.profile_id,
            user: {
                id: PREMIUM.user_id,
                name: "BAD BOY Premium",
                has_premium: true,
                is_user_anonymous: false,
                is_free_trial_period: true,
                is_existing_subscriber: true,
                subscription_status: "Active",
                valid_till: "2030-12-31",
                plan_name: "Lifetime Premium",
                user_subscriptions: [{
                    status: "Active",
                    valid_till: "2030-12-31",
                    plan_name: "Lifetime [ BAD BOY ] Premium",
                    is_recurring: false,
                    plan_amount: 0,
                    subscription_id: "BB_PREMIUM_LIFETIME"
                }]
            },
            success: true,
            code: 200
        });
    }

    // ==========================================
    // 🔥 SEND OTP - PASS THROUGH
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
    // 🔥 GET SESSION TOKEN - RETURN EXTENDED
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/') || 
        urlPath.includes('/api/v1.0/users/get-session-token/')) {
        console.log('✅ Session token intercepted');
        return res.status(200).json(getValidSessionResponse());
    }

    // ==========================================
    // 🔥 MASTER CONFIG - FIX SUBSCRIPTION
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/') || 
        urlPath.includes('/api/v1.0/config/master/')) {
        try {
            const headers = buildPremiumHeaders();
            maskIP(headers);
            
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            // 🔥 OVERRIDE WITH ACTIVE SESSION
            if (data.user_data) {
                data.user_data.id = PREMIUM.user_id;
                data.user_data.has_premium = true;
                data.user_data.is_anonymous = false;
                data.user_data.is_existing_subscriber = true;
                data.user_data.subscription_status = "Active";
                data.user_data.valid_till = "2030-12-31";
                data.user_data.session_valid = true;
                
                if (data.user_data.user) {
                    data.user_data.user.id = PREMIUM.user_id;
                    data.user_data.user.has_premium = true;
                    data.user_data.user.is_free_trial_period = true;
                    data.user_data.user.subscription_status = "Active";
                    data.user_data.user.valid_till = "2030-12-31";
                    data.user_data.user.session_valid = true;
                    
                    // Fix subscriptions
                    if (!data.user_data.user.user_subscriptions || 
                        data.user_data.user.user_subscriptions.length === 0) {
                        data.user_data.user.user_subscriptions = [{
                            status: "Active",
                            valid_till: "2030-12-31",
                            plan_name: "Lifetime [ BAD BOY ] Premium",
                            is_recurring: false,
                            plan_amount: 0,
                            subscription_id: "BB_PREMIUM_LIFETIME"
                        }];
                    } else {
                        data.user_data.user.user_subscriptions.forEach(sub => {
                            sub.status = "Active";
                            sub.valid_till = "2030-12-31";
                            sub.plan_name = "Lifetime [ BAD BOY ] Premium";
                            sub.is_recurring = false;
                            sub.subscription_id = "BB_PREMIUM_LIFETIME";
                        });
                    }
                }
            }

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            // 🔥 ALWAYS RETURN VALID SESSION EVEN IF API FAILS
            return res.status(200).json({
                success: true,
                code: 200,
                user_data: {
                    id: PREMIUM.user_id,
                    has_premium: true,
                    is_anonymous: false,
                    is_existing_subscriber: true,
                    subscription_status: "Active",
                    valid_till: "2030-12-31",
                    session_valid: true,
                    user: {
                        id: PREMIUM.user_id,
                        name: "BAD BOY Premium",
                        has_premium: true,
                        is_free_trial_period: true,
                        subscription_status: "Active",
                        valid_till: "2030-12-31",
                        user_subscriptions: [{
                            status: "Active",
                            valid_till: "2030-12-31",
                            plan_name: "Lifetime [ BAD BOY ] Premium",
                            is_recurring: false,
                            plan_amount: 0,
                            subscription_id: "BB_PREMIUM_LIFETIME"
                        }]
                    }
                }
            });
        }
    }

    // ==========================================
    // 🔥 LIBRARY/PROFILE - FIX EXPIRED STATUS
    // ==========================================
    if (urlPath.includes('/api/v3.1/library/items/') || 
        urlPath.includes('/api/v2.0/users/me/') ||
        urlPath.includes('/api/v2.0/users/me/history/') ||
        urlPath.includes('/api/v2/groups/unlocked-by-you-coin/') ||
        urlPath.includes('/api/v3/library/')) {
        
        try {
            const headers = buildPremiumHeaders();
            maskIP(headers);
            
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();
            
            // 🔥 FIX: Change "Expired" to "Active" but keep session alive
            if (data.sections && Array.isArray(data.sections)) {
                data.sections = data.sections.map(section => {
                    if (section.view_type === 'subscription' && section.meta_data) {
                        // ✅ Keep the subscription visible but mark as Active
                        return {
                            ...section,
                            meta_data: {
                                ...section.meta_data,
                                // 🔥 CHANGE FROM "Expired" TO "Active"
                                bottom_label: "Active ✅",
                                top_label: "Premium Active 🎉",
                                cta_text: "Enjoy Premium",
                                bg_colors: ["#00FF00", "#008000"],
                                // Keep existing bg_image or use green version
                                bg_image: section.meta_data.bg_image || "https://images.cdn.kukufm.com/https://kukufm.s3.ap-south-1.amazonaws.com/bg_images/subs-section-bg-myspace/subs-section-bg-green.png"
                            }
                        };
                    }
                    return section;
                });
            }
            
            // 🔥 FIX PROFILE - ALWAYS ACTIVE
            if (data.profile) {
                data.profile.has_premium = true;
                data.profile.is_subscribed = true;
                data.profile.subscription_status = "Active";
                data.profile.valid_till = "2030-12-31";
                data.profile.plan_name = "Lifetime Premium";
                data.profile.session_valid = true;
                data.profile.is_session_active = true;
            }
            
            // 🔥 ADD SESSION VALIDITY
            data.session = {
                is_valid: true,
                expires_at: PREMIUM.extended_expiry,
                user_id: PREMIUM.user_id
            };
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            // 🔥 ALWAYS RETURN VALID SESSION
            return res.status(200).json({
                sections: [{
                    view_type: "subscription",
                    slug: "myspace-subscription",
                    title: "Premium Active",
                    meta_data: {
                        top_label: "🎉 Premium Active",
                        bottom_label: "Lifetime Access ✅",
                        bg_colors: ["#00FF00"],
                        cta_text: "Enjoy Premium"
                    }
                }],
                profile: {
                    id: PREMIUM.user_id,
                    name: "BAD BOY Premium",
                    has_premium: true,
                    is_subscribed: true,
                    subscription_status: "Active",
                    valid_till: "2030-12-31",
                    session_valid: true
                },
                session: {
                    is_valid: true,
                    expires_at: PREMIUM.extended_expiry
                }
            });
        }
    }

    // ==========================================
    // 🔥 PREMIUM PLANS - SHOW ALREADY PREMIUM
    // ==========================================
    if (urlPath.includes('/orders/get-premium-plans/') || 
        urlPath.includes('/api/v2.4/orders/')) {
        try {
            const headers = buildPremiumHeaders();
            maskIP(headers);
            
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();
            
            // 🔥 OVERRIDE - User already has premium
            data.is_already_premium = true;
            data.has_active_subscription = true;
            data.is_subscription_active = true;
            data.active_subscription = {
                plan_name: "Lifetime Premium [ BAD BOY ]",
                valid_till: "2030-12-31",
                status: "Active",
                is_recurring: false,
                subscription_id: "BB_PREMIUM_LIFETIME"
            };
            data.message = "You have an active Premium subscription! 🎉";
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(200).json({
                is_already_premium: true,
                has_active_subscription: true,
                is_subscription_active: true,
                message: "Premium Active - No need to subscribe! 🎉",
                active_subscription: {
                    plan_name: "Lifetime Premium [ BAD BOY ]",
                    valid_till: "2030-12-31",
                    status: "Active",
                    subscription_id: "BB_PREMIUM_LIFETIME"
                }
            });
        }
    }

    // ==========================================
    // 🔥 CDN HANDLER
    // ==========================================
    if (urlPath.includes('media.cdn.kukufm.com') || 
        urlPath.includes('cloudfront.net') ||
        urlPath.includes('kukufm.com/hls/') ||
        urlPath.includes('.m3u8') ||
        urlPath.includes('.ts')) {
        
        try {
            const headers = {
                'User-Agent': PREMIUM.user_agent,
                'Accept-Encoding': 'gzip',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Referer': 'https://api.kukufm.com',
                'Origin': 'https://api.kukufm.com',
                'Authorization': PREMIUM.authorization,
                'device-id': PREMIUM.device_id,
                'package-name': PREMIUM.package_name,
                'app-version': PREMIUM.app_version,
                'x-session-keep-alive': 'true'
            };

            let cdnUrl = urlPath;
            if (!cdnUrl.startsWith('http')) {
                cdnUrl = 'https://' + cdnUrl;
            }

            const response = await fetch(cdnUrl, {
                method: 'GET',
                headers: headers
            });

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
            return res.status(403).json({
                error: "CDN Access Denied",
                message: "Use API endpoint instead [ BAD BOY ]"
            });
        }
    }

    // ==========================================
    // 🎯 VIDEO PLAYBACK
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
            
            // 🔥 UNLOCK ALL
            data.is_premium = true;
            data.is_unlocked = true;
            data.session_valid = true;
            
            if (data && data.video_url) {
                data.video_url = data.video_url.replace('https://media.cdn.kukufm.com', 'https://' + req.headers.host);
            }
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 HOME / SHOWS - UNLOCK ALL
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

            // 🔥 UNLOCK ALL SHOWS
            if (data.data && Array.isArray(data.data)) {
                data.data = data.data.map(item => {
                    if (item.is_premium !== undefined) {
                        item.is_premium = false;
                        item.is_locked = false;
                        item.is_unlocked = true;
                    }
                    return item;
                });
            }
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 UNLOCK / ORDER / PAYMENT
    // ==========================================
    if (urlPath.includes('/unlock') || urlPath.includes('/order') || 
        urlPath.includes('/pay') || urlPath.includes('/payment') || 
        urlPath.includes('/purchase') || urlPath.includes('/subscribe')) {
        return res.status(200).json({
            code: 200,
            message: "Already Premium! 🎉 [ BAD BOY ]",
            success: true,
            data: {
                orderId: "BB_" + Date.now(),
                status: "SUCCESS",
                unlockTime: Date.now(),
                isPremium: true,
                subscription_id: "BB_PREMIUM_LIFETIME",
                already_premium: true,
                session_valid: true
            }
        });
    }

    // ==========================================
    // 🔥 ANALYTICS / TRACKING - BLOCK
    // ==========================================
    if (urlPath.includes('/events/') || urlPath.includes('web-events') ||
        urlPath.includes('moengage') || urlPath.includes('sdk-03.moengage.com') ||
        urlPath.includes('appsflyer') || urlPath.includes('androidevent') ||
        urlPath.includes('graph.facebook.com') || urlPath.includes('facebook') ||
        urlPath.includes('firebase') || urlPath.includes('googleapis.com')) {
        return res.status(200).json({ message: "Event created successfully", success: true });
    }

    // ==========================================
    // 🔥 ROOT PATH
    // ==========================================
    if (urlPath === '/' || urlPath === '') {
        return res.status(200).json({
            status: "🔥 Proxy is Running",
            brand: "BAD BOY EDITION",
            message: "✅ NEVER LOGOUT! Session always active!",
            user_id: PREMIUM.user_id,
            profile_id: PREMIUM.profile_id,
            subscription: "Active ✅",
            valid_till: "2030-12-31",
            session_valid: true,
            ip_masking: "Active - Fake IP: " + PREMIUM.fakeIP,
            how_it_works: {
                session_check: "All session validation endpoints return ACTIVE",
                subscription: "Even if backend shows Expired, proxy overrides to Active",
                logout_prevention: "All auth endpoints intercepted to prevent logout"
            },
            endpoints: {
                send_otp: "POST /api/v1.0/users/auth/send-otp/",
                verify_otp: "POST /api/v1.0/users/auth/verify-otp/",
                session: "/api/v1.1/users/get-session-token/",
                config: "/api/v1.0/config/master/android/",
                home: "/api/v3/home/all/?page=1",
                video_playback: "POST /api/v1.0/video/playback/",
                library: "/api/v3.1/library/items/?nav=profile"
            }
        });
    }

    // ==========================================
    // 🔄 ALL OTHER REQUESTS - FORWARD
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
            
            // 🔥 ENSURE SESSION IS ALWAYS VALID IN RESPONSE
            if (data) {
                data.session_valid = true;
                if (data.user) {
                    data.user.session_valid = true;
                    data.user.has_premium = true;
                    data.user.subscription_status = "Active";
                }
            }
            
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
        // 🔥 NEVER RETURN 401/403 - Always return valid session
        return res.status(200).json({
            success: true,
            code: 200,
            message: "Session active (proxy fallback)",
            session_valid: true,
            user_id: PREMIUM.user_id,
            has_premium: true
        });
    }
}
