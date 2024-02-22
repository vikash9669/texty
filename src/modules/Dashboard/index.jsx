import React, { useState, useEffect, useRef } from "react";
import Avatar from "../../assets/man.png";
import axios from "axios";
import { io } from "socket.io-client";
import Send from "../../assets/paper.png";
import addFile from "../../assets/add-button.png";
import { useNavigate } from "react-router-dom";


const DashBoard = (apiurl) => {
  const navigate = useNavigate();
  const messageRef = useRef();

  // loged in user
  const [User, setUser] = useState(
    JSON.parse(localStorage.getItem("user.detail"))
    );

  // selected User to chat
  const [isUserSelected, setIsUserSelected] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState({});

  const [Messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [soketFile, setSoketFile] = useState(null);
  // soket
  const [socket, setSocket] = useState(null);

  console.log(conversations,"conversations",users,"users")
  //socketio useEffect
  useEffect(() => {
    console.log(io("http://localhost:8080"), "socket is runnnig");
    setSocket(io("http://localhost:8080"));
  },[]);
  
  const userId = User.id;
  useEffect(() => {
    socket?.emit("addUser", userId);
    console.log(userId, "UserId line 51");

    socket?.on("getUsers", (users) => {
      // console.log("active users", users);
    });
    socket?.on("getMessage", (data) => {
      console.log(data.senderId, receiver.id, "data");
      // if(data.senderId === receiver.id){
      // }
      setMessages((prevMessages) => [
        ...prevMessages,
        { User, message: data.message },
      ]);

      console.log(Messages, "realtime Messages");
    });
  }, [socket]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [Messages.length, messageRef]);

  
  const loggedInUser = JSON.parse(localStorage.getItem("user.detail"));
  useEffect(() => {
    if (!localStorage.getItem("user.token")) {
      navigate("/sign_in");
    }

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/conversations/${loggedInUser.id}`
        );
        if (res.status === 200) {
          const resData = res.data;
          setConversations(resData);
          
          const conversationUserIds = resData.map(conversation => conversation.user.id);
          const filteredUsers = users.filter(user=> !conversationUserIds.includes(user.id));
          setUsers(filteredUsers);

        } else {
          alert("error getting conversation");
        }
      } catch (error) {
        alert(error, "error getting conversationsdata");
      }
    };
    fetchConversations();

    const fetchUsers = async (req, res) => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/users/${User.id}`
        );
        if (res.status === 200) {
          const resData = res.data;
          // console.log(resData)
          setUsers(resData);
        } else {
          alert("error getting Users");
        }
      } catch (error) {
        alert(error, "error getting users");
      }
    };
    fetchUsers();
  }, [loggedInUser.id,User.id]);

  const fetchMessages = async (conversationId, receiver) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/messages/${conversationId}?senderId=${User.id}&receiverId=${receiver.id}`
      );
      const messages = res.data;
      setMessages(messages);
      setReceiver(receiver);
      setIsUserSelected(true);
      setConversationId(conversationId);
    } catch (error) {
      console.log(error, "error getting messages");
    }
  };

  const getFileInput = (e) => {
    console.log(e.target.files[0], "file value");
    setFile(e.target.files[0]);
  };

  const logOut = () => {
    console.log("logOut");
    localStorage.clear(window.location.reload());
  };

//   window.onbeforeunload = function() {
//     localStorage.clear();
//  }
window.addEventListener("unload", function(event) {
   if (event.clientY < 0) {
        localStorage.clear();
    }
});


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSoketFile(reader.result);
      };
      reader.onerror = (error) => {
        console.log("error", error);
      };
    }

    socket.emit("sendMessage", {
      file: soketFile,
      message,
      conversationId: conversationId,
      senderId: User.id,
      receiverId: receiver.id,
    });

    console.log(
      file,
      message,
      conversationId,
      User.id,
      receiver.id,
      "sendMessage"
    );
    try {
      let formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("message", message);
      formData.append("conversationId", conversationId);
      formData.append("senderId", User.id);
      formData.append("receiverId", receiver.id);
      const res = await axios
        .post(
          `http://localhost:8000/api/message`,
          formData
          // {
          // message,
          // conversationId: conversationId,
          // senderId: User.id,
          // receiverId: receiver.id,
          // }
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.log(error, "Error in sending message");
    }

    setMessage("");
    setFile(null);
    fetchMessages(conversationId, receiver);
    console.log("fetchMessages");
  };
