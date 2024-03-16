import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./SearchIdea.module.scss";
const cx = classNames.bind(styles);
function SearchIdea() {
  const navigate = useNavigate();
  return (
    <div className={cx("search-ideas-container")}>
      <div className={cx("images-layout")}>
        <div className={cx("search")}>
          <div className={cx("search-icon")}>
            <i className={cx("fa-solid fa-magnifying-glass", "icon")}></i>
          </div>
          <div className={cx("search-input")}>easy pizza dinner</div>
        </div>
        <div className={cx("image-card-1")}>
          <img
            src="https://i.pinimg.com/564x/8a/f2/a1/8af2a17dd2bbffb0a4b36442b6e34d8d.jpg"
            alt="img"
            className={cx("image")}
          />
        </div>
        <div className={cx("image-card-2")}>
          <img
            src="https://i.pinimg.com/564x/b6/94/0e/b6940e530fa87fdf8f4e9cdf5ccafc36.jpg"
            alt="img"
            className={cx("image")}
          />
        </div>
        <div className={cx("image-card-3")}>
          <img
            src="https://i.pinimg.com/564x/4d/8b/ce/4d8bce02999b38314e48ea984f015fe0.jpg"
            alt="img"
            className={cx("image")}
          />
        </div>
        <div className={cx("image-card-4")}>
          <img
            src="https://i.pinimg.com/564x/63/6c/20/636c202569ba7c8116f8b48e72b2f110.jpg"
            alt="img"
            className={cx("image")}
          />
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("content-container")}>
          <div className={cx("search-title")}>Search for an idea</div>
          <div className={cx("search-content")}>
            <div className={cx("text")}>
              What do you want to try next? Think of something you’re into—like
              “easy pizza dinner”—and see what you find.
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

export default SearchIdea;
