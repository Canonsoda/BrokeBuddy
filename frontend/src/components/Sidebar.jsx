import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Wallet,
  FilePlus,
  BarChart,
  Receipt,
  HandCoins,
} from "lucide-react";

const Sidebar = ({ isOpen, isExpanded, toggleMobile }) => {
  const { activeRole } = useAuth();

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base font-medium hover:bg-[#e9dfd7]/50 hover:shadow";

  const sidebarWidth = isExpanded ? "md:w-64" : "md:w-16";

  return (
    <aside
      className={`fixed md:static z-30 inset-y-0 left-0 bg-white/70 backdrop-blur-md border-r border-[#e0d8d0] shadow-lg
        transition-all duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${sidebarWidth}
      `}
    >
      <Link to="/dashboard" className="block hover:opacity-80 transition">
        <div className="p-4 text-xl font-bold text-[#6b5448] truncate">
          {isExpanded ? "💰 BrokeBuddy" : "💰"}
        </div>
      </Link>

      <nav className="flex flex-col space-y-1 md:space-y-2 p-1 md:p-2">
        <Link to="/dashboard/profile" className={linkClass}>
          <User size={20} />
          {isExpanded && <span className="hidden sm:inline">Profile</span>}
        </Link>

        <Link to="/dashboard/loans" className={linkClass}>
          <Wallet size={20} />
          {isExpanded && <span className="hidden sm:inline">My Loans</span>}
        </Link>

        {activeRole === "lender" && (
          <>
            <Link to="/dashboard/create-loan" className={linkClass}>
              <FilePlus size={20} />
              {isExpanded && <span className="hidden sm:inline">Create Loan</span>}
            </Link>
            <Link to="/dashboard/loan-summary" className={linkClass}>
              <BarChart size={20} />
              {isExpanded && <span className="hidden sm:inline">Loan Summary</span>}
            </Link>
            <Link to="/dashboard/repayments" className={linkClass}>
              <Receipt size={20} />
              {isExpanded && <span className="hidden sm:inline">Repayments</span>}
            </Link>
          </>
        )}

        {activeRole === "borrower" && (
          <Link to="/dashboard/repay" className={linkClass}>
            <HandCoins size={20} />
            {isExpanded && <span className="hidden sm:inline">Repay Loan</span>}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

