// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION)
// 🔥 OTP SUBMIT FIX - PROPER RESPONSE FORMAT
// ==========================================

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.kukufm.com";

    // ==========================================
    // 🔥 HARDCORE PREMIUM TOKEN
    // ==========================================
    const PREMIUM = {
        authorization: "jwt eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNzQ5ODA0ODMsImV4cCI6MTc4NTMyMDc0MSwic3ViX3Byb2ZpbGVfaWQiOjQ5NDQ4MzE1LCJ1bmlxdWVfaWQiOiI3MDQ3YmJhYS1kZWRiLTQ2N2MtYTVmZC1hY2I1ZjRhMjg2MWIifQ.QZ97fL0LNPULpYs4WcUYbWBC3tY6astiSpmP8yBHYwfFD2Ay9EOy6ydiTCCME7PxgCTstfsb-nPGtdrSSg8E-A",
        user_id: "374980483",
        sub_profile_id: "49448315",
        unique_id: "7047bbaa-dedb-467c-a5fd-acb5f4a2861b",
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
    // 🔥 GET FULL USER RESPONSE
    // ==========================================
    function getPremiumUserResponse(originalData = {}) {
        const user = {
            id: PREMIUM.user_id,
            name: "BAD BOY Premium",
            email: "badboy@premium.com",
            phone: "+918918753244",
            has_premium: true,
            is_user_anonymous: false,
            is_free_trial_period: true,
            is_existing_subscriber: true,
            subscription_type: "lifetime",
            plan_name: "Lifetime Premium [BAD BOY]",
            valid_till: "2099-12-31",
            user_subscriptions: [{
                id: "sub_" + Date.now(),
                status: "Active",
                valid_till: "2099-12-31",
                plan_name: "Lifetime Premium [BAD BOY]",
                is_recurring: false,
                plan_amount: 0,
                subscription_id: "BB_" + Date.now(),
                start_date: new Date().toISOString(),
                end_date: "2099-12-31T23:59:59Z"
            }],
            profile: {
                id: PREMIUM.sub_profile_id,
                name: "BAD BOY Premium",
                bio: "Premium User [BAD BOY]",
                profile_pic: "https://i.pravatar.cc/300",
                unique_id: PREMIUM.unique_id
            },
            preferences: {
                language: "english",
                country: "IN",
                notifications: true
            }
        };

        // Merge with original data if provided
        if (originalData && typeof originalData === 'object') {
            return {
                ...originalData,
                user: { ...user, ...(originalData.user || {}) },
                access_token: PREMIUM.authorization.replace('jwt ', ''),
                refresh_token: PREMIUM.authorization.replace('jwt ', ''),
                code: 200,
                success: true,
                message: "Login successful [BAD BOY]",
                status: "success"
            };
        }

        return {
            code: 200,
            success: true,
            message: "Login successful [BAD BOY]",
            status: "success",
            user: user,
            access_token: PREMIUM.authorization.replace('jwt ', ''),
            refresh_token: PREMIUM.authorization.replace('jwt ', ''),
        };
    }

    // ==========================================
    // 🔥 FORWARD REQUEST FUNCTION
    // ==========================================
    async function forwardRequest(url, options = {}) {
        const headers = { ...req.headers };
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        delete headers['connection'];
        
        if (options.premium) {
            const premiumHeaders = buildPremiumHeaders();
            Object.assign(headers, premiumHeaders);
        }

        const fetchOptions = {
            method: method,
            headers: headers,
            timeout: 30000,
        };

        if (method !== 'GET' && method !== 'HEAD') {
            if (req.body) {
                if (typeof req.body === 'string') {
                    fetchOptions.body = req.body;
                } else if (typeof req.body === 'object') {
                    fetchOptions.body = JSON.stringify(req.body);
                } else if (Buffer.isBuffer(req.body)) {
                    fetchOptions.body = req.body;
                }
            }
        }

        try {
            const response = await fetch(targetBaseUrl + url, fetchOptions);
            const contentType = response.headers.get('content-type') || '';
            
            if (contentType.includes('application/json')) {
                const data = await response.json();
                return { status: response.status, data: data, isJson: true };
            } else {
                const buffer = await response.arrayBuffer();
                return { status: response.status, data: Buffer.from(buffer), isJson: false };
            }
        } catch (error) {
            console.error('Forward Error:', error);
            throw error;
        }
    }

    // ==========================================
    // 🔥 SEND OTP
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/send-otp/')) {
        try {
            console.log('📱 SEND OTP');
            const result = await forwardRequest(urlPath);
            
            if (result.isJson) {
                return res.status(result.status).json(result.data);
            } else {
                res.setHeader('Content-Type', 'application/octet-stream');
                return res.status(result.status).send(result.data);
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔥 VERIFY OTP - MAIN FIX
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            console.log('🔐 VERIFY OTP');
            
            // First try to verify with actual API
            try {
                const result = await forwardRequest(urlPath);
                
                if (result.isJson && result.data) {
                    const data = result.data;
                    
                    // Check if OTP verification was successful
                    if (!data.error_code && data.message !== 'INVALID_REQUEST' && data.success !== false) {
                        // Success - inject premium and return full response
                        const premiumResponse = getPremiumUserResponse(data);
                        injectBadBoyBranding(premiumResponse);
                        return res.status(200).json(premiumResponse);
                    } else {
                        // OTP is wrong - return actual error
                        console.log('❌ OTP Wrong:', data.error_message || data.message);
                        return res.status(result.status).json(data);
                    }
                }
            } catch (forwardError) {
                console.log('Forward failed, using mock response');
            }

            // If forward fails or returns error, return mock premium response
            // This ensures app doesn't get stuck
            console.log('✅ Returning premium mock response');
            const premiumResponse = getPremiumUserResponse();
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);

        } catch (error) {
            console.error('❌ Verify OTP Error:', error);
            // Even on error, return premium response to let user in
            const premiumResponse = getPremiumUserResponse();
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
        }
    }

    // ==========================================
    // 🔥 SESSION TOKEN
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            console.log('🎫 SESSION TOKEN');
            
            const result = await forwardRequest(urlPath);
            
            if (result.isJson) {
                let data = result.data;
                
                // If session fails, create new session
                if (!data.user) {
                    data = getPremiumUserResponse();
                } else {
                    // Inject premium into existing session
                    data.user.has_premium = true;
                    data.user.is_user_anonymous = false;
                    data.user.is_free_trial_period = true;
                    
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
                
                data.access_token = PREMIUM.authorization.replace('jwt ', '');
                data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
                data.code = 200;
                data.success = true;
                
                injectBadBoyBranding(data);
                return res.status(200).json(data);
            } else {
                // If not JSON, return premium response
                const premiumResponse = getPremiumUserResponse();
                injectBadBoyBranding(premiumResponse);
                return res.status(200).json(premiumResponse);
            }
        } catch (error) {
            // On error, return premium response
            const premiumResponse = getPremiumUserResponse();
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            console.log('⚙️ MASTER CONFIG');
            const result = await forwardRequest(urlPath, { premium: true });
            
            if (result.isJson) {
                let data = result.data;
                
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
            } else {
                // If not JSON, return premium config
                return res.status(200).json({
                    user_data: {
                        has_premium: true,
                        is_anonymous: false,
                        is_existing_subscriber: true,
                        user: {
                            has_premium: true,
                            is_free_trial_period: true,
                            user_subscriptions: [{
                                status: "Active",
                                valid_till: "2099-12-31",
                                plan_name: "Lifetime [ BAD BOY ] Premium",
                                is_recurring: false,
                                plan_amount: 0
                            }]
                        }
                    }
                });
            }
        } catch (error) {
            return res.status(200).json({
                user_data: {
                    has_premium: true,
                    is_anonymous: false,
                    is_existing_subscriber: true,
                    user: {
                        has_premium: true,
                        is_free_trial_period: true,
                        user_subscriptions: [{
                            status: "Active",
                            valid_till: "2099-12-31",
                            plan_name: "Lifetime [ BAD BOY ] Premium",
                            is_recurring: false,
                            plan_amount: 0
                        }]
                    }
                }
            });
        }
    }

    // ==========================================
    // 🏠 HOME / SEARCH
    // ==========================================
    if (urlPath.includes('/api/v3/home/') || urlPath.includes('/api/v2/home/') || 
        urlPath.includes('/api/v1.0/show/') || urlPath.includes('/category/') ||
        urlPath.includes('/search')) {
        try {
            const result = await forwardRequest(urlPath, { premium: true });
            
            if (result.isJson) {
                injectBadBoyBranding(result.data);
                return res.status(result.status).json(result.data);
            } else {
                res.setHeader('Content-Type', 'application/octet-stream');
                return res.status(result.status).send(result.data);
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🔓 UNLOCK / PAYMENT
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
    // 📱 OTPLESS
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
    // 🔥 FIREBASE
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
    // ☁️ CLOUDFRONT
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
    // 🏠 ROOT
    // ==========================================
    if (urlPath === '/' || urlPath === '') {
        return res.status(200).json({
            status: "🔥 Proxy Running",
            brand: "BAD BOY EDITION",
            message: "OTP Submit Fixed! App will proceed after verification.",
            endpoints: {
                send_otp: "POST /api/v1.0/users/auth/send-otp/",
                verify_otp: "POST /api/v1.0/users/auth/verify-otp/",
                session: "POST /api/v1.1/users/get-session-token/"
            }
        });
    }

    // ==========================================
    // 🔄 DEFAULT FORWARD
    // ==========================================
    try {
        const result = await forwardRequest(urlPath, { premium: true });
        
        if (result.isJson) {
            injectBadBoyBranding(result.data);
            return res.status(result.status).json(result.data);
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
            return res.status(result.status).send(result.data);
        }
    } catch (error) {
        console.error('❌ Proxy Error:', error);
        return res.status(500).json({
            code: 500,
            message: "Proxy Error: " + error.message
        });
    }
}
