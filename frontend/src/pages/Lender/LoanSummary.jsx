import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../Layout/DashboardLayout";
import { FileBarChart } from "lucide-react";
import Lottie from "lottie-react";
import noFound from "../../assets/animations/noFound.json";

const LoanSummary = () => {
  const { activeRole } = useAuth();
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState("pending");
  const [refreshKey, setRefreshKey] = useState(0);

  const statusOptions = ["pending", "approved", "rejected", "completed"];

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLoansByStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoans([]);
        const res = await axios.get(
          `${API_BASE_URL}/api/loans/status/${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-active-role": activeRole,
            },
          }
        );
        setLoans(res.data);
      } catch (err) {
        console.error("No such Loans:", err);
        toast.error("There are no Loans here");
      }
    };

    fetchLoansByStatus();
  }, [status, activeRole, refreshKey]);

  const handleStatusUpdate = async (loanId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/api/loans/${loanId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole,
          },
        }
      );

      setRefreshKey((prev) => prev + 1);
      toast.success(`Loan ${newStatus}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  // 📊 Pie Chart: status distribution
  const chartData = {
    labels: statusOptions.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444", "#6366f1"],
        borderWidth: 1,
      },
    ],
  };

  loans.forEach((loan) => {
    const index = statusOptions.indexOf(loan.status);
    if (index !== -1) chartData.datasets[0].data[index] += 1;
  });

  const handleDeleteLoan = async (loanId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API_BASE_URL}/api/loans/${loanId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-active-role": activeRole,
      },
    });


    toast.success("Loan deleted successfully");
    setRefreshKey((prev) => prev + 1);
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Failed to delete loan");
  }
};


  return (
    <DashboardLayout>
      <div className="space-y-8 px-2 sm:px-4 lg:px-8 py-4 min-h-[90vh] bg-gradient-to-br from-[#fdf6e3] via-[#fdfaf6] to-[#ffeede] animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6b5448] flex items-center gap-2">
          <FileBarChart size={24} className="sm:size-7" />
          Loan Summary
        </h1>

        {/* 🔘 Status Buttons */}
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => setStatus(option)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border shadow-sm transition font-medium text-xs sm:text-base ${
                status === option
                  ? "bg-[#6b5448] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* 🧾 Loans list */}
        {loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 bg-white/80 rounded-xl shadow mt-4 backdrop-blur-md">
            <Lottie animationData={noFound} loop className="w-40 h-40 sm:w-60 sm:h-60" />
            <p className="text-gray-600 text-base sm:text-lg mt-4 text-center">
              No loans with status <strong>{status}</strong>.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 text-center">Try changing the status filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 mt-6">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white/80 backdrop-blur-xl p-3 sm:p-5 rounded-xl shadow-card border-l-4 border-[#6b5448] hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg font-semibold text-[#6b5448] break-words">
                      To: {loan.borrower?.name || loan.borrower}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">Purpose: {loan.purpose}</p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-lg sm:text-xl font-bold text-blue-600">₹{loan.amount}</p>
                    <p className="text-xs sm:text-sm capitalize text-gray-500">{loan.status}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <select
                    value={loan.status}
                    onChange={(e) => handleStatusUpdate(loan._id, e.target.value)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6b5448] focus:border-[#6b5448] bg-white shadow-sm transition w-full sm:w-auto"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>

                  {loan.status === "rejected" && (
                    <button
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs sm:text-sm w-full sm:w-auto"
                      onClick={() => handleDeleteLoan(loan._id)}
                    >
                      Delete Loan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LoanSummary;
