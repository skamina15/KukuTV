export default async function handler(req, res) {
    const urlPath = req.headers["x-invoke-path"] || req.url;
    const method = req.method;
    const realApiUrl = "https://kukufm.com" + urlPath;

    res.setHeader("Content-Type", "application/json; charset=UTF-8");

    try {
        const headers = { ...req.headers };
        // Remove headers that might cause issues or are specific to the proxy environment
        delete headers["accept-encoding"];
        delete headers["content-length"];
        delete headers["host"];
        delete headers["x-invoke-path"]; // Remove proxy-specific header
        delete headers["x-invoke-query"]; // Remove proxy-specific header

        let requestBody = undefined;

        // Handle POST request body specifically for application/x-www-form-urlencoded
        if (method !== "GET" && method !== "HEAD" && req.body) {
            const contentType = req.headers["content-type"];
            if (contentType && contentType.includes("application/x-www-form-urlencoded")) {
                // req.body for form-urlencoded might already be parsed by some frameworks
                // If it's an object, convert it back to URLSearchParams string
                if (typeof req.body === 'object') {
                    const params = new URLSearchParams();
                    for (const key in req.body) {
                        if (Object.hasOwnProperty.call(req.body, key)) {
                            params.append(key, req.body[key]);
                        }
                    }
                    requestBody = params.toString();
                } else if (typeof req.body === 'string') {
                    requestBody = req.body;
                }
            } else if (typeof req.body === 'object') {
                // For other content types like application/json, assume it's already parsed
                requestBody = JSON.stringify(req.body);
                headers["content-type"] = "application/json"; // Ensure correct content-type for JSON body
            } else {
                requestBody = req.body;
            }
        }

        console.log(`Proxying request to: ${realApiUrl} with method: ${method}`);
        console.log("Request Headers:", headers);
        console.log("Request Body:", requestBody);

        const fetchOptions = {
            method: method,
            headers: headers,
        };

        if (requestBody !== undefined) {
            fetchOptions.body = requestBody;
        }

        const response = await fetch(realApiUrl, fetchOptions);
        const contentType = response.headers.get("content-type") || "";

        // Copy headers from real API response to proxy response
        response.headers.forEach((value, key) => {
            if (key !== "content-encoding" && key !== "content-length") {
                res.setHeader(key, value);
            }
        });

        if (contentType.includes("application/json")) {
            let data = await response.json();
            console.log("Original API Response Data:", data);

            // Inject premium status into the actual user data
            data = injectPremiumStatus(data);
            console.log("Modified API Response Data:", data);

            return res.status(response.status).json(data);
        } else {
            // For non-JSON responses (e.g., images, audio), stream them directly
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return res.status(response.status).send(buffer);
        }

    } catch (error) {
        console.error("Global Proxy Error:", error);
        // Fallback to a generic premium response if the real API call fails
        // This ensures the app always sees a premium user, even if the API is down
        // However, it will use the hardcoded ID for the user object.
        // For session token, it will return getPremiumResponse()
        if (urlPath.includes("/users/get-session-token")) {
            console.warn("Falling back to getPremiumResponse() due to error.");
            return res.status(200).json(getPremiumResponse());
        } else if (urlPath.includes("/users/me") || urlPath.includes("/profile") || urlPath.includes("/get-profile")) {
            console.warn("Falling back to getPremiumProfile() due to error.");
            return res.status(200).json(getPremiumProfile());
        } else {
            return res.status(500).json({
                code: 500,
                message: "Proxy Error: " + error.message,
                _badboy_mode: true // Indicate badboy mode even on error
            });
        }
    }
}

// ============= 🔥 PREMIUM INJECTION LOGIC =============

function injectPremiumStatus(data) {
    if (!data || typeof data !== 'object') return data;

    // Handle session token response structure
    if (data.user) {
        data.user.has_premium = true;
        data.user.premium_type = "🔥 BAD BOY PREMIUM 🔥";
        data.user.premium_status = "ACTIVE";
        data.user.premium_valid_till = "31 DECEMBER 9999";
        data.user.is_badboy = true;
        data.user.badboy_tag = "[ BAD BOY ]";
        data.user.premium_features = [
            "🎧 Unlimited Podcasts",
            "🚫 No Ads",
            "📱 High Quality Audio",
            "🎁 Exclusive Bad Boy Content",
            "⚡ Priority Access"
        ];
        if (data.user.name && !data.user.name.includes('[ BAD BOY ]')) {
            data.user.name = data.user.name + ' 🔥[ BAD BOY ]';
        }
    }

    // Handle direct profile response structure
    if (data.id && (data.has_premium !== undefined || data.is_premium !== undefined)) {
        data.has_premium = true;
        data.is_premium = true;
        data.premium_status = "ACTIVE [ BAD BOY ]";
        data.premium_plan = "🔥 BAD BOY PREMIUM 🔥";
        data.premium_valid_till = "31 DECEMBER 9999";
        data.badboy_mode = true;
        if (data.name && !data.name.includes('[ BAD BOY ]')) {
            data.name = data.name + ' 🔥[ BAD BOY ]';
        }
    }

    // Global premium flags
    data.has_premium = true;
    data.is_badboy_premium = true;
    data.premium_activated = true;
    data.badboy_mode = true;
    data.badboy_version = "2.0";

    // Extend tokens if present
    if (data.access_token) {
        data.access_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
        data.refresh_token_timestamp = Math.floor(Date.now() / 1000) + 31536000;
    }

    // Apply bad boy tag to content fields recursively
    data = addBadBoyToContent(data);

    return data;
}

