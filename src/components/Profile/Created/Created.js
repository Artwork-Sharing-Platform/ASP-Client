import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { fetchPinInformationByUserId } from "~/services/artService";

import ImageCard from "~/components/Home/ImageCard";

import styles from "./Created.module.scss";
const cx = classNames.bind(styles);
function Created({ userData, setShowEditArtwork, setArtworkEditData }) {
  const [createdArtworkList, setCreatedArtworkList] = useState([]);
  const [loadingArtsShow, setLoadingArtsShow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artworks = await fetchPinInformationByUserId(userData._id);
        setCreatedArtworkList(artworks);
        setLoadingArtsShow(false);
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    };

    fetchData();
  }, [userData._id]);
  return (
    <div className={cx("created-content-wrapper")}>
      {loadingArtsShow ? (
        <div className={cx("created-content-artwork-loading")}>
          <ClipLoader
            size={40}
            color="#e60023"
            className={cx("loading-spinner")}
          />
        </div>
      ) : createdArtworkList.length > 0 ? (
        <div className={cx("created-content-artwork-list-container")}>
          <div className={cx("created-content-artwork-list")}>
            {createdArtworkList.map((art, index) => (
              <ImageCard
                artWork={art}
                key={index}
                type="Edit"
                setShowEditArtwork={setShowEditArtwork}
                setArtworkEditData={setArtworkEditData}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={cx("no-created-content")}>
          <div className={cx("text")}>
            Nothing to show...yet! Pins you create will live here.
          </div>
          <Link to="/pin-creation-tool" className={cx("create-pin-action")}>
            <div className={cx("text")}>Create Pin</div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Created;
