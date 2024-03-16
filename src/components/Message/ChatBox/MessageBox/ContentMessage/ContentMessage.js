import classNames from "classnames/bind";
import styles from "./ContentMessage.module.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);
function ContentMessage({ message, own, setShowImageViewer, setImageViewer }) {
  const [showDateTimeSelf, setShowDateTimeSelf] = useState(false);
  const [showDateTimeReceive, setShowDateTimeReceive] = useState(false);

  const convertFormat = (isoDateTime) => {
    const date = new Date(isoDateTime);
    const currentDate = new Date();
    const sameDate = date.toDateString() === currentDate.toDateString();

    const hours = date.getHours() % 12 || 12; // Convert 0 to 12
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    if (sameDate) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
    } else {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are zero-based
      const year = date.getFullYear() % 100; // Get last two digits of the year
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm} ${
        day < 10 ? "0" : ""
      }${day}/${month < 10 ? "0" : ""}${month}/${year}`;
    }
  };

  const handleClickImageViewerSelf = (image) => {
    setImageViewer(image);
    setShowImageViewer(true);
  };

  const handleClickImageViewerReceive = (image) => {
    setImageViewer(image);
    setShowImageViewer(true);
  };
  return (
    <>
      {own ? (
        <div className={cx("message-container-self")}>
          {showDateTimeSelf && (
            <div className={cx("message-date-time-self")}>
              {convertFormat(message.createdAt)}
            </div>
          )}
          <div className={cx("message-info-self")}>
            {message.type === "text" ? (
              <div
                className={cx("message-content-self")}
                onMouseEnter={() => setShowDateTimeSelf(true)}
                onMouseLeave={() => setShowDateTimeSelf(false)}
              >
                {message.message}
              </div>
            ) : message.type === "link" ? (
              <Link
                to={message.message}
                target="_blank"
                className={cx("message-content-self")}
                onMouseEnter={() => setShowDateTimeSelf(true)}
                onMouseLeave={() => setShowDateTimeSelf(false)}
              >
                {message.message}
              </Link>
            ) : (
              <div
                className={cx("message-image-self")}
                onClick={() => handleClickImageViewerSelf(message.message)}
              >
                <img
                  src={message.message}
                  alt="message-img"
                  className={cx("message-img")}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={cx("message-container-receive")}>
          {showDateTimeReceive && (
            <div className={cx("message-date-time-receive")}>
              {convertFormat(message.createdAt)}
            </div>
          )}
          <div className={cx("message-info-receive")}>
            {message.type === "text" ? (
              <div
                className={cx("message-content-receive")}
                onMouseEnter={() => setShowDateTimeReceive(true)}
                onMouseLeave={() => setShowDateTimeReceive(false)}
              >
                {message.message}
              </div>
            ) : message.type === "link" ? (
              <Link
                to={message.message}
                target="_blank"
                className={cx("message-content-receive")}
                onMouseEnter={() => setShowDateTimeReceive(true)}
                onMouseLeave={() => setShowDateTimeReceive(false)}
              >
                {message.message}
              </Link>
            ) : (
              <div
                className={cx("message-image-receive")}
                onClick={() => handleClickImageViewerReceive(message.message)}
              >
                <img
                  src={message.message}
                  alt="message-img"
                  className={cx("message-img")}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ContentMessage;
