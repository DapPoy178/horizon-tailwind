import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import axios from "axios";

export const UserContext = React.createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(function () {
    axios.get("http://localhost:8000/api/user").then(function (response) {
      const user = response.data.data;
      setUser(user);
    });
  }, []);

  return (
    <>
      <UserContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          {authenticatedUser ? (
            <Route path="admin/*" element={<AdminLayout />} />
          ) : (
            <Route path="admin/*" element={<Navigate to="/auth/sign-in" replace />} />
          )}
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
