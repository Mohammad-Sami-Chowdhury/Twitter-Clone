import React, { useEffect, useState } from "react";
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
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";
import profilesm from "../../assets/profilesm.png";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]); // State to store the user's posts
  const data = useSelector((state) => state.userDetails.userInfo); // Logged-in user info
  const db = getDatabase();

  // Fetch user's posts from Firebase
  useEffect(() => {
    const postsRef = ref(db, "posts/");
    onValue(postsRef, (snapshot) => {
      const posts = [];
      snapshot.forEach((post) => {
        if (post.val().uid === data.uid) {
          // Filter posts by logged-in user's UID
          posts.push({ id: post.key, ...post.val() });
        }
      });
      posts.sort((a, b) => b.timestamp - a.timestamp); // Sort posts by timestamp (newest first)
      setUserPosts(posts);
    });
  }, [db, data.uid]);

  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="w-[50%] h-screen relative space-y-5 overflow-y-scroll hide-scrollbar">
          {/* Header */}
          <div className="flex items-center gap-x-[30px] pl-[30px] py-5">
            <Link to="/home">
              <FaArrowLeftLong
                size={20}
                className="text-white cursor-pointer"
              />
            </Link>
            <p className="font-pops text-[20px] text-white font-bold ">
              {data.username || "Name"}
            </p>
          </div>

          {/* Cover and Profile Image */}
          <div>
            <img className="w-full" src={cover} alt="cover" />
          </div>
          <div>
            <img
              className="absolute top-[35%] left-5 rounded-full border-4 border-[#1B2730]"
              src={profile}
              alt="profile"
            />
          </div>

          {/* User Info */}
          <p className="text-2xl text-white font-bold px-10 pt-[100px]">
            {data.displayName || "Name"}
          </p>
          <p className="text-gray-500 text-base px-10">
            @{data.username || "name"}
          </p>
          <p className="text-white text-[18px] px-10">Write your bio.</p>

          {/* User Details */}
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

          {/* User's Posts */}
          <div className="px-10 mt-[50px]">
            <p className="text-white text-2xl font-bold mb-4">Your Posts</p>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 text-white rounded-lg p-4 mb-4 space-y-2"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-[40px]"
                      src={profilesm}
                      alt="profile-user"
                    />
                    <p className="font-bold text-2xl">{post.name}</p>
                  </div>
                  <p className="text-[20px]">{post.text}</p>
                  <small className="text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p className="text-gray-400">You have not posted anything yet.</p>
            )}
          </div>
        </div>
        <Rightbar />
      </div>
    </div>
  );
};

export default Profile;
