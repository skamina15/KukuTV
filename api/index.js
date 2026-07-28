// ==========================================
// 🎯 DrXmas PROXY - SIMPLE VIDEO FIX
// ==========================================

export default async function handler(req, res) {
    let urlPath = req.headers['x-invoke-path'] || req.url;
    const cleanPath = urlPath.split('?')[0];
    const method = req.method;
    const targetBaseUrl = "https://www.drxmas.online";

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // 🔥 SIMPLE VIDEO UNLOCK
    // ==========================================
    const unlockVideo = (data) => {
        if (!data) return data;
        
        // Agar array hai toh har item ko unlock karo
        if (Array.isArray(data)) {
            return data.map(item => unlockVideo(item));
        }
        
        // Agar object hai toh
        if (typeof data === 'object') {
            // Sab important flags set karo
            data.vip = 1;
            data.isVip = true;
            data.premium = true;
            data.free = true;
            data.locked = false;
            data.can_play = true;
            data.playable = true;
            data.available = true;
            data.status = "active";
            data.price = "0";
            data.need_auth = false;
            data.drm_enabled = false;
            
            // Video URL fix - Tencent Cloud hatao
            const urlKeys = ['url', 'video_url', 'play_url', 'stream_url', 'source_url', 'source', 'video', 'play'];
            urlKeys.forEach(key => {
                if (data[key] && typeof data[key] === 'string') {
                    // Agar Tencent ka URL hai toh direct URL banao
                    if (data[key].includes('tencent') || data[key].includes('cloud')) {
                        // Sirf base URL lo, saare params hatao
                        data[key] = data[key].split('?')[0];
                    }
                    // HTTP ko HTTPS mein convert karo
                    data[key] = data[key].replace('http://', 'https://');
                }
            });
            
            // Recursively unlock nested data
            Object.keys(data).forEach(key => {
                if (data[key] && typeof data[key] === 'object') {
                    data[key] = unlockVideo(data[key]);
                }
            });
        }
        
        return data;
    };

    // ==========================================
    // 🎯 VIDEO SOURCE - MAIN FIX
    // ==========================================
    if (cleanPath.includes('/api/video/source') || 
        cleanPath.includes('/api/play/source') ||
        cleanPath.includes('/api/get/play') ||
        cleanPath.includes('/api/source/')) {
        
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            
            let data = await response.json();
            
            // Video URL extract karo
            let videoUrl = null;
            if (data.data) {
                // Pehle existing URL dhoondo
                const urlKeys = ['source', 'url', 'video', 'play_url', 'stream_url', 'hls_url', 'm3u8'];
                for (let key of urlKeys) {
                    if (data.data[key]) {
                        videoUrl = data.data[key];
                        break;
                    }
                }
                
                // Agar URL mil gaya toh clean karo
                if (videoUrl) {
                    // Tencent aur auth parameters hatao
                    if (videoUrl.includes('tencent') || videoUrl.includes('auth') || videoUrl.includes('sign')) {
                        videoUrl = videoUrl.split('?')[0];
                    }
                    videoUrl = videoUrl.replace('http://', 'https://');
                    
                    // Saari jagah clean URL set karo
                    data.data.source = videoUrl;
                    data.data.url = videoUrl;
                    data.data.video = videoUrl;
                    data.data.play_url = videoUrl;
                    data.data.stream_url = videoUrl;
                    data.data.direct_url = videoUrl;
                    data.data.can_play = true;
                    data.data.playable = true;
                    data.data.available = true;
                    data.data.need_auth = false;
                    data.data.drm_enabled = false;
                } else {
                    // Agar URL nahi mila toh fallback video do
                    data.data = {
                        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        can_play: true,
                        playable: true,
                        available: true,
                        need_auth: false,
                        drm_enabled: false,
                        status: "active"
                    };
                }
            }
            
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: data.data || {},
                success: true
            });
            
        } catch (error) {
            console.error('Source Error:', error);
            // Fallback response
            return res.status(200).json({
                code: 200,
                message: "Success",
                data: {
                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    can_play: true,
                    playable: true,
                    available: true,
                    need_auth: false,
                    drm_enabled: false
                },
                success: true
            });
        }
    }

    // ==========================================
    // 🎯 VIDEO/DRAMA DETAILS
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
            
            if (data.data) {
                data.data = unlockVideo(data.data);
            }
            
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
                data.data.isVip = true;
                data.data.premium = true;
                data.data.level = "1";
                data.data.score = "99999";
                data.data.vipExpiry = "2099-12-31";
                data.data.plan = "Lifetime Premium";
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
                data.data = data.data.map(item => unlockVideo(item));
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🚫 ADS BLOCK
    // ==========================================
    if (cleanPath.includes('/analytics') || 
        cleanPath.includes('/heartbeat') || 
        cleanPath.includes('/track') ||
        cleanPath.includes('/ad/')) {
        return res.status(200).json({ 
            code: 200, 
            message: "SUCCESS", 
            data: null 
        });
    }

    // ==========================================
    // 🔓 FAKE UNLOCK
    // ==========================================
    if (cleanPath.includes('/order/create') || 
        cleanPath.includes('/product/unlock') || 
        cleanPath.includes('/pay')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                orderId: "FAKE_" + Date.now(),
                status: "PAID",
                success: true,
                unlocked: true
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

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            if (typeof req.body === 'string') {
                fetchOptions.body = req.body;
            } else if (typeof req.body === 'object') {
                fetchOptions.body = JSON.stringify(req.body);
            }
        }

        const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            
            if (data.data) {
                data.data = unlockVideo(data.data);
            }

            return res.status(response.status).json(data);
        } else {
            const buffer = Buffer.from(await response.arrayBuffer());
            return res.status(response.status).send(buffer);
        }

    } catch (error) {
        console.error('Proxy Error:', error);
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

    // Original headers copy
    if (req.headers) {
        Object.keys(req.headers).forEach(key => {
            if (!['accept-encoding', 'content-length', 'host'].includes(key.toLowerCase())) {
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
    headers['content-type'] = 'application/json';
    headers['user-agent'] = 'MarShow/3.1.1 (Android; 16)';
    headers['fcm-token'] = 'eRo13f1dQ2q6EhXay3BiI7:APA91bGQaVEn_4t91bzA3Np2Bd33LxLneMh1fbS9AvRnjkglgt2-zT15S3gGMM9fiWAtZcHCGkRUPDWlzwo1H9JdVHOHV42TxPMFBYjT5svVydit9lCwv9w';
    headers['apps-flyer-id'] = '1785053309902-1698556423230743718';
    headers['af-status'] = 'Organic';
    
    return headers;
}
