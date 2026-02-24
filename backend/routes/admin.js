const express = require("express");
const router = express.Router();
const { login, getMe, changePassword } = require("../controllers/adminController");
const { protect } = require("../middleware/auth");

// POST /api/admin/login
router.post("/login", login);

// GET /api/admin/me  (token шалгах)
router.get("/me", protect, getMe);

// PUT /api/admin/change-password
router.put("/change-password", protect, changePassword);

module.exports = router;