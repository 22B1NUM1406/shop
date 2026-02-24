const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET  /api/products        — Бүх бүтээгдэхүүн (нийтэд нээлттэй)
// POST /api/products        — Нэмэх (Admin)
router
    .route("/")
    .get(getProducts)
    .post(protect, upload.single("image"), createProduct);

// GET    /api/products/:id  — Нэг бүтээгдэхүүн
// PUT    /api/products/:id  — Засах (Admin)
// DELETE /api/products/:id  — Устгах (Admin)
router
    .route("/:id")
    .get(getProduct)
    .put(protect, upload.single("image"), updateProduct)
    .delete(protect, deleteProduct);

// POST /api/products/:id/upload — Зураг тусдаа upload хийх (Admin)
router.post("/:id/upload", protect, upload.single("image"), uploadImage);

module.exports = router;