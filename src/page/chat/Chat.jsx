import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, push } from "firebase/database";
import Sidebar from "../../components/Sidebar/Sidebar";
import profilesm from "../../assets/profilesm.png";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { TiAttachment } from "react-icons/ti";
import { MdEmojiEmotions } from "react-icons/md";

const Chat = () => {
  const auth = getAuth();
  const db = getDatabase();

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch the current logged-in user from localStorage or Firebase
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    }
  }, [auth]);

  // Fetch all users except the current user
  useEffect(() => {
    if (currentUser) {
      const usersRef = ref(db, "users");
      onValue(usersRef, (snapshot) => {
        const userList = [];
        snapshot.forEach((child) => {
          const user = { uid: child.key, ...child.val() };
          if (user.uid !== currentUser.uid) {
            userList.push(user);
          }
        });
        setUsers(userList);
      });
    }
  }, [db, currentUser]);

  // Fetch messages between the current user and the selected user
  useEffect(() => {
    if (selectedUser && currentUser) {
      const chatId =
        currentUser.uid > selectedUser.uid
          ? `${currentUser.uid}_${selectedUser.uid}`
          : `${selectedUser.uid}_${currentUser.uid}`;

      const messagesRef = ref(db, `messages/${chatId}`);
      onValue(messagesRef, (snapshot) => {
        const messageList = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          messageList.push(message);
        });
        setMessages(messageList); // Update the messages state
      });
    }
  }, [db, selectedUser, currentUser]);

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const chatId =
      currentUser.uid > selectedUser.uid
        ? `${currentUser.uid}_${selectedUser.uid}`
        : `${selectedUser.uid}_${currentUser.uid}`;
    const messagesRef = ref(db, `messages/${chatId}`);

    // Push the new message to Firebase
    push(messagesRef, {
      sender: currentUser.uid,
      text: newMessage,
      timestamp: Date.now(),
    });

    setNewMessage(""); // Clear the input field
  };

  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        {/* User List */}
        <div className="px-5 w-[25%] border-r-[1px] border-gray-500">
          <div className="border-b-[1px] border-b-gray-500">
            <p className="text-white text-xl font-bold mt-5 mb-5">Messages</p>
            <input
              className="w-[300px] mb-5 h-[55px] bg-[#3b3b3b] rounded-full pl-[30px] text-gray-400 outline-none"
              type="text"
              placeholder="Search users"
            />
          </div>
          <div className="my-5">
            {users.map((user) => (
              <div
                key={user.uid}
                className="flex gap-x-4 items-center cursor-pointer mb-4"
                onClick={() => setSelectedUser(user)}
              >
                <img src={profilesm} alt="profile" />
                <div>
                  <p className="text-base text-white font-bold">
                    {user.displayName || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">Click to chat</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Section */}
        <div className="w-[50%]">
          {selectedUser ? (
            <>
              <div className="mx-5 mt-5 flex gap-x-5 items-center border-b-[1px] border-gray-500 pb-5 ">
                <img src={profilesm} alt="profile" />
                <div>
                  <p className="text-2xl text-white font-bold">
                    {selectedUser.displayName || "Anonymous"}
                  </p>
                  <p className="text-gray-500 text-base">Last Seen</p>
                </div>
              </div>
              <div className="space-y-5 h-[700px] overflow-y-scroll overflow-x-hidden hide-scrollbar px-5">
                {messages.map((message, index) => (
                  <div key={index}>
                    <div
                      className={`${
                        message.sender === currentUser.uid
                          ? "bg-[#1D9BF0] ml-auto"
                          : "bg-[#3b3b3b] mr-auto"
                      } max-w-[500px] text-white font-medium p-[10px] rounded-lg relative`}
                    >
                      <TbTriangleInvertedFilled
                        size={24}
                        className={`absolute top-[-3px] ${
                          message.sender === currentUser.uid
                            ? "right-[-10px] text-[#1D9BF0]"
                            : "left-[-10px] text-[#3b3b3b]"
                        }`}
                      />
                      <p className="text-justify text-base">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-10 border-t-[1px] border-gray-500 pt-5 relative">
                <input
                  className="w-full mb-5 h-[55px] bg-[#3b3b3b] rounded-lg pl-[30px] pr-[200px] text-gray-400 outline-none"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="absolute top-8 right-[50px]">
                  <div className="flex gap-x-5 items-center">
                    <MdEmojiEmotions
                      className="text-white cursor-pointer"
                      size={24}
                    />
                    <GrGallery
                      className="text-white cursor-pointer"
                      size={24}
                    />
                    <TiAttachment
                      className="text-white cursor-pointer"
                      size={24}
                    />
                    <IoMdSend
                      className="text-white cursor-pointer"
                      size={30}
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-white mt-10">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
