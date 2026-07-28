// ==========================================
// 🎯 DrXmas / Mar-Show PROXY (No Device Lock)
// ==========================================

export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://www.drxmas.online";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // ==========================================
    // 🏷️ BRANDING INJECTION FUNCTION
    // ==========================================
    const BRAND = " | @Az_Mods_Adda";

    const injectBranding = (obj) => {
        const targetKeys = ['name', 'title', 'drama_name', 'text', 'remark', 'content', 'summary', 'covert', 'label', 'categoryCode'];

        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                if (typeof obj[key] === 'string' && targetKeys.includes(key)) {
                    if (!obj[key].includes('@Az_Mods_Adda')) {
                        obj[key] = obj[key] + BRAND;
                    }
                } 
                else if (typeof obj[key] === 'object') {
                    injectBranding(obj[key]);
                }
            }
        }
    };

    // ==========================================
    // 🎯 VIP / PREMIUM SPOOF
    // ==========================================
    if (urlPath.includes('/api/user/v2/profile')) {
        try {
            const headers = buildHeaders(req);
            const response = await fetch(targetBaseUrl + urlPath, {
                method: method,
                headers: headers
            });
            let data = await response.json();

            // 🔥 VIP ko 1 karo (Active)
            if (data.data) {
                data.data.vip = 1;
                data.data.level = "1";
                data.data.score = "99999";
                data.data.vipExpiry = "2099-12-31";
                data.data.plan = "Lifetime Premium";
            }

            injectBranding(data);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // ==========================================
    // 🚫 ADS / ANALYTICS / TRACKING BLOCK
    // ==========================================
    if (urlPath.includes('/analytics') || 
        urlPath.includes('/heartbeat') || 
        urlPath.includes('/impression') || 
        urlPath.includes('/track') ||
        urlPath.includes('/log')) {
        return res.status(200).json({ code: 200, message: "SUCCESS", data: null });
    }

    // ==========================================
    // 🔓 UNLOCK / BUY / ORDER FAKE RESPONSE
    // ==========================================
    if (urlPath.includes('/order/create') || 
        urlPath.includes('/product/unlock') || 
        urlPath.includes('/pay')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                orderId: "FAKE_" + Date.now(),
                status: "PAID",
                unlockTime: Date.now()
            },
            success: true
        });
    }

    // ==========================================
    // 🔄 BAAKI SARI REQUESTS FORWARD KARO
    // ==========================================
    try {
        const headers = buildHeaders(req);
        
        delete headers['accept-encoding'];
        delete headers['content-length'];
        delete headers['host'];

        const fetchOptions = {
            method: method,
            headers: headers,
            timeout: 30000,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const response = await fetch(targetBaseUrl + urlPath, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            injectBranding(data);

            if (urlPath.includes('/category/item') && data.data) {
                if (Array.isArray(data.data)) {
                    data.data.forEach(item => injectBranding(item));
                }
            }

            return res.status(response.status).json(data);
        } 
        else {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            response.headers.forEach((value, key) => {
                if (key !== 'content-encoding' && key !== 'content-length') {
                    res.setHeader(key, value);
                }
            });
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
    const headers = { ...req.headers };

    // 🔥 Ye headers har request mein override honge
    // Isse koi bhi device premium features use kar sakta hai
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
    
    delete headers['accept-encoding'];
    delete headers['content-length'];
    delete headers['host'];

    return headers;
}
