// ==========================================
// 🎯 DrXmas / Mar-Show PROXY - FINAL WORKING FIX
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
    // 🎯 VIDEO PLAYBACK - COMPLETE REWRITE
    // ==========================================
    if (cleanPath.includes('/api/video/source') || 
        cleanPath.includes('/api/play/source') ||
        cleanPath.includes('/api/get/play') ||
        cleanPath.includes('/api/source/') ||
        cleanPath.includes('/api/video/play') ||
        cleanPath.includes('/api/play/video') ||
        cleanPath.includes('/api/watch/play')) {
        
        try {
            // Try to get video source from server
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // If we got video data, modify it
            if (data && data.data) {
                // Complete VIP unlock
                const videoData = data.data;
                
                // Force all VIP flags
                videoData.vip = 1;
                videoData.isVip = true;
                videoData.is_vip = true;
                videoData.vip_status = 1;
                videoData.premium = true;
                videoData.is_premium = true;
                videoData.free = true;
                videoData.is_free = true;
                videoData.locked = false;
                videoData.is_locked = false;
                videoData.can_play = true;
                videoData.playable = true;
                videoData.available = true;
                videoData.status = "active";
                videoData.price = "0";
                videoData.rent_price = "0";
                videoData.buy_price = "0";
                videoData.drm_enabled = false;
                videoData.need_auth = false;
                videoData.auth_required = false;
                videoData.is_tencent = false;
                videoData.tencent_play = true;
                videoData.is_encrypted = false;
                videoData.encrypted = false;
                
                // Clean video URL
                let videoUrl = videoData.url || videoData.source || videoData.video || videoData.play_url || videoData.stream_url;
                
                if (videoUrl && !videoUrl.includes('tencent')) {
                    // Clean URL if not from tencent
                    videoUrl = videoUrl.split('?')[0].replace('http://', 'https://');
                } else {
                    // Use fallback video
                    videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                }
                
                // Set all URL fields
                videoData.url = videoUrl;
                videoData.source = videoUrl;
                videoData.video = videoUrl;
                videoData.play_url = videoUrl;
                videoData.direct_url = videoUrl;
                videoData.stream_url = videoUrl;
                videoData.hls_url = videoUrl;
                videoData.m3u8 = videoUrl;
                videoData.video_url = videoUrl;
                
                // Remove all auth/token fields
                const authFields = ['tencent_auth', 'auth_token', 'playback_token', 'drm_key', 'encryption_key', 
                                   'license_url', 'certificate', 'playback_auth', 'signature', 'sign', 'token', 'auth'];
                authFields.forEach(field => delete videoData[field]);
                
                // Add branding
                injectBranding(videoData);
                
                data.success = true;
                data.code = 200;
                
                return res.status(200).json(data);
            }
            
            // If no data, return fallback
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
                    video_url: fallbackUrl,
                    vip: 1,
                    isVip: true,
                    is_vip: true,
                    vip_status: 1,
                    premium: true,
                    is_premium: true,
                    free: true,
                    is_free: true,
                    locked: false,
                    is_locked: false,
                    can_play: true,
                    playable: true,
                    available: true,
                    status: "active",
                    price: "0",
                    rent_price: "0",
                    buy_price: "0",
                    drm_enabled: false,
                    need_auth: false,
                    auth_required: false,
                    is_tencent: false,
                    tencent_play: true,
                    is_encrypted: false,
                    encrypted: false,
                    title: "Big Buck Bunny | @MR_NoOB",
                    name: "Big Buck Bunny | @MR_NoOB"
                },
                success: true
            });
            
        } catch (error) {
            console.error('Video Source Error:', error);
            // Return fallback video
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
                    video_url: fallbackUrl,
                    vip: 1,
                    isVip: true,
                    is_vip: true,
                    vip_status: 1,
                    premium: true,
                    is_premium: true,
                    free: true,
                    is_free: true,
                    locked: false,
                    is_locked: false,
                    can_play: true,
                    playable: true,
                    available: true,
                    status: "active",
                    price: "0",
                    rent_price: "0",
                    buy_price: "0",
                    drm_enabled: false,
                    need_auth: false,
                    auth_required: false,
                    is_tencent: false,
                    tencent_play: true,
                    is_encrypted: false,
                    encrypted: false,
                    title: "Big Buck Bunny | @MR_NoOB",
                    name: "Big Buck Bunny | @MR_NoOB"
                },
                success: true
            });
        }
    }

    // ==========================================
    // 🎯 TENCLOUD TOKEN/AUTH - FAKE RESPONSE
    // ==========================================
    if (cleanPath.includes('/api/tencent/') || 
        cleanPath.includes('/api/cloud/') ||
        cleanPath.includes('/api/license/') ||
        cleanPath.includes('/api/auth/play') ||
        cleanPath.includes('/api/token/play') ||
        cleanPath.includes('/api/drm/') ||
        cleanPath.includes('/api/play/auth')) {
        
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
                tencent_play: true,
                can_play: true
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
                    
                    // Remove auth fields
                    const authFields = ['tencent_auth', 'auth_token', 'playback_token', 'drm_key', 'encryption_key', 
                                       'license_url', 'certificate', 'playback_auth', 'signature', 'sign', 'token', 'auth'];
                    authFields.forEach(field => delete item[field]);
                    
                    // Fix URLs
                    ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8', 'video_url'].forEach(field => {
                        if (item[field] && typeof item[field] === 'string') {
                            let url = item[field];
                            if (url.includes('tencent')) {
                                url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                            } else {
                                url = url.split('?')[0].replace('http://', 'https://');
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
                    
                    const authFields = ['tencent_auth', 'auth_token', 'playback_token', 'drm_key', 'encryption_key', 'license_url'];
                    authFields.forEach(field => delete item[field]);
                    
                    ['url', 'source', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8', 'video_url'].forEach(field => {
                        if (item[field] && typeof item[field] === 'string') {
                            let url = item[field];
                            if (url.includes('tencent')) {
                                url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                            } else {
                                url = url.split('?')[0].replace('http://', 'https://');
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
    headers['x-bypass-auth'] = 'true';
    headers['x-ignore-tencent'] = 'true';
    
    return headers;
}
