require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ragdoc-ai.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, Render health checks, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to RAGDoc AI Backend 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;