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
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { updateDisplayName } from "../../slices/userSlice";
import cover from "../../assets/cover.png";
import avatar from "../../assets/avatar.png";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const Profile = () => {
  const auth = getAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    link: "",
    birthday: "",
    profilePicture: "",
  });
  const [uploading, setUploading] = useState(false);

  const data = useSelector((state) => state.userDetails.userInfo);
  const dispatch = useDispatch();
  const db = getDatabase();
  const storage = getStorage();
  const [menuTimestamp, setMenuTimestamp] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [following, setFollowing] = useState({});

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

  useEffect(() => {
    const followingRef = ref(db, `following/${data.uid}`);
    onValue(followingRef, (snapshot) => {
      let followingData = {};
      snapshot.forEach((item) => {
        followingData[item.key] = true;
      });
      setFollowing(followingData);
      setFollowingCount(snapshot.size); // Set following count
    });

    const followersRef = ref(db, `followers/${data.uid}`);
    onValue(followersRef, (snapshot) => {
      setFollowersCount(snapshot.size); // Set followers count
    });
  }, [db, data.uid]);

  useEffect(() => {
    const userRef = ref(db, "users/" + data.uid);

    // Fetch data from Realtime Database
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Sync with Firebase Authentication
        updateProfile(auth.currentUser, {
          displayName: userData.displayName,
        }).then(() => {
          dispatch({
            type: "user/updateUserInfo",
            payload: userData,
          });
          setUserData(userData);
          setEditDetails({
            displayName: userData.displayName || "",
            username: userData.username || "",
            bio: userData.bio || "Write your bio",
            location: userData.location || "Add Location",
            link: userData.link || "Add Link",
            birthday: userData.birthday || "Add Birthday",
            profilePicture: userData.profilePicture || avatar,
          });
        });
      }
    });
  }, [db, data.uid, dispatch]);

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
    setIsEditing(true);
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileRef = storageRef(storage, `profilePictures/${data.uid}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    const userRef = ref(db, "users/" + data.uid);
    update(userRef, { profilePicture: fileURL })
      .then(() => {
        const updatedUserInfo = { ...data, profilePicture: fileURL };
        updateProfile(auth.currentUser, {
          photoURL: fileURL,
        }).then(() => {
          dispatch({ type: "user/updateUserInfo", payload: updatedUserInfo });
          localStorage.setItem(
            "userLoginInfo",
            JSON.stringify(updatedUserInfo)
          );
          setEditDetails({ ...editDetails, profilePicture: fileURL });
          setUploading(false);
        });
      })
      .catch((error) => {
        console.error("Error updating profile picture:", error);
        setUploading(false);
      });
  };

  const handleSaveProfile = () => {
    const userRef = ref(db, "users/" + data.uid);

    // Update data in Firebase Realtime Database
    update(userRef, editDetails).then(() => {
      // Update Firebase Authentication profile
      updateProfile(auth.currentUser, {
        displayName: editDetails.displayName,
      }).then(() => {
        // Update Redux state and local storage
        const updatedUserInfo = { ...data, ...editDetails };
        dispatch({
          type: "user/updateUserInfo",
          payload: updatedUserInfo,
        });
        setUserData(updatedUserInfo);
        localStorage.setItem("userLoginInfo", JSON.stringify(updatedUserInfo));

        // Ensure the changes are visible in posts
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
              {editDetails?.displayName || "Name"}
            </p>
          </div>

          <div>
            <img className="w-full" src={cover} alt="cover" />
          </div>
          <div>
            <img
              className="absolute top-[35%] h-[150px] object-cover w-[150px] bg-[#1B2730] left-5 rounded-full border-4 border-[#1B2730]"
              src={data?.photoURL || avatar}
              alt="profile"
            />
          </div>

          <div className="flex gap-x-4 items-center pt-[100px]">
            <p className="text-2xl text-white font-bold pl-10">
              {editDetails?.displayName || "Add Name"}
            </p>
            <FaPencilAlt
              className="text-white cursor-pointer"
              size={16}
              onClick={handleEditProfile}
            />
          </div>
          <div className="flex font-bold pl-10 gap-x-3">
            <p className="text-gray-500 text-base">
              {followersCount} Followers
            </p>
            <p className="text-gray-500 text-base">
              {followingCount} Following
            </p>
          </div>
          <p
            onClick={handleEditProfile}
            className="text-gray-500 text-base px-10"
          >
            @{editDetails?.username || "Add username"}
          </p>
          <p
            onClick={handleEditProfile}
            className="text-gray-500 text-[18px] px-10"
          >
            {editDetails?.bio || "Add bio"}
          </p>
          <div className="flex text-gray-500 text-[18px] justify-between items-center px-10">
            <div className="flex gap-x-2 items-center">
              <CiLocationOn size={24} />
              <p onClick={handleEditProfile}>
                {editDetails?.location || "Add Location"}
              </p>
            </div>
            <div className="flex gap-x-2 items-center">
              <FaLink size={24} />
              <a
                onClick={handleEditProfile}
                className="text-[#1D9BF0]"
                href={editDetails?.link || "#"}
              >
                {editDetails?.link || "facebook.com"}
              </a>
            </div>
            <div className="flex gap-x-2 items-center">
              <PiBalloon size={24} />
              <p onClick={handleEditProfile}>
                {editDetails?.birthday || "Add Birthday"}
              </p>
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
                        className="w-[40px] h-[40px] rounded-full object-cover"
                        src={data?.photoURL || avatar}
                        alt="profile-user"
                      />
                      <p className="font-bold text-2xl">
                        {editDetails.displayName}
                      </p>
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
            <div className="flex items-center gap-4">
              <img
                src={editDetails.profilePicture || avatar}
                alt="profile"
                className="w-[80px] h-[80px] rounded-full"
              />
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                {uploading ? "Uploading..." : "Change Picture"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
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
            <div className="flex gap-x-4">
              <button
                onClick={handleSaveProfile}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
