import classNames from "classnames/bind";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "~/contexts/AuthContext";
import api from "~/services/apiService";
import TokenService from "~/services/tokenService";

import UserDefaultImg from "~/assets/images/user-default.png";
import styles from "./AccountOptions.module.scss";
import PackageFeature from "./PackageFeature";
import { PackageContext } from "~/contexts/PackageContext";
const cx = classNames.bind(styles);
const yourAccount = [{ id: 1, text: "Add account", path: "/add-account" }];

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
function AccountOptions({ onLogout, packageName }) {
  const { userData, logout } = useContext(AuthContext);
  const { setFeature } = useContext(PackageContext);
  const [showPackageFeature, setShowPackageFeature] = useState(false);

  const handleLogout = () => {
    const refreshToken = TokenService.getRefreshToken();
    api
      .post("/auth/logout", { refreshToken })
      .then((res) => {
        onLogout();
        TokenService.removeTokens();
        setFeature(null);
        logout();
      })
      .catch((err) => {
        console.log(err);
      });
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
                <img
                  src={userData.avatar ? userData.avatar : UserDefaultImg}
                  alt="avatar"
                  className={cx("avatar")}
                />
              </div>
              <div className={cx("user-info")}>
                <div className={cx("username")}>
                  <span className={cx("text")}>
                    {userData.lastName
                      ? userData.lastName.split(" ")[0] + " "
                      : userData.firstName.split(" ")[0] + " "}
                  </span>
                  {packageName && (
                    <span className={cx("type-package")}>
                      {"(" + packageName + ")"}
                    </span>
                  )}
                </div>
                <div className={cx("account-type")}>{userData.type}</div>
                <div className={cx("email")}>{userData.email}</div>
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
        {!packageName && (
          <Link to="/convert-business" className={cx("account-item-wrapper")}>
            <div className={cx("account-item-container")}>
              Convert to business
            </div>
          </Link>
        )}

        {packageName && (
          <div
            className={
              showPackageFeature
                ? cx(
                    "account-item-wrapper-package",
                    "account-item-wrapper-package-open"
                  )
                : cx("account-item-wrapper-package")
            }
            onClick={() => setShowPackageFeature(!showPackageFeature)}
          >
            <div className={cx("account-item-container-package")}>
              <div className={cx("text")}>Package feature</div>
              <div className={cx("dropdown")}>
                <i className={cx("fa-solid fa-chevron-up", "icon")}></i>
              </div>
            </div>
          </div>
        )}

        {packageName && showPackageFeature && <PackageFeature />}

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
