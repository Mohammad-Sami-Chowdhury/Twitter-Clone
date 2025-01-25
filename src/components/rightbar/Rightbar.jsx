import React, { useEffect, useState } from "react";
import { CiSearch, CiSettings } from "react-icons/ci";
import avatar from "../../assets/avatar.png"
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { Link } from "react-router-dom";

const Rightbar = () => {
  const data = useSelector((state) => state.userDetails.userInfo);
  const db = getDatabase();
  const [userList, setUserList] = useState([]);
  const [following, setFollowing] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [blockedByUsers, setBlockedByUsers] = useState({});

  // Fetch users from the database
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
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#1B2730] font-pops h-screen pl-[50px] pr-[120px] border-l-[1px] border-gray-500">
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

      {/* Trends For You Section */}
      <div className="w-[370px] h-[402px] bg-[#3b3b3b] mt-5 rounded-xl px-4 py-4 text-white overflow-y-scroll hide-scrollbar">
        <div className="flex justify-between items-center">
          <p className="text-2xl text-white font-bold">Trends For You</p>
          <CiSettings size={28} />
        </div>
      </div>

      {/* You Might Like Section */}
      <div className="w-[370px] h-[290px] bg-[#3b3b3b] mt-5 rounded-xl px-4 py-4 overflow-y-scroll hide-scrollbar">
        <p className="font-white text-2xl font-bold text-white mb-[25px]">
          You Might Like
        </p>
        {filteredUsers.map((item) => (
          <div
            className="flex justify-between items-center mb-2"
            key={item.userid}
          >
            <Link
              to={`/profile/${item.userid}`}
              className="flex items-center gap-x-3"
            >
              <img className="w-[50px] h-[50px] rounded-full object-cover" src={item.profilePicture || avatar} alt="user-profile" />
              <div>
                <p className="text-[18px] font-semibold text-white">
                  {item.displayName}
                </p>
              </div>
            </Link>
            <button
              onClick={() => handleFollowToggle(item.userid)}
              className={`w-[92px] h-[38px] text-base font-bold rounded-full ${
                following[item.userid] ? "bg-red-500 text-white" : "bg-white"
              }`}
            >
              {following[item.userid] ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rightbar;
