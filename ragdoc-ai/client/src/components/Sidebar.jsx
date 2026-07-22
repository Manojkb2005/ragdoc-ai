import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Logout from RAGDoc AI?")) {
      logout();
      navigate("/");
    }
  };

  const menu = [
    {
      icon: "💬",
      title: "Chat",
      path: "/chat",
    },
    
    {
      icon: "👤",
      title: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Logo */}

      <div className="border-b border-slate-800 p-8">

        <h1 className="text-3xl font-bold text-white">

          📚 RAGDoc AI

        </h1>

        <p className="text-gray-400 text-sm mt-2">

          Intelligent PDF Assistant

        </p>

      </div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-6">

        {menu.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 rounded-xl px-5 py-4 mb-3 transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-800"
            }`}
          >

            <span className="text-2xl">

              {item.icon}

            </span>

            <span className="font-semibold">

              {item.title}

            </span>

          </Link>

        ))}

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800 p-5">

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 transition rounded-xl py-3 text-white font-semibold"
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;