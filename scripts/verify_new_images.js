import https from 'https';

const urls = [
    'https://images.unsplash.com/photo-1589647365583-d87e13d4ccbb?w=800&q=80', // Potential Gobi
    'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?w=800&q=80', // Potential Malai Kofta
    'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=800&q=80', // Potential Gulab Jamun
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', // Paneer/Green curry
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', // Healthy food
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
