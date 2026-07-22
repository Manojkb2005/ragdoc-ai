import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChunks: 0,
    aiStatus: "Ready",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome to RAGDoc AI 🚀
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* Documents */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-gray-400">Documents</h2>
          <p className="text-5xl text-blue-400 mt-3 font-bold">
            {stats.totalDocuments}
          </p>
        </div>

        {/* Chunks */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-gray-400">Chunks</h2>
          <p className="text-5xl text-green-400 mt-3 font-bold">
            {stats.totalChunks}
          </p>
        </div>

        {/* AI Status */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-gray-400">AI Status</h2>
          <p className="text-2xl text-yellow-400 mt-4 font-bold">
            {stats.aiStatus}
          </p>
        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;