const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload директор үүсгэх
const uploadDir = process.env.UPLOAD_PATH || "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage тохируулга
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique нэр үүсгэх: timestamp + random + extension
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

// Файлын төрөл шалгах
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error("Зөвхөн зураг файл оруулна уу (jpeg, jpg, png, webp, gif)"));
};

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
});

module.exports = upload;