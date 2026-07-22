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

      await api.post("/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      await loadDocuments();

      setUploadProgress(100);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
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

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row h-[85vh]">
        {/* ================= Sidebar ================= */}
        <div className="w-full lg:w-72 bg-slate-900 border-r border-slate-700 p-5">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-400">
              📚 RAGDoc AI
            </h1>
            <p className="text-gray-400 text-sm mt-1">Chat with your PDFs</p>
          </div>

          {/* New Chat */}
          <button
            onClick={() => setMessages([])}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold transition"
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
          <div className="space-y-3 max-h-[55vh] overflow-y-auto">
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
                  className="flex-1"
                  onClick={() => {
                    setSelectedDocument(doc);
                    localStorage.setItem("selectedPDF", doc._id);
                    setMessages([]);
                  }}
                >
                  <p className="text-white truncate">
                    📄 {doc.originalName}
                  </p>
                </div>

                <button
                  onClick={() => deletePDF(doc._id)}
                  className="ml-3 text-red-400 hover:text-red-600 text-lg transition"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Chat Area ================= */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-slate-700 p-5 bg-slate-900">
            <h1 className="text-2xl font-bold text-white">
              {selectedDocument
                ? `📄 ${selectedDocument.originalName}`
                : "🤖 RAGDoc AI"}
            </h1>
            <p className="text-gray-400 mt-1">
              Ask questions about the selected document
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-7xl mb-6">🤖</div>
                <h2 className="text-4xl font-bold text-white mb-3">
                  Welcome to RAGDoc AI
                </h2>
                <p className="text-gray-400 max-w-xl">
                  Upload a PDF, select it from the sidebar, and start asking
                  questions. Your AI assistant will answer using only the
                  contents of your selected document.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-6 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl rounded-2xl px-5 py-4 shadow-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-white border border-slate-700"
                  }`}
                >
                  <div className="text-sm font-semibold mb-2">
                    {msg.role === "user" ? "You" : "RAGDoc AI"}
                  </div>
                  <div className="whitespace-pre-wrap leading-7">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Thinking</span>
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
          <div className="border-t border-slate-700 bg-slate-900 p-5">
            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-5 py-3">
              <button
                onClick={() => fileRef.current.click()}
                className="text-2xl hover:scale-110 transition"
                disabled={uploading}
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
                className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400"
                placeholder={
                  uploading
                    ? "Uploading PDF..."
                    : "Ask anything about this document..."
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
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  loading || uploading
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
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
