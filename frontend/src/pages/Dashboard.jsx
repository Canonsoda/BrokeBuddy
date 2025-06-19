import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../Layout/DashboardLayout";
import Lottie from "lottie-react";
import searchAnimation from "../assets/animations/search.json";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user, activeRole } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    totalAmount: 0,
    completedLoans: 0,
    totalLoans: 0,
    totalInterest: 0,
  });

const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (!activeRole) return;

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/loans/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole === "both" ? "lender" : activeRole,
          }
        });

        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };

    const fetchRecentTransactions = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/transactions/recent-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-active-role": activeRole,
      },
    });

    const formatted = [];

    res.data.loans.forEach((loan) =>
      formatted.push({
        id: loan._id,
        title: `Loan Created - ${loan.purpose}`,
        amount: `₹${loan.amount}`,
        date: new Date(loan.createdAt).toLocaleDateString(),
        type: "loan",
      })
    );

    res.data.repayments.forEach((r, index) =>
      formatted.push({
        id: `rep-${index}`,
        title: `Repayment`,
        amount: `₹${r.amount}`,
        date: new Date(r.date).toLocaleDateString(),
        type: "repayment",
      })
    );

    formatted.sort((a, b) => new Date(b.date) - new Date(a.date));

    setRecentTransactions(formatted.slice(0, 5));
  } catch (err) {
    console.error("Error fetching recent transactions", err);
  }
};

    fetchSummary();
    fetchRecentTransactions();


  }, [activeRole]);

  return (
    <DashboardLayout>
      <div className="space-y-8 px-2 sm:px-4 lg:px-8 py-4 min-h-[90vh] bg-gradient-to-br from-[#fdf6e3] via-[#fdfaf6] to-[#ffeede] animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 break-words">
          👋 Hi {user?.name},{" "}
          {localStorage.getItem("isNewUser") === "true" ? "welcome!" : "welcome back!"}
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-card border-l-4 border-blue-500 hover:shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs sm:text-sm text-gray-500">Total Loaned Amount</p>
            <p className="text-xl sm:text-2xl font-semibold text-blue-600 truncate">
              ₹{stats.totalAmount?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-card border-l-4 border-amber-500 hover:shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs sm:text-sm text-gray-500">Total Loans</p>
            <p className="text-xl sm:text-2xl font-semibold text-amber-600">{stats.totalLoans}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-card border-l-4 border-green-500 hover:shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs sm:text-sm text-gray-500">Completed Loans</p>
            <p className="text-xl sm:text-2xl font-semibold text-green-600">{stats.completedLoans}</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">📄 Recent Activity</h2>

          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 bg-white/80 rounded-xl shadow space-y-3 sm:space-y-4">
              <div className="w-28 sm:w-40 md:w-56 mx-auto">
                <Lottie animationData={searchAnimation} loop />
              </div>
              <p className="text-gray-500 text-sm sm:text-base">No recent transactions yet.</p>
              <p className="text-gray-400 text-xs sm:text-sm">
                Start by creating a loan or repaying one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {recentTransactions.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 sm:p-5 bg-white rounded-xl shadow border-l-4 space-y-1 ${
                    item.type === "loan" ? "border-blue-500" : "border-green-500"
                  }`}
                >
                  <h3 className="font-medium text-base sm:text-lg">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{item.date}</p>
                  <p
                    className={`text-base sm:text-lg font-semibold ${
                      item.type === "loan" ? "text-blue-600" : "text-green-600"
                    }`}
                  >
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Visual Chart */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">📊 Loan Completion Overview</h2>
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow max-w-xs sm:max-w-md mx-auto hover:shadow-lg transition">
            <div className="relative" style={{ height: "220px" }}>
              <Pie
                data={{
                  labels: ["Completed", "Ongoing"],
                  datasets: [
                    {
                      label: "Loan Status",
                      data: [
                        stats.completedLoans,
                        stats.totalLoans - stats.completedLoans,
                      ],
                      backgroundColor: ["#34d399", "#fbbf24"],
                      borderColor: ["#10b981", "#f59e0b"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#374151",
                        font: { size: 12 },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                  responsive: true,
                }}
                height={220}
              />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
