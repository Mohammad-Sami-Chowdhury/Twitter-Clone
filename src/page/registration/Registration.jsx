import React, { useState } from "react";
import bg from "../../assets/bg.png";
import logo from "../../assets/logo.png";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar.png"

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState(false);
  const handleEmailInput = (e) => setEmailInput(e.target.value);
  const handleNameInput = (e) => setNameInput(e.target.value);
  const handlePasswordInput = (e) => setPasswordInput(e.target.value);
  const handleNumberInput = (e) => setNumberInput(e.target.value);

  const handleSignup = () => {
    setSignup(true);
  };
  const handleEmail = () => {
    setEmail(!email);
  };
  const handleCancel = () => {
    setSignup(false);
  };

  const handleNext = () => {
    createUserWithEmailAndPassword(auth, emailInput, passwordInput)
      .then((user) => {
        updateProfile(auth.currentUser, {
          displayName: nameInput,
          photoURL: avatar,
        });
        sendEmailVerification(auth.currentUser)
          .then(() => {
            toast.success("Please Check Your Mail");
            setEmailInput("");
            setNameInput("");
            setPasswordInput("");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          })
          .then(() => {
            set(ref(db, "users/" + user.user.uid), {
              username: user.user.displayName,
              email: user.user.email,
            });
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode.includes("auth/email-already-in-use")) {
          toast.error("This Email is Already in Use");
        }
      });
  };

  return (
    <section className="bg-[#1B2730] relative">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="flex items-center font-pops">
        <div className="w-[60%]">
          <img className="h-screen" src={bg} alt="registration background" />
        </div>
        <div>
          <img className="w-[100px] mb-[55px]" src={logo} alt="logo" />
          <h1 className="text-[84px] font-bold text-white">Happening now</h1>
          <h2 className="text-[42px] font-bold text-white mb-[30px]">
            Join Twitter today
          </h2>
          <div className="text-[20px] font-medium text-white space-y-5">
            <div className="flex cursor-pointer items-center gap-x-2 justify-center border-[1px] border-gray-500 w-[400px] h-[60px] rounded-full">
              <img className="w-[30px]" src={google} alt="goole" />
              <p>Sign up with Google</p>
            </div>
            <div className="flex cursor-pointer items-center gap-x-2 justify-center border-[1px] border-gray-500 w-[400px] h-[60px] rounded-full">
              <img className="w-[30px]" src={apple} alt="apple" />
              <p>Sign up with Apple</p>
            </div>
            <div
              onClick={handleSignup}
              className="border-gray-500 cursor-pointer border-[1px] w-[400px] h-[60px] rounded-full items-center justify-center flex"
            >
              <p>Sign up with phone or email</p>
            </div>
          </div>
          <p className="text-white text-[14px] w-[370px] mt-6">
            By singing up you agree to the{" "}
            <Link to="/terms" className="text-[#1D9BF0] cursor-pointer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              className="text-[#1D9BF0] cursor-pointer"
            >
              Privacy Policy
            </Link>
            , including{" "}
            <Link to="/cookie" className="text-[#1D9BF0] cursor-pointer">
              Cookie Use
            </Link>
            .
          </p>
          <p className="text-white text-[14px] w-[370px] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1D9BF0] cursor-pointer">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <div className="max-w-[1480px] mx-auto py-5">
        <ul className="text-[13px] font-medium  flex justify-between text-white">
          <li>
            <Link>About</Link>
          </li>
          <li>
            <Link>Help Center</Link>
          </li>
          <li>
            <Link>Term of Service</Link>
          </li>
          <li>
            <Link>Privacy Policy</Link>
          </li>
          <li>
            <Link>Cookie Policy</Link>
          </li>
          <li>
            <Link>Ads Info</Link>
          </li>
          <li>
            <Link>Blog</Link>
          </li>
          <li>
            <Link>Status</Link>
          </li>
          <li>
            <Link>Carrers</Link>
          </li>
          <li>
            <Link>Brand Resources</Link>
          </li>
          <li>
            <Link>Advertsing</Link>
          </li>
          <li>
            <Link>Marketing</Link>
          </li>
          <li>
            <Link>Twitter for Business</Link>
          </li>
          <li>
            <Link>Developers</Link>
          </li>
          <li>
            <Link>Directory</Link>
          </li>
          <li>
            <Link>Settings</Link>
          </li>
          <li>
            <Link>© 2024 Twitter, Inc.</Link>
          </li>
        </ul>
      </div>
      {signup && (
        <div className="bg-[#1B2730] shadow-lg shadow-black rounded-md w-[750px] h-[800px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-10">
          <MdCancel
            onClick={handleCancel}
            size={28}
            className="text-white cursor-pointer absolute top-[20px] right-[20px]"
          />
          <img className="w-[50px] mx-auto mb-10" src={logo} alt="logo" />
          <p className="font-pops text-white text-[30px] font-bold mb-[35px]">
            Create an account
          </p>
          {email ? (
            <>
              <input
                onChange={handleNameInput}
                placeholder="Name"
                className="w-[670px] h-[70px] mb-[25px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
                type="text"
              />
              <input
                onChange={handleNumberInput}
                placeholder="Phone Number"
                className="w-[670px] h-[70px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white mb-[25px]"
                type="text"
              />
              <input
                onChange={handlePasswordInput}
                placeholder="Password"
                className="w-[670px] h-[70px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
                type="text"
              />
              <p
                onClick={handleEmail}
                className="text-base text-[#1D9BF0] mt-[30px] cursor-pointer"
              >
                Use Email
              </p>
            </>
          ) : (
            <>
              <input
                value={nameInput}
                onChange={handleNameInput}
                placeholder="Name"
                className="w-[670px] h-[70px] mb-[25px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
                type="text"
              />
              <input
                value={emailInput}
                onChange={handleEmailInput}
                placeholder="Email"
                className="w-[670px] h-[70px] mb-[25px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
                type="text"
              />
              <input
                value={passwordInput}
                onChange={handlePasswordInput}
                placeholder="Password"
                className="w-[670px] h-[70px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
                type="text"
              />
              <p
                onClick={handleEmail}
                className="text-base text-[#1D9BF0] mt-[30px] cursor-pointer"
              >
                Use Phone number
              </p>
            </>
          )}
          <button
            onClick={handleNext}
            className="w-full h-[60px] rounded-full bg-[#1D9BF0] text-white text-[18px] font-bold font-pops mt-5"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Registration;
