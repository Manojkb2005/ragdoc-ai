const express = require("express");
const protect = require("../middleware/authMiddleware");
const { askQuestion } = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, askQuestion);

module.exports = router;