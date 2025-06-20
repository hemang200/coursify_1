import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage(); // stores file in memory

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!['.png', '.jpg', '.jpeg', '.webp', '.mp4'].includes(ext)) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
    } else {
      cb(null, true);
    }
  }
});

export default upload;
