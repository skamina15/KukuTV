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
    // 🎯 BRANDING REPLACE - HAR JAGAH
    // ==========================================
    const replaceBranding = (text) => {
        if (!text || typeof text !== 'string') return text;
        return text.replace(/@Az_Mods_Adda/gi, '@MR_NoOB');
    };

    const brandAllStrings = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => brandAllStrings(item));
        }
        
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                if (obj[key].includes('@Az_Mods_Adda')) {
                    obj[key] = replaceBranding(obj[key]);
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                brandAllStrings(obj[key]);
            }
        });
        
        return obj;
    };

    // ==========================================
    // 🎯 FORCE UNLOCK FUNCTION - COMPLETE
    // ==========================================
    const forceUnlock = (item) => {
        if (!item || typeof item !== 'object') return item;
        
        // Main VIP flags
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
        item.unlocked = true;
        item.is_unlocked = true;
        item.has_access = true;
        item.access = "granted";
        item.requires_vip = false;
        item.requires_payment = false;
        item.paid = true;
        item.is_paid = true;
        item.user_type = "premium";
        item.membership = "premium";
        item.plan = "Lifetime Premium";
        item.vipExpiry = "2099-12-31";
        item.vip_expiry = "2099-12-31";
        item.level = "1";
        item.level_name = "Premium";
        item.score = "99999";
        item.coins = "99999";
        
        // Fix video URLs
        ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8', 'direct_url'].forEach(field => {
            if (item[field] && typeof item[field] === 'string') {
                item[field] = item[field].split('?')[0].replace('http://', 'https://');
            }
        });
        
        // Recursive
        if (Array.isArray(item.data)) item.data.forEach(forceUnlock);
        else if (item.data && typeof item.data === 'object') forceUnlock(item.data);
        if (Array.isArray(item.episodes)) item.episodes.forEach(forceUnlock);
        if (Array.isArray(item.seasons)) item.seasons.forEach(forceUnlock);
        if (Array.isArray(item.list)) item.list.forEach(forceUnlock);
        if (Array.isArray(item.items)) item.items.forEach(forceUnlock);
        if (Array.isArray(item.results)) item.results.forEach(forceUnlock);
        
        return item;
    };

    // ==========================================
    // 🎯 VIDEO PLAYBACK - MAIN FIX
    // ==========================================
    if (cleanPath.includes('/api/video/source') || 
        cleanPath.includes('/api/play/source') ||
        cleanPath.includes('/api/get/play') ||
        cleanPath.includes('/api/source/') ||
        cleanPath.includes('/api/video/play') ||
        cleanPath.includes('/api/play/')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // Force unlock - PURE DATA LEVEL PAR BHI
            forceUnlock(data);
            
            // Agar data.data hai toh usko bhi unlock
            if (data && data.data) {
                forceUnlock(data.data);
            }
            
            // Success flags
            data.success = true;
            data.code = 200;
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('Video Source Error:', error);
            // Fallback with full unlock
            return res.status(200).json({
                code: 200,
                message: "Success",
                success: true,
                vip: 1,
                isVip: true,
                premium: true,
                free: true,
                locked: false,
                can_play: true,
                playable: true,
                data: {
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    vip: 1,
                    isVip: true,
                    premium: true,
                    free: true,
                    locked: false,
                    can_play: true,
                    playable: true,
                    drm_enabled: false,
                    need_auth: false,
                    requires_vip: false,
                    requires_payment: false
                }
            });
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
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // Force unlock
            forceUnlock(data);
            
            if (data.data) {
                forceUnlock(data.data);
            }
            
            data.code = 200;
            data.success = true;
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('Video Error:', error);
            return res.status(200).json({
                code: 200,
                message: "Success",
                success: true,
                vip: 1,
                isVip: true,
                premium: true,
                free: true,
                locked: false,
                can_play: true,
                playable: true,
                data: []
            });
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
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // Force unlock
            forceUnlock(data);
            
            if (data.data) {
                forceUnlock(data.data);
            }
            
            return res.status(200).json(data);
        } catch (error) {
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
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // Force unlock
            forceUnlock(data);
            
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(item => forceUnlock(item));
            }
            
            return res.status(200).json(data);
        } catch (error) {
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
            data: null,
            vip: 1,
            isVip: true,
            premium: true,
            success: true
        });
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
        return res.status(200).json({
            code: 200,
            message: "Success",
            success: true,
            vip: 1,
            isVip: true,
            premium: true,
            free: true,
            locked: false,
            can_play: true,
            playable: true,
            data: {
                orderId: "FAKE_" + Date.now(),
                status: "PAID",
                unlockTime: Date.now(),
                success: true,
                paid: true,
                unlocked: true,
                premium: true
            }
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
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // Force unlock
            forceUnlock(data);
            
            if (data.data) {
                forceUnlock(data.data);
            }
            
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
        return res.status(500).json({
            code: 500,
            message: "Proxy Error: " + error.message,
            vip: 1,
            isVip: true,
            premium: true,
            success: false
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
    headers['x-vip-status'] = '1';
    headers['x-user-type'] = 'premium';
    headers['x-premium'] = 'true';
    
    return headers;
}
