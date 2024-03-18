import classNames from "classnames/bind";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { ClipLoader } from "react-spinners";

import { AuthContext } from "~/contexts/AuthContext";
import { MessageContext } from "~/contexts/MessageContext";
import api from "~/services/apiService";
import { fetchGetConversationById } from "~/services/conversationService";

import ChatBox from "~/components/Message/ChatBox";
import ChatInfo from "~/components/Message/ChatInfo";
import Conversation from "~/components/Message/Conversation";

import MainHeader from "~/layouts/MainHeader";
import styles from "./Message.module.scss";
import ImageViewer from "~/components/ImageViewer";

const cx = classNames.bind(styles);

function Message({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const { conversations } = useContext(MessageContext);
  const { id } = useParams();

  const socket = useRef();

  const [messages, setMessages] = useState([]);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [imageViewer, setImageViewer] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SERVER_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessages({
        senderId: data.senderId,
        message: data.message,
        type: data.type,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessages &&
      currentChat?.members.some(
        (member) => member.user_id === arrivalMessages.senderId
      ) &&
      setMessages((prev) => [...prev, arrivalMessages]);
  }, [arrivalMessages, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", userData._id);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
    });
  }, [userData]);

  useEffect(() => {
    if (id) {
      const getConversation = async () => {
        const conversation = await fetchGetConversationById(id);
        setCurrentChat(conversation);
        try {
        } catch (err) {
          console.log(err);
        }
      };

      getConversation();
    }
  }, [id]);

  useEffect(() => {
    setLoadingMessage(true);
    if (currentChat) {
      const getMessages = async () => {
        try {
          const messagesResponse = await api.get(
            `/message/getMessage/${currentChat?._id}`
          );
          setMessages(messagesResponse.data);
          setLoadingMessage(false);
        } catch (err) {
          console.log(err);
        }
      };

      getMessages();
    }
  }, [currentChat]);

  return (
    <>
      {showImageViewer && (
        <ImageViewer
          imageSrc={imageViewer}
          setShowImageViewer={setShowImageViewer}
        />
      )}
      <div className={cx("message-wrapper")}>
        <MainHeader onLogout={onLogout} type="NoSearch" />
        <div className={cx("message-container")}>
          <Conversation
            conversations={conversations}
            currentUser={userData}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
          />
          {currentChat ? (
            loadingMessage ? (
              <div className={cx("message-loading")}>
                <ClipLoader
                  size={40}
                  color="#e60023"
                  className={cx("loading-spinner")}
                />
              </div>
            ) : (
              <ChatBox
                socket={socket}
                currentUser={userData}
                currentChat={currentChat}
                messages={messages}
                setMessages={setMessages}
                setShowImageViewer={setShowImageViewer}
                setImageViewer={setImageViewer}
              />
            )
          ) : (
            <div className={cx("no-message-box")}></div>
          )}
          {currentChat ? (
            <ChatInfo currentChat={currentChat} currentUser={userData} />
          ) : (
            <div className={cx("no-info-chat")}></div>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
