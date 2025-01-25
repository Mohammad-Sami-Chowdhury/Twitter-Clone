import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

const Login = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  const handleEmailInput = (e) => {
    setEmailInput(e.target.value);
  };
  const handlePasswordInput = (e) => {
    setPasswordInput(e.target.value);
  };
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, emailInput, passwordInput).then((user) => {
      dispatch(userLoginInfo(user.user));     
      localStorage.setItem("userLoginInfo", JSON.stringify(user.user));
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    });
  };
  return (
    <div className="bg-[#1B2730] h-screen py-10">
      <img className="w-[100px] mx-auto" src={logo} alt="logo" />
      <h1 className="font-pops font-bold text-[42px] text-white text-center my-9 ">
        Log in to Handbook
      </h1>
      <div className="flex justify-center mb-[25px]">
        <input
          value={emailInput}
          onChange={handleEmailInput}
          className="w-[450px] h-[70px] border-[1px] border-gray-300 rounded-md bg-transparent px-3 text-white"
          placeholder="Email address"
          type="text"
        />
      </div>
      <div className="flex justify-center">
        <input
          value={passwordInput}
          onChange={handlePasswordInput}
          className="w-[450px] h-[70px] border-[1px] border-gray-300 rounded-md bg-transparent px-3 text-white"
          placeholder="Password"
          type="text"
        />
      </div>
      <div className="flex justify-center mt-[25px] mb-10">
        <button
          onClick={handleLogin}
          className="w-[450px] h-[70px] bg-[#1D9BF0] rounded-full text-white text-[18px] font-pops font-semibold"
        >
          Log In
        </button>
      </div>
      <div className="flex gap-x-[165px] justify-center items-center">
        <Link to="#" className="text-[#1D9BF0] text-[18px] font-pops">
          Forgot Password?
        </Link>
        <Link
          to="/registration"
          className="text-[#1D9BF0] text-[18px] font-pops"
        >
          Sign up to Handbook
        </Link>
      </div>
    </div>
  );
};

export default Login;
