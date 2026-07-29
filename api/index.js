// ==========================================
// 🎯 KUKU FM PROXY (BAD BOY EDITION)
// 🔥 FORCE PROXY PREMIUM ACCOUNT - IGNORE USER LOGIN
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
        
        // 🔥 PROXY ACCOUNT DETAILS
        user_id: 374980483,
        sub_profile_id: 49448315,
        unique_id: "7047bbaa-dedb-467c-a5fd-acb5f4a2861b",
        
        // 🔥 DEVICE DETAILS
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
    // 🔥 GET PROXY ACCOUNT RESPONSE
    // ==========================================
    function getProxyAccountResponse() {
        const now = new Date().toISOString();
        
        return {
            code: 200,
            success: true,
            message: "Login successful [ BAD BOY ]",
            status: "success",
            
            // 🔥 THIS IS THE PROXY'S PREMIUM ACCOUNT
            user: {
                id: PROXY_ACCOUNT.user_id,
                name: "BAD BOY Premium [ BAD BOY ]",
                email: "badboy@premium.com",
                phone: "+918918753244",
                has_premium: true,
                is_user_anonymous: false,
                is_free_trial_period: true,
                is_existing_subscriber: true,
                is_subscription_active: true,
                subscription_type: "lifetime",
                plan_name: "Lifetime Premium [ BAD BOY ]",
                valid_till: "2099-12-31",
                created_at: now,
                updated_at: now,
                
                profile: {
                    id: PROXY_ACCOUNT.sub_profile_id,
                    name: "BAD BOY Premium [ BAD BOY ]",
                    bio: "🔥 Premium User [ BAD BOY ]",
                    profile_pic: "https://i.pravatar.cc/300",
                    unique_id: PROXY_ACCOUNT.unique_id,
                    is_verified: true
                },
                
                user_subscriptions: [{
                    id: "sub_" + Date.now(),
                    subscription_id: "BB_" + Date.now(),
                    status: "Active",
                    valid_from: now,
                    valid_till: "2099-12-31T23:59:59Z",
                    plan_name: "Lifetime Premium [ BAD BOY ]",
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
                }
            },
            
            // 🔥 PROXY TOKENS
            access_token: PROXY_ACCOUNT.authorization.replace('jwt ', ''),
            refresh_token: PROXY_ACCOUNT.authorization.replace('jwt ', ''),
            token_type: "Bearer",
            expires_in: 3600,
            refresh_expires_in: 86400
        };
    }

    // ==========================================
    // 🔥 SEND OTP - FORWARD BUT IGNORE RESPONSE
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/send-otp/')) {
        try {
            // Just forward the request, but we don't care about response
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
            // Even if OTP send fails, return success
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
    // 🔥 VERIFY OTP - IGNORE USER, RETURN PROXY ACCOUNT
    // ==========================================
    if (urlPath.includes('/api/v1.0/users/auth/verify-otp/')) {
        try {
            // Forward to real API but we don't care about result
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

            // Try to verify, but ignore result
            try {
                await fetch(targetBaseUrl + urlPath, fetchOptions);
            } catch(e) {
                // Ignore errors
            }

            // 🔥 ALWAYS RETURN PROXY ACCOUNT (NOT USER'S ACCOUNT)
            console.log('✅ Returning PROXY premium account');
            const proxyResponse = getProxyAccountResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
            
        } catch (error) {
            // Even on error, return proxy account
            console.log('⚠️ Error, returning PROXY account');
            const proxyResponse = getProxyAccountResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
        }
    }

    // ==========================================
    // 🔥 SESSION TOKEN - ALWAYS RETURN PROXY ACCOUNT
    // ==========================================
    if (urlPath.includes('/api/v1.1/users/get-session-token/')) {
        try {
            // Forward with proxy headers but we don't care
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

            // Try to get session, but ignore result
            try {
                await fetch(targetBaseUrl + urlPath, fetchOptions);
            } catch(e) {
                // Ignore errors
            }

            // 🔥 ALWAYS RETURN PROXY ACCOUNT
            console.log('✅ Returning PROXY session');
            const proxyResponse = getProxyAccountResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
            
        } catch (error) {
            console.log('⚠️ Session error, returning PROXY account');
            const proxyResponse = getProxyAccountResponse();
            injectBadBoyBranding(proxyResponse);
            return res.status(200).json(proxyResponse);
        }
    }

    // ==========================================
    // 🔥 MASTER CONFIG - FORCE PROXY ACCOUNT
    // ==========================================
    if (urlPath.includes('/api/v1.0/config/master/android/')) {
        try {
            const headers = buildProxyHeaders();
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            // 🔥 FORCE PROXY ACCOUNT IN CONFIG
            if (data.user_data) {
                data.user_data.has_premium = true;
                data.user_data.is_anonymous = false;
                data.user_data.is_existing_subscriber = true;
                data.user_data.user_id = PROXY_ACCOUNT.user_id;
                
                if (data.user_data.user) {
                    data.user_data.user.id = PROXY_ACCOUNT.user_id;
                    data.user_data.user.has_premium = true;
                    data.user_data.user.is_free_trial_period = true;
                    data.user_data.user.is_existing_subscriber = true;
                    
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
            // Return proxy config on error
            return res.status(200).json({
                user_data: {
                    has_premium: true,
                    is_anonymous: false,
                    is_existing_subscriber: true,
                    user_id: PROXY_ACCOUNT.user_id,
                    user: {
                        id: PROXY_ACCOUNT.user_id,
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
    // 🏠 HOME / SEARCH - USE PROXY HEADERS
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
    // 🔓 UNLOCK / PAYMENT - ALWAYS SUCCESS
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
            
            try {
                const jsonData = JSON.parse(data);
                if (jsonData && jsonData.idToken) {
                    // 🔥 REPLACE WITH PROXY TOKEN
                    jsonData.idToken = PROXY_ACCOUNT.authorization.replace('jwt ', '');
                    jsonData.refreshToken = PROXY_ACCOUNT.authorization.replace('jwt ', '');
                    jsonData.localId = String(PROXY_ACCOUNT.user_id);
                    return res.status(200).json(jsonData);
                }
            } catch(e) {}
            
            return res.status(response.status).send(data);
        } catch (e) {
            return res.status(200).json({ 
                kind: "identitytoolkit#VerifyCustomTokenResponse", 
                registered: true,
                idToken: PROXY_ACCOUNT.authorization.replace('jwt ', ''),
                localId: String(PROXY_ACCOUNT.user_id)
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
            status: "🔥 Proxy Running",
            brand: "BAD BOY EDITION",
            message: "🔴 ANY USER LOGIN → PROXY PREMIUM ACCOUNT",
            proxy_account: {
                user_id: PROXY_ACCOUNT.user_id,
                name: "BAD BOY Premium",
                plan: "Lifetime Premium",
                valid_till: "2099-12-31"
            },
            endpoints: {
                send_otp: "POST /api/v1.0/users/auth/send-otp/",
                verify_otp: "POST /api/v1.0/users/auth/verify-otp/",
                session: "POST /api/v1.1/users/get-session-token/"
            }
        });
    }

    // ==========================================
    // 🔄 ALL OTHER REQUESTS - USE PROXY HEADERS
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
            
            // 🔥 FORCE PROXY ACCOUNT IN ALL RESPONSES
            if (data.user) {
                data.user.id = PROXY_ACCOUNT.user_id;
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
