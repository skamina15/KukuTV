// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION)
// 🔥 FIXED - PROXY ACCOUNT LOGIN
// ==========================================

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.kukufm.com";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ==========================================
    // 🔥 PROXY'S PREMIUM ACCOUNT (HARDCODED)
    // ==========================================
    const PROXY_ACCOUNT = {
        // 🔥 PREMIUM TOKEN
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
    // 🔥 BUILD PROXY PREMIUM HEADERS
    // ==========================================
    function buildProxyHeaders() {
        return {
            'authorization': PROXY_ACCOUNT.authorization,
            'device-id': PROXY_ACCOUNT.device_id,
            'advertising-id': PROXY_ACCOUNT.advertising_id,
            'android_id': PROXY_ACCOUNT.android_id,
            'user-agent': PROXY_ACCOUNT.user_agent,
            'package-name': PROXY_ACCOUNT.package_name,
            'app-version': PROXY_ACCOUNT.app_version,
            'build-number': PROXY_ACCOUNT.build_number,
            'client-country': PROXY_ACCOUNT.client_country,
            'lang': PROXY_ACCOUNT.lang,
            'install-source': 'google_play',
            'content-type': 'application/json; charset=UTF-8',
            'accept': 'application/json',
            'accept-charset': 'UTF-8',
        };
    }

    // ==========================================
    // 🔥 GET PROXY ACCOUNT SESSION RESPONSE
    // ==========================================
    function getProxySessionResponse() {
        const now = new Date().toISOString();
        const accessToken = PROXY_ACCOUNT.authorization.replace('jwt ', '');
        
        return {
            code: 200,
            success: true,
            status: "success",
            message: "Login successful [ BAD BOY ]",
            
            // 🔥 IMPORTANT: Session token must be in this format
            access_token: accessToken,
            refresh_token: accessToken,
            token_type: "Bearer",
            expires_in: 86400,
            
            // 🔥 USER DATA - Must be complete
            user: {
                id: parseInt(PROXY_ACCOUNT.user_id),
                user_id: parseInt(PROXY_ACCOUNT.user_id),
                name: "BAD BOY Premium",
                email: "badboy@premium.com",
                phone: "+918918753244",
                phone_number: "+918918753244",
                country_code: "+91",
                is_phone_verified: true,
                is_email_verified: false,
                
                // 🔥 PREMIUM FLAGS - CRITICAL
                has_premium: true,
                is_user_anonymous: false,
                is_free_trial_period: true,
                is_existing_subscriber: true,
                is_subscription_active: true,
                subscription_status: "active",
                subscription_type: "lifetime",
                plan_name: "Lifetime Premium [ BAD BOY ]",
                valid_till: "2099-12-31",
                
                // 🔥 PROFILE
                profile: {
                    id: parseInt(PROXY_ACCOUNT.sub_profile_id),
                    user_id: parseInt(PROXY_ACCOUNT.user_id),
                    name: "BAD BOY Premium",
                    bio: "🔥 Premium User",
                    profile_pic: "https://i.pravatar.cc/300",
                    unique_id: PROXY_ACCOUNT.unique_id,
                    is_verified: true,
                    is_active: true
                },
                
                // 🔥 SUBSCRIPTIONS
                user_subscriptions: [{
                    id: "sub_" + Date.now(),
                    subscription_id: "BB_" + Date.now(),
                    user_id: parseInt(PROXY_ACCOUNT.user_id),
                    status: "Active",
                    plan_name: "Lifetime Premium [ BAD BOY ]",
                    plan_amount: 0,
                    currency: "INR",
                    valid_from: now,
                    valid_till: "2099-12-31T23:59:59Z",
                    is_recurring: false,
                    is_active: true,
                    is_trial: false,
                    payment_status: "paid"
                }],
                
                // 🔥 PREFERENCES
                preferences: {
                    language: "english",
                    country: "IN",
                    notifications: true,
                    dark_mode: false
                },
                
                // 🔥 ADDITIONAL FIELDS
                created_at: now,
                updated_at: now,
                last_login: now,
                is_active: true,
                is_blocked: false
            }
        };
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
    // 🔥 VERIFY OTP - RETURN PROXY ACCOUNT
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            // Try to verify, but ignore result
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

                await fetch(targetBaseUrl + urlPath, fetchOptions);
            } catch(e) {
                // Ignore errors
            }

            // 🔥 ALWAYS RETURN PROXY ACCOUNT
            console.log('✅ Returning PROXY account after OTP');
            const proxyResponse = getProxySessionResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
            
        } catch (error) {
            console.log('⚠️ OTP verify error, returning PROXY account');
            const proxyResponse = getProxySessionResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
        }
    }

    // ==========================================
    // 🔥 SESSION TOKEN - MAIN FIX
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            // Forward to real API with proxy headers
            const headers = buildProxyHeaders();
            delete headers['accept-encoding'];
            delete headers['content-length'];
            delete headers['host'];

            const fetchOptions = {
                method: 'POST',
                headers: headers,
                timeout: 30000,
            };

            if (req.body) {
                fetchOptions.body = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body).toString();
            }

            // Try real API
            try {
                const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
                if (response.status === 200) {
                    const data = await response.json();
                    
                    // If we got data, inject proxy account
                    if (data && data.user) {
                        data.user.id = parseInt(PROXY_ACCOUNT.user_id);
                        data.user.user_id = parseInt(PROXY_ACCOUNT.user_id);
                        data.user.has_premium = true;
                        data.user.is_user_anonymous = false;
                        data.user.is_free_trial_period = true;
                        data.user.is_existing_subscriber = true;
                        data.user.is_subscription_active = true;
                        
                        if (!data.user.user_subscriptions || data.user.user_subscriptions.length === 0) {
                            data.user.user_subscriptions = [{
                                status: "Active",
                                valid_till: "2099-12-31",
                                plan_name: "Lifetime [ BAD BOY ] Premium",
                                is_recurring: false,
                                plan_amount: 0
                            }];
                        }
                        
                        data.access_token = PROXY_ACCOUNT.authorization.replace('jwt ', '');
                        data.refresh_token = PROXY_ACCOUNT.authorization.replace('jwt ', '');
                        data.code = 200;
                        data.success = true;
                        
                        injectBadBoyBranding(data);
                        return res.status(200).json(data);
                    }
                }
            } catch(e) {
                console.log('⚠️ Session API error, using mock');
            }

            // 🔥 RETURN COMPLETE PROXY SESSION
            console.log('✅ Returning PROXY session');
            const proxyResponse = getProxySessionResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
            
        } catch (error) {
            console.log('⚠️ Session error, returning PROXY account');
            const proxyResponse = getProxySessionResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            const headers = buildProxyHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            if (data.user_data) {
                data.user_data.has_premium = true;
                data.user_data.is_anonymous = false;
                data.user_data.is_existing_subscriber = true;
                data.user_data.user_id = parseInt(PROXY_ACCOUNT.user_id);
                
                if (data.user_data.user) {
                    data.user_data.user.id = parseInt(PROXY_ACCOUNT.user_id);
                    data.user_data.user.user_id = parseInt(PROXY_ACCOUNT.user_id);
                    data.user_data.user.has_premium = true;
                    data.user_data.user.is_free_trial_period = true;
                    data.user_data.user.is_existing_subscriber = true;
                    data.user_data.user.is_subscription_active = true;
                    
                    if (!data.user_data.user.user_subscriptions || 
                        data.user_data.user.user_subscriptions.length === 0) {
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
            return res.status(200).json({
                user_data: {
                    has_premium: true,
                    is_anonymous: false,
                    is_existing_subscriber: true,
                    user_id: parseInt(PROXY_ACCOUNT.user_id),
                    user: {
                        id: parseInt(PROXY_ACCOUNT.user_id),
                        user_id: parseInt(PROXY_ACCOUNT.user_id),
                        has_premium: true,
                        is_free_trial_period: true,
                        is_existing_subscriber: true,
                        is_subscription_active: true,
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
            const headers = buildProxyHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            injectBadBoyBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(200).json({
                data: [],
                success: true,
                message: "Home data [ BAD BOY ]"
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
                    jsonData.idToken = PROXY_ACCOUNT.authorization.replace('jwt ', '');
                    jsonData.refreshToken = PROXY_ACCOUNT.authorization.replace('jwt ', '');
                    jsonData.localId = PROXY_ACCOUNT.user_id;
                    return res.status(200).json(jsonData);
                }
            } catch(e) {}
            
            return res.status(response.status).send(data);
        } catch (e) {
            return res.status(200).json({ 
                kind: "identitytoolkit#VerifyCustomTokenResponse", 
                registered: true,
                idToken: PROXY_ACCOUNT.authorization.replace('jwt ', ''),
                localId: PROXY_ACCOUNT.user_id
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
            message: "🔴 PROXY ACCOUNT LOGIN FIXED",
            proxy_account: {
                user_id: PROXY_ACCOUNT.user_id,
                name: "BAD BOY Premium",
                plan: "Lifetime Premium",
                valid_till: "2099-12-31"
            }
        });
    }

    // ==========================================
    // 🔄 ALL OTHER REQUESTS
    // ==========================================
    try {
        const headers = buildProxyHeaders();
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
            
            if (data.user) {
                data.user.id = parseInt(PROXY_ACCOUNT.user_id);
                data.user.user_id = parseInt(PROXY_ACCOUNT.user_id);
                data.user.has_premium = true;
                data.user.is_user_anonymous = false;
                data.user.is_free_trial_period = true;
                data.user.is_existing_subscriber = true;
                data.user.is_subscription_active = true;
                
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
            
            data.access_token = PROXY_ACCOUNT.authorization.replace('jwt ', '');
            data.refresh_token = PROXY_ACCOUNT.authorization.replace('jwt ', '');
            
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
