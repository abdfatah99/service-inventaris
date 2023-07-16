import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/collection-image");
    },
    filename: (req, file, cb) => {
      /**
       * before : Mon Jan 02 2023 13:20:38
       * after  : Mon Jan 02 2023 13-18-59
       * this because you can't add : in directory search
       */
        cb(null, new Date().toString().replace(/:/g, "-") + file.originalname);
    },
});

/**
 * filter -> only jpeg and png are accepted
 * 
 * @param {*} req 
 * @param {*} file 
 * @param {*} cb 
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        const error = new Error("Only .jpeg and .png are accepted");
        cb(error, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter,
});

export default upload;
