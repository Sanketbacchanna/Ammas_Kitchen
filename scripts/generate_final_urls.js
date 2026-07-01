import crypto from 'crypto';

const items = [
    { name: 'Paneer Tikka', filename: 'Paneer_tikka.jpg' },
    { name: 'Gobi Manchurian', filename: 'Gobi_Manchurian.jpg' },
    { name: 'Hara Bhara Kebab', filename: 'Harabhara_kabab.jpg' },
    { name: 'Corn Cheese Balls', filename: 'Cheese_corn_balls.JPG' },
    { name: 'Paneer Butter Masala', filename: 'Paneerbuttermasala.JPG' },
    { name: 'Palak Paneer', filename: 'Palak_Paneer_(Cottage_cheese_in_spinach_gravy).jpg' },
    { name: 'Malai Kofta', filename: 'Malai_kofta.jpg' }, // Guessing simpler filename
    { name: 'Mushroom Masala', filename: 'Mushroom_Masala_by_Dr._Raju_Kasambe_IMG_20190701_(5).jpg' },
    { name: 'Dal Makhani', filename: 'Dal-Makhani.jpg' },
    { name: 'Veg Dum Biryani', filename: 'Veg-Biryani.jpg' },
    { name: 'Jeera Rice', filename: 'Jeera-rice.JPG' },
    { name: 'Butter Naan', filename: 'Butter_Naan.jpg' },
    { name: 'Garlic Naan', filename: 'Garlic_Naan.JPG' },
    { name: 'Tandoori Roti', filename: 'Tandoori-roti.jpg' },
    { name: 'Gulab Jamun', filename: 'Gulab_Jamun.jpg' },
    { name: 'Rasmalai', filename: 'Rasmalai_-_the_King_of_Indian_Sweets.JPG' }
];

const getWikiUrl = (filename) => {
    const safeFilename = filename.replace(/ /g, '_');
    const md5 = crypto.createHash('md5').update(safeFilename).digest('hex');
    const part1 = md5.substring(0, 1);
    const part2 = md5.substring(0, 2);
    const wikiUrl = `https://upload.wikimedia.org/wikipedia/commons/${part1}/${part2}/${safeFilename}`;
    return `https://images.weserv.nl/?url=${encodeURIComponent(wikiUrl)}&w=800`;
};

items.forEach(item => {
    console.log(`${item.name}: ${getWikiUrl(item.filename)}`);
});
