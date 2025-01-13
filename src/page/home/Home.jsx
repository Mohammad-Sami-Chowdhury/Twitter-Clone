import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import profilesm from "../../assets/profilesm.png";
import { CiImageOn, CiTimer } from "react-icons/ci";
import { MdOutlineGifBox, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaChartBar } from "react-icons/fa6";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase(); // Realtime Database instance
  const [verify, setVerify] = useState(false);
  const [postText, setPostText] = useState(""); // Text input for the post
  const [posts, setPosts] = useState([]); // Store posts data
  const [currentUser, setCurrentUser] = useState(null); // Logged-in user data
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
        setCurrentUser(user); // Set logged-in user data
        toast.success("Login Successful");
      } else {
        setVerify(false);
        navigate("/login");
        toast.error("Please Verify Your Email");
      }
    });
  }, [auth, navigate]);

  // Function to handle tweet submission
  const handleTweet = () => {
    if (postText.trim() === "") {
      toast.error("Post cannot be empty!");
      return;
    }

    const postsRef = ref(db, "posts");
    const newPostRef = push(postsRef); // Create a new unique key for the post
    set(newPostRef, {
      text: postText,
      timestamp: Date.now(),
      uid: currentUser?.uid, // Logged-in user UID
      email: currentUser?.email, // Logged-in user email
      name: currentUser?.displayName,
    })
      .then(() => {
        setPostText(""); // Clear the input field after posting
        toast.success("Post added successfully!");
      })
      .catch((error) => {
        toast.error("Failed to add post!");
        console.error("Error adding post: ", error);
      });
  };

  // Fetch posts of followed users
  useEffect(() => {
    const postsRef = ref(db, "posts/");
    const followingRef = ref(db, `following/${currentUser?.uid}`);

    onValue(followingRef, (snapshot) => {
      const followingUsers = [];
      snapshot.forEach((childSnapshot) => {
        followingUsers.push(childSnapshot.key); // Get the followed users
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

  return (
    <section className="bg-[#1B2730] h-screen font-pops">
      <ToastContainer />
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
                <img src={profilesm} alt="profilesm" />
                <input
                  placeholder="What’s happening"
                  className="outline-none w-full bg-transparent placeholder:font-bold text-white text-[22px]"
                  type="text"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="text-2xl flex text-[#1D9BF0] gap-x-5">
                  <CiImageOn />
                  <MdOutlineGifBox />
                  <MdOutlineEmojiEmotions />
                  <FaChartBar />
                  <CiTimer />
                </div>
                <button
                  onClick={handleTweet}
                  className="w-[110px] h-[50px] rounded-full bg-[#1D9BF0] text-white font-bold text-base"
                >
                  Tweet
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
