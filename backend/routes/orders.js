const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

// POST /api/orders   — Захиалга үүсгэх (нэвтрэлгүй хэрэглэгч)
// GET  /api/orders   — Жагсаалт харах (Admin)
router.route("/").post(createOrder).get(protect, getOrders);

// GET /api/orders/:id             — Нэг захиалга (Admin)
// PUT /api/orders/:id/status      — Статус шинэчлэх (Admin)
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;