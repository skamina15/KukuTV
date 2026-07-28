// ==========================================
// 🎯 DrXmas / Mar-Show PROXY (No Device Lock) - FIXED
// ==========================================

export default async function handler(req, res) {
    // Extract the actual path from the request
    let urlPath = req.headers['x-invoke-path'] || req.url;
    
    // Remove query parameters for path matching
    const cleanPath = urlPath.split('?')[0];
    const method = req.method;
    const targetBaseUrl = "https://www.drxmas.online";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight
    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 🏷️ BRANDING INJECTION FUNCTION
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
    // 🎯 VIP / PREMIUM SPOOF - PROFILE
    // ==========================================
    if (cleanPath === '/api/user/v2/profile') {
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Complete VIP spoof
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
            }

            injectBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('Profile Error:', error);
            return res.status(500).json({ 
                code: 500, 
                message: "Profile Error: " + error.message 
            });
        }
    }

    // ==========================================
    // 🎯 VIP SEARCH - Fix for video playback
    // ==========================================
    if (cleanPath === '/api/user/vip/search') {
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Ensure VIP status in search results
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(item => {
                    if (item && typeof item === 'object') {
                        item.vip = 1;
                        item.isVip = true;
                        item.premium = true;
                        item.free = false;
                    }
                });
            }

            injectBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('VIP Search Error:', error);
            return res.status(500).json({ 
                code: 500, 
                message: "VIP Search Error: " + error.message 
            });
        }
    }

    // ==========================================
    // 🎯 VIDEO / DRAMA DETAILS - Fix playback
    // ==========================================
    if (cleanPath.includes('/api/video/') || 
        cleanPath.includes('/api/drama/') ||
        cleanPath.includes('/api/movie/') ||
        cleanPath.includes('/api/episode/')) {
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Unlock all videos
            if (data.data) {
                const unlockVideo = (item) => {
                    if (item && typeof item === 'object') {
                        item.vip = 1;
                        item.isVip = true;
                        item.premium = true;
                        item.free = true;
                        item.locked = false;
                        item.is_locked = false;
                        item.can_play = true;
                        item.playable = true;
                        item.available = true;
                        item.status = "active";
                        item.price = "0";
                        item.rent_price = "0";
                        item.buy_price = "0";
                        item.is_free = true;
                    }
                };

                if (Array.isArray(data.data)) {
                    data.data.forEach(unlockVideo);
                } else {
                    unlockVideo(data.data);
                }
            }

            injectBranding(data);
            return res.status(200).json(data);
            
        } catch (error) {
            console.error('Video Error:', error);
            return res.status(500).json({ 
                code: 500, 
                message: "Video Error: " + error.message 
            });
        }
    }

    // ==========================================
    // 🚫 ADS / ANALYTICS / TRACKING BLOCK
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
    // 🔓 UNLOCK / BUY / ORDER FAKE RESPONSE
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
                unlocked: true
            },
            success: true
        });
    }

    // ==========================================
    // 🔄 ALL OTHER REQUESTS FORWARD
    // ==========================================
    try {
        const headers = buildHeaders(req);
        
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];
        delete headers['content-type']; // Let fetch handle it

        const fetchOptions = {
            method: method,
            headers: headers,
            timeout: 30000,
        };

        // Handle body
        if (method !== 'GET' && method !== 'HEAD') {
            if (req.body) {
                if (typeof req.body === 'string') {
                    fetchOptions.body = req.body;
                } else if (Buffer.isBuffer(req.body)) {
                    fetchOptions.body = req.body;
                } else if (typeof req.body === 'object') {
                    fetchOptions.body = JSON.stringify(req.body);
                    fetchOptions.headers['content-type'] = 'application/json';
                }
            }
        }

        const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            
            // Unlock any content in response
            if (data.data) {
                const unlockContent = (item) => {
                    if (item && typeof item === 'object') {
                        item.vip = 1;
                        item.isVip = true;
                        item.premium = true;
                        item.free = true;
                        item.locked = false;
                        item.can_play = true;
                        item.playable = true;
                        item.available = true;
                    }
                };

                if (Array.isArray(data.data)) {
                    data.data.forEach(unlockContent);
                } else {
                    unlockContent(data.data);
                }
            }

            injectBranding(data);
            return res.status(response.status).json(data);
        } 
        else {
            // Non-JSON response
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // Copy headers
            response.headers.forEach((value, key) => {
                if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) {
                    res.setHeader(key, value);
                }
            });
            
            // Set content type
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
// 🛠 HELPER: Headers Build (Fixed Premium Device)
// ==========================================
function buildHeaders(req) {
    const headers = {};

    // 🔥 Copy original headers except problematic ones
    if (req.headers) {
        Object.keys(req.headers).forEach(key => {
            if (!['accept-encoding', 'content-length', 'host', 'connection'].includes(key.toLowerCase())) {
                headers[key] = req.headers[key];
            }
        });
    }

    // 🔥 Override with premium device headers
    headers['project'] = 'mar-show';
    headers['pkg'] = 'com.marshows';
    headers['device-id'] = 'ca6e0ece0e7e3451';   // Fixed premium device
    headers['platform'] = 'android';
    headers['app-version'] = '3.1.1';
    headers['os-version'] = '16';
    headers['x-client-token'] = 'AIOSA_ENC:UEsXRQptUgxeRGYKDR8NVUEQXlE6BgpeQGwKXAABB09GS1Bt';
    headers['accept'] = 'application/json';
    headers['accept-charset'] = 'UTF-8';
    headers['content-type'] = 'application/json';
    headers['user-agent'] = 'MarShow/3.1.1 (Android; 16)';

    // Add FCM token if not present
    if (!headers['fcm-token']) {
        headers['fcm-token'] = 'eRo13f1dQ2q6EhXay3BiI7:APA91bGQaVEn_4t91bzA3Np2Bd33LxLneMh1fbS9AvRnjkglgt2-zT15S3gGMM9fiWAtZcHCGkRUPDWlzwo1H9JdVHOHV42TxPMFBYjT5svVydit9lCwv9w';
    }

    if (!headers['apps-flyer-id']) {
        headers['apps-flyer-id'] = '1785053309902-1698556423230743718';
    }

    if (!headers['af-status']) {
        headers['af-status'] = 'Organic';
    }

    return headers;
}
