import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../Layout/DashboardLayout";
import Lottie from "lottie-react";
import noFound from "../assets/animations/noFound.json";
import { Pie } from "react-chartjs-2";
import Spinning from "../components/Spinner";
import toast from "react-hot-toast";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const LoanDetails = () => {
  const { id } = useParams();
  const { activeRole } = useAuth();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/loans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole,
          },
        });

        // ✅ Defensive check
        if (res.data && typeof res.data === "object" && res.data._id) {
          setLoan(res.data);
          setEditedSchedule(res.data.repaymentSchedule || []);
        } else {
          console.warn("Unexpected loan format:", res.data);
          setLoan(null);
        }
      } catch (err) {
        console.error("Error fetching loan details:", err);
        setLoan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id, activeRole]);

  if (loading)
    return (
      <DashboardLayout>
        <Spinning />
      </DashboardLayout>
    );

  if (!loan) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-10 px-4 sm:px-0">
          <Lottie animationData={noFound} className="w-48 h-48 sm:w-64 sm:h-64" loop />
          <p className="text-gray-500 text-base sm:text-lg mt-4 text-center">
            Loan not found or access denied.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const getRepaymentBorder = (status) => {
    if (status === "paid") return "border-green-500";
    if (status === "overdue") return "border-red-500";
    return "border-yellow-400";
  };

  const paidPercentage = Math.min(
    (loan.totalRepaid / loan.totalAmount) * 100,
    100
  ).toFixed(2);

  return (
    <DashboardLayout>
      <div className="space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 min-h-[90vh] bg-gradient-to-br from-[#fdf6e3] via-[#fdfaf6] to-[#ffeede] animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center sm:text-left">
          📄 Loan Details
        </h1>

        {/* Loan Info */}
        <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-[#6b5448] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Borrower</p>
              <p className="text-base sm:text-lg font-semibold text-[#4a3a33] break-words">
                {loan.borrower?.name} ({loan.borrower?.emailId})
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-gray-600 text-xs sm:text-sm">Lender</p>
              <p className="text-base sm:text-lg font-semibold text-[#4a3a33] break-words">
                {loan.lender?.name} ({loan.lender?.emailId})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 mt-2 sm:mt-4">
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            <p><strong>Interest Type:</strong> {loan.interestType}</p>
            <p><strong>Duration:</strong> {loan.duration} months</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[loan.status] || "bg-gray-100 text-gray-700"}`}>
                {loan.status}
              </span>
            </p>
            <p><strong>Purpose:</strong> {loan.purpose}</p>
            <p><strong>Total Payable:</strong> ₹{loan.totalAmount}</p>
            <p><strong>Total Repaid:</strong> ₹{loan.totalRepaid}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Repayment Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 sm:h-5">
              <div
                className="h-4 sm:h-5 bg-green-500 rounded-full text-xs text-white flex items-center justify-center transition-all duration-300"
                style={{ width: `${paidPercentage}%` }}
              >
                {paidPercentage}%
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Repayment Status</h2>
            <div className="w-full flex justify-center items-center">
              <div className="w-40 h-40 sm:w-52 sm:h-52">
                <Pie
                  data={{
                    labels: ["Repaid", "Remaining"],
                    datasets: [
                      {
                        data: [loan.totalRepaid, loan.totalAmount - loan.totalRepaid],
                        backgroundColor: ["#10b981", "#fbbf24"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Repayment Schedule */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">🗓 Repayment Schedule</h2>
            {activeRole === "lender" && (
              <button
                onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-[#6b5448] text-white hover:bg-[#4d3e36] transition"
              >
                {isEditingSchedule ? "Cancel" : "Edit Schedule"}
              </button>
            )}
          </div>

          <div className="space-y-3">
            {editedSchedule.map((repayment, idx) => (
              <div
                key={idx}
                className={`p-3 sm:p-4 bg-white/80 backdrop-blur-xl rounded-lg shadow-md border-l-4 ${getRepaymentBorder(repayment.status)}`}
              >
                {isEditingSchedule ? (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between">
                    <div className="flex flex-col">
                      <label className="text-xs sm:text-sm text-gray-600">Due Date</label>
                      <input
                        type="date"
                        value={new Date(repayment.dueDate).toISOString().split("T")[0]}
                        onChange={(e) => {
                          const newData = [...editedSchedule];
                          newData[idx].dueDate = e.target.value;
                          setEditedSchedule(newData);
                        }}
                        className="border px-2 py-1 rounded text-xs sm:text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs sm:text-sm text-gray-600">Amount Due</label>
                      <input
                        type="number"
                        value={repayment.amountDue}
                        onChange={(e) => {
                          const newData = [...editedSchedule];
                          newData[idx].amountDue = Number(e.target.value);
                          setEditedSchedule(newData);
                        }}
                        className="border px-2 py-1 rounded text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <p><strong>Due Date:</strong> {new Date(repayment.dueDate).toLocaleDateString()}</p>
                    <p><strong>Amount Due:</strong> ₹{repayment.amountDue}</p>
                    <p><strong>Amount Paid:</strong> ₹{repayment.amountPaid}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{repayment.status}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditingSchedule && (
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    await axios.put(
                      `${API_BASE_URL}/loans/${loan._id}/edit-schedule`,
                      { updatedSchedule: editedSchedule },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "x-active-role": activeRole,
                        },
                      }
                    );
                    toast.success("Schedule updated successfully");

                    // Re-fetch with defensive check
                    const refreshed = await axios.get(`${API_BASE_URL}/loans/${id}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "x-active-role": activeRole,
                      },
                    });

                    if (refreshed.data && typeof refreshed.data === "object" && refreshed.data._id) {
                      setLoan(refreshed.data);
                      setEditedSchedule(refreshed.data.repaymentSchedule || []);
                      setIsEditingSchedule(false);
                    } else {
                      toast.error("Unexpected data after update");
                      console.warn("Unexpected refresh data:", refreshed.data);
                    }
                  } catch (error) {
                    toast.error("Failed to update schedule");
                    console.error(error);
                  }
                }}
                className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs sm:text-base"
              >
                Save Schedule
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoanDetails;
