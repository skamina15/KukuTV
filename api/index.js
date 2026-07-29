// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION)
// 🔥 FINAL FIX - SESSION TOKEN LOOP
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
    // 🔥 GET COMPLETE USER RESPONSE
    // ==========================================
    function getCompleteUserResponse() {
        const now = new Date().toISOString();
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 50);

        return {
            code: 200,
            success: true,
            message: "Login successful [BAD BOY]",
            status: "success",
            user: {
                id: parseInt(PREMIUM.user_id),
                name: "BAD BOY Premium",
                email: "badboy@premium.com",
                phone: "+918918753244",
                has_premium: true,
                is_user_anonymous: false,
                is_free_trial_period: true,
                is_existing_subscriber: true,
                is_subscription_active: true,
                subscription_type: "lifetime",
                plan_name: "Lifetime Premium [BAD BOY]",
                valid_till: "2099-12-31",
                created_at: now,
                updated_at: now,
                profile: {
                    id: parseInt(PREMIUM.sub_profile_id),
                    name: "BAD BOY Premium",
                    bio: "Premium User [BAD BOY]",
                    profile_pic: "https://i.pravatar.cc/300",
                    unique_id: PREMIUM.unique_id,
                    is_verified: true
                },
                user_subscriptions: [{
                    id: "sub_" + Date.now(),
                    subscription_id: "BB_" + Date.now(),
                    status: "Active",
                    valid_from: now,
                    valid_till: "2099-12-31T23:59:59Z",
                    plan_name: "Lifetime Premium [BAD BOY]",
                    is_recurring: false,
                    plan_amount: 0,
                    currency: "INR",
                    is_active: true,
                    is_trial: false
                }],
                preferences: {
                    language: "english",
                    country: "IN",
                    notifications: true,
                    dark_mode: false
                },
                stats: {
                    listening_time: 0,
                    shows_completed: 0,
                    downloads: 0
                }
            },
            access_token: PREMIUM.authorization.replace('jwt ', ''),
            refresh_token: PREMIUM.authorization.replace('jwt ', ''),
            token_type: "Bearer",
            expires_in: 3600,
            refresh_expires_in: 86400
        };
    }

    // ==========================================
    // 🔥 SESSION TOKEN - FIXED
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            console.log('🎫 SESSION TOKEN');
            
            // Get body if any
            let body = null;
            if (req.body) {
                if (typeof req.body === 'string') {
                    body = req.body;
                } else if (typeof req.body === 'object') {
                    body = new URLSearchParams(req.body).toString();
                }
            }

            // Try to forward to real API first
            try {
                const headers = { ...req.headers };
                delete headers['accept-encoding'];
                delete headers['content-length'];
                delete headers['host'];
                delete headers['connection'];

                const fetchOptions = {
                    method: 'POST',
                    headers: headers,
                    timeout: 30000,
                };

                if (body) {
                    fetchOptions.body = body;
                }

                console.log('📤 Forwarding session to:', targetBaseUrl + urlPath);
                const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
                
                if (response.status === 200) {
                    const data = await response.json();
                    console.log('📥 Session response received');
                    
                    // If we got valid data, inject premium
                    if (data && data.user) {
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
                        
                        data.access_token = PREMIUM.authorization.replace('jwt ', '');
                        data.refresh_token = PREMIUM.authorization.replace('jwt ', '');
                        data.code = 200;
                        data.success = true;
                        
                        injectBadBoyBranding(data);
                        return res.status(200).json(data);
                    }
                }
            } catch (forwardError) {
                console.log('⚠️ Session forward failed, using mock');
            }

            // If forward fails, return complete mock response
            console.log('✅ Returning mock session');
            const mockResponse = getCompleteUserResponse();
            injectBadBoyBranding(mockResponse);
            return res.status(200).json(mockResponse);

        } catch (error) {
            console.error('❌ Session Error:', error);
            const mockResponse = getCompleteUserResponse();
            injectBadBoyBranding(mockResponse);
            return res.status(200).json(mockResponse);
        }
    }

    // ==========================================
    // 🔥 VERIFY OTP - FIXED
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            console.log('🔐 VERIFY OTP');
            
            // Try to verify with real API
            try {
                const headers = { ...req.headers };
                delete headers['accept-encoding'];
                delete headers['content-length'];
                delete headers['host'];
                delete headers['connection'];

                const fetchOptions = {
                    method: 'POST',
                    headers: headers,
                    timeout: 30000,
                };

                if (req.body) {
                    if (typeof req.body === 'string') {
                        fetchOptions.body = req.body;
                    } else if (typeof req.body === 'object') {
                        fetchOptions.body = JSON.stringify(req.body);
                    }
                }

                console.log('📤 Forwarding OTP verification to:', targetBaseUrl + urlPath);
                const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
                
                if (response.status === 200) {
                    const data = await response.json();
                    console.log('📥 OTP Response:', JSON.stringify(data, null, 2));
                    
                    // Check if verification was successful
                    if (!data.error_code && data.message !== 'INVALID_REQUEST') {
                        const premiumResponse = getCompleteUserResponse();
                        if (data.user) {
                            premiumResponse.user = { ...premiumResponse.user, ...data.user };
                        }
                        injectBadBoyBranding(premiumResponse);
                        return res.status(200).json(premiumResponse);
                    } else {
                        // OTP wrong - but we still let user in with premium (bypass)
                        console.log('⚠️ OTP wrong but bypassing');
                    }
                }
            } catch (forwardError) {
                console.log('⚠️ OTP verify forward failed, using mock');
            }

            // Always return premium response - bypass OTP check
            console.log('✅ Returning premium response');
            const premiumResponse = getCompleteUserResponse();
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);

        } catch (error) {
            console.error('❌ Verify OTP Error:', error);
            const premiumResponse = getCompleteUserResponse();
            injectBadBoyBranding(premiumResponse);
            return res.status(200).json(premiumResponse);
        }
    }

    // ==========================================
    // 🔥 SEND OTP
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/send-otp/')) {
        try {
            console.log('📱 SEND OTP');
            
            const headers = { ...req.headers };
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];
            delete headers['connection'];

            const fetchOptions = {
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            if (req.body) {
                if (typeof req.body === 'string') {
                    fetchOptions.body = req.body;
                } else if (typeof req.body === 'object') {
                    fetchOptions.body = JSON.stringify(req.body);
                }
            }

            const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
            const data = await response.json();
            
            return res.status(response.status).json(data);
        } catch (error) {
            // Return mock success even on error
            return res.status(200).json({
                message: "OTP sent successfully",
                phone_number: "+918918753244",
                verification_id: Date.now(),
                otp_length: 4,
                success: true
            });
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            console.log('⚙️ MASTER CONFIG');
            
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
            // Return mock config
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
            return res.status(200).json({
                data: [],
                success: true,
                message: "Home data [BAD BOY]"
            });
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
            message: "Session loop fixed! Complete user response.",
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
        console.error('❌ Proxy Error:', error);
        return res.status(500).json({
            code: 500,
            message: "Proxy Error: " + error.message
        });
    }
}
