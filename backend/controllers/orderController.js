const Order = require("../models/Order");
const Product = require("../models/Product");

// Банкны мэдээлэл (env-ээс авах боломжтой)
const BANK_INFO = {
    bankName: process.env.BANK_NAME || "Хаан Банк",
    accountName: process.env.ACCOUNT_NAME || "Номад Дэлгүүр ХХК",
    accountNumber: process.env.ACCOUNT_NUMBER || "5043****8821",
};

// @desc    Захиалга үүсгэх (нэвтрэлгүй)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { name, phone, address, delivery, productId } = req.body;

        // Validation
        if (!name || !phone || !address || !productId) {
            return res.status(400).json({
                success: false,
                message: "Нэр, утас, хаяг, бүтээгдэхүүн заавал байна",
            });
        }

        if (!/^\d{8}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Утасны дугаар 8 оронтой байна",
            });
        }

        // Бүтээгдэхүүн шалгах
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Бүтээгдэхүүн олдсонгүй эсвэл идэвхгүй байна",
            });
        }

        // Захиалга үүсгэх
        const order = await Order.create({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            delivery: delivery || "express",
            productId: product._id,
            productName: product.name,
            price: product.price,
        });

        // Хариу - Банкны мэдээлэл хамт явуулах
        res.status(201).json({
            success: true,
            message: "Захиалга амжилттай үүслээ",
            orderNumber: order.orderNumber,
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                productName: order.productName,
                price: order.price,
                delivery: order.delivery,
                status: order.status,
            },
            payment: {
                ...BANK_INFO,
                amount: product.price,
                reference: order.orderNumber,
            },
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }
        if (err.name === "CastError") {
            return res.status(400).json({ success: false, message: "Бүтээгдэхүүний ID буруу байна" });
        }
        console.error("Order create error:", err);
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Бүх захиалга авах (Admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            delivery,
            sort = "-createdAt",
            search,
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (delivery) query.delivery = delivery;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { orderNumber: { $regex: search, $options: "i" } },
                { productName: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [orders, total] = await Promise.all([
            Order.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
            Order.countDocuments(query),
        ]);

        // Статистик
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                    delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
                    totalRevenue: { $sum: "$price" },
                    express: { $sum: { $cond: [{ $eq: ["$delivery", "express"] }, 1, 0] } },
                    daily: { $sum: { $cond: [{ $eq: ["$delivery", "daily"] }, 1, 0] } },
                },
            },
        ]);

        res.json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            stats: stats[0] || {},
            data: orders,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Нэг захиалга авах (Admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("productId", "name price image");

        if (!order) {
            return res.status(404).json({ success: false, message: "Захиалга олдсонгүй" });
        }

        res.json({ success: true, data: order });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ success: false, message: "Захиалга олдсонгүй" });
        }
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Захиалгын статус шинэчлэх (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    try {
        const { status, isPaid, adminNote } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (isPaid !== undefined) updateData.isPaid = isPaid;
        if (adminNote !== undefined) updateData.adminNote = adminNote;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Захиалга олдсонгүй" });
        }

        res.json({ success: true, data: order });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ success: false, message: "Захиалга олдсонгүй" });
        }
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };