import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import Lottie from "lottie-react";
import noFound from "../assets/animations/noFound.json";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Spinning from "../components/Spinner";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LenderRepayments = () => {
  const { user, activeRole } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user || !activeRole) return;

    const fetchLenderLoans = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/loans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole,
          },
        });

        if (Array.isArray(res.data)) {
          const givenLoans = res.data.filter(
            (loan) =>
              loan?.lender?._id?.toString() === user.id?.toString() ||
              loan?.lender?.toString() === user.id?.toString()
          );
          setLoans(givenLoans);
        } else {
          console.warn("Unexpected loans format:", res.data);
          setLoans([]); // fallback to avoid crash
        }
      } catch (err) {
        console.error("Error fetching loans for lender", err);
        setLoans([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchLenderLoans();
  }, [user?.id, activeRole]);

  // 📊 Bar Chart Data
  const chartData = {
    labels: loans.map((loan) => loan.borrower?.name || "Borrower"),
    datasets: [
      {
        label: "Loan Amount (₹)",
        data: loans.map((loan) => loan.totalAmount),
        backgroundColor: "#6b5448cc",
        borderRadius: 3,
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
      <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 py-4 min-h-[90vh] bg-gradient-to-br from-[#fdf6e3] via-[#fdfaf6] to-[#ffeede] animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6b5448] text-center sm:text-left">
          💰 Repayments
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinning />
          </div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 sm:w-60 md:w-72">
              <Lottie animationData={noFound} loop />
            </div>
            <p className="text-gray-500 text-base sm:text-lg text-center">
              No loans given yet.
            </p>
          </div>
        ) : (
          <>
            {/* 📊 Chart Overview */}
            <div className="bg-white/80 backdrop-blur-xl p-3 sm:p-6 rounded-xl shadow w-full max-w-full overflow-x-auto">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-center sm:text-left">
                Loan Distribution
              </h2>
              <div className="min-w-[320px] sm:min-w-0">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* 🧾 Loan Cards */}
            <div className="grid gap-3 sm:gap-4">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-5 shadow-card border-l-4 border-[#6b5448] hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-base sm:text-lg font-medium text-[#6b5448] break-words">
                        Borrower: {loan.borrower?.name || "N/A"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Loan Amount: ₹{loan.totalAmount}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Status: {loan.status}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/repayments/${loan._id}/history`)}
                      className="mt-2 sm:mt-0 bg-[#6b5448] text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-[#5a443b] transition w-full sm:w-auto"
                    >
                      View History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LenderRepayments;
