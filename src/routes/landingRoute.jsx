import { Routes, Route, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
import Landingpage from "../pages/user/Landingpage";
import Login from "../pages/Auth/SignIn";
import PreAuth from "../pages/user/PreAuth";
import SignUp from "../pages/user/SignUp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import RegisterVerify from "../pages/user/RegisterVerify";
import AdminLogin from "../pages/admin/AdminLogin";
import { useForgotPage } from "../utils/context/ForgotPasswordContext";

import {
  ProtectedRoute,
  AdminPublicRoute,
} from "../utils/middleWare/ProtectedRoute";

const LandingRoute = () => {
  const { passwordPage } = useForgotPage();
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pre" element={<PreAuth />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/verifyRegistration" element={<RegisterVerify />} />
        {passwordPage && (
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        )}
      </Route>

      <Route element={<AdminPublicRoute />}>
        <Route path="/adminLogin" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
};

export default LandingRoute;
