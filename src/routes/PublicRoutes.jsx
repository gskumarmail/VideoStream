// src/routes/PublicRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import PublicLayout from "../public/Layout";
import Cash from "../public/Cash";
import Trade from "../public/Trade";
import Fx from "../public/Fx";
import Home from "../public/Home";
import VideoGallery from "../public/VideoGallery";
import SoftwareDownloadCentre from "../public/SoftwareDownloadCentre";


export const publicRoutes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="home" /> },
      { path: "home", element: <Home /> },
      { path: "cash", element: <Cash /> },
      { path: "trade", element: <Trade /> },
      { path: "fx", element: <Fx /> },
      { path: "/videos/:category", element: <VideoGallery /> },
      { path: "downloads", element: <SoftwareDownloadCentre /> },

    ],
  },
];
