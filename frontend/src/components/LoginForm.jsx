import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
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
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isNewUser", "true");
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f8f8] px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-white border rounded-xl shadow-xl p-4 sm:p-8 space-y-4 sm:space-y-6"
      >
        <h2 className="text-xl sm:text-3xl font-semibold text-center text-[#6b5448]">
          Log In
        </h2>

        <input
          type="email"
          name="emailId"
          placeholder="Email"
          value={formData.emailId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b5448] text-sm sm:text-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6b5448] text-sm sm:text-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded transition text-sm sm:text-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6b5448] hover:bg-[#4d3e36]"
          }`}
        >
          {loading ? "Processing..." : "Log In"}
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full border py-2 rounded hover:bg-gray-100 transition text-sm sm:text-lg"
        >
          Continue with Google
        </button>

        <p className="text-xs sm:text-base text-center text-[#6b5448]">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:text-[#4d3e36]">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
