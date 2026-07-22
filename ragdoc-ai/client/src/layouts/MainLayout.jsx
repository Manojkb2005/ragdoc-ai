import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* Sidebar */}

      <aside className="hidden lg:flex">

        <Sidebar />

      </aside>

      {/* Main Content */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top Navbar */}

        <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">

          <Navbar />

        </header>

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto">

          <div className="max-w-7xl mx-auto p-6 lg:p-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}

export default MainLayout;