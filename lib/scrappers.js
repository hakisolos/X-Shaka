const fetch = require('node-fetch');

async function facebook_dl(url) {
    const apiz = `https://diegoson-naxor-api.hf.space/facebook?url=${url}`;
    try {
        const res = await fetch(apiz);
        if (!res.ok) {
            throw new Error(`Facebook API error: ${res.statusText}`);
        }
        const jsonData = await res.json();
        if (jsonData.status === 200 && jsonData.data) {
            const hdUrl = jsonData.data; 
            return {
                "HD (720p)": hdUrl["720p (HD)"],
                "SD (360p)": hdUrl["360p (SD)"]
            };
        } else {
            throw new Error("No video data found");
        }
    } catch (err) {
        return { error: `Facebook download error: ${err.message}` };
    }
}

async function tiktok_dl(url) {
    try {
        const apis = `https://diegoson-naxor-api.hf.space/tiktok?url=${url}`;
        const res = await fetch(apis);
        if (!res.ok) {
            throw new Error(`TikTok API request failed: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.status !== 200) {
            throw new Error(`TikTok API response error: Status ${data.status}`);
        }

        const v_data = data.data;
        if (!v_data) {
            throw new Error("No video data available");
        }

        const result = {
            id: v_data.id,
            title: v_data.title,
            coverImage: v_data.cover,
            playUrl: v_data.playUrl,
            hdPlayUrl: v_data.hdPlayUrl,
            musicUrl: v_data.musicUrl,
            musicTitle: v_data.musicTitle,
            musicAuthor: v_data.musicAuthor,
            playCount: v_data.playCount,
            diggCount: v_data.diggCount,
            commentCount: v_data.commentCount,
            shareCount: v_data.shareCount,
            downloadCount: v_data.downloadCount,
            avatar: v_data.avatar,
            nickname: v_data.nickname,
            isAd: v_data.isAd,
        };
        return result;
    } catch (error) {
        console.error(`TikTok download error: ${error.message}`);
        return { error: `TikTok download error: ${error.message}` }; 
    }
}

module.exports = { facebook_dl, tiktok_dl };
                