console.log(conversations,'conversations')
console.log(users,'users')
  return (
    <div className="w-screen bg-[#c6f5f5] h-screen flex overflow-hidden">
      <div className="w-[25%]  h-scrren bg-[#eaf3f3] ">
        <div className="h-[5%] flex flex-row items-center mx-9 my-5">
          <div className="border border-[#586666] p-[2px] rounded-full">
            <img src={Avatar} height={58} width={58} alt="" />
          </div>
          <div className="ml-4">
            <h3 className="font-bold text-xl">{User.fullName}</h3>
            <h3 className="text-lg font-light">My Account</h3>
          </div>

          <button
            type="button"
            className="btn btn-danger mx-2"
            onClick={logOut}
          >
            logout
          </button>
        </div>
        <hr />
        <div className=" h-[1%] text-lg text-sky-400 mx-24 my-2 text-center mb-4 ">
          messeages
        </div>

        <div className="h-[75%] overflow-auto no-scrollbar">
          {conversations?.length ? (
            conversations?.map(({ conversationId, user }) => {
              return (
                <div
                  key={conversationId}
                  className="flex flex-row border-b-2 cursor-pointer items-center mx-10 mt-4  "
                  onClick={() => {
                    fetchMessages(conversationId, user);
                  }}
                >
                  <div className="cursor-pointer">
                    <img src={Avatar} height={45} width={45} alt="" />
                  </div>
                  <div className="ml-4 mb-1">
                    <h3 className="font-bold text-lg mb-0">{user.fullName}</h3>
                    <h3 className=" text-sm font-light ">{user.email}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="font-bold mx-24 my-4 text-lg border-b-2">
              No Messages
            </div>
          )}
        </div>
      </div>
      <div className="w-[50%] bg-white h-scrren flex flex-col items-center">
        {isUserSelected ? (
          <div className="w-[75%] bg-[#eef6f5] h-[60px] my-4 flex items-center rounded-full">
            <div className="mx-2 cursor-pointer">
              <img src={Avatar} height={45} width={45} alt="" />
            </div>
            <div className=" mr-auto	">
              <h3 className="  font-semibold text-lg mb-0">
                {receiver.fullName}
              </h3>
              <h3 className=" text-sm font-light">{receiver.email}</h3>
            </div>
            {/* <div className="flex ">
                <div className="cursor-pointer mx-2">
                  <img src={addContact} height={30} width={30} alt="" />
                </div>
                <div className="cursor-pointer mr-2">
                  <img src={addVideo} height={30} width={30} alt="" />
                </div>
              </div> */}
          </div>
        ) : (
          <div className=" text-xl font-bold text-black mx-24 my-4 ">
            WellCome-{User.fullName}
          </div>
        )}

        <div className="w-full h-[80%] overflow-auto no-scrollbar ">
          <div className=" px-2 py-2 ">
            {Messages.map((user) => {
              // console.log(user.id, "user.id");

              if (user.id === User.id) {
                return (
                  // senders messages
                  <>
                    {/* {file?
                    (<div className="ml-auto p-2 min-h-[250px] max-w-[250px] bg-[#d5efec]  rounded-b-xl rounded-tl-xl">
                    <img src={URL.createObjectURL(file)} alt=''/>
                  </div>)
                    :() */}

                    <div className="ml-auto p-2 min-h-[35px] max-w-[350px] bg-[#d5efec]  rounded-b-xl rounded-tl-xl">
                      {user.message}
                    </div>
                    <div ref={messageRef}></div>
                  </>
                );
              } else {
                return (
                  // receivers messages
                  <>
                    <div className="p-2  min-h-[35px] max-w-[350px] bg-[#eef6f5] rounded-b-xl rounded-tr-xl">
                      {user.message}
                    </div>
                    <div ref={messageRef}></div>
                  </>
                );
              }
            })}
          </div>
        </div>

        {isUserSelected && (
          <form
            onSubmit={handleSubmit}
            className="relative h-[10%] w-full flex  items-center "
          >
            <input
              placeholder="Enter your message..."
              type="text"
              name="message"
              value={message}
              
              onChange={(e) => setMessage(e.target.value)}
              className="absolute w-[95%] bg-transparent p-2 h-[40px] my-2 mx-2  flex items-center rounded-full outline-none shadow-md"
            />
            <label
              // htmlFor="formFileSm"
              className="ml-[85%] z-10 cursor-pointer bg-transparent "
            >
              {/* <img src={addFile} height={30} width={30} alt="" /> */}
            </label>
            <input
              className="form-control form-control-sm"
              id="formFileSm"
              type="file"
              onChange={getFileInput}
              hidden
            />
            <button
              className="ml-2 z-10 rounded-full cursor-pointer bg-transparent "
              type="submit"
              onClick={handleSubmit}
              disabled={message.length === 0}
            >
              <img src={Send} height={30} width={30} alt="" />
            </button>
          </form>
        )}
      </div>

      <div className="w-[25%]  flex flex-col border-b-2 ">
        <div className=" text-lg text-sky-400 w-full  mx-2 my-2 ">
          <h3>Peaples</h3>
        </div>
        <hr className="h-2" />

        <div className=" overflow-auto no-scrollbar">
          {users?.length ? (
            users?.map(({ user }) => {
              return (
                <div
                  key={user.id}
                  className="flex flex-row border-b-2 cursor-pointer items-center mx-10 mt-4"
                  onClick={() => {
                    fetchMessages("new", user);
                    console.log(user);
                  }}
                >
                  <div className="cursor-pointer">
                    <img src={Avatar} height={45} width={45} alt="" />
                  </div>
                  <div className="ml-4 mb-1">
                    <h3 className="font-bold text-lg mb-0">{user.fullName}</h3>
                    <h3 className=" text-sm font-light mb-0">{user.email}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="font-bold mx-24 my-4 text-lg border-b-2">
              No Other users Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;