// ============= 🔥 FALLBACK RESPONSES (for when real API fails) =============

function getPremiumResponse() {
    console.warn("Using getPremiumResponse() fallback.");
    return {
        refresh_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4NDY5ODA2OSwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.PXswiUDtK7jQoOguJH5pZgpkIwfAishl1NmLwsB7LmxBnSRBpDuIUvQB6-CNQlrj4pJuODiCj_BhgYzp52GwqQ",
        access_token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDYwNjAwMjgsImV4cCI6MTc4MjE1NTc5MCwidW5pcXVlX2lkIjoiZThlOTU0NjgtMWQ2Zi00Yjc3LWExM2MtYWYwNjljNzJlN2FiIn0.uqqKkEauTebFWJeGR-pZah9rIj16X2qydH2J1f6uJxlt0lTbJuwhgfbgYWxZP2IzucS8LvLAfyT7veOX1QVbiA",
        access_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        refresh_token_timestamp: Math.floor(Date.now() / 1000) + 31536000,
        user: {
            id: 146060028,
            sub_profile_id: null,
            name: "🔥 BadBoy Premium 🔥",
            email: "",
            avatar: {
                "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
                "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
            },
            uuid: "badboy_01f37dc7d2c249958116f5db0a77a515",
            has_premium: true,
            premium_type: "🔥 BAD BOY PREMIUM 🔥",
            premium_status: "ACTIVE",
            premium_valid_till: "31 DECEMBER 9999",
            username: "badboy_premium",
            phone: "+919999999999",
            joined_on: Math.floor(Date.now() / 1000),
            firebase_uid: "badboy_Vd2wAmCWBCULJ3n57Hxnzi9p1oo2",
            is_badboy: true,
            badboy_tag: "[ BAD BOY ]",
            premium_features: [
                "🎧 Unlimited Podcasts",
                "🚫 No Ads",
                "📱 High Quality Audio",
                "🎁 Exclusive Bad Boy Content",
                "⚡ Priority Access"
            ]
        },
        select_multi_profile: false,
        has_premium: true,
        is_badboy_premium: true,
        premium_activated: true,
        badboy_mode: true
    };
}

function getPremiumProfile() {
    console.warn("Using getPremiumProfile() fallback.");
    return {
        id: 146060028,
        name: "🔥 BadBoy Premium 🔥",
        email: "",
        has_premium: true,
        is_premium: true,
        premium_status: "ACTIVE [ BAD BOY ]",
        premium_plan: "🔥 BAD BOY PREMIUM 🔥",
        premium_valid_till: "31 DECEMBER 9999",
        badboy_mode: true,
        avatar: {
            "32": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "64": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "128": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg",
            "256": "https://d1l07mcd18xic4.cloudfront.net/sub_profile_avatar_new/arc_svg/arc_9.svg"
        },
        features: [
            "🎧 Unlimited Podcasts",
            "🚫 No Ads",
            "📱 High Quality Audio",
            "🎁 Exclusive Bad Boy Content"
        ]
    };
}

// ============= 🔥 CONTENT TAGGING (for all other APIs) =============

function addBadBoyToContent(data) {
    if (!data || typeof data !== 'object') return data;

    const badBoyFields = ['title', 'name', 'show_name', 'episode_name', 'podcast_name',
                          'description', 'label', 'heading', 'subtitle', 'display_name'];

    if (Array.isArray(data)) {
        return data.map(item => addTags(item, badBoyFields));
    }

    const result = { ...data };

    // Recursively apply tags to common content arrays
    ['data', 'results', 'items', 'content', 'podcasts', 'episodes', 'shows', 'list'].forEach(key => {
        if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].map(item => addTags(item, badBoyFields));
        }
    });

    // Apply tags to the top-level object itself
    return addTags(result, badBoyFields);
}

function addTags(obj, fields) {
    if (!obj || typeof obj !== 'object') return obj;

    const result = { ...obj };

    fields.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
            if (!result[field].includes('[ BAD BOY ]')) {
                result[field] = result[field] + ' [ BAD BOY ]';
            }
        }
    });

    result._premium_unlocked = true;
    result._badboy_mode = true;

    return result;
}
