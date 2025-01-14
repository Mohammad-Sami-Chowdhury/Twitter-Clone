import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import profilesm from "../../assets/profilesm.png";

const chat = () => {
  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="px-5 w-[25%] border-r-[1px] border-gray-500">
          <div className="border-b-[1px] border-b-gray-500">
            <p className="text-white text-xl font-bold mt-5 mb-5">Messages</p>
            <input
              className="w-[300px] mb-5 h-[55px] bg-[#3b3b3b] rounded-full pl-[30px] text-gray-400 outline-none"
              type="text"
              placeholder="Search users"
            />
          </div>
          <div className="my-5">
            <div className="flex gap-x-4 items-center">
              <img src={profilesm} alt="profile" />
              <div>
                <p className="text-base text-white font-bold">displayName</p>
                <p className="text-sm text-gray-500">last message</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default chat;
