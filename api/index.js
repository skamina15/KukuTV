// ==========================================
// 🎯 DrXmas / Mar-Show PROXY - TENCLOUD FIX
// ==========================================

export default async function handler(req, res) {
    let urlPath = req.headers['x-invoke-path'] || req.url;
    const cleanPath = urlPath.split('?')[0];
    const method = req.method;
    const targetBaseUrl = "https://www.drxmas.online";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 🏷️ BRANDING
    // ==========================================
    const BRAND = " | @Az_Mods_Adda";

    const injectBranding = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        const targetKeys = ['name', 'title', 'drama_name', 'text', 'remark', 'content', 'summary', 'covert', 'label', 'categoryCode', 'video_name', 'movie_name', 'series_name'];
        
        if (Array.isArray(obj)) {
            obj.forEach(item => injectBranding(item));
            return obj;
        }

        for (let key in obj) {
            if (typeof obj[key] === 'string' && targetKeys.includes(key)) {
                if (!obj[key].includes('@Az_Mods_Adda')) {
                    obj[key] = obj[key] + BRAND;
                }
            } 
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                injectBranding(obj[key]);
            }
        }
        return obj;
    };

    // ==========================================
    // 🔥 ULTIMATE UNLOCK - INCLUDING TENCLOUD
    // ==========================================
    const unlockContent = (item) => {
        if (!item || typeof item !== 'object') return item;
        
        // All VIP flags
        item.vip = 1;
        item.isVip = true;
        item.is_vip = true;
        item.vip_status = 1;
        item.premium = true;
        item.is_premium = true;
        item.free = true;
        item.is_free = true;
        item.locked = false;
        item.is_locked = false;
        item.can_play = true;
        item.playable = true;
        item.available = true;
        item.status = "active";
        item.price = "0";
        item.rent_price = "0";
        item.buy_price = "0";
        
        // Tencent Cloud specific fields
        item.is_tencent = false;
        item.tencent_play = true;
        item.use_cdn = true;
        item.drm_enabled = false;
        item.playback_auth = null;
        item.need_auth = false;
        item.auth_required = false;
        item.encrypted = false;
        item.is_encrypted = false;
        
        // Video URL fields - ensure HTTPS
        if (item.video_url) {
            item.video_url = item.video_url.replace('http://', 'https://');
        }
        if (item.play_url) {
            item.play_url = item.play_url.replace('http://', 'https://');
        }
        if (item.stream_url) {
            item.stream_url = item.stream_url.replace('http://', 'https://');
        }
        if (item.source_url) {
            item.source_url = item.source_url.replace('http://', 'https://');
        }
        if (item.url) {
            item.url = item.url.replace('http://', 'https://');
        }
        if (item.hls_url) {
            item.hls_url = item.hls_url.replace('http://', 'https://');
        }
        if (item.m3u8) {
            item.m3u8 = item.m3u8.replace('http://', 'https://');
        }
        
        // Remove any Tencent Cloud restrictions
        delete item.tencent_auth;
        delete item.auth_token;
        delete item.playback_token;
        delete item.drm_key;
        delete item.encryption_key;
        delete item.license_url;
        delete item.certificate;
        
        // Recursive unlock
        if (item.data && typeof item.data === 'object') {
            if (Array.isArray(item.data)) {
                item.data.forEach(sub => unlockContent(sub));
            } else {
                unlockContent(item.data);
            }
        }
        if (item.episodes && Array.isArray(item.episodes)) {
            item.episodes.forEach(ep => unlockContent(ep));
        }
        if (item.seasons && Array.isArray(item.seasons)) {
            item.seasons.forEach(season => {
                if (season.episodes && Array.isArray(season.episodes)) {
                    season.episodes.forEach(ep => unlockContent(ep));
                }
            });
        }
        if (item.list && Array.isArray(item.list)) {
            item.list.forEach(sub => unlockContent(sub));
        }
        if (item.items && Array.isArray(item.items)) {
            item.items.forEach(sub => unlockContent(sub));
        }
        
        return item;
    };

    // ==========================================
    // 🎯 VIDEO SOURCE / PLAYBACK - FIX TENCLOUD
    // ==========================================
    if (cleanPath.includes('/api/video/source') || 
        cleanPath.includes('/api/play/source') ||
        cleanPath.includes('/api/get/play') ||
        cleanPath.includes('/api/source/') ||
        cleanPath.includes('/api/playback/') ||
        cleanPath.includes('/api/stream/') ||
        cleanPath.includes('/api/video/play')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Complete unlock for video source
            if (data.data) {
                unlockContent(data.data);
                
                // Force Tencent Cloud bypass
                if (data.data.source || data.data.url || data.data.video) {
                    const videoUrl = data.data.source || data.data.url || data.data.video || data.data.play_url;
                    
                    // Replace Tencent Cloud domain if present
                    if (videoUrl && videoUrl.includes('tencent')) {
                        // Try to get direct URL by removing auth params
                        const cleanUrl = videoUrl.split('?')[0];
                        data.data.url = cleanUrl;
                        data.data.source = cleanUrl;
                        data.data.video = cleanUrl;
                        data.data.play_url = cleanUrl;
                        data.data.direct_url = cleanUrl;
                    }
                    
                    // Mark as playable
                    data.data.can_play = true;
                    data.data.playable = true;
                    data.data.available = true;
                    data.data.status = "success";
                    data.data.need_auth = false;
                    data.data.auth_required = false;
                    data.data.drm_enabled = false;
                    data.data.tencent_play = false;
                    
                    // Add direct playback flag
                    data.data.direct_play = true;
                    data.data.no_auth = true;
                }
            }

            injectBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Video Source Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🎯 TENCLOUD TOKEN/AUTH ENDPOINTS - FAKE
    // ==========================================
    if (cleanPath.includes('/api/tencent/') || 
        cleanPath.includes('/api/cloud/') ||
        cleanPath.includes('/api/license/') ||
        cleanPath.includes('/api/auth/play') ||
        cleanPath.includes('/api/token/play')) {
        
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                token: "DIRECT_PLAY_" + Date.now(),
                status: "success",
                playable: true,
                auth_required: false,
                drm_enabled: false,
                license_url: null,
                certificate: null,
                expiry: "2099-12-31"
            },
            success: true
        });
    }

    // ==========================================
    // 🎯 VIDEO PLAY ENDPOINT
    // ==========================================
    if (cleanPath.includes('/api/video/play') || 
        cleanPath.includes('/api/play/video') ||
        cleanPath.includes('/api/watch/play')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            if (data.data) {
                unlockContent(data.data);
                
                // Force direct play
                if (data.data.video_url || data.data.play_url || data.data.url) {
                    const vidUrl = data.data.video_url || data.data.play_url || data.data.url;
                    data.data.direct_url = vidUrl.replace('http://', 'https://');
                    data.data.can_play = true;
                    data.data.playable = true;
                    data.data.need_auth = false;
                    data.data.auth_required = false;
                    data.data.drm_enabled = false;
                }
            }

            injectBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Video Play Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🎯 ALL VIDEO/MOVIE/DRAMA ENDPOINTS
    // ==========================================
    if (cleanPath.includes('/api/video/') || 
        cleanPath.includes('/api/drama/') ||
        cleanPath.includes('/api/movie/') ||
        cleanPath.includes('/api/episode/') ||
        cleanPath.includes('/api/watch/')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            if (data.data) {
                if (Array.isArray(data.data)) {
                    data.data.forEach(item => unlockContent(item));
                } else {
                    unlockContent(data.data);
                }
            }

            injectBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Video Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🎯 PROFILE - VIP
    // ==========================================
    if (cleanPath === '/api/user/v2/profile') {
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            if (data.data) {
                data.data.vip = 1;
                data.data.vip_status = 1;
                data.data.isVip = true;
                data.data.is_vip = true;
                data.data.level = "1";
                data.data.level_name = "Premium";
                data.data.score = "99999";
                data.data.coins = "99999";
                data.data.vipExpiry = "2099-12-31";
                data.data.vip_expiry = "2099-12-31";
                data.data.plan = "Lifetime Premium";
                data.data.membership = "premium";
                data.data.user_type = "premium";
                data.data.premium = true;
                data.data.is_premium = true;
            }

            injectBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Profile Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🎯 VIP SEARCH
    // ==========================================
    if (cleanPath === '/api/user/vip/search') {
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(item => unlockContent(item));
            }

            injectBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            console.error('VIP Search Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🚫 BLOCK ADS/TRACKING
    // ==========================================
    if (cleanPath.includes('/analytics') || 
        cleanPath.includes('/heartbeat') || 
        cleanPath.includes('/impression') || 
        cleanPath.includes('/track') ||
        cleanPath.includes('/log') ||
        cleanPath.includes('/ad/') ||
        cleanPath.includes('/ads/')) {
        return res.status(200).json({ 
            code: 200, 
            message: "SUCCESS", 
            data: null 
        });
    }

    // ==========================================
    // 🔓 FAKE ORDER/UNLOCK
    // ==========================================
    if (cleanPath.includes('/order/create') || 
        cleanPath.includes('/product/unlock') || 
        cleanPath.includes('/pay') ||
        cleanPath.includes('/payment') ||
        cleanPath.includes('/purchase')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                orderId: "FAKE_" + Date.now(),
                status: "PAID",
                unlockTime: Date.now(),
                success: true,
                paid: true,
                unlocked: true,
                premium: true,
                direct_access: true
            },
            success: true
        });
    }

    // ==========================================
    // 🔄 FORWARD ALL OTHER REQUESTS
    // ==========================================
    try {
        const headers = buildHeaders(req);
        
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        delete headers['connection'];

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            if (typeof req.body === 'string') {
                fetchOptions.body = req.body;
            } else if (Buffer.isBuffer(req.body)) {
                fetchOptions.body = req.body;
            } else if (typeof req.body === 'object') {
                fetchOptions.body = JSON.stringify(req.body);
                fetchOptions.headers['content-type'] = 'application/json';
            }
        }

        const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            
            if (data.data) {
                if (Array.isArray(data.data)) {
                    data.data.forEach(item => unlockContent(item));
                } else {
                    unlockContent(data.data);
                }
            }

            injectBranding(data);
            return res.status(response.status).json(data);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            response.headers.forEach((value, key) => {
                if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
                    res.setHeader(key, value);
                }
            });
            
            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            
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

