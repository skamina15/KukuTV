// ==========================================
// 🎯 DrXmas / Mar-Show PROXY - ULTIMATE TENCLOUD FIX
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
    // 🏷️ BRANDING - @MR_NoOB
    // ==========================================
    const BRAND = " | @MR_NoOB";

    const injectBranding = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        const targetKeys = [
            'name', 'title', 'drama_name', 'text', 'remark', 'content', 
            'summary', 'covert', 'label', 'categoryCode', 'video_name', 
            'movie_name', 'series_name', 'episode_name', 'show_name',
            'film_name', 'production', 'studio', 'director', 'cast',
            'description', 'overview', 'headline', 'subtitle'
        ];
        
        if (Array.isArray(obj)) {
            obj.forEach(item => injectBranding(item));
            return obj;
        }

        for (let key in obj) {
            if (typeof obj[key] === 'string' && targetKeys.includes(key)) {
                obj[key] = obj[key].replace(/\s*\|\s*@\w+/g, '');
                obj[key] = obj[key] + BRAND;
            } 
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                injectBranding(obj[key]);
            }
        }
        return obj;
    };

    // ==========================================
    // 🎯 VIDEO PLAYBACK - MAIN FIX
    // ==========================================
    if (cleanPath.includes('/api/video/source') || 
        cleanPath.includes('/api/play/source') ||
        cleanPath.includes('/api/get/play') ||
        cleanPath.includes('/api/source/') ||
        cleanPath.includes('/api/video/play') ||
        cleanPath.includes('/api/play/video')) {
        
        try {
            const headers = buildHeaders(req);
            
            // First try to get real video source from server
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // If we got video data, modify it
            if (data && data.data) {
                // Force unlock all VIP flags
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
                data.data.is_tencent = false;
                data.data.tencent_play = true;
                data.data.is_encrypted = false;
                data.data.encrypted = false;
                
                // Remove any Tencent Cloud auth fields
                delete data.data.tencent_auth;
                delete data.data.auth_token;
                delete data.data.playback_token;
                delete data.data.drm_key;
                delete data.data.encryption_key;
                delete data.data.license_url;
                delete data.data.certificate;
                delete data.data.playback_auth;
                delete data.data.signature;
                delete data.data.sign;
                delete data.data.token;
                delete data.data.auth;
                
                // Fix video URL - remove all query params
                let videoUrl = data.data.url || data.data.source || data.data.video || data.data.play_url || data.data.stream_url;
                
                if (videoUrl) {
                    // Remove all query parameters
                    videoUrl = videoUrl.split('?')[0];
                    // Convert HTTP to HTTPS
                    videoUrl = videoUrl.replace('http://', 'https://');
                    // If still has tencent in URL, try to get clean version
                    if (videoUrl.includes('tencent')) {
                        // Try to extract just the base URL without any tencent paths
                        const urlParts = videoUrl.split('/');
                        const fileName = urlParts[urlParts.length - 1];
                        if (fileName.includes('.mp4') || fileName.includes('.m3u8')) {
                            videoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
                        }
                    }
                    
                    // Set all URL fields to clean URL
                    data.data.url = videoUrl;
                    data.data.source = videoUrl;
                    data.data.video = videoUrl;
                    data.data.play_url = videoUrl;
                    data.data.direct_url = videoUrl;
                    data.data.stream_url = videoUrl;
                    data.data.hls_url = videoUrl;
                    data.data.m3u8 = videoUrl;
                } else {
                    // Fallback video URL
                    const fallbackUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                    data.data.url = fallbackUrl;
                    data.data.source = fallbackUrl;
                    data.data.video = fallbackUrl;
                    data.data.play_url = fallbackUrl;
                    data.data.direct_url = fallbackUrl;
                    data.data.stream_url = fallbackUrl;
                    data.data.hls_url = fallbackUrl;
                    data.data.m3u8 = fallbackUrl;
                }
                
                // Add branding
                injectBranding(data.data);
                
                data.success = true;
                data.code = 200;
                
                return res.status(200).json(data);
            }
            
            // If no data, return fallback with all fields
            const fallbackUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: {
                    url: fallbackUrl,
                    source: fallbackUrl,
                    video: fallbackUrl,
                    play_url: fallbackUrl,
                    direct_url: fallbackUrl,
                    stream_url: fallbackUrl,
                    hls_url: fallbackUrl,
                    m3u8: fallbackUrl,
                    vip: 1,
                    isVip: true,
                    premium: true,
                    free: true,
                    locked: false,
                    can_play: true,
                    playable: true,
                    available: true,
                    drm_enabled: false,
                    need_auth: false,
                    auth_required: false,
                    is_tencent: false,
                    tencent_play: true,
                    is_encrypted: false,
                    encrypted: false,
                    status: "active"
                },
                success: true
            });
            
        } catch (error) {
            console.error('Video Source Error:', error);
            // Return fallback video with all fields
            const fallbackUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: {
                    url: fallbackUrl,
                    source: fallbackUrl,
                    video: fallbackUrl,
                    play_url: fallbackUrl,
                    direct_url: fallbackUrl,
                    stream_url: fallbackUrl,
                    hls_url: fallbackUrl,
                    m3u8: fallbackUrl,
                    vip: 1,
                    isVip: true,
                    premium: true,
                    free: true,
                    locked: false,
                    can_play: true,
                    playable: true,
                    available: true,
                    drm_enabled: false,
                    need_auth: false,
                    auth_required: false,
                    is_tencent: false,
                    tencent_play: true,
                    is_encrypted: false,
                    encrypted: false,
                    status: "active"
                },
                success: true
            });
        }
    }

    // ==========================================
    // 🎯 TENCLOUD TOKEN/AUTH ENDPOINTS - FAKE SUCCESS
    // ==========================================
    if (cleanPath.includes('/api/tencent/') || 
        cleanPath.includes('/api/cloud/') ||
        cleanPath.includes('/api/license/') ||
        cleanPath.includes('/api/auth/play') ||
        cleanPath.includes('/api/token/play') ||
        cleanPath.includes('/api/drm/')) {
        
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
                expiry: "2099-12-31",
                is_tencent: false,
                tencent_play: true
            },
            success: true
        });
    }

    // ==========================================
    // 🎯 ALL VIDEO/DRAMA/MOVIE ENDPOINTS
    // ==========================================
    if (cleanPath.includes('/api/video/') || 
        cleanPath.includes('/api/drama/') ||
        cleanPath.includes('/api/movie/') ||
        cleanPath.includes('/api/episode/') ||
        cleanPath.includes('/api/watch/') ||
        cleanPath.includes('/api/category/') ||
        cleanPath.includes('/api/list/') ||
        cleanPath.includes('/api/home/') ||
        cleanPath.includes('/api/recommend/') ||
        cleanPath.includes('/api/search/')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Unlock all content
            if (data.data) {
                const unlockAll = (item) => {
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
                    item.drm_enabled = false;
                    item.need_auth = false;
                    item.auth_required = false;
                    item.is_tencent = false;
                    item.tencent_play = true;
                    item.is_encrypted = false;
                    item.encrypted = false;
                    
                    // Remove any auth fields
                    delete item.tencent_auth;
                    delete item.auth_token;
                    delete item.playback_token;
                    delete item.drm_key;
                    delete item.encryption_key;
                    delete item.license_url;
                    delete item.certificate;
                    delete item.playback_auth;
                    delete item.signature;
                    delete item.sign;
                    delete item.token;
                    delete item.auth;
                    
                    // Fix any video URLs
                    ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8'].forEach(field => {
                        if (item[field] && typeof item[field] === 'string') {
                            let url = item[field];
                            // Remove all query params
                            url = url.split('?')[0];
                            // Convert to HTTPS
                            url = url.replace('http://', 'https://');
                            // If tencent URL, use fallback
                            if (url.includes('tencent')) {
                                url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                            }
                            item[field] = url;
                        }
                    });
                    
                    // Add branding
                    injectBranding(item);
                    
                    // Recursive
                    if (Array.isArray(item.data)) item.data.forEach(unlockAll);
                    else if (item.data && typeof item.data === 'object') unlockAll(item.data);
                    if (Array.isArray(item.episodes)) item.episodes.forEach(unlockAll);
                    if (Array.isArray(item.seasons)) item.seasons.forEach(unlockAll);
                    if (Array.isArray(item.list)) item.list.forEach(unlockAll);
                    if (Array.isArray(item.items)) item.items.forEach(unlockAll);
                    if (Array.isArray(item.results)) item.results.forEach(unlockAll);
                    if (Array.isArray(item.content)) item.content.forEach(unlockAll);
                    
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
                
                // Add branding to profile name
                if (data.data.name) {
                    data.data.name = data.data.name.replace(/\s*\|\s*@\w+/g, '') + BRAND;
                }
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
            
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(item => {
                    item.vip = 1;
                    item.isVip = true;
                    item.premium = true;
                    item.free = true;
                    item.locked = false;
                    item.can_play = true;
                    item.playable = true;
                    injectBranding(item);
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
                    item.drm_enabled = false;
                    item.need_auth = false;
                    item.auth_required = false;
                    item.is_tencent = false;
                    item.tencent_play = true;
                    
                    // Remove auth fields
                    delete item.tencent_auth;
                    delete item.auth_token;
                    delete item.playback_token;
                    delete item.drm_key;
                    delete item.encryption_key;
                    delete item.license_url;
                    
                    // Fix URLs
                    ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8'].forEach(field => {
                        if (item[field] && typeof item[field] === 'string') {
                            let url = item[field].split('?')[0].replace('http://', 'https://');
                            if (url.includes('tencent')) {
                                url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                            }
                            item[field] = url;
                        }
                    });
                    
                    injectBranding(item);
                    
                    if (Array.isArray(item.data)) item.data.forEach(unlock);
                    else if (item.data && typeof item.data === 'object') unlock(item.data);
                    if (Array.isArray(item.results)) item.results.forEach(unlock);
                    if (Array.isArray(item.items)) item.items.forEach(unlock);
                    
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
// 🛠 BUILD HEADERS - ULTIMATE PREMIUM
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

    // Ultimate premium headers
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
    headers['x-bypass-auth'] = 'true';
    headers['x-ignore-tencent'] = 'true';
    
    return headers;
}
