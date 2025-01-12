import React, { useState } from "react";
import bg from "../../assets/bg.png";
import logo from "../../assets/logo.png";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";

const Registration = () => {
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSignup = () => {
    setSignup(true);
  };
  const handleEmail = () => {
    setEmail(!email);
  };
  const handleCancel = () => {
    setSignup(false)
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <section className="bg-[#1B2730] relative">
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
            <MdCancel onClick={handleCancel} size={28} className="text-white cursor-pointer absolute top-[20px] right-[20px]"/>
          <img className="w-[50px] mx-auto mb-10" src={logo} alt="logo" />
          <p className="font-pops text-white text-[30px] font-bold mb-[35px]">
            Create an account
          </p>
          <input
            placeholder="Name"
            className="w-[670px] h-[70px] mb-[25px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
            type="text"
          />
          {email ? (
            <>
              <input
                placeholder="Email"
                className="w-[670px] h-[70px] px-5 rounded-md bg-transparent border-[1px] border-gray-500 outline-none text-white"
                type="text"
              />
              <p
                onClick={handleEmail}
                className="text-base text-[#1D9BF0] mt-[30px] cursor-pointer"
              >
                Use Phone Number
              </p>
            </>
          ) : (
            <>
              <input
                placeholder="Phone Number"
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
          )}
          <p className="font-pops text-[18px] text-white font-medium mt-10">
            Date Of Birth
          </p>
          <p className="font-pops text-base text-gray-500 mt-[10px] mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
            assumenda culpa consequuntur accusantium, fugiat tempora cum.
            Laboriosam facilis deserunt consequuntur vero magni voluptate error,
            accusantium in, consectetur illum iusto enim!
          </p>

          <div className="flex justify-between">
            {/* Month Dropdown */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="block w-[312px] h-[70px] bg-transparent p-2 border border-gray-500 rounded-lg text-white outline-none"
            >
              <option className="bg-[#1B2730] text-gray-500" value="">Month</option>
              {months.map((m, index) => (
                <option className="bg-[#1B2730]" key={index} value={index + 1}>
                  {m}
                </option>
              ))}
            </select>

            {/* Day Dropdown */}
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="block w-[160px] h-[70px] p-2 border border-gray-500 rounded-lg text-white outline-none bg-transparent"
            >
              <option className="bg-[#1B2730] text-gray-500" value="">Day</option>
              {days.map((d) => (
                <option className="bg-[#1B2730]" key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-[160px] h-[70px] p-2 border border-gray-500 rounded-lg text-white outline-none bg-transparent"
            >
              <option className="bg-[#1B2730] text-gray-500" value="">Year</option>
              {years.map((y) => (
                <option className="bg-[#1B2730]" key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button className="w-full h-[60px] rounded-full bg-[#1D9BF0] text-white text-[18px] font-bold font-pops mt-5">Next</button>
        </div>
      )}
    </section>
  );
};

export default Registration;
