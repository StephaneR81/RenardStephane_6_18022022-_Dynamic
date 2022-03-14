const multer = require('multer');
//Regex that replaces punctuation characters by space
const regex = /[!"#$%&'()*+,-/:;<=>?@[\]^`{|}~]/g;

const MIME_TYPES = {
    'image/jpg': '.jpg',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/avif': '.avif',
    'image/webp': '.webp'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const safeFilename = file.originalname.split('.')[0].replace(regex, '');
        const name = safeFilename.split(' ').join('_');

        // const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '_' + Date.now() + extension);
    }
});

module.exports = multer({
    storage
}).single('image');