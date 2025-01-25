import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import Sidebar from "../Sidebar/Sidebar";
import Rightbar from "../rightbar/Rightbar";
import cover from "../../assets/cover.png";
import avatar from "../../assets/avatar.png"

const UserProfile = () => {
  const { userid } = useParams(); // Get the userid from the route
  const [userData, setUserData] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  const db = getDatabase();

  useEffect(() => {
    // Fetch user profile data
    const userRef = ref(db, `users/${userid}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    });

    // Fetch posts by the user
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const posts = [];
      snapshot.forEach((postItem) => {
        if (postItem.val().uid === userid) {
          // Filter posts by the user’s uid
          posts.push({
            id: postItem.key,
            ...postItem.val(),
          });
        }
      });
      posts.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp
      setUserPosts(posts);
    });
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());       
      }
    });

    // Fetch followers count
    const followersRef = ref(db, `followers/${userid}`);
    onValue(followersRef, (snapshot) => {
      setUserData((prevData) => ({
        ...prevData,
        followers: snapshot.size || 0, // snapshot.size gives the count
      }));
    });

    // Fetch following count
    const followingRef = ref(db, `following/${userid}`);
    onValue(followingRef, (snapshot) => {
      setUserData((prevData) => ({
        ...prevData,
        following: snapshot.size || 0,
      }));
    });
  }, [db, userid]);

  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="w-[50%] h-screen relative space-y-5 overflow-y-scroll hide-scrollbar">
          <div className="flex items-center gap-x-[30px] pl-[30px] py-5">
            <p className="font-pops text-[20px] text-white font-bold">
              {userData?.displayName || "Name"}
            </p>
          </div>

          <div>
            <img className="w-full" src={cover} alt="cover" />
          </div>
          <div>
            <img
              className="absolute top-[35%] left-5 rounded-full border-4 border-[#1B2730] h-[150px] w-[150px] object-cover"
              src={userData.profilePicture || avatar}
              alt="profile"
            />
          </div>
          <div className="flex gap-x-4 items-center pt-[100px]">
            <p className="text-2xl text-white font-bold pl-10">
              {userData?.displayName || "Name"}
            </p>
          </div>
          <div className="flex font-bold pl-10 gap-x-3">
            <p className="text-gray-500 text-base">
              {userData.followers || 0} Followers
            </p>
            <p className="text-gray-500 text-base">
              {userData.following || 0} Following
            </p>
          </div>
          <p className="text-gray-500 text-base px-10">
            @{userData?.username || "name"}
          </p>
          <p className="text-gray-500 text-[18px] px-10">
            {userData?.bio || "Write your bio"}
          </p>

          {/* Display user posts */}
          <div className="px-10 mt-[50px]">
            <p className="text-white text-2xl font-bold mb-4">
              Posts by {userData?.displayName}
            </p>
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 text-white rounded-lg p-4 mb-4 space-y-2"
              >
                <div className="flex gap-2 items-center">
                  <img
                    className="w-[40px]"
                    src={avatar}
                    alt="profile-user"
                  />
                  <p className="font-bold text-2xl">{post.name}</p>
                </div>
                <p className="text-[20px]">{post.text}</p>
                <small className="text-gray-400">
                  {new Date(post.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        </div>
        <Rightbar />
      </div>
    </div>
  );
};

export default UserProfile;
