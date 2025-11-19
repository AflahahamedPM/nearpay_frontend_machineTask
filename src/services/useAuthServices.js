import React, { useState } from "react";
import APIRequest from "../utils/APIRequest";
import { API_ENDPOINTS } from "../config/ConfigAPIURL";
import useAlert from "../hooks/useAlert";
import { CheckValidation } from "../utils/Validation";
import { useNavigate, useNavigation } from "react-router-dom";

const loginDetails = {
  email: "",
  password: "",
};

const registerDetails = {
  email: "",
  password: "",
  name: "",
};

const useAuthServices = () => {
  const [loginForm, setLoginForm] = useState(loginDetails);
  const [registerForm, setRegisterForm] = useState(registerDetails);
  const [showPassoword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { publishNotification } = useAlert();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const missingFields = CheckValidation(loginForm);

      if (missingFields?.length > 0) {
        publishNotification("Please fill all the mandatory fields", "error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(loginForm?.email)) {
        publishNotification("Please enter a valid email", "error");
        return;
      }

      setIsLoading(true);

      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS.userLogin,
        JSON.stringify(loginForm)
      );
      const message = response?.data?.message;

      if (response?.data?.responseCode === 109) {
        const token = response?.data?.token;
        const userDetails = response?.data?.user;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
        }

        publishNotification(message, "success");
        navigate("/dashboard");
      } else if (response?.data?.responseCode === 103) {
        publishNotification(message, "error");
      } else if (response?.data?.responseCode === 104) {
        publishNotification(message, "error");
      } else {
        publishNotification(
          message ?? "Error occured while logging in",
          "error"
        );
      }
    } catch (error) {
      console.log(error, "error");
      publishNotification(
        error?.message ?? "Error occured while logging in",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      const missingFields = CheckValidation(registerForm);

      if (missingFields?.length > 0) {
        publishNotification("Please fill all the mandatory fields", "error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(registerForm?.email)) {
        publishNotification("Please enter a valid email", "error");
        return;
      }

      setIsLoading(true);

      const response = await APIRequest.request(
        "POST",
        API_ENDPOINTS?.register,
        JSON.stringify(registerForm)
      );
      const responseCode = response?.data?.responseCode;
      const message = response?.data?.message;
      if (responseCode === 109) {
        publishNotification(message, "success");
        navigate("/login");
      } else if (responseCode === 114) {
        publishNotification(message, "error");
      }
    } catch (error) {
      publishNotification(error?.message ?? "Error while registering", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginForm,
    setLoginForm,
    showPassoword,
    setShowPassword,
    handleLogin,
    registerForm,
    setRegisterForm,
    handleRegister,
    isLoading,
  };
};

export default useAuthServices;
