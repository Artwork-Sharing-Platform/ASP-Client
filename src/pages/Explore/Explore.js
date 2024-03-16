import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { fetchArtworkList } from "~/services/artService";
import { categories } from "~/datas/categoriesDatas";
import ExploreHeder from "~/layouts/ExploreHeder";
import Login from "~/components/Auth/Login";
import Signup from "~/components/Auth/Signup";
import SignupBusiness from "~/components/Auth/SignupBusiness";
import styles from "./Explore.module.scss";
const cx = classNames.bind(styles);
function Explore({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showSignupBusiness, setShowSignupBusiness] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artWorkList = await fetchArtworkList();
        setImages(artWorkList);
      } catch (error) {
        console.error("Error fetching pin information:", error);
      }
    };

    fetchData();
  }, []);

  const handleClickArtwork = () => {
    const isLogin = localStorage.getItem("isLoggedIn");
    if (isLogin === "false") {
      setShowLogin(true);
    }
  };
  return (
    <>
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
          onLogin={onLogin}
        />
      )}
      {showSignup && (
        <Signup
          setShowSignup={setShowSignup}
          setShowLogin={setShowLogin}
          setShowSignupBusiness={setShowSignupBusiness}
        />
      )}
      {showSignupBusiness && (
        <SignupBusiness
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
          setShowSignupBusiness={setShowSignupBusiness}
        />
      )}
      <div className={cx("explore-wrapper")}>
        <ExploreHeder
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
        />
        <div className={cx("explore-container")}>
          <div className={cx("explore-content")}>
            <div className={cx("content-heading")}>
              Explore the best of Pesterin
            </div>
            <div className={cx("categories")}>
              <div className={cx("categories-list")}>
                {categories.map((category) => (
                  <div
                    className={cx("category-item")}
                    style={{
                      backgroundImage: `url(${category.imageUrl})`,
                    }}
                    key={category.id}
                  >
                    <Link to={category.path} className={cx("category-label")}>
                      {category.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={cx("explore-content-artwork")}>
            <div className={cx("heading-text")}>Explore popular ideas</div>
            <div className={cx("show-artwork")}>
              {images.map((item, index) => (
                <div
                  className={cx("image-card")}
                  key={index}
                  onClick={handleClickArtwork}
                >
                  <img src={item.url} alt="img" className={cx("image-item")} />
                  <div className={cx("image-label")}>Open</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Explore;
