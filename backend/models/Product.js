const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Бүтээгдэхүүний нэр заавал байна"],
            trim: true,
            maxlength: [200, "Нэр 200 тэмдэгтээс хэтрэхгүй байна"],
        },
        price: {
            type: Number,
            required: [true, "Үнэ заавал байна"],
            min: [0, "Үнэ 0-ээс бага байж болохгүй"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Тайлбар 2000 тэмдэгтээс хэтрэхгүй байна"],
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search
productSchema.index({ name: "text", description: "text" });

// Virtual for formatted price
productSchema.virtual("formattedPrice").get(function () {
    return `₮${this.price.toLocaleString("mn-MN")}`;
});

module.exports = mongoose.model("Product", productSchema);