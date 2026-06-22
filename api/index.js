export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    // ✅ Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-invoke-path');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log("🔹 API Hit:", urlPath);

    // ============================================================
    // 🎯 SESSION TOKEN - EXACT ORIGINAL FORMAT
    // ============================================================
    if (urlPath.includes('/users/get-session-token')) {
        try {
            // 🔥 PEHLE ORIGINAL API SE FETCH KARO
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = {
                'User-Agent': 'KukuFM/3.6.0 (Android)',
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': req.headers.authorization || '',
                'x-invoke-path': urlPath
            };

            // Body ko URLSearchParams mein convert karo
            let body = req.body;
            let bodyString = '';
            if (body && typeof body === 'object') {
                const params = new URLSearchParams();
                for (let key in body) {
                    if (body.hasOwnProperty(key) && body[key] !== undefined) {
                        params.append(key, body[key]);
                    }
                }
                bodyString = params.toString();
            }

            console.log("📤 Sending request to KukuFM...");

            const response = await fetch(realApiUrl, {
                method: 'POST',
                headers: headers,
                body: bodyString
            });

            let data = await response.json();
            console.log("📥 Received from KukuFM:", Object.keys(data));

            // 🔥 AB US DATA KO MODIFY KARO - EXACT FORMAT RAKH KE
            if (data && data.user) {
                // User object mein premium add karo
                data.user.has_premium = true;
                data.user.is_premium = true;
                data.user.premium_status = "ACTIVE";
                data.user.premium_type = "🔥 BAD BOY PREMIUM 🔥";
                data.user.premium_valid_till = "31 DECEMBER 9999";
                data.user.is_badboy = true;
                data.user.badboy_tag = "[ BAD BOY ]";
                
                // Name mein Bad Boy tag
                if (data.user.name) {
                    data.user.name = data.user.name + " 🔥[ BAD BOY ]";
                } else {
                    data.user.name = "🔥 BadBoy Premium 🔥";
                }

                // Premium features add karo
                data.user.premium_features = [
                    "🎧 Unlimited Podcasts",
                    "🚫 No Ads",
                    "📱 High Quality Audio",
                    "🎁 Exclusive Bad Boy Content"
                ];
            }

            // Global flags
            data.has_premium = true;
            data.is_badboy_premium = true;
            data.premium_activated = true;
            data.badboy_mode = true;

            // Tokens extend karo
            if (data.access_token) {
                data.access_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
            }
            if (data.refresh_token) {
                data.refresh_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
            }

            console.log("✅ Premium added to session token");
            return res.status(200).json(data);

        } catch (error) {
            console.error("❌ Session Error:", error.message);
            
            // 🔥 FALLBACK - EXACT FORMAT
            return res.status(200).json({
                refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
                access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
                access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
                refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
                user: {
                    id: 146060028,
                    sub_profile_id: null,
                    name: "🔥 BadBoy Premium 🔥",
                    email: "badboy@kukufm.com",
                    avatar: {
                        "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                        "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                        "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                        "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
                    },
                    uuid: "badboy_01f37dc7d2c249958116f5db0a77a515",
                    has_premium: true,
                    is_premium: true,
                    premium_type: "🔥 BAD BOY PREMIUM 🔥",
                    premium_status: "ACTIVE",
                    premium_valid_till: "31 DECEMBER 9999",
                    username: "badboy_premium",
                    phone: "+919999999999",
                    joined_on: Math.floor(Date.now() / 1000),
                    firebase_uid: "badboy_Vd2wAmCWBCULJ3n57Hxnzi9p1oo2",
                    is_badboy: true,
                    badboy_tag: "[ BAD BOY ]",
                    premium_features: [
                        "🎧 Unlimited Podcasts",
                        "🚫 No Ads",
                        "📱 High Quality Audio",
                        "🎁 Exclusive Bad Boy Content"
                    ]
                },
                select_multi_profile: false,
                has_premium: true,
                is_badboy_premium: true,
                premium_activated: true,
                badboy_mode: true,
                badboy_version: "2.0"
            });
        }
    }

    // ============================================================
    // 👤 USER PROFILE - EXACT FORMAT
    // ============================================================
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile')) {
        
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = {
                'User-Agent': 'KukuFM/3.6.0 (Android)',
                'Accept': 'application/json',
                'Authorization': req.headers.authorization || '',
                'x-invoke-path': urlPath
            };

            const response = await fetch(realApiUrl, {
                method: 'GET',
                headers: headers
            });

            let data = await response.json();
            
            // 🔥 EXISTING DATA KO MODIFY KARO
            if (data) {
                data.has_premium = true;
                data.is_premium = true;
                data.premium_status = "ACTIVE [ BAD BOY ]";
                data.premium_plan = "🔥 BAD BOY PREMIUM 🔥";
                data.premium_valid_till = "31 DECEMBER 9999";
                data.badboy_mode = true;
                data.is_badboy = true;
                data.badboy_tag = "[ BAD BOY ]";
                
                if (data.name) {
                    data.name = data.name + " 🔥[ BAD BOY ]";
                }
                
                // Avatar ensure karo
                if (!data.avatar) {
                    data.avatar = {
                        "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                        "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                        "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                        "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
                    };
                }
            }

            return res.status(200).json(data);

        } catch (error) {
            // FALLBACK PROFILE
            return res.status(200).json({
                id: 146060028,
                name: "🔥 BadBoy Premium 🔥",
                email: "badboy@kukufm.com",
                has_premium: true,
                is_premium: true,
                premium_status: "ACTIVE [ BAD BOY ]",
                premium_plan: "🔥 BAD BOY PREMIUM 🔥",
                premium_valid_till: "31 DECEMBER 9999",
                badboy_mode: true,
                is_badboy: true,
                badboy_tag: "[ BAD BOY ]",
                avatar: {
                    "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                    "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                    "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                    "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
                }
            });
        }
    }

    // ============================================================
    // ✅ PREMIUM CHECK
    // ============================================================
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan')) {
        
        return res.status(200).json({
            has_premium: true,
            is_premium: true,
            premium_status: "ACTIVE [ BAD BOY ]",
            premium_plan: "🔥 BAD BOY PREMIUM 🔥",
            premium_valid_till: "31 DECEMBER 9999",
            badboy_mode: true,
            is_badboy: true,
            badboy_tag: "[ BAD BOY ]",
            features: [
                "🎧 Unlimited Podcasts",
                "🚫 No Ads",
                "📱 High Quality Audio",
                "🎁 Exclusive Bad Boy Content",
                "⚡ Priority Access"
            ]
        });
    }

    // ============================================================
    // 📦 CONTENT APIS
    // ============================================================
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/content') ||
        urlPath.includes('/recommend') || urlPath.includes('/search')) {
        
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            const headers = {
                'User-Agent': 'KukuFM/3.6.0 (Android)',
                'Accept': 'application/json',
                'Authorization': req.headers.authorization || '',
                'x-invoke-path': urlPath
            };

            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers
            });

            let data = await response.json();
            data = addBadBoyToContent(data);
            
            return res.status(200).json(data);

        } catch (error) {
            return res.status(200).json({
                success: true,
                message: "🔥 Bad Boy Mode Active",
                data: [],
                has_premium: true,
                badboy_mode: true
            });
        }
    }

    // ============================================================
    // 📊 ANALYTICS
    // ============================================================
    if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
        urlPath.includes('/log') || urlPath.includes('/heartbeat')) {
        
        return res.status(200).json({ 
            success: true, 
            status: "SUCCESS"
        });
    }

    // ============================================================
    // 🌐 ALL OTHER APIs
    // ============================================================
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
        const headers = {
            'User-Agent': 'KukuFM/3.6.0 (Android)',
            'Accept': 'application/json',
            'Authorization': req.headers.authorization || '',
            'x-invoke-path': urlPath
        };

        const response = await fetch(targetUrl, {
            method: method,
            headers: headers,
        });

        let data = await response.json();
        data._badboy_mode = true;
        return res.status(200).json(data);

    } catch (error) {
        return res.status(200).json({ 
            success: true,
            _badboy_mode: true,
            message: "Bad Boy Mode Active"
        });
    }
}

// ============= 🔥 HELPER FUNCTIONS =============

function addBadBoyToContent(data) {
    if (!data) return { has_premium: true, badboy_mode: true };
    if (typeof data !== 'object') return data;
    
    const result = { ...data };
    
    // Premium flags
    result.has_premium = true;
    result.badboy_mode = true;
    result._premium_unlocked = true;
    
    // Tag items
    const tagFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 
                       'description', 'label', 'heading', 'subtitle', 'display_name'];
    
    function tagItem(item) {
        if (!item || typeof item !== 'object') return item;
        const tagged = { ...item };
        tagFields.forEach(field => {
            if (tagged[field] && typeof tagged[field] === 'string') {
                if (!tagged[field].includes('[ BAD BOY ]')) {
                    tagged[field] = tagged[field] + ' [ BAD BOY ]';
                }
            }
        });
        tagged._premium_unlocked = true;
        return tagged;
    }
    
    if (Array.isArray(data)) {
        return data.map(tagItem);
    }
    
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows', 'list'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(tagItem);
        }
    });
    
    return result;
}
