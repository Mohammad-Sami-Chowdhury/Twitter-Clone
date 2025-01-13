import React, { useEffect, useState } from "react";
import { CiSearch, CiSettings } from "react-icons/ci";
import userProfile from "../../assets/profile-user.png";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref } from "firebase/database";

const Rightbar = () => {
  const data = useSelector((state) => state.userDetails.userInfo);
  const db = getDatabase();
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          arr.push({ ...item.val(), userid: item.key });
        }
        console.log(item.val());
      });
      setUserList(arr);
    });
  }, []);
  return (
    <div className="bg-[#1B2730] font-pops h-screen pl-[50px] pr-[120px] border-l-[1px] border-gray-500">
      <div className="mt-5 relative">
        <CiSearch
          size={28}
          className="text-gray-400 absolute top-[50%] left-5 translate-y-[-50%]"
        />
        <input
          className="w-[370px] h-[55px] bg-[#3b3b3b] rounded-full pl-[60px] text-gray-400 outline-none"
          type="text"
        />
      </div>
      <div className="w-[370px] h-[402px] bg-[#3b3b3b] mt-5 rounded-xl px-4 py-4 text-white overflow-y-scroll hide-scrollbar">
        <div className="flex justify-between items-center">
          <p className="text-2xl text-white font-bold">Trends For You</p>
          <CiSettings size={28} />
        </div>
      </div>
      <div className="w-[370px] h-[290px] bg-[#3b3b3b] mt-5 rounded-xl px-4 py-4 overflow-y-scroll hide-scrollbar">
        <p className="font-white text-2xl font-bold text-white mb-[25px]">
          You Might Like
        </p>
        {userList.map((item) => (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <img src={userProfile} alt="user-profile" />
              <div>
                <p className="text-[18px] font-semibold text-white">
                  {item.username}
                </p>
                {/* <p className="text-[18px] text-gray-400">{item.email}</p> */}
              </div>
            </div>
            <button className="w-[92px] h-[38px] bg-white text-base font-bold rounded-full">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rightbar;
