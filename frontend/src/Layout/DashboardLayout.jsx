import { useState } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile slide
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Desktop collapse
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeee6] via-[#fdfaf6] to-[#e8dfd8] bg-fixed">
      <div className="flex flex-col md:flex-row md:h-screen relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isExpanded={isSidebarExpanded}
          toggleMobile={() => setIsSidebarOpen(!isSidebarOpen)}
          toggleDesktop={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />

        {/* Overlay on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:overflow-y-auto backdrop-blur-sm bg-white/60">
          <AppNavbar
            toggleSidebar={() =>
              window.innerWidth < 768
                ? setIsSidebarOpen(!isSidebarOpen)
                : setIsSidebarExpanded(!isSidebarExpanded)
            }
          />
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 transition-all duration-300">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
