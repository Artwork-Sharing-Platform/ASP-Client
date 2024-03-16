import { useState } from "react";
import classNames from "classnames/bind";
import WhatsApp from "~/assets/images/Whatsapp.png";
import Twitter from "~/assets/images/X.png";
import Facebook from "~/assets/images/facebook.png";
import styles from "./SharingPin.module.scss";
const cx = classNames.bind(styles);
function SharingPin({ pinInformation }) {
  const urlCopy = `${process.env.REACT_APP_CLIENT}/pin/${pinInformation._id}`;
  const [copyText, setCopyText] = useState("Copy link");
  const handleCopyLink = () => {
    navigator.clipboard.writeText(urlCopy);
    setCopyText("Copied!");
  };
  return (
    <div className={cx("sharing-wrapper")} onClick={(e) => e.stopPropagation()}>
      <div className={cx("sharing-container")}>
        <div className={cx("send-heading")}>Send on Pesterin</div>
        <div className={cx("send-options")}>
          <div className={cx("search")}>
            <div className={cx("search-icon")}>
              <i className={cx("fa-solid fa-magnifying-glass", "icon")}></i>
            </div>
            <div className={cx("search-text")}>Search</div>
          </div>

          <div className={cx("import")}>
            <div className={cx("import-icon")}>
              <i className={cx("fa-solid fa-user-group", "icon")}></i>
            </div>
            <div className={cx("import-text")}>Import</div>
          </div>
        </div>
        <div className={cx("sharing-heading")}>Share</div>
        <div className={cx("sharing-options")}>
          <div className={cx("whatsapp")}>
            <div className={cx("whatsapp-icon")}>
              <img
                src={WhatsApp}
                alt="icon-img"
                className={cx("whatsapp-image")}
              />
            </div>
            <div className={cx("whatsapp-text")}>WhatsApp</div>
          </div>
          <div className={cx("messenger")}>
            <div className={cx("messenger-icon")}>
              <i className={cx("fa-brands fa-facebook-messenger", "icon")}></i>
            </div>
            <div className={cx("messenger-text")}>Messenger</div>
          </div>
          <div className={cx("facebook")}>
            <div className={cx("facebook-icon")}>
              <img
                src={Facebook}
                alt="icon-img"
                className={cx("facebook-image")}
              />
            </div>
            <div className={cx("facebook-text")}>Facebook</div>
          </div>
          <div className={cx("twitter")}>
            <div className={cx("twitter-icon")}>
              <img
                src={Twitter}
                alt="icon-img"
                className={cx("twitter-image")}
              />
            </div>
            <div className={cx("twitter-text")}>X</div>
          </div>
          <div className={cx("copy-link")}>
            <div className={cx("copy-link-icon")} onClick={handleCopyLink}>
              <i className={cx("fa-solid fa-link", "icon")}></i>
            </div>
            <div className={cx("copy-link-text")}>{copyText}</div>
          </div>
          <div className={cx("email")}>
            <div className={cx("email-icon")}>
              <i className={cx("fa-regular fa-envelope", "icon")}></i>
            </div>
            <div className={cx("email-text")}>Email</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharingPin;
