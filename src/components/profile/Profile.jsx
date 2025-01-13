import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import cover from "../../assets/cover.png";
import Sidebar from "../Sidebar/Sidebar";
import { CiLocationOn } from "react-icons/ci";
import { FaLink } from "react-icons/fa";
import { PiBalloon } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import profile from "../../assets/profile.png";
import Rightbar from "../rightbar/Rightbar";

const Profile = () => {
  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="w-[50%] relative space-y-5 overflow-y-scroll hide-scrollbar">
          <div className="flex items-center gap-x-[30px] pl-[30px] py-5">
            <Link to="/home">
              <FaArrowLeftLong
                size={20}
                className="text-white cursor-pointer"
              />
            </Link>
            <p className="font-pops text-[20px] text-white font-bold ">Name</p>
          </div>
          <div>
            <img className="w-full" src={cover} alt="cover" />
          </div>
          <div>
            <img
              className="absolute top-[35%] left-5"
              src={profile}
              alt="profile"
            />
          </div>
          <p className="text-2xl text-white font-bold px-10 pt-[100px]">Name</p>
          <p className="text-gray-500 text-base px-10">@name</p>
          <p className="text-white text-[18px] px-10">Write your bio.</p>
          <div className="flex text-gray-500 text-[18px] justify-between items-center px-10">
            <div className="flex gap-x-2 items-center">
              <CiLocationOn size={24} />
              <p>Dhaka, Bangladesh</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <FaLink size={24} />
              <p className="text-[#1D9BF0]">facebook.com</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <PiBalloon size={24} />
              <p>5 January 2005</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <SlCalender size={24} />
              <p>Joined 1 January 2025</p>
            </div>
          </div>
        </div>
        <Rightbar />
      </div>
    </div>
  );
};

export default Profile;
