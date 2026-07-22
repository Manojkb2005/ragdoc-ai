import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    logout();
    navigate("/");
  };

  return (
    <MainLayout>

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-8">
          👤 My Profile
        </h1>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 h-36 flex items-end justify-center">

            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl font-bold text-blue-700 border-4 border-slate-800 translate-y-16">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}

            </div>

          </div>

          {/* Content */}

          <div className="pt-20 pb-10 px-10">

            <h2 className="text-3xl font-bold text-white text-center">

              {user?.name || "Unknown User"}

            </h2>

            <p className="text-center text-gray-400 mt-2">

              Welcome to RAGDoc AI

            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-10">

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-gray-400 text-sm">

                  Full Name

                </p>

                <h3 className="text-white text-lg font-semibold mt-2">

                  {user?.name}

                </h3>

              </div>

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-gray-400 text-sm">

                  Email Address

                </p>

                <h3 className="text-white text-lg font-semibold mt-2 break-all">

                  {user?.email}

                </h3>

              </div>

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-gray-400 text-sm">

                  User ID

                </p>

                <h3 className="text-white text-sm mt-2 break-all">

                  {user?.id || "N/A"}

                </h3>

              </div>

              <div className="bg-slate-900 rounded-xl p-5">

                <p className="text-gray-400 text-sm">

                  Account Status

                </p>

                <h3 className="text-green-400 text-lg font-semibold mt-2">

                  ● Active

                </h3>

              </div>

            </div>

            {/* Features */}

            <div className="mt-10 bg-slate-900 rounded-xl p-6">

              <h3 className="text-xl text-white font-semibold mb-4">

                Your Features

              </h3>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="text-gray-300">
                  ✅ Upload PDFs
                </div>

                <div className="text-gray-300">
                  ✅ AI Question Answering
                </div>

                <div className="text-gray-300">
                  ✅ Document Management
                </div>

                <div className="text-gray-300">
                  ✅ Secure Authentication
                </div>

              </div>

            </div>

            {/* Logout */}

            <div className="mt-10 flex justify-center">

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 transition px-8 py-3 rounded-xl text-white font-semibold shadow-lg"
              >
                🚪 Logout
              </button>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Profile;