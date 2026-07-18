import Logo from "../../components/uic/Logo";
import { AuthButtonGroup } from "../../components/uic/AuthButtons";
import { PasswordField } from "../../components/uic/passwordShow";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserAxios, ClientAxios } from "../../utils/api/baseUrl";
import { useState } from "react";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState();

  const location = useLocation();
  const navigate = useNavigate();
  const userType = location.state?.userType;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    const userInfo = { name, email, phone, password, job_role: userType };
    try {
      let AxiosInstance;
      if (userType === "client") {
        AxiosInstance = ClientAxios;
      } else if (userType === "freelancer") {
        AxiosInstance = UserAxios;
      } else {
        navigate("/pre");
      }
      const res = await AxiosInstance.post("/register", userInfo);

      if (res.data.success) {
        toast.info(res.data.message, {
          autoClose: 1000,
          closeButton: true,
          draggable: true,
        });
        const responseOtp = res.data.otp;
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        navigate('/verifyRegistration', { state: { userInfo, responseOtp } });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists");
      } else {
        toast.error("An error occurred while processing your request");
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              {userType === "freelancer"
                ? "Sign up to find work you love"
                : "Sign up to hire talent"}
            </h1>
            <GoogleOAuthProvider clientId="1011709679059-km4ncqucf9k86qroa03mlhjhlhuv256s.apps.googleusercontent.com">
              <AuthButtonGroup layout="Signup" userType={userType} />
            </GoogleOAuthProvider>
          </div>

          <div className="flex items-center gap-4 my-2">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-semibold text-gray-700">
                  {userType === "freelancer" ? "Full Name" : "Company Name"}
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-semibold text-gray-700">
                  {userType === "freelancer" ? "Email Address" : "Company Email"}
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 outline-none transition-all text-sm font-medium"
                />
              </div>

              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-semibold text-gray-700">
                  {userType === "freelancer" ? "Phone Number" : "Contact Number"}
                </label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="number"
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-green-600 focus:border-green-600 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={handleSignup}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all shadow-sm hover:shadow cursor-pointer text-sm"
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-200/50 mt-10">
        <p className="text-xs text-gray-400">© 2026 QUICKWORK Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SignUp;
