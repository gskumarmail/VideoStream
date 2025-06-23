// src/routes/AdminRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Dashboard from "../pages/Dashboard";
import Cash from "../pages/Cash";
import Trade from "../pages/Trade";
import Fx from "../pages/Fx";

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  return isAuth ? children : <Navigate to="/login" />;
};

// Return only <Route />s, not <Routes>
export const adminRoutes = [
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "cash", element: <Cash /> },
      { path: "trade", element: <Trade /> },
      { path: "fx", element: <Fx /> },
    ],
  },
];
