const fs = require("fs");
const pdfParse = require("pdf-parse");

const Document = require("../models/Document");
const chunkText = require("../utils/textChunker");

const uploadPDF = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF Uploaded",
      });
    }

    // Read uploaded PDF
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);

    // Split text into chunks
    const chunks = chunkText(pdfData.text);

    // Save document in MongoDB
    const document = await Document.create({
      user: req.user.id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      extractedText: pdfData.text,
      chunks: chunks,
    });

    // Success response
    res.status(201).json({
      success: true,
      message: "PDF Uploaded Successfully",
      pages: pdfData.numpages,
      characters: pdfData.text.length,
      totalChunks: chunks.length,
      document,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadPDF,
};