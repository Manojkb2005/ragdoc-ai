import { useState, useEffect, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Controls the mobile sidebar drawer (hidden by default on small screens)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fileRef = useRef();
  const messagesEndRef = useRef();

  // ===========================
  // Auto Scroll
  // ===========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ===========================
  // Load Documents
  // ===========================
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/user/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDocuments(res.data.documents);

      // Restore previously selected PDF
      const saved = localStorage.getItem("selectedPDF");

      if (saved) {
        const found = res.data.documents.find((doc) => doc._id === saved);

        if (found) {
          setSelectedDocument(found);
          return;
        }
      }

      if (res.data.documents.length > 0) {
        setSelectedDocument(res.data.documents[0]);
        localStorage.setItem("selectedPDF", res.data.documents[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // Delete PDF
  // ===========================
  const deletePDF = async (id) => {
    const confirmDelete = window.confirm("Delete this PDF permanently?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/user/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (selectedDocument?._id === id) {
        setSelectedDocument(null);
        setMessages([]);
        localStorage.removeItem("selectedPDF");
      }

      await loadDocuments();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to delete PDF.");
    }
  };

  // ===========================
  // Upload PDF
  // ===========================
  const uploadPDF = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("pdf", file);

      const res = await api.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percent);
        },
      });

      // Add newly uploaded PDF immediately
      const uploadedDocument = res.data.document;

      setDocuments((prev) => [...prev, uploadedDocument]);

      // Automatically switch to new PDF
      setSelectedDocument(uploadedDocument);

      // Save selected PDF
      localStorage.setItem("selectedPDF", uploadedDocument._id);

      // Start a fresh chat
      setMessages([]);
      setQuestion("");

      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

      // Reset file input so the same PDF can be uploaded again later
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  // ===========================
  // Ask AI
  // ===========================
  const askAI = async () => {
    if (!selectedDocument) {
      alert("Please select a PDF first.");
      return;
    }

    if (!question.trim()) return;

    const q = question;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/chat",
        {
          question: q,
          documentId: selectedDocument._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.answer },
      ]);
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: err.response?.data?.message || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectDocument = (doc) => {
    setSelectedDocument(doc);
    localStorage.setItem("selectedPDF", doc._id);
    setMessages([]);
    setSidebarOpen(false); // auto-close drawer on mobile after picking a doc
  };

  return (
    <MainLayout>
      <div className="relative flex h-[100dvh] lg:h-[85vh] overflow-hidden">
        {/* ================= Mobile overlay (behind drawer) ================= */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}

        {/* ================= Sidebar ================= */}
        <div
          className={`fixed lg:static top-0 left-0 z-30 h-full w-72 max-w-[85vw]
            bg-slate-900 border-r border-slate-700 p-5 flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
        >
          {/* Logo + mobile close button */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">
                📚 RAGDoc AI
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Chat with your PDFs
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white text-2xl leading-none p-1"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* New Chat */}
          <button
            onClick={() => {
              setMessages([]);
              setSidebarOpen(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-3 rounded-lg text-white font-semibold transition"
          >
            + New Chat
          </button>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-5">
              <div className="flex justify-between text-gray-300 text-sm mb-1">
                <span>Uploading PDF...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-2 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <h2 className="text-gray-400 mt-8 mb-4">Uploaded PDFs</h2>

          {/* Empty State */}
          {documents.length === 0 && (
            <div className="bg-slate-800 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">📄</div>
              <p className="text-gray-400">No PDFs uploaded yet</p>
            </div>
          )}

          {/* PDF List */}
          <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className={`flex items-center justify-between rounded-xl p-3 transition-all cursor-pointer border ${
                  selectedDocument?._id === doc._id
                    ? "bg-blue-600 border-blue-400 shadow-lg"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700"
                }`}
              >
                <div
                  className="flex-1 min-w-0"
                  onClick={() => selectDocument(doc)}
                >
                  <p className="text-white truncate">
                    📄 {doc.originalName}
                  </p>
                </div>

                <button
                  onClick={() => deletePDF(doc._id)}
                  className="ml-3 text-red-400 hover:text-red-600 text-lg transition p-1"
                  aria-label="Delete PDF"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Chat Area ================= */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b border-slate-700 p-4 sm:p-5 bg-slate-900 flex items-center gap-3">
            {/* Hamburger, mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-2xl text-gray-300 hover:text-white p-1 shrink-0"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                {selectedDocument
                  ? `📄 ${selectedDocument.originalName}`
                  : "🤖 RAGDoc AI"}
              </h1>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm hidden sm:block">
                Ask questions about the selected document
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="text-6xl sm:text-7xl mb-6">🤖</div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                  Welcome to RAGDoc AI
                </h2>
                <p className="text-gray-400 max-w-xl text-sm sm:text-base">
                  Upload a PDF, select it from the sidebar, and start asking
                  questions. Your AI assistant will answer using only the
                  contents of your selected document.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 sm:mb-6 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-3xl rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-white border border-slate-700"
                  }`}
                >
                  <div className="text-sm font-semibold mb-2">
                    {msg.role === "user" ? "You" : "RAGDoc AI"}
                  </div>
                  <div className="whitespace-pre-wrap leading-6 sm:leading-7 text-sm sm:text-base">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm sm:text-base">
                      Thinking
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* ================= INPUT ================= */}
          <div className="border-t border-slate-700 bg-slate-900 p-3 sm:p-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-5">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-800 rounded-full px-3 py-2 sm:px-5 sm:py-3">
              <button
                onClick={() => fileRef.current.click()}
                className="text-xl sm:text-2xl hover:scale-110 transition shrink-0 p-1"
                disabled={uploading}
                aria-label="Upload PDF"
              >
                📎
              </button>

              <input
                hidden
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={uploadPDF}
              />

              <input
                className="flex-1 min-w-0 bg-transparent outline-none text-white placeholder:text-gray-400 text-sm sm:text-base"
                placeholder={
                  uploading
                    ? "Uploading PDF..."
                    : "Ask anything..."
                }
                value={question}
                disabled={loading || uploading}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && !uploading) {
                    askAI();
                  }
                }}
              />

              <button
                onClick={askAI}
                disabled={loading || uploading}
                className={`shrink-0 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold transition text-sm sm:text-base ${
                  loading || uploading
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                } text-white`}
              >
                {loading ? "..." : uploading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Chat;
