const pdfParse = require("pdf-parse");

const Document = require("../models/Document");
const chunkText = require("../utils/textChunker");

const uploadPDF = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded.",
      });
    }

    console.log("📄 Uploaded File:", req.file.originalname);
    console.log("Starting pdf-parse...");
    console.log("PDF parsed successfully.");
    // Extract text directly from memory
    const pdfData = await pdfParse(req.file.buffer);

    // Check if PDF contains text
    if (!pdfData.text || pdfData.text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "This PDF does not contain readable text.",
      });
    }

    // Split into chunks
    const chunks = chunkText(pdfData.text);

    // Save document
    const document = await Document.create({
      user: req.user.id,
      originalName: req.file.originalname,
      filename: req.file.originalname,
      filePath: "memory",
      extractedText: pdfData.text,
      chunks,
    });

    return res.status(201).json({
      success: true,
      message: "PDF uploaded successfully.",
      pages: pdfData.numpages,
      characters: pdfData.text.length,
      totalChunks: chunks.length,
      document,
    });

  } catch (error) {
    console.error("========== UPLOAD ERROR ==========");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  uploadPDF,
};