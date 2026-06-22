export default async function handler(req, res) {
    const urlPath = req.headers['x-invoke-path'] || req.url;
    const method = req.method;
    const targetBaseUrl = "https://api.storymax.app";

    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    // Fake Premium Response for Story Max
    if (urlPath.includes('/profile/subscription/state')) {
        return res.status(200).json({ code: 200, message: "Success", data: { subStat: "2", mc: "0" } });
    }

    if (urlPath.includes('/profile/subscription') && !urlPath.includes('/state')) {
        return res.status(200).json({
            code: 200,
            message: "Success",
            data: {
                subStat: "2",
                plan: "Premium Plan [ BAD BOY ]",
                cta: "Enjoy Premium",
                valdTxt: "Lifetime Active",
                pvend: "JUSPAY",
                sectionTile: { id: "18", lyt: "TS1", acttxt: "", text: "Top 10" },
                valEp: 4102444800000,
                mdActv: true
            }
        });
    }

    if (urlPath.includes('/feedservice/v1/shows/watched')) {
        return res.status(200).json({ code: 200, message: "Updated lastwatched", data: null });
    }

    const isAnalyticsUrl = urlPath.includes('/heartbeat') || urlPath.includes('/impression') || urlPath.includes('/analytics');
    if (isAnalyticsUrl) {
        return res.status(200).json({ status: 200, message: "SUCCESS", data: null });
    }

    // Bad Boy Branding Injector
    const applyBadBoyBranding = (obj) => {
        const brandTag = " \n [ BAD BOY ] ";
        const targetKeys = ['title', 'name', 'drama_name', 'text', 'language'];

        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                if (typeof obj[key] === 'string' && targetKeys.includes(key)) {
                    if (!obj[key].includes('[ BAD BOY ]')) {
                        obj[key] = obj[key].replace(/\[ MODS \]/g, '').replace(/\[ REAL APK \]/g, '').replace(/\[ \]/g, '').trim() + brandTag;
                    }
                } else if (typeof obj[key] === 'object') {
                    applyBadBoyBranding(obj[key]);
                }
            }
        }
    };

    // Story Max Premium Credentials (from your request)
    const STORY_MAX_PREMIUM = {
        deviceId: "6caec8fc10dee519",
        bearerToken: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkRGF0ZSI6IjIwMjYtMDItMDEgMjI6Mjk6NDQuMjMiLCJzZXNzaW9uSWQiOiIxMjQ5MjM4MyIsImRldmljZUlkIjoiNjkwZmM1ODNiNzM5ODM0Iiwic3ViIjoiODM2MyIsImV4cCI6MTc4MTY4MTI4Nn0.AM0mvoEwlxPothDJ4L_vsiJS7IgbPwAEjGI2fyBxdI0",
        os: "Android 15 (API 29)",
        platform: "0",
        appVersion: "12",
        userAgent: "ktor-client",
        fixedIp: "122.168.2.40"
    };

    try {
        const targetUrl = targetBaseUrl + urlPath;

        const headers = { ...req.headers };
        headers['host'] = 'api.storymax.app';
        delete headers['accept-encoding'];
        delete headers['content-length'];

        // Override with premium credentials
        headers['deviceid'] = STORY_MAX_PREMIUM.deviceId;
        headers['authorization'] = STORY_MAX_PREMIUM.bearerToken;
        headers['os'] = STORY_MAX_PREMIUM.os;
        headers['platform'] = STORY_MAX_PREMIUM.platform;
        headers['appversion'] = STORY_MAX_PREMIUM.appVersion;
        headers['user-agent'] = STORY_MAX_PREMIUM.userAgent;
        headers['accept'] = 'application/json';
        headers['accept-charset'] = 'UTF-8';
        headers['content-type'] = 'application/json';
        headers['network_type'] = 'WIFI';

        headers['ts'] = Math.floor(Date.now() / 1000).toString();

        headers['x-forwarded-for'] = STORY_MAX_PREMIUM.fixedIp;
        headers['x-real-ip'] = STORY_MAX_PREMIUM.fixedIp;
        headers['x-client-ip'] = STORY_MAX_PREMIUM.fixedIp;

        delete headers['x-request-id'];
        delete headers['x-b3-traceid'];
        delete headers['x-cloud-trace-context'];

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && method !== 'HEAD' && req.body) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            let data = await response.json();
            applyBadBoyBranding(data);
            return res.status(response.status).json(data);
        } else {
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
        return res.status(500).json({ code: 500, message: "Proxy Error: " + error.message });
    }
}
