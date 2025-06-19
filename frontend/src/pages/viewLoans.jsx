import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../Layout/DashboardLayout";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Loaded from "../assets/animations/noFound.json";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const { user, activeRole } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user || !activeRole) return;

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/loans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole,
          },
        });

        // ✅ Defensive check
        if (Array.isArray(res.data)) {
          setLoans(res.data);
        } else {
          console.warn("Unexpected loans format:", res.data);
          setLoans([]); // fallback
        }
      } catch (err) {
        console.error("Error fetching loans:", err);
        setLoans([]); // fallback
      }
    };

    fetchLoans();
  }, [user, activeRole]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 min-h-[90vh] bg-gradient-to-br from-[#fdf6e3] via-[#fdfaf6] to-[#ffeede] animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">📋 My Loans</h1>

        {loans.length === 0 ? (
          <div className="flex justify-center">
            <Lottie animationData={Loaded} loop={false} className="w-48 h-48 sm:w-72 sm:h-72" />
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => (
              <Link to={`/dashboard/loans/${loan._id}`} key={loan._id}>
                <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-[#6b5448]">
                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <p className="text-base sm:text-lg font-semibold text-[#4a3a33]">
                      {activeRole === "lender" ? "To" : "From"}{" "}
                      {activeRole === "lender"
                        ? loan.borrower?.name || loan.borrower
                        : loan.lender?.name || loan.lender}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">{loan.purpose}</p>

                    <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">
                        ₹{loan.totalAmount}
                      </span>
                      <span
                        className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${getStatusColor(
                          loan.status
                        )}`}
                      >
                        {loan.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Loans;
