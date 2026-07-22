import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-white">
          📚 RAGDoc AI
        </h1>

        <p className="text-xs text-gray-400">
          Intelligent PDF Assistant
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <div className="text-right">

          <h3 className="text-white font-semibold">

            {user?.name || "User"}

          </h3>

          <p className="text-xs text-gray-400">

            {user?.email}

          </p>

        </div>

        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">

          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}

        </div>

        

      </div>

    </div>
  );
}

export default Navbar;