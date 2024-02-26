import React from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import Logo from "~/assets/images/logo.png";
import styles from "./AccountOptions.module.scss";
const cx = classNames.bind(styles);
const yourAccount = [
  { id: 1, text: "Add account", path: "/add-account" },
  { id: 2, text: "Add payment method", path: "/add-payment" },
  { id: 3, text: "Convert to business", path: "/convert-business" },
];

const moreOptions = [
  {
    id: 1,
    text: "Settings",
    path: "/settings",
    icon: false,
  },
  {
    id: 2,
    text: "Tune your home feed",
    path: "/",
    icon: false,
  },
  {
    id: 3,
    text: "Install the Windows app",
    path: "/",
    icon: false,
  },
  {
    id: 4,
    text: "Your privacy rights",
    path: "/",
    icon: false,
  },
  {
    id: 5,
    text: "Get help",
    path: "/",
    icon: true,
  },
  {
    id: 6,
    text: "See terms of service",
    path: "/",
    icon: true,
  },
  {
    id: 7,
    text: "See privacy policy",
    path: "/",
    icon: true,
  },
  {
    id: 8,
    text: "Be a beta tester",
    path: "/",
    icon: true,
  },
];
function AccountOptions() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className={cx("account-options-wrapper")}>
      <div className={cx("account-options-container")}>
        {/* User info */}
        <div className={cx("current-text")}>Currently in</div>
        <div className={cx("user-info-wrapper")}>
          <div className={cx("user-info-container")}>
            <div className={cx("user-info-main")}>
              <div className={cx("user-avatar")}>
                <img src={Logo} alt="avatar" className={cx("avatar")} />
              </div>
              <div className={cx("user-info")}>
                <div className={cx("username")}>Le Vu Dinh Duy</div>
                <div className={cx("account-type")}>Personal</div>
                <div className={cx("email")}>duylvdse160367@fpt.edu.vn</div>
              </div>
            </div>
            <div className={cx("tick")}>
              <i className={cx("fa-solid fa-check", "icon")}></i>
            </div>
          </div>
        </div>
        {/* Account */}
        <div className={cx("your-account-text")}>Your account</div>
        {yourAccount.map((item) => (
          <Link
            to={item.path}
            className={cx("account-item-wrapper")}
            key={item.id}
          >
            <div className={cx("account-item-container")}>{item.text}</div>
          </Link>
        ))}
        {/* More options */}
        <div className={cx("more-options-text")}>More options</div>
        {moreOptions.map((option) => (
          <Link
            to={option.path}
            className={cx("option-wrapper")}
            key={option.id}
          >
            <span className={cx("option-text")}>{option.text}</span>
            {option.icon && (
              <i
                className={cx("fa-solid fa-arrow-up-right-from-square", "icon")}
              ></i>
            )}
          </Link>
        ))}
        <div className={cx("log-out-wrapper")} onClick={handleLogout}>
          <div className={cx("log-out-text")}>Log out</div>
        </div>
      </div>
    </div>
  );
}

export default AccountOptions;