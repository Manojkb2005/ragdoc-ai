const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboard,
  getMyDocuments,
  deleteDocument,
} = require("../controllers/userController");

// Dashboard
router.get("/dashboard", protect, getDashboard);

// All Documents
router.get("/documents", protect, getMyDocuments);

// Delete Document
router.delete("/documents/:id", protect, deleteDocument);

module.exports = router;