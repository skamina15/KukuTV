// ==========================================
// 🎯 DrXmas / Mar-Show PROXY - FINAL WORKING
// ==========================================

export default async function handler(req, res) {
    let urlPath = req.headers['x-invoke-path'] || req.url;
    const cleanPath = urlPath.split('?')[0];
    const method = req.method;
    const targetBaseUrl = "https://www.drxmas.online";

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 🎯 BRANDING - ADD @MR_NoOB EVERYWHERE
    // ==========================================
    const addBranding = (text) => {
        if (!text || typeof text !== 'string') return text;
        // Remove old branding first
        let cleaned = text.replace(/@Az_Mods_Adda/gi, '');
        cleaned = cleaned.replace(/Az Mods Adda/gi, '');
        cleaned = cleaned.replace(/AzModsAdda/gi, '');
        cleaned = cleaned.trim();
        
        // Add @MR_NoOB at the end
        if (cleaned.length > 0) {
            return cleaned + ' @MR_NoOB';
        }
        return '@MR_NoOB';
    };

    const brandAllStrings = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => brandAllStrings(item));
        }
        
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                // Brand EVERY string field
                result[key] = addBranding(value);
            } else if (typeof value === 'object' && value !== null) {
                result[key] = brandAllStrings(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    };

    // ==========================================
    // 🎯 VIDEO PLAYBACK - MAIN FIX
    // ==========================================
    if (cleanPath.includes('/api/video/source') || 
        cleanPath.includes('/api/play/source') ||
        cleanPath.includes('/api/get/play') ||
        cleanPath.includes('/api/source/') ||
        cleanPath.includes('/api/video/play')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            if (data && data.data) {
                // Force unlock
                data.data.vip = 1;
                data.data.isVip = true;
                data.data.premium = true;
                data.data.free = true;
                data.data.locked = false;
                data.data.can_play = true;
                data.data.playable = true;
                data.data.available = true;
                data.data.drm_enabled = false;
                data.data.need_auth = false;
                data.data.auth_required = false;
                
                // BRAND ALL STRINGS IN DATA
                data.data = brandAllStrings(data.data);
                data = brandAllStrings(data);
                
                // Fix video URL
                let videoUrl = data.data.url || data.data.source || data.data.video || data.data.play_url;
                if (videoUrl && typeof videoUrl === 'string' && !videoUrl.includes('commondatastorage')) {
                    videoUrl = videoUrl.split('?')[0];
                    videoUrl = videoUrl.replace('http://', 'https://');
                    
                    data.data.url = videoUrl;
                    data.data.source = videoUrl;
                    data.data.video = videoUrl;
                    data.data.play_url = videoUrl;
                    data.data.direct_url = videoUrl;
                    data.data.stream_url = videoUrl;
                } else {
                    data.data.url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                    data.data.source = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                    data.data.video = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                    data.data.play_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                    data.data.direct_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                }
                
                data.success = true;
                data.code = 200;
                
                return res.status(200).json(data);
            }
            
            // Fallback with branding
            const fallbackData = {
                code: 200,
                message: "Success @MR_NoOB",
                data: {
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    title: "Free Video @MR_NoOB",
                    vip: 1,
                    isVip: true,
                    premium: true,
                    free: true,
                    locked: false,
                    can_play: true,
                    playable: true,
                    drm_enabled: false,
                    need_auth: false
                },
                success: true
            };
            return res.status(200).json(brandAllStrings(fallbackData));
            
        } catch (error) {
            console.error('Video Source Error:', error);
            const fallbackData = {
                code: 200,
                message: "Success @MR_NoOB",
                data: {
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    title: "Free Video @MR_NoOB",
                    vip: 1,
                    isVip: true,
                    premium: true,
                    free: true,
                    locked: false,
                    can_play: true,
                    playable: true,
                    drm_enabled: false,
                    need_auth: false
                },
                success: true
            };
            return res.status(200).json(brandAllStrings(fallbackData));
        }
    }

    // ==========================================
    // 🎯 ALL VIDEO/DRAMA/MOVIE ENDPOINTS
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
            
            // Unlock and brand all content
            if (data.data) {
                const unlockAndBrand = (item) => {
                    if (!item || typeof item !== 'object') return item;
                    
                    // Unlock
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
                    item.drm_enabled = false;
                    item.need_auth = false;
                    item.auth_required = false;
                    
                    // Fix video URLs
                    ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8'].forEach(field => {
                        if (item[field] && typeof item[field] === 'string') {
                            item[field] = item[field].split('?')[0].replace('http://', 'https://');
                        }
                    });
                    
                    // Recursive
                    if (Array.isArray(item.data)) item.data.forEach(unlockAndBrand);
                    else if (item.data && typeof item.data === 'object') unlockAndBrand(item.data);
                    if (Array.isArray(item.episodes)) item.episodes.forEach(unlockAndBrand);
                    if (Array.isArray(item.seasons)) item.seasons.forEach(unlockAndBrand);
                    if (Array.isArray(item.list)) item.list.forEach(unlockAndBrand);
                    if (Array.isArray(item.items)) item.items.forEach(unlockAndBrand);
                    if (Array.isArray(item.results)) item.results.forEach(unlockAndBrand);
                    
                    return item;
                };
                
                if (Array.isArray(data.data)) {
                    data.data.forEach(unlockAndBrand);
                } else {
                    unlockAndBrand(data.data);
                }
            }
            
            // BRAND EVERYTHING
            data = brandAllStrings(data);
            data.code = 200;
            data.success = true;
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('Video Error:', error);
            return res.status(200).json(brandAllStrings({
                code: 200,
                message: "Success @MR_NoOB",
                data: [],
                success: true
            }));
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
                data.data.level_name = "Premium @MR_NoOB";
                data.data.score = "99999";
                data.data.coins = "99999";
                data.data.vipExpiry = "2099-12-31";
                data.data.vip_expiry = "2099-12-31";
                data.data.plan = "Lifetime Premium @MR_NoOB";
                data.data.membership = "premium";
                data.data.user_type = "premium";
                data.data.premium = true;
                data.data.is_premium = true;
            }
            
            // BRAND EVERYTHING
            data = brandAllStrings(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json(brandAllStrings({ error: error.message }));
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
                data.data.forEach(item => {
                    item.vip = 1;
                    item.isVip = true;
                    item.premium = true;
                    item.free = true;
                    item.locked = false;
                    item.can_play = true;
                    item.playable = true;
                });
            }
            
            // BRAND EVERYTHING
            data = brandAllStrings(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json(brandAllStrings({ error: error.message }));
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
        return res.status(200).json(brandAllStrings({ 
            code: 200, 
            message: "SUCCESS @MR_NoOB", 
            data: null 
        }));
    }

    // ==========================================
    // 🔓 FAKE ORDER/UNLOCK
    // ==========================================
    if (cleanPath.includes('/order/create') || 
        cleanPath.includes('/product/unlock') || 
        cleanPath.includes('/pay') ||
        cleanPath.includes('/payment') ||
        cleanPath.includes('/purchase') ||
        cleanPath.includes('/rent')) {
        return res.status(200).json(brandAllStrings({
            code: 200,
            message: "Success @MR_NoOB",
            data: {
                orderId: "FAKE_" + Date.now(),
                status: "PAID",
                unlockTime: Date.now(),
                success: true,
                paid: true,
                unlocked: true,
                premium: true
            },
            success: true
        }));
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
            
            // Unlock and brand any content
            if (data.data) {
                const unlockAndBrand = (item) => {
                    if (!item || typeof item !== 'object') return item;
                    item.vip = 1;
                    item.isVip = true;
                    item.premium = true;
                    item.free = true;
                    item.locked = false;
                    item.can_play = true;
                    item.playable = true;
                    
                    if (Array.isArray(item.data)) item.data.forEach(unlockAndBrand);
                    else if (item.data && typeof item.data === 'object') unlockAndBrand(item.data);
                    if (Array.isArray(item.list)) item.list.forEach(unlockAndBrand);
                    if (Array.isArray(item.items)) item.items.forEach(unlockAndBrand);
                    if (Array.isArray(item.results)) item.results.forEach(unlockAndBrand);
                    
                    return item;
                };
                
                if (Array.isArray(data.data)) {
                    data.data.forEach(unlockAndBrand);
                } else {
                    unlockAndBrand(data.data);
                }
            }
            
            // BRAND EVERY STRING
            data = brandAllStrings(data);
            return res.status(response.status).json(data);
        } else {
            const buffer = Buffer.from(await response.arrayBuffer());
            response.headers.forEach((value, key) => {
                if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
                    res.setHeader(key, value);
                }
            });
            if (contentType) res.setHeader('Content-Type', contentType);
            return res.status(response.status).send(buffer);
        }

    } catch (error) {
        console.error('❌ Proxy Error:', error);
        return res.status(500).json(brandAllStrings({
            code: 500,
            message: "Proxy Error @MR_NoOB: " + error.message
        }));
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

    // Premium device headers
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
