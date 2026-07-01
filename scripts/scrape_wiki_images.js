import https from 'https';

const pageUrls = [
    'https://commons.wikimedia.org/wiki/File:Paneer_tikka.jpg',
    'https://commons.wikimedia.org/wiki/File:Gobi_Manchurian.jpg',
    'https://commons.wikimedia.org/wiki/File:Harabhara_kabab.jpg',
    'https://commons.wikimedia.org/wiki/File:Cheese_corn_balls.JPG',
    'https://commons.wikimedia.org/wiki/File:Paneerbuttermasala.JPG',
    'https://commons.wikimedia.org/wiki/File:Palak_Paneer_(Cottage_cheese_in_spinach_gravy).jpg',
    'https://commons.wikimedia.org/wiki/File:Malai_Kofta_at_Kamat.jpg',
    'https://commons.wikimedia.org/wiki/File:Mushroom_Masala_by_Dr._Raju_Kasambe_IMG_20190701_(5).jpg',
    'https://commons.wikimedia.org/wiki/File:Dal-Makhani.jpg',
    'https://commons.wikimedia.org/wiki/File:Veg-Biryani.jpg',
    'https://commons.wikimedia.org/wiki/File:Jeera-rice.JPG',
    'https://commons.wikimedia.org/wiki/File:Butter_Naan.jpg',
    'https://commons.wikimedia.org/wiki/File:Garlic_Naan.JPG',
    'https://commons.wikimedia.org/wiki/File:Tandoori-roti.jpg',
    'https://commons.wikimedia.org/wiki/File:Gulab_Jamuns.jpg',
    'https://commons.wikimedia.org/wiki/File:Rasmalai_-_the_King_of_Indian_Sweets.JPG'
];

const getOriginalImageUrl = (pageUrl) => {
    return new Promise((resolve) => {
        https.get(pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // Look for the "Original file" link or the full resolution link
                // Pattern: <div class="fullMedia"><a href="//upload.wikimedia.org/wikipedia/commons/..."
                const match = data.match(/class="fullMedia"><a href="\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([^"]+)"/);
                if (match) {
                    resolve(`https://upload.wikimedia.org/wikipedia/commons/${match[1]}`);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrape = async () => {
    for (const url of pageUrls) {
        const imgUrl = await getOriginalImageUrl(url);
        if (imgUrl) {
            console.log(`FOUND: ${url} -> ${imgUrl}`);
        } else {
            console.log(`FAILED: ${url}`);
        }
        await delay(1000); // 1 second delay to be polite
    }
};

scrape();
