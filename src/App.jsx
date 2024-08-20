// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserRoute from './routes/userRoute';
import ClientRoute from './routes/ClientRoutes';
import AdminRoute from './routes/AdminRoute';
import LandingRoute from "./routes/landingRoute";


import { UserProtectedRoute, ClientProtectedRoute, AdminProtectedRoute  } from './utils/middleWare/ProtectedRoute';

function App() {

  return (
    <Routes>
 
      <Route path="/*" element={<LandingRoute />} />

      <Route element={<UserProtectedRoute />}>
        <Route path="/user/*" element={<UserRoute />} />
      </Route>
      <Route element={<ClientProtectedRoute />}>
        <Route path="/client/*" element={<ClientRoute />} />
      </Route>
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/*" element={<AdminRoute />} />
        </Route>
    </Routes>
  );
}

export default App;
