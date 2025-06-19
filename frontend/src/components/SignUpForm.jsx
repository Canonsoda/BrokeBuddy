import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    phoneNumber: "",
    password: "",
    roles: "both"
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.emailId || !formData.phoneNumber || !formData.password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        user: { ...formData, roles: formData.roles }
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isNewUser", "true");
      toast.success("Signup successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Signup failed:", err.response?.data?.message || err.message);
      toast.error("Signup failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto p-6 sm:p-8 bg-white border rounded-xl shadow-xl space-y-5 sm:space-y-6 flex flex-col"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#6b5448]">Sign Up</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b5448] text-base sm:text-lg"
      />

      <input
        type="number"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b5448] text-base sm:text-lg"
      />

      <input
        type="email"
        name="emailId"
        placeholder="Email"
        value={formData.emailId}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b5448] text-base sm:text-lg"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b5448] text-base sm:text-lg"
      />

      <select
        name="roles"
        value={formData.roles}
        onChange={handleChange}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded text-base sm:text-lg"
      >
        <option value="lender">Lender</option>
        <option value="borrower">Borrower</option>
        <option value="both">Both</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white py-2 sm:py-2.5 rounded transition text-base sm:text-lg ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6b5448] hover:bg-[#4d3e36]"
        }`}
      >
        {loading ? "Processing..." : "Sign Up"}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full border py-2 sm:py-2.5 rounded hover:bg-gray-100 transition text-base sm:text-lg"
      >
        Continue with Google
      </button>

      <p className="text-xs sm:text-sm text-center mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-[#6b5448] underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
