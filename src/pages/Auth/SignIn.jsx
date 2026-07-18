import Logo from "../../components/uic/Logo";
import { Link } from "react-router-dom";
import { AuthButtonGroup } from "../../components/uic/AuthButtons";
import { PasswordField } from "../../components/uic/passwordShow";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAxios } from "../../utils/api/baseUrl";
import { useDispatch } from "react-redux";
import { setUser, setUserAuth } from "../../utils/Redux/userSlice";
import { setClient, setClientAuth } from "../../utils/Redux/recruiterSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "../../config/config";
import { useForgotPage } from "../../utils/context/ForgotPasswordContext";

const Login = () => {
  const { passwordPage, setPasswordPage } = useForgotPage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const disPatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email.trim() || !password.trim()) {
        toast.error("fields cannot be empty", {
          autoClose: 1000,
          closeButton: true,
        });
        return;
      }

      const loginData = { email, password };
      const res = await AuthAxios.post("/login", loginData);
      if (res.status === 200) {
        const accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        if (res.data.success) {
          const person = res.data.person;
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
          setEmail("");
          setPassword("");
          setTimeout(() => {
            if (person.job_role === "freelancer") {
              disPatch(setUser(person));
              disPatch(setUserAuth());
              localStorage.setItem("userrefreshToken", refreshToken);
              localStorage.setItem("useraccessToken", accessToken);
              navigate("/user/home"); /*{replace:true}*/
            } else {
              disPatch(setClient(person));
              disPatch(setClientAuth());
              localStorage.setItem("clientrefreshToken", refreshToken);
              localStorage.setItem("clientaccessToken", accessToken);
              navigate("/client/home");
            }
          }, 1000);
        } else {
          toast.error(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Error data:", error.response.data);
        toast.error(error.response.data.message, {
          autoClose: 2000,
          closeButton: true,
        });
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error("Network error. Please try again later.", {
          autoClose: 2000,
          closeButton: true,
        });
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("An unexpected error occurred. Please try again later.", {
          autoClose: 2000,
          closeButton: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setPasswordPage(true);
    navigate("/forgotpassword");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 border-b border-gray-150">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="max-w-md mx-auto w-full py-12 px-4 sm:px-6">
        <div className="flex flex-col gap-8 bg-white border border-gray-200/80 shadow-xl rounded-[32px] p-8 sm:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Log in to QuickWork
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link to="/pre" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-semibold text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 outline-none transition-all text-sm font-medium"
                placeholder="Enter your email"
              />
            </div>
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                onClick={handleForgotPasswordClick}
                className="text-xs text-green-600 hover:text-green-700 transition-colors font-bold cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer text-sm shadow-sm hover:shadow"
              >
                {loading ? "Signing in..." : "Log in"}
              </button>
              
              <div className="flex items-center gap-4 my-2">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">or</span>
                <hr className="flex-1 border-gray-200" />
              </div>

              <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                <AuthButtonGroup layout="login" />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center py-4 border-t border-gray-200/50 mt-10">
        <p className="text-xs text-gray-400">© 2026 QUICKWORK Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
