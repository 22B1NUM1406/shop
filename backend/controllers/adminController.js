const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Token үүсгэх helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
};

// @desc    Admin нэвтрэх
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Хэрэглэгчийн нэр болон нууц үг оруулна уу",
        });
    }

    try {
        // Admin хайх (password-тай хамт)
        const admin = await Admin.findOne({ username: username.toLowerCase() }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна",
            });
        }

        // Нууц үг шалгах
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна",
            });
        }

        const token = generateToken(admin._id);

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                username: admin.username,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

// @desc    Token шалгах / Профайл авах
// @route   GET /api/admin/me
// @access  Private
const getMe = async (req, res) => {
    res.json({
        success: true,
        admin: {
            id: req.admin._id,
            username: req.admin.username,
            createdAt: req.admin.createdAt,
        },
    });
};

// @desc    Нууц үг солих
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Одоогийн болон шинэ нууц үг оруулна уу",
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Нууц үг хамгийн багадаа 6 тэмдэгт байна",
        });
    }

    try {
        const admin = await Admin.findById(req.admin._id).select("+password");
        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Одоогийн нууц үг буруу байна",
            });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({ success: true, message: "Нууц үг амжилттай солигдлоо" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Серверийн алдаа" });
    }
};

module.exports = { login, getMe, changePassword };