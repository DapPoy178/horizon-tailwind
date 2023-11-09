import React, { useRef, useContext } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import InputField from "components/fields/InputField";
import { UserContext } from "App";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);
  const cookies = new Cookies();
  const { authenticatedUser, setAuthenticatedUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleLogin = async () => {
    const email = inputEmail.current.value;
    const password = inputPassword.current.value;

    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true
    });

    const loginPromise = axios.post("http://localhost:8000/api/auth/login", {
      email: email,
      password: password
    }, {
      withCredentials: true
    })
      .then(async (response) => {
        cookies.set("Authorization", response.data.token);
        return await axios.get("http://localhost:8000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        })
          .then(response => {
            setAuthenticatedUser(response.data.user);
            navigate("/admin/dashboard");
            return response;
          });
      });

    toast.promise(
      loginPromise,
      {
        pending: {
          render() {
            return "Processing..."
          },
          icon: false,
        },
        success: {
          render({ data }) {
            return `Welcome, ${data.data.user.name}`
          },
          // other options
          icon: "🟢",
        },
        error: {
          render({ data }) {
            // When the promise reject, data will contains the error
            return `Error : ${data.response.error.message}`;
          }
        }
      }
    )
  }

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-5 ml-1 text-base text-gray-600">
          Enter your name and password to sign in!
        </p>

        <InputField
          variant="auth"
          extra="mb-3"
          label="email*"
          placeholder="mail@simmmple.com"
          id="email"
          name="email"
          type="text"
          ref={inputEmail}
        />

        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          id="password"
          name="password"
          type="password"
          ref={inputPassword}
        />

        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={handleLogin}
        >
          Sign In
        </button>
      </div>
      <ToastContainer />
    </div>

  );
};

export default SignIn;
