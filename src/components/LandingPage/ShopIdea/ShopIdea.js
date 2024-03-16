import React from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./ShopIdea.module.scss";
const cx = classNames.bind(styles);
const imagesLayoutStyle = {
  background:
    'url("https://s.pinimg.com/webapp/shop-de8ddf10.png") center/cover no-repeat',
};
function ShopIdea() {
  const navigate = useNavigate();
  return (
    <div className={cx("shop-ideas-container")}>
      <div className={cx("images-layout")} style={imagesLayoutStyle}>
        <div className={cx("sub-image")}>
          <img
            src="https://s.pinimg.com/webapp/creator-pin-img-3bed5463.png"
            alt="img"
            className={cx("image")}
          />
        </div>
        <div className={cx("detail-image")}>
          <img
            src="https://s.pinimg.com/webapp/creator-avatar-262dfeba.png"
            alt="img"
            className={cx("image")}
          />
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("content-container")}>
          <div className={cx("search-title")}>
            See it, make it, try it, do it
          </div>
          <div className={cx("search-content")}>
            <div className={cx("text")}>
              The best part of Pesterin is discovering new things and ideas from
              people around the world.
            </div>
          </div>
          <div className={cx("explore")}>
            <button
              className={cx("explore-btn")}
              onClick={() => navigate("/ideas")}
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopIdea;
