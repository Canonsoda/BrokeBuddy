import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../Layout/DashboardLayout";
import Lottie from "lottie-react";
import bookReading from "../../assets/animations/bookReading.json";
import success from "../../assets/animations/success.json";
import Spinning from "../../components/Spinner";

const Repay = () => {
  const { user, activeRole } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user || !activeRole) return;

    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/api/loans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole,
          },
        });

        setLoans(
          res.data.map((loan) => ({
            ...loan,
            repayAmount: "",
          }))
        );
      } catch (err) {
        console.error("Error fetching borrower loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [user?._id, activeRole]);

  const handleRepay = async (loanId, amount) => {
    try {
      const amt = Number(amount);
      if (!amt || isNaN(amt) || amt <= 0) {
        toast.error("Enter a valid amount");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}/api/repayments/${loanId}`,
        { amount: amt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole,
          },
        }
      );

      toast.success("Repayment successful ✅");

      setLoans((prev) =>
        prev.map((loan) =>
          loan._id === loanId ? { ...res.data.loan, repayAmount: "" } : loan
        )
      );
    } catch (err) {
      console.error("Repayment error:", err);
      toast.error(err?.response?.data?.message || "Repayment failed");
    }
  };

  if (!user || !activeRole || loading) {
    return (
      <DashboardLayout>
        <Spinning/>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 px-2 sm:px-4 md:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#6b5448] text-center sm:text-left">💸 Repay Loans</h1>

        {loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 sm:w-72">
              <Lottie animationData={bookReading} loop />
            </div>
            <p className="text-gray-500 text-center text-sm sm:text-base">You have no active loans to repay.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {loans.map((loan) => {
              const remaining = loan.totalAmount - loan.totalRepaid;
              const isCompleted = loan.status === "completed";
              const progress = Math.min((loan.totalRepaid / loan.totalAmount) * 100, 100);

              return (
                <div
                  key={loan._id}
                  className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-[#6b5448] break-words">
                        Lender: {loan.lender?.name || loan.lender}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">Amount Due: ₹{remaining}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Total Payable: ₹{loan.totalAmount}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Total Repaid: ₹{loan.totalRepaid}</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <span
                        className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
                          isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {loan.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        progress === 100 ? "bg-green-500" : "bg-blue-500"
                      } transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {isCompleted ? (
                    <div className="flex justify-center mt-2 sm:mt-4">
                      <div className="w-16 sm:w-24">
                        <Lottie animationData={success} loop={false} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <input
                        type="number"
                        min={1}
                        max={remaining}
                        placeholder="Enter amount"
                        value={loan.repayAmount}
                        onChange={(e) =>
                          setLoans((prevLoans) =>
                            prevLoans.map((l) =>
                              l._id === loan._id
                                ? { ...l, repayAmount: e.target.value }
                                : l
                            )
                          )
                        }
                        className="border px-3 py-2 rounded w-full sm:w-40 focus:ring-2 focus:ring-[#6b5448] outline-none text-sm"
                      />
                      <button
                        className="bg-[#6b5448] text-white px-4 sm:px-5 py-2 rounded hover:bg-[#5a443b] transition text-sm"
                        onClick={() => handleRepay(loan._id, loan.repayAmount)}
                        disabled={
                          !loan.repayAmount ||
                          isNaN(loan.repayAmount) ||
                          Number(loan.repayAmount) > remaining
                        }
                      >
                        Repay
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Repay;
