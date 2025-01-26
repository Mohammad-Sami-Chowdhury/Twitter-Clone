import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Sidebar from "../../components/Sidebar/Sidebar";
import avatar from "../../assets/avatar.png";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { TiAttachment } from "react-icons/ti";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import moment from "moment";

const Chat = () => {
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]); // Selected users for group
  const [groups, setGroups] = useState([]); // State for groups
  const [selectedEntity, setSelectedEntity] = useState(null); // User or group
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  // Fetch the current logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    }
  }, [auth]);

  useEffect(() => {
    if (selectedEntity && currentUser) {
      const messagesRef = selectedEntity.members
        ? ref(db, `groupMessages/${selectedEntity.id}`)
        : ref(db, `messages/${getChatId(selectedEntity.uid)}`);
      onValue(messagesRef, (snapshot) => {
        const messageList = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          messageList.push(message);
        });
        setMessages(messageList);
      });
    }
  }, [db, selectedEntity, currentUser]);

  const getChatId = (uid) => {
    return currentUser.uid > uid
      ? `${currentUser.uid}_${uid}`
      : `${uid}_${currentUser.uid}`;
  };

  const handleGroupClick = (group) => {
    setSelectedEntity(group);
  };

  const handleUserClick = (user) => {
    setSelectedEntity(user);
    setSelectedUser(user);
  };

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

  useEffect(() => {
    if (currentUser) {
      const groupsRef = ref(db, "groups");
      onValue(groupsRef, (snapshot) => {
        const groupList = [];
        snapshot.forEach((child) => {
          const group = { id: child.key, ...child.val() };
          if (group.members.includes(currentUser.uid)) {
            groupList.push(group);
          }
        });
        setGroups(groupList);
      });
    }
  }, [db, currentUser]);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleSelectUser = (user) => {
    if (selectedGroupUsers.includes(user)) {
      setSelectedGroupUsers(
        selectedGroupUsers.filter((u) => u.uid !== user.uid)
      );
    } else {
      setSelectedGroupUsers([...selectedGroupUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    if (selectedGroupUsers.length < 2 || !groupName) {
      alert("Enter a group name and select at least two users.");
      return;
    }

    const groupRef = ref(db, "groups");
    const groupData = {
      groupName,
      members: [currentUser.uid, ...selectedGroupUsers.map((user) => user.uid)],
      createdBy: currentUser.uid,
      createdAt: Date.now(),
      groupImage: groupImage, // Include the group image URL
    };

    push(groupRef, groupData)
      .then(() => {
        setShowPopup(false);
        setSelectedGroupUsers([]);
        setGroupName("");
        setGroupImage(null); // Reset the group image state
        alert("Group created successfully!");
      })
      .catch((error) => console.error("Error creating group:", error));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messagesRef = selectedEntity.members
      ? ref(db, `groupMessages/${selectedEntity.id}`)
      : ref(db, `messages/${getChatId(selectedEntity.uid)}`);

    // Push the new message to Firebase
    push(messagesRef, {
      sender: currentUser.uid,
      text: newMessage,
      timestamp: Date.now(),
    });

    setNewMessage("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const messagesRef = selectedEntity.members
      ? ref(db, `groupMessages/${selectedEntity.id}`)
      : ref(db, `messages/${getChatId(selectedEntity.uid)}`);

    const imageRef = storageRef(
      storage,
      `chatImages/${selectedEntity.id || getChatId(selectedEntity.uid)}/${
        file.name
      }`
    );

    // Upload the image to Firebase Storage
    uploadBytes(imageRef, file).then(() => {
      // Get the download URL
      getDownloadURL(imageRef).then((url) => {
        // Send the image URL as a message
        push(messagesRef, {
          sender: currentUser.uid,
          imageUrl: url,
          timestamp: Date.now(),
        });
      });
    });
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleGroupImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = storageRef(storage, `groupImages/${file.name}`);

    // Upload image to Firebase Storage
    uploadBytes(storageRef, file).then(() => {
      // Get the download URL
      getDownloadURL(storageRef).then((url) => {
        // Set the image URL for display and save it in state
        setGroupImage(url);
      });
    });
  };

  return (
    <div className="bg-[#1B2730] h-screen font-pops">
      <div className="flex">
        <Sidebar />
        <div className="px-5 w-[25%] border-r-[1px] border-gray-500">
          <div className="border-b-[1px] border-b-gray-500">
            <p className="text-white text-xl font-bold mt-5 mb-5">Messages</p>
            <input
              className="w-[300px] mb-5 h-[55px] bg-[#3b3b3b] rounded-full pl-[30px] text-gray-400 outline-none"
              type="text"
              placeholder="Search users"
            />
          </div>

          <div className="flex py-4 justify-between items-center">
            <p className="text-white font-bold text-xl">Create groups</p>
            <button
              className="bg-[#1D9BF0] text-white font-bold text-xl w-[120px] rounded-full h-[40px]"
              onClick={togglePopup}
            >
              Create
            </button>
          </div>

          <div className="my-5">
            <p className="text-white font-bold">Groups</p>
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex gap-x-4 items-center cursor-pointer mb-4"
                onClick={() => handleGroupClick(group)}
              >
                <div className="w-[50px] h-[50px] bg-gray-500 rounded-full flex justify-center items-center">
                  <p className="text-white font-bold">
                    {group.groupName
                      ? group.groupName.charAt(0).toUpperCase()
                      : "G"}
                  </p>
                </div>
                <div>
                  <p className="text-base text-white font-bold">
                    {group.groupName}
                  </p>
                  <p className="text-sm text-gray-500">Group chat</p>
                </div>
              </div>
            ))}
            <p className="text-white font-bold mt-5">Users</p>
            {users.map((user) => (
              <div
                key={user.uid}
                className="flex gap-x-4 items-center cursor-pointer mb-4"
                onClick={() => handleUserClick(user)}
              >
                <img
                  className="w-[50px] h-[50px] object-cover rounded-full"
                  src={user.profilePicture || avatar}
                  alt="profile"
                />
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

        {/* Popup for group creation */}
        {showPopup && (
          <div className="fixed inset-0 text-white bg-black bg-opacity-50 flex justify-center items-center z-[99999]">
            <div className="bg-[#1B2730] w-[400px] rounded-lg p-5">
              <h2 className="text-xl font-bold mb-4">Create Group</h2>

              {/* Group Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-500 text-gray-500 rounded outline-none bg-transparent"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)} // Update the group name state
                />
              </div>

              {/* Group Image Upload */}
              <div className="mb-4">
                <label
                  htmlFor="groupImage"
                  className="cursor-pointer text-blue-500"
                >
                  Upload Group Image
                </label>
                <input
                  type="file"
                  id="groupImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleGroupImageUpload}
                />
                {groupImage && (
                  <div className="mt-2">
                    <img
                      src={groupImage}
                      alt="Group"
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.uid}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupUsers.includes(user)}
                      readOnly
                    />
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={user.profilePicture || avatar}
                      alt="profile"
                    />
                    <p>{user.displayName || "Anonymous"}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={togglePopup}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleCreateGroup}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Section */}
        <div className="w-[50%]">
          {selectedEntity ? (
            <>
              <div className="mx-5 mt-5 flex gap-x-5 items-center border-b-[1px] border-gray-500 pb-5 ">
                <img
                  className="w-[50px] h-[50px] object-cover rounded-full"
                  src={
                    selectedEntity.groupImage ||
                    avatar
                  }
                  alt="profile"
                />
                <div>
                  <p className="text-2xl text-white font-bold">
                    {selectedEntity.groupName ||
                      selectedEntity.displayName ||
                      "Anonymous"}
                  </p>
                  <p className="text-gray-500 text-base">Last Seen</p>
                </div>
              </div>
              <div className="space-y-5 h-[700px] overflow-y-scroll overflow-x-hidden hide-scrollbar px-5">
                {messages.map((message, index) => {
                  const timeAgo = moment(message.timestamp).fromNow();
                  const isMoreThan5Minutes =
                    moment().diff(moment(message.timestamp), "minutes") > 5;

                  return (
                    <div key={index}>
                      {message.imageUrl ? (
                        <div
                          className={`${
                            message.sender === currentUser.uid
                              ? "ml-auto"
                              : "mr-auto"
                          } max-w-[500px]`}
                        >
                          <img
                            src={message.imageUrl}
                            alt="Sent"
                            className="rounded-lg max-w-full"
                          />
                          <p className="text-gray-400 text-xs text-right">
                            {isMoreThan5Minutes
                              ? moment(message.timestamp).format(
                                  "MMM Do YYYY, h:mm a"
                                )
                              : timeAgo}
                          </p>
                        </div>
                      ) : (
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
                          <p className="text-justify text-base">
                            {message.text}
                          </p>
                          <p className="text-white text-xs text-right">
                            {isMoreThan5Minutes
                              ? moment(message.timestamp).format(
                                  "MMM Do YYYY, h:mm a"
                                )
                              : timeAgo}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-white cursor-pointer"
                      size={24}
                    />
                    {showEmojiPicker && (
                      <div className="absolute bottom-[70px] right-0">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                    <label>
                      <GrGallery
                        className="text-white cursor-pointer"
                        size={24}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e)}
                      />
                    </label>
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
            <div className="text-center text-white mt-10 text-3xl font-bold">
              <p>Select a user or group to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
