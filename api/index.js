// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION) 
// 🔥 FULLY FIXED OTP LOGIN
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
        authorization: "jwt eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNzQ5ODA0ODMsImV4cCI6MTc4NTMyMDc0MSwic3ViX3Byb2ZpbGVfaWQiOjQ5NDQ4MzE1LCJ1bmlxdWVfaWQiOiI3MDQ3YmJhYS1kZWRiLTQ2N2MtYTVmZC1hY2I1ZjRhMjg2MWIifQ.QZ97fL0LNPULpYs4WcUYbWBC3tY6astiSpmP8yBHYwfFD2Ay9EOy6ydiTCCME7PxgCTstfsb-nPGtdrSSg8E-A",
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
    // 🔥 OTP-LESS LOGIN HANDLER - FIXED
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/otp-less/')) {
        try {
            console.log('🔥 OTP-LESS LOGIN REQUEST RECEIVED');
            
            // Forward original request
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
                console.log('📤 OTP Request Body:', fetchOptions.body);
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            let data = await response.json();
            
            console.log('📥 OTP Response:', JSON.stringify(data, null, 2));

            // 🔥 INJECT PREMIUM TOKEN AND USER DATA
            if (data) {
                // Inject tokens
                data.access_token = PREMIUM.authorization.replace('jwt ', '');
                data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
                
                // If user exists, mark as premium
                if (data.user) {
                    data.user.has_premium = true;
                    data.user.is_user_anonymous = false;
                    data.user.is_free_trial_period = true;
                    data.user.is_existing_subscriber = true;
                    
                    // Add subscription if missing
                    if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                        data.user.user_subscriptions = [{
                            status: "Active",
                            valid_till: "2099-12-31",
                            plan_name: "Lifetime Premium [BAD BOY]",
                            is_recurring: false,
                            plan_amount: 0,
                            subscription_id: "BB_" + Date.now()
                        }];
                    }
                }
            }

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('❌ OTP-LESS Error:', error);
            return res.status(500).json({ 
                error: error.message,
                code: 500
            });
        }
    }

    // ==========================================
    // 🔥 GET SESSION TOKEN - FIXED
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            console.log('🔥 SESSION TOKEN REQUEST RECEIVED');
            
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
            
            console.log('📥 Session Response:', JSON.stringify(data, null, 2));

            // 🔥 INJECT PREMIUM
            if (data.user) {
                data.user.has_premium = true;
                data.user.is_user_anonymous = false;
                data.user.is_free_trial_period = true;
                
                if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                    data.user.user_subscriptions = [{
                        status: "Active",
                        valid_till: "2099-12-31",
                        plan_name: "Lifetime Premium [BAD BOY]",
                        is_recurring: false,
                        plan_amount: 0
                    }];
                }
            }
            
            // Inject tokens
            data.access_token = PREMIUM.authorization.replace('jwt ', '');
            data.refresh_token = PREMIUM.authorization.replace('jwt ', '');

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('❌ Session Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG - PREMIUM SPOOF
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            console.log('🔥 MASTER CONFIG REQUEST');
            
            const headers = buildPremiumHeaders();
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
            console.error('❌ Config Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🏠 HOME / SHOW DATA - BRANDING
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
            console.error('❌ Home Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔓 UNLOCK / ORDER / PAYMENT FAKE
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

    // ==========================================
    // 📱 OTPLESS HANDLER
    // ==========================================
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

    // ==========================================
    // 🔥 FIREBASE HANDLER
    // ==========================================
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
            
            // Try to parse JSON and inject premium
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.idToken) {
                    jsonData.idToken = PREMIUM.authorization.replace('jwt ', '');
                    jsonData.refreshToken = PREMIUM.authorization.replace('jwt ', '');
                    jsonData.expiresIn = "3600";
                    return res.status(200).json(jsonData);
                }
            } catch(e) {}
            
            return res.status(response.status).send(data);
            
        } catch (e) {
            return res.status(200).json({ 
                kind: "identitytoolkit#VerifyCustomTokenResponse", 
                registered: true,
                idToken: PREMIUM.authorization.replace('jwt ', '')
            });
        }
    }

    // ==========================================
    // ☁️ CLOUDFRONT HANDLER
    // ==========================================
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
            status: "🔥 Proxy is Running",
            brand: "BAD BOY EDITION",
            message: "Hardcoded Premium Token Inject Active! OTP Login Fixed!",
            endpoints: {
                otp_login: "/api/v1.0/users/otp-less/",
                session: "/api/v1.1/users/get-session-token/",
                config: "/api/v1.0/config/master/android/",
                home: "/api/v3/home/all/?page=1"
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
