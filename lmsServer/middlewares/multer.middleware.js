import path from 'path';
import multer from 'multer';

const upload = multer({
    
           dest : "uploads/",
    limits: {
        fileSize: 500 * 1024 * 1024  // 50 MB
    },
    storage: multer.diskStorage({
        destination: 'uploads/'
        ,
        filename: (_req, file, cb) => {
            // console.log("File >", file);
            
            cb(null, file.originalname);
        },
    }),
    fileFilter: (_req,file,cb)=>{
        let ext = path.extname(file.originalname);

        if(
            ext !== '.png' && 
            ext !== '.jpg' && 
            ext !== '.jpeg' && 
            ext !== '.webp' && 
            ext !== '.mp4'
        ) {
            cb(new Error(`Unsupported file type! ${ext}`), false);
             return;
        }
        cb(null, true);
    },
 });

 export default upload;
