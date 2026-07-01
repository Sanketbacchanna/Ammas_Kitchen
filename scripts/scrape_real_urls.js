import { exec } from 'child_process';

const pageUrls = [
    'https://commons.wikimedia.org/wiki/File:Paneer_tikka_dry.jpg', // Changed to specific file verified earlier in search
    'https://commons.wikimedia.org/wiki/File:Gobi_Manchurian.jpg',
    'https://commons.wikimedia.org/wiki/File:Hara_bhara_kabab-.JPG', // Specific one
    'https://commons.wikimedia.org/wiki/File:Cheese_corn_balls.JPG',
    'https://commons.wikimedia.org/wiki/File:Paneerbuttermasala.JPG',
    'https://commons.wikimedia.org/wiki/File:Palak_Paneer_curry_on_plate.jpg', // Clearer name
    'https://commons.wikimedia.org/wiki/File:Malai_Kofta.JPG', // Trying a simpler one if exists, or searching
    'https://commons.wikimedia.org/wiki/File:Mushroom_Curry_and_Rumali_Roti.PNG',
    'https://commons.wikimedia.org/wiki/File:Dal_Makhani.jpg',
    'https://commons.wikimedia.org/wiki/File:Veg_Biryani.jpg', // Using the exact capitalization found in search
    'https://commons.wikimedia.org/wiki/File:Jeera-rice.JPG',
    'https://commons.wikimedia.org/wiki/File:Butter_Naan.jpg',
    'https://commons.wikimedia.org/wiki/File:Garlic_Naan.JPG',
    'https://commons.wikimedia.org/wiki/File:Tandoori-roti.jpg',
    'https://commons.wikimedia.org/wiki/File:Gulab_Jamuns.jpg',
    'https://commons.wikimedia.org/wiki/File:Rasmalai_-_the_King_of_Indian_Sweets.JPG'
];

// Helper to curl the page and extract the link
const getUrl = (pageUrl) => {
    return new Promise((resolve) => {
        exec(`curl -L -s -A "Mozilla/5.0" "${pageUrl}" | grep -o 'https://upload.wikimedia.org/wikipedia/commons/[^"]*' | grep -v 'thumb' | head -n 1`, (error, stdout) => {
            if (error) {
                console.log(`Error: ${pageUrl}`);
                resolve(null);
            } else {
                const url = stdout.trim();
                // If standard scrape fails, try finding the "Original file" link specifically
                if (!url) {
                    exec(`curl -L -s -A "Mozilla/5.0" "${pageUrl}" | grep "Original file" -A 2 | grep -o 'https://upload.wikimedia.org/wikipedia/commons/[^"]*'`, (e, out) => {
                        resolve(out.trim() ? out.trim().split('\n')[0] : null);
                    });
                } else {
                    resolve(url);
                }
            }
        });
    });
};

const run = async () => {
    for (const page of pageUrls) {
        const directUrl = await getUrl(page);
        console.log(`PAGE: ${page}`);
        console.log(`DIRECT: ${directUrl}`);
        console.log('---');
        // Simple delay
        await new Promise(r => setTimeout(r, 1000));
    }
};

run();
