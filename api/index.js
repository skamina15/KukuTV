// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION) 
// 🔥 NO BODY CORRUPTION - RAW BODY PASS
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
    // 🔥 HELPER - GET RAW BODY
    // ==========================================
    function getRawBody(req) {
        // If body is already a Buffer or string, use it
        if (req.body) {
            if (Buffer.isBuffer(req.body)) {
                return req.body;
            }
            if (typeof req.body === 'string') {
                return req.body;
            }
            if (typeof req.body === 'object') {
                return JSON.stringify(req.body);
            }
        }
        return null;
    }

    // ==========================================
    // 🔥 SEND OTP - /api/v1.0/users/auth/send-otp/
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/send-otp/')) {
        try {
            console.log('📱 SEND OTP REQUEST');
            
            const rawBody = getRawBody(req);
            console.log('📤 Raw Body:', rawBody);

            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            const fetchOptions = {
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            if (rawBody) {
                fetchOptions.body = rawBody;
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            const data = await response.json();
            
            console.log('📥 Send OTP Response:', JSON.stringify(data, null, 2));

            return res.status(response.status).json(data);
            
        } catch (error) {
            console.error('❌ Send OTP Error:', error);
            return res.status(500).json({ 
                error: error.message,
                code: 500
            });
        }
    }

    // ==========================================
    // 🔥 VERIFY OTP - /api/v1.0/users/auth/verify-otp/
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            console.log('🔐 VERIFY OTP REQUEST');
            
            const rawBody = getRawBody(req);
            console.log('📤 Raw Body:', rawBody);

            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            
            // Ensure correct content-type
            headers['content-type'] = 'application/json; charset=UTF-8';

            const fetchOptions = {
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            if (rawBody) {
                fetchOptions.body = rawBody;
            }

            console.log('📤 Forwarding to:', targetBaseUrl + urlPath);
            console.log('📤 Headers:', JSON.stringify(headers, null, 2));
            
            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            const responseText = await response.text();
            
            console.log('📥 Raw Response:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch(e) {
                data = { raw: responseText };
            }
            
            console.log('📥 Parsed Response:', JSON.stringify(data, null, 2));

            // Check if verification was successful
            if (!data.error_code) {
                // 🔥 SUCCESS - INJECT PREMIUM
                data.access_token = PREMIUM.authorization.replace('jwt ', '');
                data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
                
                if (data.user) {
                    data.user.has_premium = true;
                    data.user.is_user_anonymous = false;
                    data.user.is_free_trial_period = true;
                    data.user.is_existing_subscriber = true;
                    
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
                
                data.success = true;
                data.code = 200;
                data.message = "Login successful [BAD BOY]";
                
                injectBadBoyBranding(data);
                return res.status(200).json(data);
            } else {
                // OTP is wrong - return actual error
                console.log('❌ OTP Verification Failed:', data.error_message || data.message);
                return res.status(200).json(data);
            }
            
        } catch (error) {
            console.error('❌ Verify OTP Error:', error);
            return res.status(500).json({ 
                error: error.message,
                code: 500
            });
        }
    }

    // ==========================================
    // 🔥 OTP-LESS LOGIN
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/otp-less/')) {
        try {
            console.log('🔐 OTP-LESS REQUEST');
            
            const rawBody = getRawBody(req);

            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            const fetchOptions = {
                method: method,
                headers: headers,
                timeout: 30000,
            };

            if (rawBody) {
                fetchOptions.body = rawBody;
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            let data = await response.json();

            if (data && !data.error_code) {
                data.access_token = PREMIUM.authorization.replace('jwt ', '');
                data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
                
                if (data.user) {
                    data.user.has_premium = true;
                    data.user.is_user_anonymous = false;
                    data.user.is_free_trial_period = true;
                    data.user.is_existing_subscriber = true;
                    
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
                
                data.success = true;
                data.code = 200;
            }

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('❌ OTP-LESS Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 GET SESSION TOKEN
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            console.log('🎫 SESSION TOKEN REQUEST');
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            let body = null;
            if (method !== 'GET' && method !== 'HEAD' && req.body) {
                body = getRawBody(req);
            }

            const fetchOptions = {
                method: method,
                headers: headers,
                timeout: 30000,
            };

            if (body) {
                fetchOptions.body = body;
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            let data = await response.json();
            
            console.log('📥 Session Response:', JSON.stringify(data, null, 2));

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
            
            data.access_token = PREMIUM.authorization.replace('jwt ', '');
            data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
            data.code = 200;
            data.success = true;

            injectBadBoyBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('❌ Session Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            console.log('⚙️ MASTER CONFIG REQUEST');
            
            const headers = buildPremiumHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers,
                timeout: 30000,
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
    // 🏠 HOME / SHOW DATA
    // ==========================================
    if (urlPath.includes('/api/v3/home/') || urlPath.includes('/api/v2/home/') || 
        urlPath.includes('/api/v1.0/show/') || urlPath.includes('/category/') ||
        urlPath.includes('/search')) {
        try {
            const headers = buildPremiumHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers,
                timeout: 30000,
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
    // 🔓 UNLOCK / ORDER / PAYMENT
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
    // 📊 ANALYTICS / TRACKING
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
            message: "OTP Verification Fixed! Raw body preserved!",
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
    // 🔄 ALL OTHER REQUESTS
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
            fetchOptions.body = getRawBody(req);
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
