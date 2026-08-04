// ==========================================
// 🔥 ULTIMATE UNLOCK - FIXED VERSION
// ==========================================

const unlockAllEpisodes = (data) => {
    if (!data || typeof data !== 'object') return data;
    
    const deepUnlock = (item) => {
        if (!item || typeof item !== 'object') return item;
        
        // Main fields
        item.isPremium = false;
        item.is_premium = false;
        item.locked = false;
        item.free = true;
        item.paid = false;
        item.is_coin_user = true;
        item.is_paid = false;
        item.is_locked = false;
        item.is_free = true;
        item.premium = false;
        item.is_premium_episode = false;
        item.requires_purchase = false;
        item.requires_subscription = false;
        
        // VIP/Coin fields
        item.is_vip = true;
        item.vip_status = 'active';
        item.vip_timestamp = '2099-12-31T23:59:59Z';
        item.coins = 999999;
        item.coin_balance = 999999;
        item.is_coin_user = true;
        
        // Counts
        item.unlocked_episodes_count = 999999;
        item.episodes_count = 999999;
        item.tab_count = 999999;
        item.episode_locking_point = 999999;
        item.higher_episode_locking_point = 999999;
        item.total_episodes = 999999;
        item.free_episodes = 999999;
        
        // Show/Series fields
        item.is_series_premium = false;
        item.series_locked = false;
        item.series_paid = false;
        item.series_free = true;
        
        // Stories array
        if (Array.isArray(item.stories)) {
            item.stories.forEach((story, index) => {
                if (story && typeof story === 'object') {
                    story.isPremium = false;
                    story.is_premium = false;
                    story.locked = false;
                    story.free = true;
                    story.paid = false;
                    story.is_coin_user = true;
                    story.is_paid = false;
                    story.is_locked = false;
                    story.is_free = true;
                    story.premium = false;
                    story.seq_number = index + 1;
                    story.natural_sequence_number = index + 1;
                    story.is_drm = false;
                    story.is_drm_enabled = false;
                    story.is_playable = true;
                    story.downloadable = true;
                    story.downloadable_status = true;
                    story.playable = true;
                    story.accessible = true;
                    
                    // Fix URLs
                    ['video_url', 'media_url', 'media_url_enc', 'hls_url', 'audio_url', 'stream_url'].forEach(field => {
                        if (story[field]) {
                            story[field] = story[field].replace('http://', 'https://');
                        }
                    });
                }
            });
        }
        
        // Episodes array
        if (Array.isArray(item.episodes)) {
            item.episodes.forEach((episode) => {
                if (episode && typeof episode === 'object') {
                    episode.isPremium = false;
                    episode.is_premium = false;
                    episode.locked = false;
                    episode.free = true;
                    episode.paid = false;
                    episode.is_coin_user = true;
                    episode.is_paid = false;
                    episode.is_locked = false;
                    episode.is_free = true;
                    episode.premium = false;
                    episode.requires_purchase = false;
                    episode.requires_subscription = false;
                }
            });
        }
        
        // Chapters array
        if (Array.isArray(item.chapters)) {
            item.chapters.forEach((chapter) => {
                if (chapter && typeof chapter === 'object') {
                    chapter.isPremium = false;
                    chapter.is_premium = false;
                    chapter.locked = false;
                    chapter.free = true;
                    chapter.paid = false;
                }
            });
        }
        
        return item;
    };
    
    if (Array.isArray(data)) {
        data.forEach(item => deepUnlock(item));
    } else {
        // Recursively traverse nested objects
        const traverse = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;
            
            Object.keys(obj).forEach(key => {
                if (Array.isArray(obj[key])) {
                    obj[key].forEach(item => {
                        if (item && typeof item === 'object') {
                            deepUnlock(item);
                            traverse(item);
                        }
                    });
                } else if (obj[key] && typeof obj[key] === 'object') {
                    traverse(obj[key]);
                }
            });
            
            return deepUnlock(obj);
        };
        traverse(data);
    }
    
    return data;
};

// ==========================================
// 🎯 PLAY DETAILS WITH FORCED UNLOCK
// ==========================================
if (cleanPath.includes('/v2/content_api/show.play_details') || 
    cleanPath.includes('/v3/feed/player') ||
    cleanPath.includes('/v1/content/play') ||
    cleanPath.includes('/v2/content/play') ||
    cleanPath.includes('/story/play') ||
    cleanPath.includes('/episode/play')) {
    try {
        const headers = buildHeaders(req);
        const targetUrl = getTargetUrl(cleanPath);
        
        const response = await fetch(targetUrl + urlPath, {
            method: method,
            headers: headers,
            body: method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined
        });
        
        let data = await response.json();
        
        // FORCE UNLOCK - Multiple passes
        data = unlockAllEpisodes(data);
        
        // Additional forced unlock for specific fields
        if (data && data.data) {
            data.data = unlockAllEpisodes(data.data);
        }
        if (data && data.result) {
            data.result = unlockAllEpisodes(data.result);
        }
        if (data && data.show) {
            data.show = unlockAllEpisodes(data.show);
        }
        
        // Set success flag
        data.success = true;
        data.status = 200;
        data.message = "Success";
        
        // Add branding
        data = addBrandingToAll(data);
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('Play details error:', error);
        // Return fake success with empty data
        return res.status(200).json({
            status: 200,
            success: true,
            message: "Success",
            data: {
                stories: [],
                isPremium: false,
                locked: false,
                free: true
            }
        });
    }
}
