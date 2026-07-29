// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION) v3.0
// 🔥 FORCE PREMIUM OVERRIDE - IGNORE REAL DATA
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
        user_id: 352010086,
        profile_id: 21015261,
        unique_id: "aee64481-42db-42fb-861a-814f5c6b420e"
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
    // 🔥 COMPLETE PREMIUM USER OBJECT
    // ==========================================
    function getPremiumUserObject() {
        return {
            id: PREMIUM.user_id,
            user_id: PREMIUM.user_id,
            profile_id: PREMIUM.profile_id,
            unique_id: PREMIUM.unique_id,
            name: "BAD BOY Premium [ BAD BOY ]",
            email: "badboy@premium.com",
            mobile: "9999999999",
            has_premium: true,
            is_premium: true,
            premium: true,
            is_user_anonymous: false,
            is_free_trial_period: true,
            is_existing_subscriber: true,
            is_subscribed: true,
            is_trial: false,
            subscription_status: "Active",
            subscription_type: "premium",
            subscription_plan: "Lifetime Premium",
            subscription_valid_till: "2099-12-31",
            user_subscriptions: [{
                id: "sub_" + Date.now(),
                status: "Active",
                valid_till: "2099-12-31",
                plan_name: "Lifetime [ BAD BOY ] Premium",
                plan_id: "premium_lifetime",
                is_recurring: false,
                plan_amount: 0,
                subscription_id: "BB_" + Date.now()
            }],
            active_subscriptions: [{
                id: "sub_" + Date.now(),
                status: "Active",
                valid_till: "2099-12-31",
                plan_name: "Lifetime [ BAD BOY ] Premium",
                plan_id: "premium_lifetime",
                is_recurring: false,
                plan_amount: 0
            }],
            is_active: true,
            is_verified: true,
            is_email_verified: true,
            is_mobile_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            bio: "🔥 Unlimited Premium Access [ BAD BOY ]",
            avatar: "https://ui-avatars.com/api/?name=BAD+BOY&background=ff0000&color=fff&size=128",
            profile_pic: "https://ui-avatars.com/api/?name=BAD+BOY&background=ff0000&color=fff&size=128"
        };
    }

    // ==========================================
    // 🔥 COMPLETE PREMIUM RESPONSE
    // ==========================================
    function getPremiumResponse(originalData = {}) {
        const user = getPremiumUserObject();
        
        // Preserve any original data but override user
        const response = {
            success: true,
            code: 200,
            message: "Success [ BAD BOY ]",
            access_token: PREMIUM.authorization.replace('jwt ', ''),
            refresh_token: PREMIUM.authorization.replace('jwt ', ''),
            token: PREMIUM.authorization.replace('jwt ', ''),
            user: user,
            user_data: {
                ...user,
                user: user
            },
            data: {
                ...originalData.data,
                user: user
            },
            is_premium: true,
            has_premium: true,
            premium: true
        };
        
        // If original has these, keep them but override user data
        if (originalData.config) response.config = originalData.config;
        if (originalData.settings) response.settings = originalData.settings;
        if (originalData.home) response.home = originalData.home;
        if (originalData.shows) response.shows = originalData.shows;
        
        return response;
    }

    // ==========================================
    // 🔥 SEND OTP HANDLER
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
    // 🔥 VERIFY OTP - COMPLETE OVERRIDE
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            // Try to get real response but we'll override it completely
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
            let realData = await response.json();
            
            // 🔥 COMPLETE OVERRIDE - Ignore real user data
            const premiumResponse = getPremiumResponse(realData);
            premiumResponse.message = "Login successful [ BAD BOY ]";
            
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
            
        } catch (error) {
            // Return pure premium response on error
            return res.status(200).json(getPremiumResponse());
        }
    }

    // ==========================================
    // 🔥 GET SESSION TOKEN - COMPLETE OVERRIDE
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
            let realData = await response.json();

            // 🔥 COMPLETE OVERRIDE - Ignore real user data
            const premiumResponse = getPremiumResponse(realData);
            
            // Preserve any non-user data
            if (realData.config) premiumResponse.config = realData.config;
            if (realData.settings) premiumResponse.settings = realData.settings;
            
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
            
        } catch (error) {
            return res.status(200).json(getPremiumResponse());
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG - COMPLETE OVERRIDE
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            const headers = {
                ...buildPremiumHeaders(),
                'authorization': PREMIUM.authorization
            };
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let realData = await response.json();

            // 🔥 COMPLETE OVERRIDE
            const premiumResponse = getPremiumResponse(realData);
            
            // Preserve config data
            if (realData.config) premiumResponse.config = realData.config;
            if (realData.settings) premiumResponse.settings = realData.settings;
            if (realData.features) premiumResponse.features = realData.features;
            if (realData.app_config) premiumResponse.app_config = realData.app_config;
            
            // Override user_data completely
            premiumResponse.user_data = getPremiumUserObject();
            premiumResponse.user_data.user = getPremiumUserObject();
            
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
            
        } catch (error) {
            return res.status(200).json(getPremiumResponse());
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
    // 🔥 CATCH ALL USER ENDPOINTS - COMPLETE OVERRIDE
    // ==========================================
    const userDataEndpoints = [
        '/user/',
        '/profile/',
        '/me/',
        '/account/',
        '/subscription/',
        '/premium/',
        '/user/profile/',
        '/user/subscription/',
        '/users/me/',
        '/users/profile/',
        '/get-user/',
        '/get-profile/'
    ];

    const shouldForcePremium = userDataEndpoints.some(endpoint => urlPath.includes(endpoint));

    if (shouldForcePremium) {
        try {
            const headers = buildPremiumHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let realData = await response.json();

            // 🔥 COMPLETE OVERRIDE
            const premiumResponse = getPremiumResponse(realData);
            
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
            
        } catch (error) {
            return res.status(200).json(getPremiumResponse());
        }
    }

    // ==========================================
    // 🏠 HOME / SHOW DATA - Keep original but add branding
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

            // Don't override home data, just add branding
            injectBadBoyBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔓 UNLOCK / ORDER / PAYMENT - Fake success
    // ==========================================
    if (urlPath.includes('/unlock') || urlPath.includes('/order') || 
        urlPath.includes('/pay') || urlPath.includes('/payment') || 
        urlPath.includes('/purchase')) {
        return res.status(200).json({
            code: 200,
            message: "Premium Unlocked [ BAD BOY ]",
            data: {
                orderId: "BB_" + Date.now(),
                status: "SUCCESS",
                unlockTime: Date.now(),
                isPremium: true,
                has_premium: true,
                premium: true,
                subscription: {
                    status: "Active",
                    valid_till: "2099-12-31",
                    plan_name: "Lifetime [ BAD BOY ] Premium"
                }
            },
            success: true
        });
    }

    // ==========================================
    // 📊 ANALYTICS / TRACKING BLOCK
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
    // 🏠 ROOT PATH
    // ==========================================
    if (urlPath === '/' || urlPath === '') {
        return res.status(200).json({
            status: "🔥 KUKU FM PROXY RUNNING",
            brand: "BAD BOY EDITION v3.0",
            message: "🚀 COMPLETE USER DATA OVERRIDE - Premium is permanent!",
            user: getPremiumUserObject(),
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
    // 🔄 ALL OTHER REQUESTS - FORWARD WITH PREMIUM HEADERS
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
            
            // Check if this response contains user data
            if (data.user || data.user_data || data.data?.user) {
                // 🔥 COMPLETE OVERRIDE
                const premiumResponse = getPremiumResponse(data);
                injectBadBoyBranding(premiumResponse);
                return res.status(response.status).json(premiumResponse);
            }
            
            // Otherwise just add branding
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
