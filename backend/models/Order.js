const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
        },
        // Хэрэглэгчийн мэдээлэл
        name: {
            type: String,
            required: [true, "Нэр заавал байна"],
            trim: true,
            maxlength: [100, "Нэр 100 тэмдэгтээс хэтрэхгүй"],
        },
        phone: {
            type: String,
            required: [true, "Утасны дугаар заавал байна"],
            trim: true,
            match: [/^\d{8}$/, "Утасны дугаар 8 оронтой байна"],
        },
        address: {
            type: String,
            required: [true, "Хаяг заавал байна"],
            trim: true,
            maxlength: [500, "Хаяг 500 тэмдэгтээс хэтрэхгүй"],
        },
        // Бүтээгдэхүүний мэдээлэл
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Бүтээгдэхүүн заавал байна"],
        },
        productName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        // Хүргэлтийн төрөл
        delivery: {
            type: String,
            enum: {
                values: ["express", "daily"],
                message: "Хүргэлтийн төрөл буруу байна",
            },
            default: "express",
        },
        // Захиалгын статус
        status: {
            type: String,
            enum: ["pending", "confirmed", "delivered", "cancelled"],
            default: "pending",
        },
        // Төлбөрийн статус
        isPaid: {
            type: Boolean,
            default: false,
        },
        // Нэмэлт тэмдэглэл (adminд)
        adminNote: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Захиалгын дугаар автоматаар үүсгэх
orderSchema.pre("save", async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const prefix = `ORD${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
        const count = await mongoose.model("Order").countDocuments();
        this.orderNumber = `${prefix}-${String(count + 1).padStart(4, "0")}`;
    }
    next();
});

// Index for faster queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model("Order", orderSchema);