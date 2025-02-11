import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb("Please upload only images or videos.", false);
  }
};

const filterSingleImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only a image.", false);
  }
};

const upload = multer({ storage: storage, fileFilter: filter });
const uploadImage = multer({ storage: storage, fileFilter: filterSingleImage });

export const uploadFiles = upload.array('files', 10);
export const uploadImage = uploadImage.single('image');
export default upload;
