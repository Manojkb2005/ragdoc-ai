import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/user/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(res.data.documents);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDocument = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/user/document/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Document Deleted");

      loadDocuments();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        My Documents
      </h1>

      {documents.length === 0 ? (
        <p className="text-gray-400">
          No uploaded PDFs.
        </p>
      ) : (
        <div className="space-y-4">

          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-slate-800 rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-white text-xl font-semibold">
                  {doc.originalName}
                </h2>

                <p className="text-gray-400">
                  {new Date(doc.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteDocument(doc._id)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white"
              >
                Delete
              </button>
            </div>
          ))}

        </div>
      )}
    </MainLayout>
  );
}

export default Documents;