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
    // 🎯 BRANDING REPLACE - SIRF @Az_Mods_Adda -> @MR_NoOB
    // ==========================================
    const replaceBranding = (text) => {
        if (!text || typeof text !== 'string') return text;
        // Pehle purana branding hatao
        let newText = text.replace(/@Az_Mods_Adda/gi, '');
        newText = newText.replace(/Ayush jha \| /gi, '');
        newText = newText.replace(/Ayush jha/gi, '');
        newText = newText.replace(/\|/g, '');
        // Agar text khaali ho toh sirf MR_NoOB
        if (newText.trim() === '') {
            return '@MR_NoOB';
        }
        // Agar text mein pehle se MR_NoOB nahi hai toh add karo
        if (!newText.includes('@MR_NoOB')) {
            return newText.trim() + ' @MR_NoOB';
        }
        return newText.trim();
    };

    const brandAllStrings = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => brandAllStrings(item));
        }
        
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'string') {
                // Agar string mein @Az_Mods_Adda ya Ayush jha hai toh replace karo
                if (obj[key].includes('@Az_Mods_Adda') || 
                    obj[key].includes('Ayush jha') ||
                    obj[key].includes('Ayush jha |')) {
                    obj[key] = replaceBranding(obj[key]);
                }
                // Agar string sirf name field hai toh direct replace
                if (['name', 'display_name', 'username', 'nickname', 'full_name'].includes(key)) {
                    obj[key] = replaceBranding(obj[key]);
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                brandAllStrings(obj[key]);
            }
        });
        
        return obj;
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
            // Get video ID from URL
            const videoId = urlPath.split('/').pop().split('?')[0];
            
            // First try to get real video source
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // If we got video data, modify it
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
                
                // Fix video URL
                let videoUrl = data.data.url || data.data.source || data.data.video || data.data.play_url;
                if (videoUrl) {
                    // Remove Tencent auth params
                    videoUrl = videoUrl.split('?')[0];
                    videoUrl = videoUrl.replace('http://', 'https://');
                    
                    // Set all URL fields
                    data.data.url = videoUrl;
                    data.data.source = videoUrl;
                    data.data.video = videoUrl;
                    data.data.play_url = videoUrl;
                    data.data.direct_url = videoUrl;
                    data.data.stream_url = videoUrl;
                } else {
                    // If no URL found, use fallback
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
            
            // If no data, return fallback
            return res.status(200).json({
                code: 200,
                message: "Success",
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
                    need_auth: false
                },
                success: true
            });
            
        } catch (error) {
            console.error('Video Source Error:', error);
            // Return fallback video
            return res.status(200).json({
                code: 200,
                message: "Success",
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
                    need_auth: false
                },
                success: true
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
            
            // Unlock all content
            if (data.data) {
                const unlockAll = (item) => {
                    if (!item || typeof item !== 'object') return item;
                    
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
                    
                    // Fix any video URLs
                    ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8'].forEach(field => {
                        if (item[field] && typeof item[field] === 'string') {
                            item[field] = item[field].split('?')[0].replace('http://', 'https://');
                        }
                    });
                    
                    // Recursive
                    if (Array.isArray(item.data)) item.data.forEach(unlockAll);
                    else if (item.data && typeof item.data === 'object') unlockAll(item.data);
                    if (Array.isArray(item.episodes)) item.episodes.forEach(unlockAll);
                    if (Array.isArray(item.seasons)) item.seasons.forEach(unlockAll);
                    if (Array.isArray(item.list)) item.list.forEach(unlockAll);
                    if (Array.isArray(item.items)) item.items.forEach(unlockAll);
                    
                    return item;
                };
                
                if (Array.isArray(data.data)) {
                    data.data.forEach(unlockAll);
                } else {
                    unlockAll(data.data);
                }
            }
            
            data.code = 200;
            data.success = true;
            
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('Video Error:', error);
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: [],
                success: true
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
            
            // Brand all strings - specifically profile names
            if (data.data) {
                // Force set name fields to MR_NoOB only
                data.data.name = '@MR_NoOB';
                data.data.display_name = '@MR_NoOB';
                data.data.username = '@MR_NoOB';
                data.data.nickname = '@MR_NoOB';
                data.data.full_name = '@MR_NoOB';
                
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
            
            // Brand rest of the strings
            data = brandAllStrings(data);
            
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
        cleanPath.includes('/purchase') ||
        cleanPath.includes('/rent')) {
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
                premium: true
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
            
            // Brand all strings
            data = brandAllStrings(data);
            
            // Unlock any content
            if (data.data) {
                const unlock = (item) => {
                    if (!item || typeof item !== 'object') return item;
                    item.vip = 1;
                    item.isVip = true;
                    item.premium = true;
                    item.free = true;
                    item.locked = false;
                    item.can_play = true;
                    item.playable = true;
                    if (Array.isArray(item.data)) item.data.forEach(unlock);
                    else if (item.data && typeof item.data === 'object') unlock(item.data);
                    return item;
                };
                
                if (Array.isArray(data.data)) {
                    data.data.forEach(unlock);
                } else {
                    unlock(data.data);
                }
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
