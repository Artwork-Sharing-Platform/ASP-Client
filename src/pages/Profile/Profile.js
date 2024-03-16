import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { AuthContext } from "~/contexts/AuthContext";
import { fetchGetFollowing } from "~/services/followService";

import MainHeader from "~/layouts/MainHeader";
import Saved from "~/components/Profile/Saved";
import Created from "~/components/Profile/Created";
import EditProfile from "~/components/Profile/EditProfile";
import LoadingSpinner from "~/components/LoadingSpinner";

import UserDefaultImg from "~/assets/images/user-default.png";
import styles from "./Profile.module.scss";
import EditPin from "~/components/Profile/Created/EditPin";
const cx = classNames.bind(styles);
function Profile({ onLogout }) {
  const { userData } = useContext(AuthContext);
  const [artworkEditData, setArtworkEditData] = useState(null);
  const [countFollowing, setCountFollowing] = useState(0);
  const [showContent, setShowContent] = useState("Saved");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditArtwork, setShowEditArtwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch following length
        const followings = await fetchGetFollowing(userData._id);
        setCountFollowing(followings.length);
        setLoadingContent(false);
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    };

    fetchData();
  }, [userData._id]);
  return (
    <>
      {loading && <LoadingSpinner loading={loading} />}
      {showEditProfile && (
        <EditProfile
          setShowEditProfile={setShowEditProfile}
          setLoading={setLoading}
        />
      )}
      {showEditArtwork && (
        <EditPin
          artworkEditData={artworkEditData}
          setShowEditArtwork={setShowEditArtwork}
        />
      )}
      <div className={cx("profile-wrapper")}>
        <MainHeader onLogout={onLogout} />
        {loadingContent ? (
          <div className={cx("profile-loading")}>
            <ClipLoader
              size={40}
              color="#e60023"
              className={cx("loading-spinner")}
            />
          </div>
        ) : (
          <div className={cx("profile-container")}>
            {/* Profile */}
            <div className={cx("user-information-wrapper")}>
              <div className={cx("user-information-container")}>
                <div className={cx("user-avatar")}>
                  <img
                    src={userData.avatar ? userData.avatar : UserDefaultImg}
                    alt="avatar"
                    className={cx("avatar")}
                  />
                </div>
                <div className={cx("full-name")}>
                  <div className={cx("text")}>
                    {userData.firstName + " " + userData.lastName}
                  </div>
                </div>
                <div className={cx("user-name")}>
                  <i className={cx("fa-brands fa-pinterest", "icon")}></i>
                  <div className={cx("text")}>{userData.userName}</div>
                </div>
                {userData.about && (
                  <div className={cx("about")}>
                    <div className={cx("text")}>{userData.about}</div>
                  </div>
                )}

                {userData.website && (
                  <Link to={userData.website} className={cx("profile-link")}>
                    {userData.website.split("/").slice(0, 3).join("/")}
                  </Link>
                )}

                <div className={cx("following")}>
                  <span className={cx("number")}>{countFollowing}</span>
                  <span className={cx("text")}>following</span>
                </div>
                <div className={cx("profile-action")}>
                  <div className={cx("share-btn")}>
                    <div className={cx("text")}>Share</div>
                  </div>
                  <div
                    className={cx("edit-btn")}
                    onClick={() => setShowEditProfile(true)}
                  >
                    <div className={cx("text")}>Edit profile</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Nav */}
            <div className={cx("nav-options-wrapper")}>
              <div className={cx("nav-options-container")}>
                <div className={cx("nav-options-main")}>
                  <div className={cx("created-wrapper")}>
                    <div
                      className={
                        showContent === "Created"
                          ? cx("created-active")
                          : cx("created")
                      }
                      onClick={() => setShowContent("Created")}
                    >
                      <div className={cx("text")}>Created</div>
                    </div>
                    <div
                      className={
                        showContent === "Created"
                          ? cx("line-active")
                          : cx("line")
                      }
                    ></div>
                  </div>
                  <div className={cx("saved-wrapper")}>
                    <div
                      className={
                        showContent === "Saved"
                          ? cx("saved-active")
                          : cx("saved")
                      }
                      onClick={() => setShowContent("Saved")}
                    >
                      <div className={cx("text")}>Saved</div>
                    </div>
                    <div
                      className={
                        showContent === "Saved" ? cx("line-active") : cx("line")
                      }
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Content */}
            {showContent === "Saved" ? (
              <Saved userData={userData} />
            ) : (
              <Created
                userData={userData}
                setShowEditArtwork={setShowEditArtwork}
                setArtworkEditData={setArtworkEditData}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
