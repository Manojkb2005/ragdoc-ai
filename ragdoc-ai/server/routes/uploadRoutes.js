const express = require("express");
const multer = require("multer");

const protect = require("../middleware/authMiddleware");
const { uploadPDF } = require("../controllers/uploadController");

const router = express.Router();

// Store PDF in memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

router.post("/", protect, upload.single("pdf"), uploadPDF);

module.exports = router;