import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../Layout/DashboardLayout";
import Lottie from "lottie-react";
import bookReading from "../assets/animations/bookReading.json";
import { Bar } from "react-chartjs-2";
import Spinning from "../components/Spinner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RepaymentHistory = () => {
  const { loanId } = useParams();
  const { activeRole } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/api/repayments/${loanId}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-active-role": activeRole,
            },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching repayment history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [loanId, activeRole]);

  const totalPaid = history.reduce((sum, r) => sum + r.amount, 0);

  const chartData = {
    labels: history.map((r) =>
      new Date(r.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Amount Paid (₹)",
        data: history.map((r) => r.amount),
        backgroundColor: "#6b5448aa",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 px-2 sm:px-4 lg:px-8 py-4 min-h-[90vh] bg-gradient-to-br from-[#fdf6e3] via-[#fdfaf6] to-[#ffeede] animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6b5448] text-center sm:text-left">
          📄 Repayment History
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinning />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Lottie animationData={bookReading} className="w-48 sm:w-72" loop />
            <p className="text-gray-500 text-base sm:text-lg text-center">No repayments made yet.</p>
          </div>
        ) : (
          <>
            {/* 💰 Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow border-l-4 border-green-500 flex flex-col items-center sm:items-start">
                <p className="text-xs sm:text-sm text-gray-600">Total Amount Repaid</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">₹{totalPaid}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow border-l-4 border-amber-500 flex flex-col items-center sm:items-start">
                <p className="text-xs sm:text-sm text-gray-600">Repayments Made</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{history.length}</p>
              </div>
            </div>

            {/* 📊 Chart */}
            <div className="bg-white/80 backdrop-blur-xl p-3 sm:p-6 rounded-xl shadow">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-center sm:text-left">Repayment Overview</h2>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[320px] sm:min-w-0">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* 🔁 Repayment List */}
            <div className="space-y-4">
              {history.map((repayment, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow border-l-4 border-[#6b5448] space-y-1 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-gray-700 text-xs sm:text-sm">
                      <strong>Amount:</strong> ₹{repayment.amount}
                    </p>
                    <p className="text-gray-700 text-xs sm:text-sm">
                      <strong>Date:</strong> {new Date(repayment.date).toLocaleDateString()}
                    </p>
                  </div>
                  {activeRole === "lender" && repayment.user && (
                    <p className="text-gray-700 text-xs sm:text-sm mt-2 sm:mt-0">
                      <strong>Paid by:</strong> {repayment.user.name} ({repayment.user.emailId})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RepaymentHistory;
