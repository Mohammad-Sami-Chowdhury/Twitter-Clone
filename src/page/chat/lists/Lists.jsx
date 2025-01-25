// import React, { useEffect, useState } from "react";
// import cover from "../../../assets/cover.png";
// import Sidebar from "../../../components/Sidebar/Sidebar";
// import avatar from "../../../assets/avatar.png";
// import { getDatabase, onValue, ref, remove, set } from "firebase/database";
// import { useSelector } from "react-redux";
// import { CiSearch } from "react-icons/ci";
// import { Link } from "react-router-dom";

// const Lists = () => {
//   const data = useSelector((state) => state.userDetails.userInfo);
//   const db = getDatabase();
//   const [userList, setUserList] = useState([]);
//   const [following, setFollowing] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [blockedByUsers, setBlockedByUsers] = useState({});

//   useEffect(() => {
//     const usersRef = ref(db, "users/");
//     const followersRef = ref(db, "followers/");
//     const followingRef = ref(db, "following/");

//     // Fetch all users
//     onValue(usersRef, (snapshot) => {
//       let users = [];
//       snapshot.forEach((item) => {
//         if (data.uid !== item.key) {
//           const userId = item.key;
//           users.push({
//             ...item.val(),
//             userid: userId,
//             followers: 0, // Placeholder
//             following: 0, // Placeholder
//           });
//         }
//       });

//       // Fetch followers count
//       onValue(followersRef, (snapshot) => {
//         snapshot.forEach((item) => {
//           const userId = item.key;
//           const followersCount = Object.keys(item.val() || {}).length;
//           const userIndex = users.findIndex((u) => u.userid === userId);
//           if (userIndex !== -1) {
//             users[userIndex].followers = followersCount;
//           }
//         });

//         // Fetch following count
//         onValue(followingRef, (snapshot) => {
//           snapshot.forEach((item) => {
//             const userId = item.key;
//             const followingCount = Object.keys(item.val() || {}).length;
//             const userIndex = users.findIndex((u) => u.userid === userId);
//             if (userIndex !== -1) {
//               users[userIndex].following = followingCount;
//             }
//           });

//           // Update the state with final user data
//           setUserList(users);
//         });
//       });
//     });
//   }, [db, data.uid]);

//   useEffect(() => {
//     const followingRef = ref(db, `following/${data.uid}`);
//     onValue(followingRef, (snapshot) => {
//       let followingData = {};
//       snapshot.forEach((item) => {
//         followingData[item.key] = true;
//       });
//       setFollowing(followingData);
//     });
//   }, [db, data.uid]);

//   const handleFollowToggle = (followedUserId) => {
//     const currentUserId = data.uid;

//     if (following[followedUserId]) {
//       remove(ref(db, `followers/${followedUserId}/${currentUserId}`));
//       remove(ref(db, `following/${currentUserId}/${followedUserId}`));
//     } else {
//       set(ref(db, `followers/${followedUserId}/${currentUserId}`), true);
//       set(ref(db, `following/${currentUserId}/${followedUserId}`), true);
//     }
//   };

