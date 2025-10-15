import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallback = async () => {
      try {
        const res = await fetch(
          "https://grid-aura.onrender.com/api/gr/google/callback",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();

        if (res.ok && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          alert(data.message || "Google login failed");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong with Google login!");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <div className="text-gray-700 flex flex-col items-center">
          <p className="mb-2">Processing Google login...</p>
          <svg
            className="animate-spin h-8 w-8 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default GoogleCallback;
