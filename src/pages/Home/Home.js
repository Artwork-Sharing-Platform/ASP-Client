import classNames from "classnames/bind";
import MainHeader from "~/layouts/MainHeader";
import ImageCard from "~/components/Home/ImageCard";
import { artworks } from "~/datas/artworkDatas";
import styles from "./Home.module.scss";
const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx("home-wrapper")}>
      <MainHeader />
      <div className={cx("home-container")}>
        <div className={cx("show-artworks-list")}>
          {artworks.map((image, index) => (
            <ImageCard image={image} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
