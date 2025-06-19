import { useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom"; // ⬅️ Import Link
import { useAuth } from "../context/AuthContext.jsx";

const AppNavbar = ({ toggleSidebar }) => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-[#fdfaf6] border-b border-[#6b5448] shadow px-4 py-5 flex items-center justify-between">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-3xl">
          <FaBars />
        </button>
        <Link to="/dashboard">
          <span className="text-black font-semibold text-2xl hover:underline transition">
            Dashboard
          </span>
        </Link>
      </div>

      {/* Right: Role Switch + Dropdown */}
      <div className="flex items-center gap-6 relative">
        {user?.role === "both" && (
          <button
            onClick={switchRole}
            className="px-3 py-2 rounded-full text-white bg-[#6b5448] hover:bg-[#4d3e36] transition"
          >
            Switch to {activeRole === "lender" ? "Borrower" : "Lender"}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-white bg-[#6b5448] hover:bg-[#4d3e36] transition"
          >
            <span>{user?.name}</span>
            <FaChevronDown size={12} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md p-2 w-48 z-50">
              <div className="px-2 py-1 text-sm text-gray-600">
                Role: <strong>{user.role} ({activeRole})</strong>
              </div>
              <hr className="my-1" />
              <button
                onClick={logout}
                className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 text-sm rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
