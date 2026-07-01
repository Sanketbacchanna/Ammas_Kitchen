import crypto from 'crypto';
import https from 'https';

const filenames = [
    'Paneer_tikka.jpg',
    'Gobi_Manchurian.jpg',
    'Harabhara_kabab.jpg',
    'Cheese_corn_balls.JPG',
    'Paneerbuttermasala.JPG',
    'Palak_Paneer_(Cottage_cheese_in_spinach_gravy).jpg',
    'Malai_Kofta_at_Kamat.jpg',
    'Mushroom_Masala_by_Dr._Raju_Kasambe_IMG_20190701_(5).jpg',
    'Dal-Makhani.jpg',
    'Veg-Biryani.jpg',
    'Jeera-rice.JPG',
    'Butter_Naan.jpg',
    'Garlic_Naan.JPG',
    'Tandoori-roti.jpg',
    'Gulab_Jamuns.jpg',
    'Rasmalai_-_the_King_of_Indian_Sweets.JPG'
];

const getWikiUrl = (filename) => {
    // Replace spaces with underscores just in case, though usually I provided them with underscores
    const safeFilename = filename.replace(/ /g, '_');
    const md5 = crypto.createHash('md5').update(safeFilename).digest('hex');
    const part1 = md5.substring(0, 1);
    const part2 = md5.substring(0, 2);
    // Standard URL format
    return `https://upload.wikimedia.org/wikipedia/commons/${part1}/${part2}/${safeFilename}`;
};

const checkUrl = (url) => {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            console.log(`${res.statusCode} - ${url}`);
            resolve();
        });
        req.on('error', () => {
            console.log(`Error - ${url}`);
            resolve();
        });
        req.end();
    });
};

const run = async () => {
    for (const filename of filenames) {
        const url = getWikiUrl(filename);
        await checkUrl(url);
    }
};

run();
