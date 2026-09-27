import { Navigate } from "react-router-dom";

import { useEffect, useState } from "react";
import api from "./axios.js";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("profile")
      .then(res => {
        setUser(res.data);   // ✅ logged in
        setLoading(false);
        
      })
      .catch(() => {
        setUser(null);       // ❌ not logged in
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // ⏳ wait for check
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;