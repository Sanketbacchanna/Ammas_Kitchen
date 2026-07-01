import https from 'https';

const urls = [
    'https://upload.wikimedia.org/wikipedia/commons/2/22/Paneer_tikka.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Gobi_Manchurian.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Harabhara_kabab.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Cheese_corn_balls.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/3/30/Paneerbuttermasala.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/Palak_Paneer_%28Cottage_cheese_in_spinach_gravy%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Malai_Kofta_at_Kamat.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5a/Mushroom_Masala_by_Dr._Raju_Kasambe_IMG_20190701_%285%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/29/Dal-Makhani.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/a2/Veg-Biryani.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/05/Jeera-rice.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Butter_Naan.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/de/Garlic_Naan.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/Tandoori-roti.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/8/87/Gulab_Jamuns.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/50/Rasmalai_-_the_King_of_Indian_Sweets.JPG'
];

const checkUrl = (url) => {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => { // Adding UA to avoid 403
            console.log(`${res.statusCode} - ${url}`);
            resolve();
        }).on('error', (e) => {
            console.log(`Error - ${url} : ${e.message}`);
            resolve();
        });
    });
};

const verify = async () => {
    await Promise.all(urls.map(checkUrl));
};

verify();
