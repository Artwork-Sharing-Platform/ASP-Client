import classNames from "classnames/bind";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useRef, useState } from "react";
import { v4 } from "uuid";
import { storage } from "~/configs/firebase";
import { MessageContext } from "~/contexts/MessageContext";
import api from "~/services/apiService";
import styles from "./MessageInput.module.scss";
const cx = classNames.bind(styles);

function MessageInput({
  socket,
  messageInputRef,
  newMessage,
  setNewMessage,
  currentUser,
  currentChat,
  setMessages,
  setShowEmoji,
}) {
  const fileInputImageRef = useRef(null);
  const { setConversations } = useContext(MessageContext);
  const [messageMedia, setMessageMedia] = useState(null);
  const [typeMessage, setTypeMessage] = useState("text");
  const [fileImageUpload, setFileImageUpload] = useState();
  const [showMediaMessage, setShowMediaMessage] = useState(false);

  const handleChangeMessage = (e) => {
    setNewMessage(e.target.value);
    setTypeMessage("text");
  };

  const handleClickImage = () => {
    fileInputImageRef.current.click();
  };

  const handlePreviewImage = (e) => {
    let file = null;
    let url;

    if (e.target.files.length === 1) {
      file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        url = reader.result;

        if (messageMedia) {
          URL.revokeObjectURL(messageMedia);
        }
        messageInputRef.current.focus();
        setMessageMedia(url);
        setTypeMessage("image");
        setFileImageUpload(file);
        setShowMediaMessage(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCloseMediaMessage = () => {
    setMessageMedia(null);
    setShowMediaMessage(false);
  };

  const handleSendMessage = async () => {
    setShowEmoji(false);
    const { _id: conversationId, members } = currentChat;
    const { _id: senderId } = currentUser;

    const isURL = (str) => {
      const urlRegex = /(https?:\/\/[^\s]+)/;
      return urlRegex.test(str);
    };

    const messageType = typeMessage === "text" ? "text" : "image";
    const messageContent = typeMessage === "text" ? newMessage : messageMedia;
    const messageTypeWithLink = isURL(messageContent) ? "link" : messageType;

    const messagePreview = {
      conversationId,
      senderId,
      type: messageTypeWithLink,
      message: messageContent,
      seen: false,
      createdAt: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, messagePreview]);
    setNewMessage("");
    setMessageMedia(null);
    setShowMediaMessage(false);

    const receiver = members.find((m) => m.user_id !== senderId);
    const receiverId = receiver.user_id;

    await socket.current.emit("sendMessage", {
      senderId,
      receiverId,
      type: messageTypeWithLink,
      message: messagePreview.message,
    });

    try {
      let downloadURL;
      if (fileImageUpload) {
        const mediaMessageRef = ref(
          storage,
          `message/image/${currentUser._id}/${fileImageUpload.name + v4()}`
        );
        await uploadBytes(mediaMessageRef, fileImageUpload);
        downloadURL = await getDownloadURL(mediaMessageRef);
      }

      const message = {
        conversationId,
        senderId,
        type: messageTypeWithLink,
        message: typeMessage === "text" ? newMessage : downloadURL,
        seen: false,
        createdAt: new Date(),
      };

      const messageResponse = await api.post("/message/newMessage", message);
      const { conversations: newConversationResponse } = messageResponse.data;

      setConversations(newConversationResponse);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEnterSendMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClickEmoji = () => {
    setShowEmoji((val) => !val);
  };

  return (
    <div className={cx("message-box-footer")}>
      <div className={cx("option-input")}>
        <div className={cx("plus")}>
          <i className={cx("fa-solid fa-circle-plus", "icon")}></i>
        </div>
        <div className={cx("image")}>
          <i
            className={cx("fa-regular fa-image", "icon")}
            onClick={handleClickImage}
          ></i>
          <input
            ref={fileInputImageRef}
            type="file"
            multiple
            style={{ display: "none" }}
            accept="image/*"
            onChange={handlePreviewImage}
          />
        </div>
        <div className={cx("video")}>
          <i className={cx("fa-sharp fa-regular fa-circle-play", "icon")}></i>
        </div>
        <div className={cx("gif")}>
          <i className={cx("fa-solid fa-gif", "icon")}></i>
        </div>
      </div>
      <div className={cx("input-container")}>
        {showMediaMessage && (
          <div className={cx("list-preview-image")}>
            <div className={cx("load-image-preview")}>
              <img
                src={messageMedia}
                alt="img-preview"
                className={cx("image-preview")}
              />
              <div className={cx("close")} onClick={handleCloseMediaMessage}>
                <i className={cx("fa-regular fa-xmark", "close-icon")}></i>
              </div>
            </div>
          </div>
        )}

        <div
          className={
            showMediaMessage
              ? cx("text-input", "media-active")
              : cx("text-input")
          }
        >
          <input
            ref={messageInputRef}
            value={newMessage}
            type="text"
            placeholder="Aa"
            spellCheck={false}
            autoFocus={true}
            className={cx("input-chat")}
            onChange={handleChangeMessage}
            onKeyDown={handleEnterSendMessage}
          />

          <div className={cx("emoji")}>
            <i
              className={cx("fa-regular fa-face-smile", "icon-emoji")}
              onClick={handleClickEmoji}
            ></i>
          </div>
        </div>
      </div>
      <button
        className={cx("send-chat")}
        onClick={handleSendMessage}
        disabled={newMessage === "" && messageMedia === null}
      >
        <i
          className={
            newMessage || messageMedia
              ? cx("fa-regular fa-paper-plane-top", "icon-send-active")
              : cx("fa-regular fa-paper-plane-top", "icon-send")
          }
        ></i>
      </button>
    </div>
  );
}

export default MessageInput;
