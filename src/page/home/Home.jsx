import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import avatar from "../../assets/avatar.png";
import { CiImageOn, CiTimer } from "react-icons/ci";
import { MdOutlineGifBox, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaChartBar } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
  const [verify, setVerify] = useState(false);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [usersProfilePictures, setUsersProfilePictures] = useState({});
  const [imageFile, setImageFile] = useState(null); // State to handle image file
  const [imagePreview, setImagePreview] = useState(null); // State to show image preview
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  const data = useSelector((state) => state.userDetails.userInfo);

  // Check for logged-in user and authentication status
  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setVerify(true);
        setCurrentUser(user);
        toast.success("Login Successful");
      } else {
        setVerify(false);
        navigate("/login");
        toast.error("Please Verify Your Email");
      }
    });
  }, [auth, navigate]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Function to handle tweet submission
  const handleTweet = () => {
    if (postText.trim() === "" && !imageFile) {
      toast.error("Post cannot be empty!");
      return;
    }

    const postsRef = ref(db, "posts");
    const newPostRef = push(postsRef);

    // If there's an image, upload it to Firebase Storage
    if (imageFile) {
      const storage = getStorage();
      const imageRef = storageRef(
        storage,
        `postImages/${Date.now()}_${imageFile.name}`
      );
      const uploadTask = uploadBytesResumable(imageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress (optional)
        },
        (error) => {
          toast.error("Error uploading image");
          console.error(error);
        },
        () => {
          // Once the upload is complete, get the image URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Save the post along with the image URL
            set(newPostRef, {
              text: postText,
              imageUrl: downloadURL, // Store the image URL
              timestamp: Date.now(),
              uid: currentUser?.uid,
              email: currentUser?.email,
              name: currentUser?.displayName,
            }).then(() => {
              setPostText("");
              setImageFile(null); // Clear the image state after posting
              setImagePreview(null); // Clear image preview after posting
            });
          });
        }
      );
    } else {
      // If no image, just save the text post
      set(newPostRef, {
        text: postText,
        timestamp: Date.now(),
        uid: currentUser?.uid,
        email: currentUser?.email,
        name: currentUser?.displayName,
      }).then(() => {
        setPostText("");
      });
    }
  };

  // Fetch posts of followed users
  useEffect(() => {
    const postsRef = ref(db, "posts/");
    const followingRef = ref(db, `following/${currentUser?.uid}`);

    onValue(followingRef, (snapshot) => {
      const followingUsers = [];
      snapshot.forEach((childSnapshot) => {
        followingUsers.push(childSnapshot.key);
      });

      // Fetch posts from followed users
      onValue(postsRef, (postSnapshot) => {
        const fetchedPosts = [];
        postSnapshot.forEach((postItem) => {
          if (followingUsers.includes(postItem.val().uid)) {
            fetchedPosts.push({
              id: postItem.key,
              ...postItem.val(),
            });
          }
        });
        fetchedPosts.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp
        setPosts(fetchedPosts);
      });
    });
  }, [db, currentUser?.uid]);

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const usersPictures = {};
      snapshot.forEach((userSnapshot) => {
        usersPictures[userSnapshot.key] = userSnapshot.val().profilePicture;
      });
      setUsersProfilePictures(usersPictures);
    });
  }, [db]);

  return (
    <section className="bg-[#1B2730] h-screen font-pops">
      {verify ? (
        <div className="flex">
          <Sidebar />
          <div className="w-[50%] overflow-y-scroll h-screen hide-scrollbar">
            <div>
              <p className="text-2xl text-white font-bold py-5 px-[25px] border-b-[1px] border-gray-500">
                Home
              </p>
            </div>
            <div className="mt-5 px-[25px] border-b-[1px] border-gray-500 pb-7">
              <div className="flex gap-x-5">
                <img
                  className="w-[100px] h-[90px] rounded-full object-cover"
                  src={data.photoURL || avatar}
                  alt="profilesm"
                />
                <input
                  placeholder="What’s happening"
                  className="outline-none w-full bg-transparent placeholder:font-bold text-white text-[22px]"
                  type="text"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </div>
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-[300px] object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex justify-between items-center mt-6">
                <div className="text-2xl flex text-[#1D9BF0] gap-x-5">
                  <div className="relative">
                    <CiImageOn className="cursor-pointer" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute top-[4px] left-[4px] w-4 h-4 opacity-0 cursor-pointer"
                      id="image-upload"
                    />
                  </div>
                  <MdOutlineGifBox />
                  <MdOutlineEmojiEmotions />
                  <FaChartBar />
                  <CiTimer />
                </div>
                <button
                  onClick={handleTweet}
                  className="w-[110px] h-[50px] rounded-full bg-[#1D9BF0] text-white font-bold text-base"
                >
                  Post
                </button>
              </div>
            </div>
            <div className="mt-5 px-[25px]">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 text-white rounded-lg p-4 mb-4 space-y-2"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-[40px] h-[40px] rounded-full object-cover"
                      src={usersProfilePictures[post.uid] || avatar}
                      alt="profile-user"
                    />
                    <p className="font-bold text-2xl">{post.name}</p>
                  </div>
                  <p className="text-[20px]">{post.text}</p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post Image"
                      className="w-[300px] object-cover rounded-lg mt-4"
                    />
                  )}
                  <small className="text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
          <Rightbar />
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default Home;
