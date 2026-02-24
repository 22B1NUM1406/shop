const Product = require("../models/Product");
const path = require("path");
const fs = require("fs");

// @desc    Бүх бүтээгдэхүүн авах
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { search, page = 1, limit = 20, sort = "-createdAt" } = req.query;

        const query = { isActive: true };

        // Search
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [products, total] = await Promise.all([
            Product.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
            Product.countDocuments(query),
        ]);

        res.json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: products,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Нэг бүтээгдэхүүн авах
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || !product.isActive) {
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }

        res.json({ success: true, data: product });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Бүтээгдэхүүн нэмэх
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;

        // Validation
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Нэр болон үнэ заавал байна",
            });
        }

        // Зураг upload хийсэн бол path авах
        let imagePath = req.body.image || "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const product = await Product.create({
            name,
            price: Number(price),
            description: description || "",
            image: imagePath,
        });

        res.status(201).json({ success: true, data: product });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Бүтээгдэхүүн засах
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }

        const { name, price, description } = req.body;
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = Number(price);
        if (description !== undefined) updateData.description = description;

        // Шинэ зураг upload хийсэн бол хуучин устгах
        if (req.file) {
            if (product.image && product.image.startsWith("/uploads/")) {
                const oldPath = path.join(__dirname, "..", product.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            updateData.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image !== undefined) {
            updateData.image = req.body.image;
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: updated });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Бүтээгдэхүүн устгах
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }

        // Зургийн файл устгах
        if (product.image && product.image.startsWith("/uploads/")) {
            const imagePath = path.join(__dirname, "..", product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.deleteOne();

        res.json({ success: true, message: "Бүтээгдэхүүн устгагдлаа" });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Зураг upload хийх (тусдаа endpoint)
// @route   POST /api/products/:id/upload
// @access  Private (Admin)
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Зураг оруулна уу" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            // Upload хийсэн файл устгах
            fs.unlinkSync(path.join(__dirname, "..", "uploads", req.file.filename));
            return res.status(404).json({ success: false, message: "Бүтээгдэхүүн олдсонгүй" });
        }

        // Хуучин зураг устгах
        if (product.image && product.image.startsWith("/uploads/")) {
            const oldPath = path.join(__dirname, "..", product.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        product.image = `/uploads/${req.file.filename}`;
        await product.save();

        res.json({
            success: true,
            imageUrl: product.image,
            data: product,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImage };