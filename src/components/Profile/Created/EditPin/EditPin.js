import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import MoreOptions from "~/components/Create/MoreOptions";
import styles from "./EditPin.module.scss";
import api from "~/services/apiService";
const cx = classNames.bind(styles);
function EditPin({ artworkEditData, setShowEditArtwork }) {
  const textareaRef = useRef(null);
  const [textareaRows, setTextareaRows] = useState(1);
  const [artWorkData, setArtWorkData] = useState({
    access: artworkEditData.access,
    title: artworkEditData.title,
    description: artworkEditData.description,
    link: artworkEditData.link,
    isCheckedComment: artworkEditData.isCheckedComment,
    isCheckedSimilar: artworkEditData.isCheckedSimilar,
  });

  const [showMoreOptions, setShowMoreOptions] = useState(true);

  useEffect(() => {
    // Automatically resize the textarea when the content is changed
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
    // Calculate the number of rows based on scrollHeight and clientHeight
    const extraLines =
      (textareaRef.current.scrollHeight - textareaRef.current.clientHeight) /
      20;
    const calculatedRows = Math.max(1, Math.ceil(extraLines));
    setTextareaRows(calculatedRows);
  }, [artWorkData.description]);

  const handleChangeTitle = (e) => {
    setArtWorkData({ ...artWorkData, title: e.target.value });
  };

  const handleChangeDescription = (e) => {
    setArtWorkData({ ...artWorkData, description: e.target.value });
  };

  const handleChangeLink = (e) => {
    setArtWorkData({ ...artWorkData, link: e.target.value });
  };

  const handleShowMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const handleSaveEditArtwork = async () => {
    try {
      await api.post(`/art/editArtwork/${artworkEditData._id}`, artWorkData);
      setShowEditArtwork(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={cx("edit-artwork-wrapper")}>
      <div className={cx("edit-artwork-container")}>
        <div className={cx("edit-artwork-heading")}>
          <div className={cx("heading-text")}>Edit Pin</div>
          <div
            className={cx("close")}
            onClick={() => setShowEditArtwork(false)}
          >
            <i className={cx("fa-solid fa-xmark", "icon")}></i>
          </div>
        </div>
        <div className={cx("edit-artwork-main")}>
          <div className={cx("edit-artwork-content")}>
            <div className={cx("title-content")}>
              <div className={cx("title")}>Title</div>
              <div className={cx("title-input")}>
                <input
                  type="text"
                  placeholder="Add a title"
                  value={artWorkData.title}
                  spellCheck={false}
                  autoFocus={false}
                  className={cx("input")}
                  onChange={handleChangeTitle}
                />
              </div>
            </div>
            <div className={cx("desc-content")}>
              <div className={cx("title")}>Description</div>
              <div className={cx("desc-input")}>
                <textarea
                  className={cx("input")}
                  placeholder="Add a detailed description"
                  onChange={handleChangeDescription}
                  value={artWorkData.description}
                  rows={textareaRows}
                  ref={textareaRef}
                  autoFocus={true}
                ></textarea>
              </div>
            </div>
            <div className={cx("link-content")}>
              <div className={cx("title")}>Link</div>
              <div className={cx("link-input")}>
                <input
                  type="text"
                  placeholder="Add a link"
                  value={artWorkData.link}
                  spellCheck={false}
                  autoFocus={false}
                  className={cx("input")}
                  onChange={handleChangeLink}
                />
              </div>
            </div>
            <div
              className={
                showMoreOptions
                  ? cx("more-options", "more-options-show")
                  : cx("more-options")
              }
              onClick={handleShowMoreOptions}
            >
              <div className={cx("text")}>More options</div>
              <i className={cx("fa-solid fa-chevron-down", "icon")}></i>
            </div>
            {showMoreOptions && (
              <MoreOptions
                type="Edit"
                artWorkData={artWorkData}
                setArtWorkData={setArtWorkData}
              />
            )}
          </div>
        </div>
        <div className={cx("edit-art-footer-main")}>
          <div className={cx("edit-art-footer")}>
            <button
              className={cx("cancel-btn")}
              onClick={() => setShowEditArtwork(false)}
            >
              Cancel
            </button>
            <button className={cx("save-btn")} onClick={handleSaveEditArtwork}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPin;
