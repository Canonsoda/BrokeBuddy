import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const expiry = decodedToken.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expiry - currentTime;

      if (timeLeft <= 0) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setUser(decodedToken);
        if (decodedToken.role === "both") {
          const storedActiveRole = localStorage.getItem("activeRole");
          setActiveRole(storedActiveRole || "lender");
        } else {
          setActiveRole(decodedToken.role);
        }

        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("activeRole");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      localStorage.removeItem("token");
      toast.error("Invalid token. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  const switchRole = () => {
    if (!user || user.role !== "both") {
      toast.error("Role switching not allowed.");
      return;
    }

    const newRole = activeRole === "lender" ? "borrower" : "lender";
    setActiveRole(newRole);
    localStorage.setItem("activeRole", newRole);
    toast.success(`Switched to ${newRole}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeRole");
    setUser(null);
    setActiveRole(null);
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, activeRole, switchRole, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
