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

  // Tells Sidebar.jsx to toggle its mobile drawer.
  // (Lightweight event bridge since Navbar and Sidebar don't share state directly.
  // If you have a layout-level context/state, swap this for that instead.)
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <div className="h-14 sm:h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 sm:px-8 gap-3">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger, mobile only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-2xl text-gray-300 hover:text-white p-1 shrink-0"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
            📚 RAGDoc AI
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            Intelligent PDF Assistant
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-5 shrink-0">
        <div className="text-right hidden sm:block max-w-[10rem] md:max-w-xs">
          <h3 className="text-white font-semibold truncate">
            {user?.name || "User"}
          </h3>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>

        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-600 flex items-center justify-center text-base sm:text-xl font-bold text-white shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
