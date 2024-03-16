import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { fetchCreatorInformation } from "~/services/creatorService";
import { fetchGetFollower, fetchGetFollowing } from "~/services/followService";

import Comment from "../Comment";

import styles from "./Middle.module.scss";
import { fetchGetCommentByArtId } from "~/services/commentService";
import { fetchGetReplyCommentByCommentId } from "~/services/replyCommentService";
import api from "~/services/apiService";

const cx = classNames.bind(styles);
function Middle({
  userData,
  pinInformation,
  listComments,
  setListComments,
  loadingShowListComment,
  setLoadingShowListComment,
  setCountComment,
}) {
  const [following, setFollowing] = useState([]);
  const [countFollower, setCountFollower] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const [creator, setCreator] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creatorData = await fetchCreatorInformation(
          pinInformation.userId
        );
        setCreator(creatorData);

        // Fetch following data only if creatorData is available
        const followingList = await fetchGetFollowing(userData._id);
        const filteredUserData = followingList.filter(
          (user) => user === creatorData._id
        );
        setFollowing(filteredUserData);

        // Fetch follower data only if creatorData is available
        const followerList = await fetchGetFollower(creatorData._id);
        setCountFollower(followerList.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pinInformation.userId, setCountComment, userData._id]);

  useEffect(() => {
    setLoadingShowListComment(true);
    const fetchData = async () => {
      try {
        const comments = await fetchGetCommentByArtId(pinInformation._id);
        const countTopLevelComments = comments.length;

        let countReplyComments = 0;

        const fetchAndCountReplies = async (commentId) => {
          try {
            const replyResponse = await fetchGetReplyCommentByCommentId(
              commentId
            );
            countReplyComments += replyResponse.length;
          } catch (error) {
            console.error(
              `Error fetching replies for comment ${commentId}:`,
              error
            );
          }
        };
        // Create an array of promises for each fetchAndCountReplies call
        const fetchPromises = comments.map((comment) =>
          fetchAndCountReplies(comment._id)
        );

        // Wait for all promises to resolve
        await Promise.all(fetchPromises);
        const totalCountComments = countTopLevelComments + countReplyComments;
        setListComments(comments);
        setCountComment(totalCountComments);
        setLoadingShowListComment(false);
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    };

    fetchData();
  }, [
    pinInformation._id,
    setCountComment,
    setListComments,
    setLoadingShowListComment,
  ]);

  const handleShowComment = () => {
    setShowComment(!showComment);
  };
  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const handleFollow = async () => {
    try {
      await api.post(`/follow/createFollow/${userData._id}/${creator._id}`);

      // Fetch following data only if creatorData is available
      const followingList = await fetchGetFollowing(userData._id);
      const filteredUserData = followingList.filter(
        (user) => user === creator._id
      );
      setFollowing(filteredUserData);

      // Fetch follower data only if creatorData is available
      const followerList = await fetchGetFollower(creator._id);
      setCountFollower(followerList.length);

      // Additional logic if needed after the follow operation
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnFollow = async () => {
    try {
      await api.delete(`/follow/deleteFollow/${userData._id}/${creator._id}`);

      // Fetch following data only if creatorData is available
      const followingList = await fetchGetFollowing(userData._id);
      const filteredUserData = followingList.filter(
        (user) => user === creator._id
      );
      setFollowing(filteredUserData);

      // Fetch follower data only if creatorData is available
      const followerList = await fetchGetFollower(creator._id);
      setCountFollower(followerList.length);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cx("information-content")}>
      {pinInformation.access === "private" && (
        <i className={cx("fa-sharp fa-solid fa-crown", "icon-private")}></i>
      )}
      {pinInformation.link && (
        <Link to={pinInformation.link} className={cx("hyper-link")}>
          {pinInformation.link}
        </Link>
      )}
      {pinInformation.title && (
        <div className={cx("title")}>
          <div className={cx("text")}>{pinInformation.title}</div>
        </div>
      )}
      {pinInformation.description && (
        <div className={cx("description")}>
          <pre className={cx("text")}>
            {pinInformation.description.length > 200
              ? showFullContent
                ? pinInformation.description
                : pinInformation.description.slice(0, 200)
              : pinInformation.description}
            {pinInformation.description.length > 200 && (
              <>
                {!showFullContent && (
                  <>
                    ....
                    <button
                      onClick={toggleContent}
                      className={cx("see-more-btn")}
                    >
                      more
                    </button>
                  </>
                )}
                {showFullContent && (
                  <>
                    ...
                    <button
                      onClick={toggleContent}
                      className={cx("see-more-btn")}
                    >
                      less
                    </button>
                  </>
                )}
              </>
            )}
          </pre>
        </div>
      )}

      {creator && (
        <div className={cx("creator")}>
          {creator._id === userData._id ? (
            <>
              <div className={cx("creator-self-information")}>
                <div className={cx("note-text")}>Note to self</div>
                <div className={cx("sub-note-text")}>
                  What do you want to remember about this Pin?
                </div>
              </div>
              <div className={cx("creator-add-note")}>
                <button className={cx("add-note-btn")}>Add note</button>
              </div>
            </>
          ) : (
            <>
              <div className={cx("creator-information")}>
                <div className={cx("creator-avatar")}>
                  <img
                    src={creator?.avatar}
                    alt="avatar"
                    className={cx("avatar")}
                  />
                </div>
                <div className={cx("creator-detail")}>
                  <Link
                    to={`/creator/${creator._id}`}
                    className={cx("creator-name")}
                  >
                    {creator.userName}
                  </Link>
                  <div className={cx("followers")}>
                    {countFollower}{" "}
                    {countFollower > 1 ? "Followers" : "Follower"}
                  </div>
                </div>
              </div>
              {following.length > 0 ? (
                <div className={cx("creator-following")}>
                  <button
                    className={cx("following-btn")}
                    onClick={handleUnFollow}
                  >
                    Following
                  </button>
                </div>
              ) : (
                <div className={cx("creator-follow")}>
                  <button className={cx("follow-btn")} onClick={handleFollow}>
                    Follow
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className={cx("comment-wrapper")}>
        <div className={cx("comment-heading")} onClick={handleShowComment}>
          <div className={cx("text")}>Comments</div>
          <div
            className={
              showComment
                ? cx("show-comment", "show-comment-show")
                : cx("show-comment")
            }
          >
            <i className={cx("fa-solid fa-chevron-down", "icon")}></i>
          </div>
        </div>

        {showComment &&
          (listComments.length > 0 ? (
            loadingShowListComment ? (
              <div className={cx("comment-loading")}>
                <ClipLoader
                  size={40}
                  color="#e60023"
                  className={cx("loading-spinner")}
                />
              </div>
            ) : (
              <div className={cx("comment-container")}>
                {listComments.map((comment) => (
                  <Comment
                    key={comment._id}
                    userData={userData}
                    pinInformation={pinInformation}
                    comment={comment}
                    setCountComment={setCountComment}
                    setLoadingShowListComment={setLoadingShowListComment}
                  />
                ))}
              </div>
            )
          ) : (
            <div className={cx("no-comment")}>
              No comments yet! Add one to start the conversation.
            </div>
          ))}
      </div>
    </div>
  );
}

export default Middle;
