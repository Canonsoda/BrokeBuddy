import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isNewUser", "true");
      window.location.href ="/dashboard";
    } else {
      window.location.href ="/login";
    }
  }, []);

  return null;
};

export default GoogleAuthSuccess;
