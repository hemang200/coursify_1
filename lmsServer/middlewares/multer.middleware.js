import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.mp4'].includes(ext)) {
      cb(new Error(`Unsupported file type: ${ext}`), false);
    } else {
      cb(null, true);
    }
  }
});

export default upload; // ✅ so you can use upload.single() in router
