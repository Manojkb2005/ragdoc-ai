import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "../components/SidebarContext";

function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-slate-950">
        {/* Sidebar (handles its own mobile drawer / desktop static layout) */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Top Navbar */}
          <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
            <Navbar />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
