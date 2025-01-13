import React from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { FaHashtag, FaUser } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMailOutline, IoHomeOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { LuNotebookText } from "react-icons/lu";
import { PiDotsThreeCircle, PiDotsThreeOutline } from "react-icons/pi";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const data = useSelector((state) => state.userDetails.userInfo);
  return (
    <div className="bg-[#1B2730] h-screen w-[25%] pl-[155px] pr-[15px] pt-[31px] border-r-[1px] border-gray-500">
      <img className="w-[40px]" src={logo} alt="logo" />
      <div className="mt-[50px] space-y-10">
        <div className="flex text-white items-center gap-x-5">
          <Link className="flex items-center gap-x-5" to="/home">
            <IoHomeOutline size={28} />
            <p className="text-[18px] font-pops font-semibold">Home</p>
          </Link>
        </div>
        <div className="flex text-white items-center gap-x-5 cursor-pointer">
          <FaHashtag size={28} />
          <p className="text-[18px] font-pops font-semibold">Explore</p>
        </div>
        <div className="flex text-white items-center gap-x-5 cursor-pointer">
          <IoMdNotificationsOutline size={28} />
          <p className="text-[18px] font-pops font-semibold">Notificatios</p>
        </div>
        <div className="flex text-white items-center gap-x-5 cursor-pointer">
          <IoMailOutline size={28} />
          <p className="text-[18px] font-pops font-semibold">Messages</p>
        </div>
        <div className="flex text-white items-center gap-x-5 cursor-pointer">
          <CiBookmark size={28} />
          <p className="text-[18px] font-pops font-semibold">Bookmarks</p>
        </div>
        <div className="flex text-white items-center gap-x-5 cursor-pointer">
          <LuNotebookText size={28} />
          <p className="text-[18px] font-pops font-semibold">Lists</p>
        </div>
        <div className="flex text-white items-center gap-x-5">
          <Link className="flex items-center gap-x-5" to="/profile">
            <FaUser size={28} />
            <p className="text-[18px] font-pops font-semibold">Profile</p>
          </Link>
        </div>
        <div className="flex text-white items-center gap-x-5 cursor-pointer">
          <PiDotsThreeCircle size={28} />
          <p className="text-[18px] font-pops font-semibold">More</p>
        </div>
      </div>
      <button className="bg-[#1D9BF0] duration-300 hover:bg-[#1d9cf0a4] text-white w-[230px] h-[55px] rounded-full text-[18px] font-bold font-pops mt-[50px]">
        Tweet
      </button>
      <div className="flex items-center gap-x-3 mt-[100px] cursor-pointer">
        <img className="w-[50px]" src={avatar} alt="profile" />
        <div>
          <p className="font-pops text-base text-white font-semibold">
            {data.displayName}
          </p>
          <p className="font-pops text-[10px] text-gray-500">{data.email}</p>
        </div>
        <PiDotsThreeOutline size={22} className="text-white ml-[50px]" />
      </div>
    </div>
  );
};

export default Sidebar;
