import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    console.log("Selected:", selected);
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("pdf", file);

      const response = await api.post("/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      console.log(response.data);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        Upload PDF
      </h1>

      <div className="bg-slate-800 rounded-xl p-8">

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-5 text-white"
        />

        {file && (
          <p className="text-green-400 mb-5">
            Selected: {file.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

      </div>
    </MainLayout>
  );
}

export default Upload;