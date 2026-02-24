const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Хэрэглэгчийн нэр заавал байна"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [3, "Хамгийн багадаа 3 тэмдэгт"],
        },
        password: {
            type: String,
            required: [true, "Нууц үг заавал байна"],
            minlength: [6, "Хамгийн багадаа 6 тэмдэгт"],
            select: false, // query-д автоматаар ирэхгүй
        },
    },
    {
        timestamps: true,
    }
);

// Нууц үг хадгалахаас өмнө hash хийх
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Нууц үг харьцуулах method
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);