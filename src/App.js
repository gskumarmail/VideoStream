// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { publicRoutes } from "./routes/PublicRoutes";
import { adminRoutes } from "./routes/AdminRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Public Site Routes */}
        {publicRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element}>
            {route.children?.map((child, cidx) => (
              <Route
                key={cidx}
                index={child.index}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {/* Admin Routes */}
        {adminRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element}>
            {route.children?.map((child, cidx) => (
              <Route
                key={cidx}
                index={child.index}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
