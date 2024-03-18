import classNames from "classnames/bind";
import { ClipLoader } from "react-spinners";

import Conversation from "./ConversationDetail";

import styles from "./MessageConversation.module.scss";
const cx = classNames.bind(styles);
function MessageConversation({
  userData,
  loading,
  conversations,
  setShowMessage,
  unseenMessages,
}) {
  return (
    <div className={cx("message-wrapper")}>
      <div className={cx("message-container")}>
        <div className={cx("conversation-heading")}>
          <div className={cx("heading-text")}>Chats</div>
          <div className={cx("heading-options")}>
            <div className={cx("options")}>
              <i className={cx("fa-solid fa-ellipsis", "icon")}></i>
            </div>
            <div className={cx("edits")}>
              <i className={cx("fa-solid fa-pen-to-square", "icon")}></i>
            </div>
          </div>
        </div>
        <div className={cx("conversation-search")}>
          <div className={cx("search")}>
            <i
              className={cx("fa-light fa-magnifying-glass", "search-icon")}
            ></i>
            <input
              type="text"
              placeholder="Search..."
              spellCheck={false}
              className={cx("input-search")}
            />
          </div>
        </div>
        {loading ? (
          <div className={cx("conversation-message-loading")}>
            <ClipLoader
              size={30}
              color="#e60023"
              className={cx("loading-spinner")}
            />
          </div>
        ) : (
          <div className={cx("conversation-message-list")}>
            {conversations.map((con) => (
              <Conversation
                key={con._id}
                conversation={con}
                currentUser={userData}
                setShowMessage={setShowMessage}
                unseenMessages={unseenMessages}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageConversation;
