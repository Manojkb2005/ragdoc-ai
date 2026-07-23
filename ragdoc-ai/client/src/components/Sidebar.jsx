import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Mobile drawer open/closed. Toggled here directly, or remotely by
  // Navbar's hamburger button via the "toggle-sidebar" window event.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  // Close the drawer automatically whenever the route changes (mobile only,
  // has no visible effect on desktop since the drawer is always shown there)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Logout from RAGDoc AI?")) {
      logout();
      navigate("/");
    }
  };

  const menu = [
    { icon: "💬", title: "Chat", path: "/chat" },
    { icon: "👤", title: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
        />
      )}

      <div
        className={`fixed lg:static top-0 left-0 z-30 h-full lg:h-auto w-72 max-w-[85vw]
          bg-slate-900 border-r border-slate-800 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="border-b border-slate-800 p-5 sm:p-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              📚 RAGDoc AI
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Intelligent PDF Assistant
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white text-2xl leading-none p-1"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
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
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:pb-5">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 transition rounded-xl py-3 text-white font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
