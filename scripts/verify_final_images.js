import https from 'https';

const urls = [
    'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&q=80', // Potential Gobi (Buffalo Cauliflower)
    'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&q=80', // Gulab Jamun
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80', // Malai Kofta
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
