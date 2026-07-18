
import Logo from "../../components/uic/Logo";
import { PasswordField } from "../../components/uic/passwordShow";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdmin, setAdminAuth } from "../../utils/Redux/adminSlice";
import { AdminAxios } from "../../utils/api/baseUrl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const AdminLogin = () => {
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
      const res = await AdminAxios.post("/login", loginData);
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
            disPatch(setAdmin(person));
            disPatch(setAdminAuth());
            localStorage.setItem("adminrefreshToken", refreshToken);
            localStorage.setItem("adminaccessToken", accessToken);
            navigate("/admin/dashboard");
          }, 2000);
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
              Admin Login
            </h1>
          </div>
          <div className="py-8 px-4 sm:px-10 bg-white shadow-md rounded-2xl border border-gray-200">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-teal-500 outline-none transition-colors"
                  />
                </div>
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-6">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
  