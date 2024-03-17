import classNames from "classnames/bind";
import { useEffect, useState } from "react";

import { fetchGetArtworkByCategoryId } from "~/services/artService";

import ImageCard from "~/components/Home/ImageCard";

import styles from "./PinRelated.module.scss";
const cx = classNames.bind(styles);

function PinRelated({ pinInformation }) {
  const [artworks, setArtwork] = useState([]);

  useEffect(() => {
    if (pinInformation) {
      const fetchData = async () => {
        try {
          const artWorkList = await fetchGetArtworkByCategoryId(
            pinInformation.categoryId
          );

          const filterArtworks = artWorkList.filter(
            (art) => art._id !== pinInformation._id
          );
          setArtwork(filterArtworks);
        } catch (error) {
          console.error("Error fetching pin information:", error);
        }
      };

      fetchData();
    }
  }, [pinInformation]);

  return (
    <>
      {artworks.length > 0 && (
        <>
          <div className={cx("related-heading")}>More to explore</div>
          <div className={cx("related-art-wrapper")}>
            <div className={cx("related-art-container")}>
              {artworks.map((art, index) => (
                <ImageCard artWork={art} key={index} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default PinRelated;
