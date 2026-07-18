import Logo from "../../components/uic/Logo";
import { Link } from "react-router-dom";
import { useState } from "react";
import emailLogo from "../../assets/email.webp";
import { PasswordField } from "../../components/uic/passwordShow";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AuthAxios } from "../../utils/api/baseUrl";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [resotp, setResotp] = useState("");
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailError || otpError || passwordError) {
      const timer = setTimeout(() => {
        setError("");
        setOtpError("");
        setPasswordError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailError, otpError, passwordError]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
      setOtp("");
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleSendEmail = async () => {
    try {
      if (!email) {
        setError("Email address is required.");
        return;
      }
      const res = await AuthAxios.post("/forgot-password", { email });
      if (res.status === 200) {
        if (res.data.success) {
          setShowOtpInput(true);
          setResotp(res.data.otp);
        }
      } else {
        toast.error(res.data.message, {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        setTimer("");
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Server responded with status code:",
          error.response.status
        );
        console.error("Error data:", error.response.data);
        setError(error.response.data.message);
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

  const handleResend = async () => {
    try {
      const res = await AuthAxios.post("/resend-otp", { email });
      if (res.data.success) {
        setResotp(res.data.resendOtp);
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
      const res = await AuthAxios.post("/verifyPassword-otp", {
        otp: otp,
        enteredotp: resotp,
      });
      if (res.data.success) {
        toast.success(res.data.message, {
          autoClose: 1000,
          closeButton: true,
        });
        setOtp("");
        setTimer("");
        setOtpExpired(false);
        setShowOtpInput(false);
        setShowNewPasswordInput(true);
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

  const handleResetPassword = async () => {
    try {
      if (!password) {
        setPasswordError("Please enter a new password");
        return;
      }
      const res = await AuthAxios.post("/reset-password", { email, password });
      if (res.status === 200) {
        if (res.data.success) {
          toast.success(res.data.message, {
            autoClose: 800,
            closeButton: true,
            draggable: true,
          });
          setOtp(res.data.otp);
          setEmail("");
          setPassword("");
          setShowNewPasswordInput(false);
          navigate("/login", { replace: true });
        }
      } else {
        toast.error(res.data.message, {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
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
      }
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: "linear-gradient(to right, #81e6d9, #fef08a, #fda4af)",
      }}
    >
      <div className="sticky top-0 z-50 flex">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="max-w-lg mx-auto py-8 md:py-20 px-4 sm:px-8">
        <div className="flex flex-col gap-6">
          <div className="space-y-5 -mt-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-teal-600">
              Update your password
            </h1>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/pre" className="text-teal-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="py-8 px-4 sm:px-10 bg-white shadow-md rounded-2xl border border-gray-200">
            <div className="flex flex-col items-center mb-8 text-center">
              <img src={emailLogo} className="w-[100px] h-[100px] object-contain mb-4" alt="Email logo" />
              {!showNewPasswordInput && !showOtpInput && (
                <p className="text-sm text-gray-500">
                  Enter your <strong>EMAIL ADDRESS</strong> and select Send Email
                </p>
              )}

              {showOtpInput && !showNewPasswordInput && (
                !otpExpired ? (
                  <>
                    <p className="text-sm text-gray-500">
                      Enter the <strong>OTP</strong> sent to your email
                    </p>
                    <p className={`text-sm mt-2 font-bold ${timer < 10 ? "text-red-500" : "text-gray-500"}`}>
                      0:{timer.toString().padStart(2, "0")}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500 font-bold">
                    OTP expired, please resend OTP
                  </p>
                )
              )}

              {showNewPasswordInput && (
                <p className="text-sm text-gray-500">
                  Enter your <strong>NEW PASSWORD</strong> and Submit
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {!showOtpInput && (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showNewPasswordInput}
                      className={`w-full p-2 border rounded outline-none transition-colors ${
                        emailError
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-teal-500"
                      }`}
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs mt-1">{emailError}</p>
                    )}
                  </div>
                )}
                {showNewPasswordInput && (
                  <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    passwordError={passwordError}
                  />
                )}
              </div>

              {showOtpInput && !showNewPasswordInput && (
                <div className="flex flex-col gap-1 w-full text-center">
                  <label className="text-sm font-semibold text-gray-700 pb-2">
                    {otpExpired ? "" : "Enter OTP"}
                  </label>
                  <div className="flex justify-center">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      disabled={otpExpired}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="0000"
                      className={`w-40 text-center tracking-[1rem] pl-[1rem] p-2 border rounded text-2xl font-bold outline-none transition-colors ${
                        otpError
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-teal-500"
                      }`}
                    />
                  </div>
                  {otpError && (
                    <p className="text-red-500 text-xs mt-1">{otpError}</p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {!showOtpInput && !showNewPasswordInput && (
                  <button
                    onClick={handleSendEmail}
                    className="w-full py-2 bg-teal-600 text-white font-semibold rounded hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    Send Email
                  </button>
                )}

                {showOtpInput && !showNewPasswordInput && (
                  <button
                    onClick={otpExpired ? handleResend : handleVerifyOtp}
                    className="w-full py-2 bg-teal-600 text-white font-semibold rounded hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    {otpExpired ? "Resend OTP" : "Verify OTP"}
                  </button>
                )}

                {showNewPasswordInput && (
                  <button
                    onClick={handleResetPassword}
                    className="w-full py-2 bg-teal-600 text-white font-semibold rounded hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
