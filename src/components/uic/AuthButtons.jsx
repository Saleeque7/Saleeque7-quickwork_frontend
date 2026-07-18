import { MdInfo } from "react-icons/md";
import { GitHubIcon, GoogleIcon } from "./Icons";
import React from "react";
import { AuthAxios } from "../../utils/api/baseUrl";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setClient, setClientAuth } from "../../utils/Redux/recruiterSlice";
import { setUser, setUserAuth } from "../../utils/Redux/userSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { config } from "../../config/config";

const handleGoogleLog = async (layout, userType, data) => {
  if (layout === "Signup") {
    const res = await AuthAxios.post("/googleSignup", { userType, data });
    return res;
  } else if (layout === "login") {
    const res = await AuthAxios.post("/googleLogin", { data });
    return res;
  }
};

export const AuthButtonGroup = ({ layout, userType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const res = await handleGoogleLog(layout, userType, response.data);
        const person = res.data.user;
        if (res.data.success) {
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: true,
            draggable: true,
          });
          const accessToken = res.data.accessToken;
          const refreshToken = res.data.refreshToken;
          setTimeout(() => {
            handleNavigation(person, accessToken, refreshToken);
          }, 2000);
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "Server responded with status code:",
            error.response.status
          );
          console.error("Error data:", error.response.data);
          setErrorMessage(error.response.data.message);
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
    },
    onError: (errorResponse) => {
      console.error("Login Failed:", errorResponse);
    },
  });

  const handleNavigation = (person, accessToken, refreshToken) => {
    if (person.job_role === "freelancer") {
      dispatch(setUser(person));
      dispatch(setUserAuth());
      localStorage.setItem("userrefreshToken", refreshToken);
      localStorage.setItem("useraccessToken", accessToken);
      navigate("/user/home", { replace: true });
    } else if (person.job_role === "client") {
      dispatch(setClient(person));
      dispatch(setClientAuth());
      localStorage.setItem("clientrefreshToken", refreshToken);
      localStorage.setItem("clientaccessToken", accessToken);
      navigate("/client/home", { replace: true });
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    if (code && !localStorage.getItem("gitaccessToken")) {
      const getAccessToken = async () => {
        try {
          const response = await AuthAxios.get(
            `/gitAccessToken?code=${code}&layout=${layout}`
          );

          if (response.data.token) {
            localStorage.setItem("gitaccessToken", response.data.token);
            const res = await githubAuth(layout, userType);

            const person = res.data.user;
            if (res.data.success) {
              toast.success(res.data.message, {
                autoClose: 1000,
                closeButton: true,
                draggable: true,
              });
              const accessToken = res.data.accessToken;
              const refreshToken = res.data.refreshToken;
              setTimeout(() => {
                handleNavigation(person, accessToken, refreshToken);
              }, 2000);
            }
          }
        } catch (error) {
          if (error.response) {
            console.error(
              "Server responded with status code:",
              error.response.status
            );
            console.error("Error data:", error.response.data);
            setErrorMessage(error.response.data.message);
          } else if (error.request) {
            console.error("No response received from server:", error.request);
            toast.error("Network error. Please try again later.", {
              autoClose: 2000,
              closeButton: true,
            });
          } else {
            console.error("Error setting up the request:", error.message);
            toast.error(
              "An unexpected error occurred. Please try again later.",
              {
                autoClose: 2000,
                closeButton: true,
              }
            );
          }
        }
      };
      getAccessToken();
    } else {
      localStorage.removeItem("gitaccessToken");
    }
  }, [userType, layout, handleNavigation]);

  const githubAuth = async (layout, userType) => {
    const apiEndpoint = layout === "login" ? "/githubLogin" : "/githubSignup";

    if (layout === "login") {
      const res = await AuthAxios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gitaccessToken")}`,
        },
      });
      return res;
    } else if (layout === "Signup") {
      const res = await AuthAxios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("gitaccessToken")}`,
        },
        params: { userType },
      });
      return res;
    } else {
      console.log("layout is not available");
    }
  };

  const CLIENT_ID = config.GIT_HUB_CLIENT_ID;
  const registerWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`
    );
  };

  const CLIENT_ID_LOG = config.GIT_HUB_CLIENT_ID_LOG;
  const logInWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID_LOG}&scope=user:email`
    );
  };

  const handleGitHubButtonClick = () => {
    if (layout === "login") {
      logInWithGithub();
    } else if (layout === "Signup") {
      registerWithGithub();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex flex-col sm:flex-row gap-4 w-full ${
          layout === "Signup" ? "mt-3" : "mt-5"
        }`}
      >
        <button
          onClick={() => login()}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded hover:bg-blue-50 transition-colors text-sm font-medium cursor-pointer"
        >
          <GoogleIcon />
          <span>{layout === "login" ? "Sign in with Google" : "Sign up with Google"}</span>
        </button>
        <button
          onClick={handleGitHubButtonClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm font-medium cursor-pointer"
        >
          <GitHubIcon />
          <span>{layout === "login" ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
        </button>
      </div>
      {errorMessage && (
        <div className="mt-2 text-center text-sm">
          <p className="font-bold text-red-500 inline-flex items-center gap-2 justify-center">
            <MdInfo className="text-lg" />
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};
