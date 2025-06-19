import { useState } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../AuthContext";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeee6] via-[#fdfaf6] to-[#e8dfd8] bg-fixed">
      <div className="flex flex-col md:flex-row md:h-screen relative">
        {/* Sidebar */}
        <aside
          className={`fixed z-30 inset-y-0 left-0 w-64 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:static md:translate-x-0 md:block`}
        >
          <Sidebar isOpen={isOpen} />
        </aside>

        {/* Overlay on mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:overflow-y-auto backdrop-blur-sm bg-white/60">
          <AppNavbar toggleSidebar={() => setIsOpen(!isOpen)} user={user} />
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
