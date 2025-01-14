import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { FaLink } from "react-icons/fa";
import { PiBalloon } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "../Sidebar/Sidebar";
import Rightbar from "../rightbar/Rightbar";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  push,
  update,
} from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import { updateDisplayName } from "../../slices/userSlice";
import cover from "../../assets/cover.png";
import profile from "../../assets/profile.png";
import profilesm from "../../assets/profilesm.png";

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState({});
  console.log(userData);

  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    link: "",
    birthday: "",
  });

  const data = useSelector((state) => state.userDetails.userInfo);
  const dispatch = useDispatch();
  const db = getDatabase();
  const [menuTimestamp, setMenuTimestamp] = useState(null);

  useEffect(() => {
    const postsRef = ref(db, "posts/");
    onValue(postsRef, (snapshot) => {
      const posts = [];
      snapshot.forEach((post) => {
        if (post.val().uid === data.uid) {
          posts.push({ id: post.key, ...post.val() });
        }
      });
      posts.sort((a, b) => b.timestamp - a.timestamp);
      setUserPosts(posts);
    });
  }, [db, data.uid]);

  const handleMenu = (timestamp) => {
    setMenuTimestamp(menuTimestamp === timestamp ? null : timestamp);
  };

  const handleDeletePost = (postId) => {
    const postRef = ref(db, "posts/" + postId);
    remove(postRef).then(() => {
      setUserPosts(userPosts.filter((post) => post.id !== postId));
    });
  };

  const handleEditProfile = () => {
    setEditDetails({
      displayName: data.displayName || "",
      username: data.username || "",
      bio: data.bio || "Write your bio",
      location: data.location || "Dhaka, Bangladesh",
      link: data.link || "facebook.com",
      birthday: data.birthday || "5 January 2005",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    const userRef = ref(db, "users/" + data.uid);
    update(userRef, editDetails).then(() => {
      // Update Redux state
      dispatch(updateDisplayName(editDetails.displayName));

      // Update localStorage
      const updatedUserInfo = { ...data, ...editDetails };
      localStorage.setItem("userLoginInfo", JSON.stringify(updatedUserInfo));

      // Now update the user's posts with the new name
      const postsRef = ref(db, "posts/");
      onValue(postsRef, (snapshot) => {
        snapshot.forEach((post) => {
          if (post.val().uid === data.uid) {
            const postRef = ref(db, "posts/" + post.key);
            update(postRef, { name: editDetails.displayName });
          }
        });
      });

      setIsEditing(false);
    });
  };
  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="w-[50%] h-screen relative space-y-5 overflow-y-scroll hide-scrollbar">
          <div className="flex items-center gap-x-[30px] pl-[30px] py-5">
            <Link to="/home">
              <FaArrowLeftLong
                size={20}
                className="text-white cursor-pointer"
              />
            </Link>
            <p className="font-pops text-[20px] text-white font-bold">
              {data?.displayName || "Name"}
            </p>
          </div>

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

          <div className="flex gap-x-1 items-center pt-[100px]">
            <p className="text-2xl text-white font-bold px-10">
              {data?.displayName || "Name"}
            </p>
            <FaPencilAlt
              className="text-white cursor-pointer"
              size={16}
              onClick={handleEditProfile}
            />
          </div>
          <p className="text-gray-500 text-base px-10">
            @{data?.username || "name"}
          </p>
          <p className="text-white text-[18px] px-10">
            {data?.bio || "Write your bio"}
          </p>
          <div className="flex text-gray-500 text-[18px] justify-between items-center px-10">
            <div className="flex gap-x-2 items-center">
              <CiLocationOn size={24} />
              <p>{data?.location || "Dhaka, Bangladesh"}</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <FaLink size={24} />
              <p className="text-[#1D9BF0]">{data?.link || "facebook.com"}</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <PiBalloon size={24} />
              <p>{data?.birthday || "5 January 2005"}</p>
            </div>
            <div className="flex gap-x-2 items-center">
              <SlCalender size={24} />
              <p>Joined 1 January 2025</p>
            </div>
          </div>

          <div className="px-10 mt-[50px]">
            <p className="text-white text-2xl font-bold mb-4">Your Posts</p>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 text-white rounded-lg p-4 mb-4 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-[40px]"
                        src={profilesm}
                        alt="profile-user"
                      />
                      <p className="font-bold text-2xl">{data.displayName}</p>
                    </div>
                    <BsThreeDotsVertical
                      onClick={() => handleMenu(post.timestamp)}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-[20px]">{post.text}</p>
                  <small className="text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </small>
                  {menuTimestamp === post.timestamp && (
                    <div className="bg-[#3b3b3b] absolute top-0 right-[50px] px-5 py-3 rounded-lg">
                      <div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-base p-2 text-white bg-red-500 rounded-lg font-semibold"
                        >
                          Delete Post
                        </button>
                      </div>
                      <div>
                        <button className="text-base p-2 text-white bg-blue-500 rounded-lg mt-2 font-semibold">
                          Edit post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">You have not posted anything yet.</p>
            )}
          </div>
        </div>
        <Rightbar />
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[500px] space-y-4">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <input
              className="w-full p-2 border rounded"
              placeholder="Display Name"
              value={editDetails.displayName}
              onChange={(e) =>
                setEditDetails({ ...editDetails, displayName: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Username"
              value={editDetails.username}
              onChange={(e) =>
                setEditDetails({ ...editDetails, username: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Bio"
              value={editDetails.bio}
              onChange={(e) =>
                setEditDetails({ ...editDetails, bio: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Location"
              value={editDetails.location}
              onChange={(e) =>
                setEditDetails({ ...editDetails, location: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Birthday"
              value={editDetails.birthday}
              onChange={(e) =>
                setEditDetails({ ...editDetails, birthday: e.target.value })
              }
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Link"
              value={editDetails.link}
              onChange={(e) =>
                setEditDetails({ ...editDetails, link: e.target.value })
              }
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSaveProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
