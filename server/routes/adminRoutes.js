const express =
require("express");

const router =
express.Router();

const {
  login,
  getMe,
  changePassword
} = require("../controllers/adminController");

const {
  protect
} = require("../middleware/authMiddleware");

const {
  loginLimiter
} = require("../middleware/rateLimiters");

/* PUBLIC — but rate limited */

router.post(
  "/login",
  loginLimiter,
  login
);

/* PROTECTED */

router.get(
  "/me",
  protect,
  getMe
);

router.put(
  "/password",
  protect,
  changePassword
);

module.exports =
router;
