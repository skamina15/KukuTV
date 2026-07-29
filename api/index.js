// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION) v2.0
// 🔥 PREMIUM PERSISTENCE FIXED
// ==========================================

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.kukufm.com";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ==========================================
    // 🔥 HARDCORE PREMIUM TOKEN + CREDENTIALS
    // ==========================================
    const PREMIUM = {
        authorization: "jwt eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTIwMTAwODYsImV4cCI6MTc4NTM1MjY2Niwic3ViX3Byb2ZpbGVfaWQiOjIxMDE1MjYxLCJ1bmlxdWVfaWQiOiJhZWU2NDQ4MS00MmRiLTQyZmItODYxYS04MTRmNWM2YjQyMGUifQ.oExc_RzbLGEiMx7IDhwfA7JumeZFQQ5IhSQE_KethUP2j2Fn8-UdzT-p5q37KYQ__jIqlsTJPe4LLrHK5cLoBg",
        device_id: "61304354-728a-4058-8586-4607eefa339e",
        android_id: "690fc583b739834",
        advertising_id: "61304354-728a-4058-8586-4607eefa339e",
        user_agent: "Dalvik/2.1.0 (Linux; U; Android 16; SM-S928B Build/BP4A.251205.006)",
        package_name: "com.vlv.aravali.reels",
        app_version: "50807",
        build_number: "5080703",
        client_country: "IN",
        lang: "english",
    };

    // ==========================================
    // 🏷️ BRANDING FUNCTION
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
    // 🔥 FORCE PREMIUM ON ANY USER DATA
    // ==========================================
    function forcePremiumOnUserData(data) {
        if (!data) return data;
        
        // Force premium on main user object
        if (data.user) {
            data.user.has_premium = true;
            data.user.is_user_anonymous = false;
            data.user.is_free_trial_period = true;
            data.user.is_existing_subscriber = true;
            data.user.premium = true;
            data.user.is_premium = true;
            
            // Force subscription
            if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                data.user.user_subscriptions = [{
                    status: "Active",
                    valid_till: "2099-12-31",
                    plan_name: "Lifetime [ BAD BOY ] Premium",
                    is_recurring: false,
                    plan_amount: 0,
                    plan_id: "premium_lifetime",
                    subscription_id: "BB_" + Date.now()
                }];
            } else {
                data.user.user_subscriptions.forEach(sub => {
                    sub.status = "Active";
                    sub.valid_till = "2099-12-31";
                    sub.plan_name = "Lifetime [ BAD BOY ] Premium";
                    sub.is_recurring = false;
                    sub.plan_amount = 0;
                });
            }
        }
        
        // Force on user_data
        if (data.user_data) {
            data.user_data.has_premium = true;
            data.user_data.is_anonymous = false;
            data.user_data.is_existing_subscriber = true;
            data.user_data.premium = true;
            
            if (data.user_data.user) {
                data.user_data.user.has_premium = true;
                data.user_data.user.is_free_trial_period = true;
                data.user_data.user.is_existing_subscriber = true;
                data.user_data.user.premium = true;
                
                if (!data.user_data.user.user_subscriptions || data.user_data.user.user_subscriptions.length === 0) {
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
        
        // Force on any object with user-like structure
        if (data.data && data.data.user) {
            data.data.user.has_premium = true;
            data.data.user.is_premium = true;
            data.data.user.premium = true;
        }
        
        return data;
    }

    // ==========================================
    // 🔥 FORCE TOKENS ON ANY RESPONSE
    // ==========================================
    function forceTokens(data) {
        if (data) {
            data.access_token = PREMIUM.authorization.replace('jwt ', '');
            data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
            data.token = PREMIUM.authorization.replace('jwt ', '');
            data.success = true;
            data.code = 200;
        }
        return data;
    }

    // ==========================================
    // 🔥 NEW: SEND OTP HANDLER
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/send-otp/')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

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
    // 🔥 NEW: VERIFY OTP HANDLER - MAIN FIX
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

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
            
            // Force premium and tokens
            data = forcePremiumOnUserData(data);
            data = forceTokens(data);
            
            // Ensure user exists
            if (!data.user) {
                data.user = {};
            }
            
            // Force premium status
            data.user.has_premium = true;
            data.user.is_user_anonymous = false;
            data.user.is_free_trial_period = true;
            data.user.is_existing_subscriber = true;
            data.user.premium = true;
            data.user.is_premium = true;
            
            // Add subscription if missing
            if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                data.user.user_subscriptions = [{
                    status: "Active",
                    valid_till: "2099-12-31",
                    plan_name: "Lifetime [ BAD BOY ] Premium",
                    is_recurring: false,
                    plan_amount: 0
                }];
            }
            
            // Force success
            data.success = true;
            data.code = 200;
            data.message = "Login successful [ BAD BOY ]";
            
            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            return res.status(200).json({
                success: true,
                code: 200,
                message: "Login successful [ BAD BOY ]",
                access_token: PREMIUM.authorization.replace('jwt ', ''),
                refresh_token: PREMIUM.authorization.replace('jwt ', ''),
                user: {
                    has_premium: true,
                    is_user_anonymous: false,
                    is_free_trial_period: true,
                    is_existing_subscriber: true,
                    premium: true,
                    is_premium: true,
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
    // 🔥 FIXED: GET SESSION TOKEN - PERSISTENT PREMIUM
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

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

            // 🔥 FORCE PREMIUM ON EVERY RESPONSE
            data = forcePremiumOnUserData(data);
            data = forceTokens(data);
            
            // Ensure user exists with premium
            if (!data.user) {
                data.user = {};
            }
            
            data.user.has_premium = true;
            data.user.is_user_anonymous = false;
            data.user.is_free_trial_period = true;
            data.user.is_existing_subscriber = true;
            data.user.premium = true;
            data.user.is_premium = true;
            
            if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                data.user.user_subscriptions = [{
                    status: "Active",
                    valid_till: "2099-12-31",
                    plan_name: "Lifetime [ BAD BOY ] Premium",
                    is_recurring: false,
                    plan_amount: 0
                }];
            } else {
                data.user.user_subscriptions.forEach(sub => {
                    sub.status = "Active";
                    sub.valid_till = "2099-12-31";
                    sub.plan_name = "Lifetime [ BAD BOY ] Premium";
                    sub.is_recurring = false;
                    sub.plan_amount = 0;
                });
            }
            
            // 🔥 BRANDING
            if (data.user && data.user.name) {
                if (!data.user.name.includes('[ BAD BOY ]')) {
                    data.user.name = data.user.name + ' [ BAD BOY ]';
                }
            }
            if (data.user && data.user.bio) {
                if (!data.user.bio.includes('[ BAD BOY ]')) {
                    data.user.bio = data.user.bio + ' [ BAD BOY ]';
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
                    premium: true,
                    is_premium: true,
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
    // 🔥 FIXED: MASTER CONFIG - PREMIUM SPOOF
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            const headers = buildPremiumHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            // Force premium on all user data
            data = forcePremiumOnUserData(data);
            data = forceTokens(data);

            if (data.user_data) {
                data.user_data.has_premium = true;
                data.user_data.is_anonymous = false;
                data.user_data.is_existing_subscriber = true;
                data.user_data.premium = true;
                data.user_data.is_premium = true;
                
                if (data.user_data.user) {
                    data.user_data.user.has_premium = true;
                    data.user_data.user.is_free_trial_period = true;
                    data.user_data.user.is_existing_subscriber = true;
                    data.user_data.user.premium = true;
                    data.user_data.user.is_premium = true;
                    
                    if (data.user_data.user.user_subscriptions && 
                        data.user_data.user.user_subscriptions.length > 0) {
                        data.user_data.user.user_subscriptions.forEach(sub => {
                            sub.status = "Active";
                            sub.valid_till = "2099-12-31";
                            sub.plan_name = "Lifetime [ BAD BOY ] Premium";
                            sub.is_recurring = false;
                            sub.plan_amount = 0;
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
    // 🔥 FIXED: ANY ENDPOINT WITH USER DATA
    // ==========================================
    // This catches any endpoint that might contain user data
    const userDataEndpoints = [
        '/api/v1.0/user/',
        '/api/v1.1/user/',
        '/api/v2/user/',
        '/api/v3/user/',
        '/api/v1.0/profile/',
        '/api/v1.0/me/',
        '/api/v1.0/account/',
        '/api/v1.0/subscription/',
        '/api/v1.0/premium/',
        '/api/v1.0/user/subscription/',
        '/api/v1.0/user/profile/',
    ];

    const shouldForcePremium = userDataEndpoints.some(endpoint => urlPath.includes(endpoint));

    if (shouldForcePremium) {
        try {
            const headers = buildPremiumHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            // Force premium on all user data
            data = forcePremiumOnUserData(data);
            data = forceTokens(data);

            injectBadBoyBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            // Return premium mock on error
            return res.status(200).json({
                success: true,
                code: 200,
                message: "Premium Active [ BAD BOY ]",
                user: {
                    has_premium: true,
                    is_user_anonymous: false,
                    is_free_trial_period: true,
                    is_existing_subscriber: true,
                    premium: true,
                    is_premium: true,
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
    // 3️⃣ HOME / SHOW DATA - BRANDING
    // ==========================================
    if (urlPath.includes('/api/v3/home/') || urlPath.includes('/api/v2/home/') || 
        urlPath.includes('/api/v1.0/show/') || urlPath.includes('/category/') ||
        urlPath.includes('/search')) {
        try {
            const headers = buildPremiumHeaders();
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
                isPremium: true,
                has_premium: true,
                premium: true
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

    if (urlPath.includes('cloudfront.net')) {
        try {
            const response = await fetch(urlPath);
            const buffer = await response.arrayBuffer();
            response.headers.forEach((value, key) => {
                res.setHeader(key, value);
            });
            return res.status(response.status).send(Buffer.from(buffer));
        } catch (e) {
            return res.status(404).send('Not found');
        }
    }

    // ==========================================
    // 6️⃣ ROOT PATH
    // ==========================================
    if (urlPath === '/' || urlPath === '') {
        return res.status(200).json({
            status: "🔥 Proxy is Running",
            brand: "BAD BOY EDITION v2.0",
            message: "PREMIUM PERSISTENCE FIXED! App will stay premium.",
            endpoints: {
                send_otp: "POST /api/v1.0/users/auth/send-otp/",
                verify_otp: "POST /api/v1.0/users/auth/verify-otp/",
                session: "/api/v1.1/users/get-session-token/",
                config: "/api/v1.0/config/master/android/",
                home: "/api/v3/home/all/?page=1"
            }
        });
    }

    // ==========================================
    // 🔄 BAAKI SARI REQUESTS FORWARD (TOKEN INJECTED)
    // ==========================================
    try {
        const headers = buildPremiumHeaders();
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];

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
            
            // Force premium on any JSON response
            data = forcePremiumOnUserData(data);
            data = forceTokens(data);
            
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
            message: "Proxy Error: " + error.message,
            success: false
        });
    }
}
