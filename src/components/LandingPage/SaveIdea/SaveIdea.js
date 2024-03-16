import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SaveIdea.module.scss";
const cx = classNames.bind(styles);
function SaveIdea() {
  const navigate = useNavigate();
  return (
    <div className={cx("save-ideas-container")}>
      <div className={cx("content")}>
        <div className={cx("content-container")}>
          <div className={cx("search-title")}>Save ideas you like</div>
          <div className={cx("search-content")}>
            <div className={cx("text")}>
              Collect your favorites so you can get back to them later
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
      <div className={cx("images-layout")}>
        <Link className={cx("image-card-1")}>
          <img
            src="https://i.pinimg.com/736x/ab/b5/1c/abb51cdcc2a969107ff89da0351b5941.jpg"
            alt="img"
            className={cx("image")}
          />
        </Link>
        <Link className={cx("image-card-2")}>
          <img
            src="https://i.pinimg.com/564x/9a/de/ca/9adeca12131db45aa3fd226333b3cfec.jpg"
            alt="img"
            className={cx("image")}
          />
        </Link>
        <Link className={cx("image-card-3")}>
          <img
            src="https://i.pinimg.com/564x/3d/8c/46/3d8c4637c6347d43907ac5247bab2f6c.jpg"
            alt="img"
            className={cx("image")}
          />
        </Link>
        <Link className={cx("image-card-4")}>
          <img
            src="https://i.pinimg.com/564x/36/54/3f/36543f14e6b050793cc8842fb5ab2380.jpg"
            alt="img"
            className={cx("image")}
          />
        </Link>
        <Link className={cx("image-card-5")}>
          <img
            src="https://i.pinimg.com/564x/7f/30/bd/7f30bd1c947a95c7b677bf1f48fe2eb4.jpg"
            alt="img"
            className={cx("image")}
          />
        </Link>
      </div>
    </div>
  );
}

export default SaveIdea;
