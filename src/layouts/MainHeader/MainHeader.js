import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "~/services/apiService";
import { AuthContext } from "~/contexts/AuthContext";
import { MessageContext } from "~/contexts/MessageContext";
import {
  fetchGetNotificationsForUser,
  getUnreadNotifications,
} from "~/services/notificationService";
import useDebounce from "~/hooks/useDebounce";

import Logo from "~/assets/images/logo.png";
import UserDefaultImg from "~/assets/images/user-default.png";
import AccountOptions from "~/components/MainHeader/AccountOptions";
import Notifications from "~/components/MainHeader/Notifications";
import Search from "~/components/MainHeader/Search";
import MessageConversation from "~/components/MainHeader/MessageConversation";

import styles from "./MainHeader.module.scss";
const cx = classNames.bind(styles);
const headerNav = [
  {
    id: 1,
    title: "Home",
    path: "/",
  },
  {
    id: 2,
    title: "Create",
    path: "/pin-creation-tool",
  },
];
function MainHeader({ onLogout, type = "Search" }) {
  const { userData } = useContext(AuthContext);
  const { conversations } = useContext(MessageContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [countNotifications, setCountNotifications] = useState();
  const [countMessages, setCountMessages] = useState();
  const [packageName, setPackageName] = useState("");
  const [unseenMessages, setUnseenMessages] = useState([]);

  const [showSearch, setShowSearch] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showAccountSetting, setShowAccountSetting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const debouncedValue = useDebounce(searchValue, 300);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData._id) {
          const notificationResponse = await fetchGetNotificationsForUser(
            userData._id
          );
          setNotifications(notificationResponse);
        }
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    };

    fetchData();
  }, [userData._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData._id) {
          const notificationUnreadResponse = await getUnreadNotifications(
            userData._id
          );
          if (notificationUnreadResponse.length > 0) {
            setCountNotifications(notificationUnreadResponse.length);
          }
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    fetchData();
  }, [userData._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData._id) {
          const responseCountMessages = await api.get(
            `/message/getMessageUnseen/${userData._id}`
          );
          setCountMessages(responseCountMessages.data.length);
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    fetchData();
  }, [userData._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData._id) {
          const response = await api.get(
            `/message/getMessageUnseen/${userData._id}`
          );
          setUnseenMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userData._id]);

  useEffect(() => {
    if (userData.packageId) {
      api
        .get(`package/getPackageName/${userData.packageId}`)
        .then((response) => {
          setPackageName(response.data);
        });
    }
  }, [userData.packageId]);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchAPI = async () => {
      api
        .get(`/art//searchArtwork/${debouncedValue}`)
        .then((response) => {
          setSearchResult(response.data);
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    };
    fetchAPI();
  }, [debouncedValue]);

  const handleNavItemClick = (path) => {
    if (path === "/") {
      navigate(path);
      window.location.reload();
    }
    navigate(path);
  };

  const handleOpenNotification = () => {
    setShowAccountSetting(!showAccountSetting);
  };

  const handleShowSearch = () => {
    setShowSearchInput(true);
    setShowSearch(true);
  };

  const handleChangeSearchInput = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  return (
    <div
      className={
        type !== "NoSearch" && type !== "Admin"
          ? cx("main-header-wrapper")
          : cx("main-header-wrapper", "no-search")
      }
    >
      {showAccountSetting && (
        <AccountOptions onLogout={onLogout} packageName={packageName} />
      )}
      {showNotifications && (
        <Notifications
          userData={userData}
          notifications={notifications}
          setNotifications={setNotifications}
          setCountNotifications={setCountNotifications}
          setShowNotifications={setShowNotifications}
        />
      )}
      {showMessage && (
        <MessageConversation
          userData={userData}
          conversations={conversations}
          setShowMessage={setShowMessage}
          unseenMessages={unseenMessages}
        />
      )}
      <div className={cx("main-header-container")}>
        <div className={cx("header-left")}>
          <Link to="/" className={cx("header-logo")}>
            <div className={cx("logo")}>
              <img src={Logo} alt="logo" className={cx("logo-img")} />
            </div>
          </Link>

          {type !== "Admin" && (
            <div className={cx("header-nav")}>
              {headerNav.map((nav) => {
                const isActive = location.pathname === nav.path;
                return (
                  <div
                    key={nav.id}
                    className={cx(isActive ? "nav-item-active" : "nav-item")}
                    onClick={() => handleNavItemClick(nav.path)}
                  >
                    {nav.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {type !== "NoSearch" && type !== "Admin" && (
          <div className={cx("header-middle")}>
            {showSearchInput ? (
              <div className={cx("header-search-focus")}>
                <input
                  type="text"
                  value={searchValue}
                  spellCheck={false}
                  autoFocus={true}
                  placeholder="Search"
                  className={cx("search-input")}
                  onChange={handleChangeSearchInput}
                />

                <div className={cx("close-search")}>
                  <div
                    className={cx("icon-close")}
                    onClick={() => {
                      setShowSearchInput(false);
                      setShowSearch(false);
                    }}
                  >
                    <i className={cx("fa-solid fa-circle-xmark", "icon")}></i>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cx("header-search")} onClick={handleShowSearch}>
                <i
                  className={cx("fa-solid fa-magnifying-glass", "search-icon")}
                ></i>
                <span className={cx("search-focus")}>Search</span>
              </div>
            )}
            {showSearch && (
              <Search
                searchValue={searchValue}
                searchResult={searchResult}
                setShowSearch={setShowSearch}
              />
            )}
          </div>
        )}

        <div className={cx("header-right")}>
          <div
            className={cx("notification")}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessage(false);
            }}
          >
            <i className={cx("fa-sharp fa-solid fa-bell", "icon")}></i>
            {countNotifications > 0 && (
              <div className={cx("count-notification")}>
                <div className={cx("number")}>
                  {countNotifications > 9 ? 9 : countNotifications}
                </div>
                {countNotifications > 9 && (
                  <i className={cx("fa-solid fa-plus", "plus-icon")}></i>
                )}
              </div>
            )}
          </div>
          <div
            className={cx("message")}
            onClick={() => {
              setShowMessage(!showMessage);
              setShowNotifications(false);
            }}
          >
            <i className={cx("fa-solid fa-comment-dots", "icon")}></i>
            {countMessages > 0 && (
              <div className={cx("count-message")}>
                <div className={cx("number")}>
                  {countMessages > 9 ? 9 : countMessages}
                </div>
                {countMessages > 9 && (
                  <i className={cx("fa-solid fa-plus", "plus-icon")}></i>
                )}
              </div>
            )}
          </div>
          <Link to="/profile" className={cx("user-image")}>
            <img
              src={userData.avatar ? userData.avatar : UserDefaultImg}
              alt="user-img"
              className={cx("image")}
            />
          </Link>
          <div className={cx("dropdown")} onClick={handleOpenNotification}>
            <i className={cx("fa-solid fa-chevron-down", "icon")}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainHeader;
