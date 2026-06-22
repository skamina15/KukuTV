export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;

    // ✅ CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-invoke-path');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    
    // ✅ Cache Control - Force fresh data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // ✅ PREFLIGHT REQUEST
    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ✅ CHECK KARO - KONSA API HIT HO RAHA
    console.log("🔹 API Hit:", urlPath);
    console.log("🔹 Method:", method);

    // ============================================================
    // 🎯 SESSION TOKEN - MOST IMPORTANT
    // ============================================================
    if (urlPath.includes('/users/get-session-token')) {
        try {
            // 🔥 DIRECT PREMIUM RESPONSE - NO FETCH (KYUKI FETCH FAIL HO RAHA)
            const premiumData = {
                refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
                access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
                access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
                refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
                user: {
                    id: 146060028,
                    sub_profile_id: null,
                    name: "🔥 BadBoy Premium 🔥",
                    email: "badboy@premium.com",
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
                        "🎁 Exclusive Bad Boy Content",
                        "⚡ Priority Access"
                    ]
                },
                select_multi_profile: false,
                has_premium: true,
                is_badboy_premium: true,
                premium_activated: true,
                badboy_mode: true,
                badboy_version: "2.0"
            };

            console.log("✅ Sending Premium Session Token");
            return res.status(200).json(premiumData);
            
        } catch (error) {
            console.error("❌ Session Error:", error);
            // FALLBACK
            return res.status(200).json({
                has_premium: true,
                badboy_mode: true,
                user: {
                    name: "🔥 BadBoy Premium 🔥",
                    has_premium: true,
                    premium_status: "ACTIVE"
                }
            });
        }
    }

    // ============================================================
    // 👤 USER PROFILE - Premium Data
    // ============================================================
    if (urlPath.includes('/users/me') || urlPath.includes('/profile') || 
        urlPath.includes('/get-profile') || urlPath.includes('/user')) {
        
        return res.status(200).json({
            id: 146060028,
            name: "🔥 BadBoy Premium 🔥",
            email: "badboy@premium.com",
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
            },
            premium_features: [
                "🎧 Unlimited Podcasts",
                "🚫 No Ads",
                "📱 High Quality Audio",
                "🎁 Exclusive Bad Boy Content"
            ]
        });
    }

    // ============================================================
    // ✅ PREMIUM CHECK
    // ============================================================
    if (urlPath.includes('/premium') || urlPath.includes('/subscription') || 
        urlPath.includes('/check-premium') || urlPath.includes('/plan') ||
        urlPath.includes('/membership')) {
        
        return res.status(200).json({
            has_premium: true,
            is_premium: true,
            premium_status: "ACTIVE [ BAD BOY ]",
            premium_plan: "🔥 BAD BOY PREMIUM 🔥",
            premium_valid_till: "31 DECEMBER 9999",
            badboy_mode: true,
            is_badboy: true,
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
    // 📦 CONTENT APIs - Try real data, else return dummy
    // ============================================================
    if (urlPath.includes('/episodes') || urlPath.includes('/shows') || 
        urlPath.includes('/podcasts') || urlPath.includes('/audio') ||
        urlPath.includes('/content') || urlPath.includes('/feed') ||
        urlPath.includes('/recommend') || urlPath.includes('/search') ||
        urlPath.includes('/explore') || urlPath.includes('/discover')) {
        
        try {
            const realApiUrl = "https://kukufm.com" + urlPath;
            
            // Simple headers
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Authorization': req.headers.authorization || '',
                'x-invoke-path': urlPath
            };
            
            const response = await fetch(realApiUrl, {
                method: method,
                headers: headers
            });
            
            if (response.ok) {
                let data = await response.json();
                // Add Bad Boy tags
                data = addBadBoyToContent(data);
                return res.status(200).json(data);
            } else {
                // If API fails, return dummy data
                return res.status(200).json({
                    success: true,
                    message: "🔥 Bad Boy Mode Active",
                    data: [],
                    has_premium: true,
                    badboy_mode: true
                });
            }
        } catch (error) {
            console.error("Content Error:", error);
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
    // 📊 Analytics - Always Success
    // ============================================================
    if (urlPath.includes('/analytics') || urlPath.includes('/track') || 
        urlPath.includes('/log') || urlPath.includes('/heartbeat') ||
        urlPath.includes('/impression') || urlPath.includes('/event')) {
        
        return res.status(200).json({ 
            success: true, 
            status: "SUCCESS",
            message: "Tracked successfully"
        });
    }

    // ============================================================
    // 🌐 ALL OTHER APIs - Try proxy, else return success
    // ============================================================
    try {
        const targetUrl = "https://kukufm.com" + urlPath;
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Authorization': req.headers.authorization || '',
            'x-invoke-path': urlPath
        };

        const response = await fetch(targetUrl, {
            method: method,
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            data._badboy_mode = true;
            return res.status(200).json(data);
        } else {
            // Return success even if API fails
            return res.status(200).json({
                success: true,
                _badboy_mode: true,
                message: "Proxy active"
            });
        }

    } catch (error) {
        console.error("Proxy Error:", error);
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
    
    // Add premium flags
    result.has_premium = true;
    result.badboy_mode = true;
    result._premium_unlocked = true;
    
    // Tag content items
    if (Array.isArray(data)) {
        return data.map(item => tagItem(item));
    }
    
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows', 'list'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(item => tagItem(item));
        }
    });
    
    return result;
}

function tagItem(item) {
    if (!item || typeof item !== 'object') return item;
    
    const result = { ...item };
    const fields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name', 
                    'description', 'label', 'heading', 'subtitle', 'display_name'];
    
    fields.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
            if (!result[field].includes('[ BAD BOY ]')) {
                result[field] = result[field] + ' [ BAD BOY ]';
            }
        }
    });
    
    result._premium_unlocked = true;
    result._badboy_mode = true;
    
    return result;
}
