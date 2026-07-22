const fs = require("fs");
const Document = require("../models/Document");

// ======================
// Dashboard
// ======================

const getDashboard = async (req, res) => {
  try {
    const documents = await Document.find({
      user: req.user.id,
    });

    let totalChunks = 0;

    documents.forEach((doc) => {
      if (doc.chunks) {
        totalChunks += doc.chunks.length;
      }
    });

    res.json({
      success: true,
      totalDocuments: documents.length,
      totalChunks,
      aiStatus: "Ready",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================
// My Documents
// ======================

const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      user: req.user.id,
    }).sort({
      uploadedAt: -1,
    });

    res.json({
      success: true,
      documents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================
// Delete Document
// ======================

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete PDF file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete MongoDB document
    await Document.findByIdAndDelete(document._id);

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getDashboard,
  getMyDocuments,
  deleteDocument,
};