// ==========================================
// 🛠 BUILD HEADERS
// ==========================================
function buildHeaders(req) {
    const headers = {};

    if (req.headers) {
        Object.keys(req.headers).forEach(key => {
            if (!['accept-encoding', 'content-length', 'host', 'connection'].includes(key.toLowerCase())) {
                headers[key] = req.headers[key];
            }
        });
    }

    // Premium headers
    headers['project'] = 'mar-show';
    headers['pkg'] = 'com.marshows';
    headers['device-id'] = 'ca6e0ece0e7e3451';
    headers['platform'] = 'android';
    headers['app-version'] = '3.1.1';
    headers['os-version'] = '16';
    headers['x-client-token'] = 'AIOSA_ENC:UEsXRQptUgxeRGYKDR8NVUEQXlE6BgpeQGwKXAABB09GS1Bt';
    headers['accept'] = 'application/json';
    headers['accept-charset'] = 'UTF-8';
    headers['content-type'] = 'application/json';
    headers['user-agent'] = 'MarShow/3.1.1 (Android; 16)';
    headers['fcm-token'] = 'eRo13f1dQ2q6EhXay3BiI7:APA91bGQaVEn_4t91bzA3Np2Bd33LxLneMh1fbS9AvRnjkglgt2-zT15S3gGMM9fiWAtZcHCGkRUPDWlzwo1H9JdVHOHV42TxPMFBYjT5svVydit9lCwv9w';
    headers['apps-flyer-id'] = '1785053309902-1698556423230743718';
    headers['af-status'] = 'Organic';
    headers['authorization'] = 'Bearer PREMIUM_ACCESS_TOKEN';
    headers['x-vip-token'] = 'LIFETIME_PREMIUM_2026';
    headers['x-playback-mode'] = 'direct';
    headers['x-drm-bypass'] = 'true';
    
    return headers;
}
