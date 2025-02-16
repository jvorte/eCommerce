const multer = require('multer');

// Ρύθμιση για το σημείο αποθήκευσης των αρχείων και το όνομα του αρχείου
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ο φάκελος που θα αποθηκεύονται οι εικόνες
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Προσθήκη timestamp στο όνομα του αρχείου
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

