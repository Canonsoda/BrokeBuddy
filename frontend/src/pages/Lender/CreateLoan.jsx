import DashboardLayout from "../../Layout/DashboardLayout";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import success from "../../assets/animations/success.json";

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    borrowerEmail: "",
    amount: "",
    interestRate: "",
    interestType: "simple",
    duration: "",
    purpose: "",
    useEMI:false
  });

  const [loanCreated, setLoanCreated] = useState(false);
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_BASE_URL}/loans/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-active-role": activeRole,
        },
      });

      setLoanCreated(true);
      toast.success("Loan created successfully!");

      setTimeout(() => {
        navigate("/dashboard/loans");
      }, 2000);

    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to create loan.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 bg-white/80 backdrop-blur-xl rounded-xl shadow-md transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#6b5448] mb-4 text-center">📝 Create a New Loan</h2>

        {loanCreated ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Lottie animationData={success} loop={false} className="w-48 h-48 sm:w-72 sm:h-72" />
            <p className="text-green-600 font-semibold text-lg sm:text-xl mt-4">Loan Created!</p>
            <p className="text-xs sm:text-sm text-gray-500">Redirecting to My Loans...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium text-[#6b5448] mb-1">Borrower Email</label>
              <input
                type="email"
                name="borrowerEmail"
                value={formData.borrowerEmail}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#6b5448] outline-none text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#6b5448] mb-1">Loan Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#6b5448] text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block font-medium text-[#6b5448] mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#6b5448] text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block font-medium text-[#6b5448] mb-1">Interest Type</label>
                <select
                  name="interestType"
                  value={formData.interestType}
                  onChange={handleChange}
                  className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base"
                >
                  <option value="simple">Simple</option>
                  <option value="compound">Compound</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#6b5448] mb-1">Duration (months)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#6b5448] text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#6b5448] mb-1">Purpose</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border p-2 sm:p-3 rounded focus:ring-2 focus:ring-[#6b5448] text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="useEMI"
                  checked={formData.useEMI}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, useEMI: e.target.checked }))
                  }
                />
                <span className="text-xs sm:text-sm">Enable Monthly EMI Repayments</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#6b5448] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#4d3e36] transition font-medium text-base sm:text-lg"
            >
              Create Loan
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateLoan;