//   const filteredUsers = userList.filter(
//     (user) =>
//       !blockedByUsers[user.userid] &&
//       user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="bg-[#1B2730] h-screen font-pops">
//       <div className="flex">
//         <Sidebar />
//         <div className="w-[75%] h-screen space-y-5 py-5 px-5 overflow-y-scroll hide-scrollbar">
//           <p className="font-pops text-[20px] text-white font-bold">
//             User Lists
//           </p>
//           <div className="mt-5 relative">
//             <CiSearch
//               size={28}
//               className="text-gray-400 absolute top-[50%] left-5 translate-y-[-50%]"
//             />
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-[370px] h-[55px] bg-[#3b3b3b] rounded-full pl-[60px] text-gray-400 outline-none"
//               type="text"
//               placeholder="Search users"
//             />
//           </div>
//           <div className="flex gap-x-5 flex-wrap">
//             {filteredUsers.map((item) => (
//               <div
//                 className="w-[300px] h-[300px] border-[1px] border-gray-500 rounded-xl relative"
//                 key={item.userid}
//               >
//                 <img className="rounded-t-xl" src={cover} alt="cover" />
//                 <img
//                   className="w-[100px] rounded-full object-cover h-[100px] absolute top-[15%] left-[50%] translate-x-[-50%]"
//                   src={item.profilePicture || avatar}
//                   alt="avatar"
//                 />
//                 <Link to={`/profile/${item.userid}`}>
//                   <p className="text-[20px] text-white font-bold mt-[25%] text-center">
//                     {item.displayName}
//                   </p>
//                 </Link>
//                 <div className="flex font-bold pl-10 gap-x-3">
//                   <p className="text-gray-500 text-base">
//                     {item.followers || 0} Followers
//                   </p>
//                   <p className="text-gray-500 text-base">
//                     {item.following || 0} Following
//                   </p>
//                 </div>
//                 <div className="flex justify-center gap-x-[50px] mt-[20px]">
//                   <button className="w-[100px] bg-red-500 text-white font-bold h-[38px] rounded-full">
//                     Block
//                   </button>
//                   <button
//                     onClick={() => handleFollowToggle(item.userid)}
//                     className={`w-[100px] h-[38px] text-base font-bold rounded-full ${
//                       following[item.userid]
//                         ? "bg-red-500 text-white"
//                         : "bg-[#1DA1F2] text-white"
//                     }`}
//                   >
//                     {following[item.userid] ? "Unfollow" : "Follow"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lists;

import React, { useEffect, useState } from "react";
import cover from "../../../assets/cover.png";
import Sidebar from "../../../components/Sidebar/Sidebar";
import avatar from "../../../assets/avatar.png";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const Lists = () => {
  const data = useSelector((state) => state.userDetails.userInfo);
  const db = getDatabase();
  const [userList, setUserList] = useState([]);
  const [following, setFollowing] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [blockedUsers, setBlockedUsers] = useState({});
  const [blockedByUsers, setBlockedByUsers] = useState({});

  useEffect(() => {
    const usersRef = ref(db, "users/");
    const blockedByRef = ref(db, `blockedBy/${data.uid}`);

    // Fetch all users
    onValue(usersRef, (snapshot) => {
      let users = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          const userId = item.key;

          // Fetch followers and following count
          const followersRef = ref(db, `followers/${userId}`);
          const followingRef = ref(db, `following/${userId}`);

          let followersCount = 0;
          let followingCount = 0;

          onValue(followersRef, (followersSnapshot) => {
            followersCount = followersSnapshot.size || 0;
          });

          onValue(followingRef, (followingSnapshot) => {
            followingCount = followingSnapshot.size || 0;
          });

          users.push({
            ...item.val(),
            userid: userId,
            followers: followersCount,
            following: followingCount,
          });
        }
      });
      setUserList(users);
    });

    // Fetch users who blocked the current user
    onValue(blockedByRef, (snapshot) => {
      let blockedByData = {};
      snapshot.forEach((item) => {
        blockedByData[item.key] = true;
      });
      setBlockedByUsers(blockedByData);
    });
  }, [db, data.uid]);

  useEffect(() => {
    const blockedRef = ref(db, `blocked/${data.uid}`);
    const followingRef = ref(db, `following/${data.uid}`);

    // Fetch blocked users
    onValue(blockedRef, (snapshot) => {
      let blockedData = {};
      snapshot.forEach((item) => {
        blockedData[item.key] = true;
      });
      setBlockedUsers(blockedData);
    });

    // Fetch following data
    onValue(followingRef, (snapshot) => {
      let followingData = {};
      snapshot.forEach((item) => {
        followingData[item.key] = true;
      });
      setFollowing(followingData);
    });
  }, [db, data.uid]);

  const handleBlockToggle = (userId) => {
    const currentUserId = data.uid;

    if (blockedUsers[userId]) {
      // Unblock user
      remove(ref(db, `blocked/${currentUserId}/${userId}`));
      remove(ref(db, `blockedBy/${userId}/${currentUserId}`));
    } else {
      // Block user
      set(ref(db, `blocked/${currentUserId}/${userId}`), true);
      set(ref(db, `blockedBy/${userId}/${currentUserId}`), true);
    }
  };

  const handleFollowToggle = (followedUserId) => {
    const currentUserId = data.uid;

    if (following[followedUserId]) {
      // Unfollow user
      remove(ref(db, `followers/${followedUserId}/${currentUserId}`));
      remove(ref(db, `following/${currentUserId}/${followedUserId}`));
    } else {
      // Follow user
      set(ref(db, `followers/${followedUserId}/${currentUserId}`), true);
      set(ref(db, `following/${currentUserId}/${followedUserId}`), true);
    }
  };

  const filteredUsers = userList.filter(
    (user) =>
      !blockedByUsers[user.userid] && // User who blocked you
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
          <div className="flex gap-x-5 flex-wrap">
            {filteredUsers.map((item) => (
              <div
                className="w-[300px] h-[320px] border-[1px] border-gray-500 rounded-xl relative"
                key={item.userid}
              >
                <img className="rounded-t-xl" src={cover} alt="cover" />
                <img
                  className="w-[100px] rounded-full object-cover h-[100px] absolute top-[15%] left-[50%] translate-x-[-50%]"
                  src={item.profilePicture || avatar}
                  alt="avatar"
                />
                <Link to={`/profile/${item.userid}`}>
                  <p className="text-[20px] text-white font-bold mt-[25%] text-center">
                    {item.displayName}
                  </p>
                </Link>
                <div className="flex gap-x-5 justify-center mt-3 font-bold">
                  <p className="text-gray-500 text-base">
                    {item.followers || 0} Followers
                  </p>
                  <p className="text-gray-500 text-base">
                    {item.following || 0} Following
                  </p>
                </div>
                <div className="flex justify-center gap-x-5 mt-[20px]">
                  <button
                    onClick={() => handleBlockToggle(item.userid)}
                    className={`w-[100px] font-bold h-[38px] rounded-full ${
                      blockedUsers[item.userid]
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {blockedUsers[item.userid] ? "Unblock" : "Block"}
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

export default Lists;
