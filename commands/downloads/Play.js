const fetch = require('node-fetch');

async function PlaySearch(query) {
    const url = `https://api.rendigital.store/endepoin/playstore?query?${query}`;
    try {
        const voidi = await fetch(url);
        const data = await voidi.json();
        if (!data.status || !data.results || data.results.length === 0) {
            return [];
        }
        return data.results.map(app => ({
            name: app.nama,
            developer: app.developer,
            rating: app.rate2,
            link: app.link,
            developerPage: app.link_dev,
            image: app.img,
        }));
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

module.exports = { PlaySearch };
