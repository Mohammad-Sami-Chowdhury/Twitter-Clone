import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import profilesm from "../../assets/profilesm.png";
import { CiImageOn, CiTimer } from "react-icons/ci";
import { MdOutlineGifBox, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaChartBar } from "react-icons/fa6";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [verify, setVerify] = useState(false);
  const data = useSelector((state) => state.userDetails.userInfo);

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  });
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user.emailVerified) {
        setVerify(true);
        toast.success("Login Successfull");
      } else {
        setVerify(false);
        navigate("/login");
        toast.error("Please Verify Your Email");
      }
    });
  }, [auth, navigate]);

  return (
    <section className="bg-[#1B2730] h-screen">
      {verify ? (
        <div className="flex">
          <Sidebar />
          <div className="w-[50%]">
            <div>
              <p className="text-2xl text-white font-bold py-5 px-[25px] border-b-[1px] border-gray-500">
                Home
              </p>
            </div>
            <div className="mt-5 px-[25px] border-b-[1px] border-gray-500 pb-7">
              <div className="flex gap-x-5">
                <img src={profilesm} alt="profilesm" />
                <input
                  placeholder="What’s happening"
                  className="outline-none w-full bg-transparent placeholder:font-bold text-white text-[22px]"
                  type="text"
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="text-2xl flex text-[#1D9BF0] gap-x-5">
                  <CiImageOn />
                  <MdOutlineGifBox />
                  <MdOutlineEmojiEmotions />
                  <FaChartBar />
                  <CiTimer />
                </div>
                <button className="w-[110px] h-[50px] rounded-full bg-[#1D9BF0] text-white font-bold text-base">Tweet</button>
              </div>
            </div>
          </div>
          <Rightbar />
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default Home;
