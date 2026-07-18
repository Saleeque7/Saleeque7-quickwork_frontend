import Logo from "../../components/uic/Logo";
import { Link } from "react-router-dom";
import { useState } from "react";
import emailLogo from "../../assets/emalVerify.png";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { UserAxios } from "../../utils/api/baseUrl";
import { useNavigate, useLocation } from "react-router-dom";

export default function RegisterVerify() {
  const location = useLocation();
  const { userInfo, responseOtp } = location.state || {};
  const [otpError, setOtpError] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [resotp, setResotp] = useState(responseOtp);
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setResotp(responseOtp);
  }, [responseOtp]);

  useEffect(() => {
    if (otpError) {
      const timer = setTimeout(() => {
        setOtpError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [otpError]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
      setResotp("");
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleResend = async () => {
    try {
      const res = await UserAxios.post("/resend-otp", { email: userInfo.email });
      if (res.data.success) {
        setResotp(res.data.resendOtp);
        setOtp("");
        setTimer(40);
        setOtpExpired(false);
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        setOtpError("please enter a otp");
        return;
      }
      const res = await UserAxios.post("/verify-otp", {
        userData: userInfo,
        otp: resotp,
        enteredotp: otp,
      });
      if (res.data.success) {
        toast.success(res.data.message, {
          autoClose: 1000,
          closeButton: true,
        });
        setOtp("");
        setTimer("");
        setOtpExpired(false);
        navigate('/login', { replace: true });
      } else {
        setOtp("");
        setOtpError(res.data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Error data:", error.response.data);
        setOtp("");
        setOtpError(error.response.data.message);
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
    }
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
              Verify your Mail
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Already verified?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img src={emailLogo} className="h-[120px] w-[160px] object-contain mb-4" alt="Verify email" />
            {!otpExpired ? (
              <>
                <p className="text-sm text-gray-500">
                  Enter the <strong>OTP</strong> sent to your email
                </p>
                <p className={`text-base mt-2 font-bold ${timer < 10 ? "text-red-500 animate-pulse" : "text-gray-700"}`}>
                  0:{timer.toString().padStart(2, "0")}
                </p>
              </>
            ) : (
              <p className="text-sm text-red-500 font-bold">
                OTP expired, please resend OTP
              </p>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 w-full text-center">
              <label className="text-sm font-semibold text-gray-700 pb-2">
                Enter OTP
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  disabled={otpExpired}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="0000"
                  className={`w-40 text-center tracking-[1rem] pl-[1rem] p-2.5 border rounded-xl text-2xl font-bold outline-none transition-all ${
                    otpError
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:ring-1 focus:ring-green-600 focus:border-green-600"
                  }`}
                />
              </div>
              {otpError && (
                <p className="text-red-500 text-xs mt-2">{otpError}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={otpExpired ? handleResend : handleVerifyOtp}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all shadow-sm hover:shadow cursor-pointer text-sm"
              >
                {otpExpired ? "Resend OTP" : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-200/50 mt-10">
        <p className="text-xs text-gray-400">© 2026 QUICKWORK Inc. All rights reserved.</p>
      </div>
    </div>
  );
}
