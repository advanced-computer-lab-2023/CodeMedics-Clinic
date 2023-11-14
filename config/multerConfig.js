const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination folder where the uploaded files will be stored
        console.log('here -->');
        cb(null, 'frontend/el7a2ny-frontend/public/uploads/');
    },
    filename: function (req, file, cb) {
        // Specify the file name for the uploaded files
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
