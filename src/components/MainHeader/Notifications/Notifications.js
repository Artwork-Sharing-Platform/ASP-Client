import classNames from "classnames/bind";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import api from "~/services/apiService";
import { getUnreadNotifications } from "~/services/notificationService";

import Haha from "~/assets/images/haha.png";
import Love from "~/assets/images/love.png";
import Wow from "~/assets/images/wow.png";
import GoodIdea from "~/assets/images/goodIdea.png";
import Thank from "~/assets/images/thank.png";
import styles from "./Notifications.modules.scss";
const cx = classNames.bind(styles);

function Notifications({
  userData,
  notifications,
  setNotifications,
  setCountNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const getFormattedTimestamp = useMemo((createdAt) => {
    return (createdAt) => {
      const distance = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
      });

      if (distance === "less than a minute ago") {
        return "a few seconds ago";
      }
      return distance;
    };
  }, []);

  const handleMarkAsRead = async () => {
    try {
      const notificationResponse = await api.put(
        `/notification/updateAllNotificationsStatus/${userData._id}`
      );
      setNotifications(notificationResponse.data);
      setCountNotifications(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickNotificationItem = async (notify) => {
    try {
      const notificationListResponse = await api.put(
        `/notification/updateNotificationStatusById/${notify._id}/${userData._id}`
      );
      const notificationUnreadResponse = await getUnreadNotifications(
        userData._id
      );
      setNotifications(notificationListResponse.data);
      setCountNotifications(notificationUnreadResponse.length);
      setShowNotifications(false);
      if (notify.hyperLink) {
        navigate(`${notify.hyperLink}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={cx("notification-wrapper")}>
      <div className={cx("notification-container")}>
        <div className={cx("notification-heading")}>
          <div className={cx("text")}>Notifications</div>
        </div>
        {notifications.length > 0 && (
          <div className={cx("mark-as-read")}>
            <button
              className={cx("mark-as-read-btn")}
              onClick={handleMarkAsRead}
            >
              Mark as read
            </button>
          </div>
        )}
        {notifications.length > 0 && (
          <div className={cx("notification-list")}>
            {notifications.map((notify) => (
              <div
                className={cx("notification-item")}
                key={notify._id}
                onClick={() => handleClickNotificationItem(notify)}
              >
                <div className={cx("user-avatar")}>
                  <img
                    src={notify?.senderAvatar}
                    alt="user-avt"
                    className={cx("avatar")}
                  />
                  {notify.type.includes("react") ? (
                    <div className={cx("notification-type-img")}>
                      {notify.type === "new_react_Love" && (
                        <img src={Love} alt="type" className={cx("img-type")} />
                      )}
                      {notify.type === "new_react_Haha" && (
                        <img src={Haha} alt="type" className={cx("img-type")} />
                      )}
                      {notify.type === "new_react_Thank" && (
                        <img
                          src={Thank}
                          alt="type"
                          className={cx("img-type")}
                        />
                      )}
                      {notify.type === "new_react_GoodIdea" && (
                        <img
                          src={GoodIdea}
                          alt="type"
                          className={cx("img-type")}
                        />
                      )}
                      {notify.type === "new_react_Wow" && (
                        <img src={Wow} alt="type" className={cx("img-type")} />
                      )}
                    </div>
                  ) : (
                    <div className={cx("notification-type")}>
                      {notify.type === "new_follow" && (
                        <i
                          className={cx(
                            "fa-solid fa-user-plus",
                            "icon-user-plus"
                          )}
                        ></i>
                      )}
                      {(notify.type === "new_comment" ||
                        notify.type === "new_reply_comment") && (
                        <i
                          className={cx("fa-solid fa-comment-dots", "icon")}
                        ></i>
                      )}
                      {notify.type === "new_art_posted" && (
                        <i className={cx("fa-brands fa-pinterest", "icon")}></i>
                      )}
                      {(notify.type === "new_payment_package" ||
                        notify.type === "new_free_package" ||
                        "new_report_artwork" ||
                        "new_warning_artwork" ||
                        "new_unlock_artwork") && (
                        <i
                          className={cx("fa-sharp fa-solid fa-bell", "icon")}
                        ></i>
                      )}
                    </div>
                  )}
                </div>
                <div className={cx("notification-info")}>
                  <div
                    className={cx("notification-content")}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(notify.content),
                    }}
                  />
                  <div className={cx("notification-date")}>
                    {getFormattedTimestamp(notify.createdAt)}
                  </div>
                </div>
                {notify.status === false && (
                  <div className={cx("dot-wrapper")}>
                    <div className={cx("dot")}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
