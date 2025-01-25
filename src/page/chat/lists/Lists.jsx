import React, { useEffect, useState } from "react";
import cover from "../../../assets/cover.png";
import Sidebar from "../../../components/Sidebar/Sidebar";
import avatar from "../../../assets/avatar.png";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";

const lists = () => {
  const data = useSelector((state) => state.userDetails.userInfo);
  const db = getDatabase();
  const [userList, setUserList] = useState([]);
  const [following, setFollowing] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [blockedByUsers, setBlockedByUsers] = useState({});

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          arr.push({ ...item.val(), userid: item.key });
        }
      });
      setUserList(arr);
    });
  }, [db, data.uid]);

  // Fetch the list of users the logged-in user is following
  useEffect(() => {
    const followingRef = ref(db, `following/${data.uid}`);
    onValue(followingRef, (snapshot) => {
      let followingData = {};
      snapshot.forEach((item) => {
        followingData[item.key] = true;
      });
      setFollowing(followingData);
    });
  }, [db, data.uid]);

  // Follow/Unfollow functionality
  const handleFollowToggle = (followedUserId) => {
    const currentUserId = data.uid;

    if (following[followedUserId]) {
      // If already following, unfollow
      remove(ref(db, `followers/${followedUserId}/${currentUserId}`));
      remove(ref(db, `following/${currentUserId}/${followedUserId}`));
    } else {
      // If not following, follow
      set(ref(db, `followers/${followedUserId}/${currentUserId}`), true);
      set(ref(db, `following/${currentUserId}/${followedUserId}`), true);
    }
  };

  // Filter users based on search query
  const filteredUsers = userList.filter(
    (user) =>
      !blockedByUsers[user.userid] &&
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="w-[75%] h-screen space-y-5 py-5 px-5 overflow-y-scroll hide-scrollbar">
          <p className="font-pops text-[20px] text-white font-bold">
            User Lists
          </p>
          <div className="mt-5 relative">
            <CiSearch
              size={28}
              className="text-gray-400 absolute top-[50%] left-5 translate-y-[-50%]"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[370px] h-[55px] bg-[#3b3b3b] rounded-full pl-[60px] text-gray-400 outline-none"
              type="text"
              placeholder="Search users"
            />
          </div>
          <div className="flex gap-x-5">
            {filteredUsers.map((item) => (
              <div
                className="w-[300px] h-[300px] border-[1px] border-gray-500 rounded-xl relative"
                key={item.userid}
              >
                <img className="rounded-t-xl" src={cover} alt="cover" />
                <img
                  className="w-[100px] rounded-full object object-cover h-[100px] absolute top-[15%] left-[50%] translate-x-[-50%]"
                  src={item.profilePicture || avatar}
                  alt="avatar"
                />
                <p className="text-[20px] text-white font-bold mt-[25%] text-center">
                  {item.displayName}
                </p>
                <div className="flex justify-center gap-x-[50px] mt-[40px]">
                  <button className="w-[100px] bg-red-500 text-white font-bold h-[38px] rounded-full">
                    Block
                  </button>
                  <button
                    onClick={() => handleFollowToggle(item.userid)}
                    className={`w-[100px] h-[38px] text-base font-bold rounded-full ${
                      following[item.userid]
                        ? "bg-red-500 text-white"
                        : "bg-[#1DA1F2] text-white"
                    }`}
                  >
                    {following[item.userid] ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default lists;
