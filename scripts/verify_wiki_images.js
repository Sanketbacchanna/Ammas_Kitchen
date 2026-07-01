import https from 'https';

const urls = [
    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Gobi_Manchurian.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/a/a2/Paneer_tikka_dry.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/c4/Gulab_jamun_%28Gibraltar%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Malai_Kofta_at_Kamat.jpg'
];

const checkUrl = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(`${res.statusCode} - ${url}`);
            resolve();
        }).on('error', (e) => {
            console.log(`Error - ${url}`);
            resolve();
        });
    });
};

const verify = async () => {
    await Promise.all(urls.map(checkUrl));
};

verify();
