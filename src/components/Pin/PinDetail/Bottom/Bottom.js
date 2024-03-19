import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import api from "~/services/apiService";

import Reaction from "./Reaction";
import ReactionUI from "./ReactionUI";

import Haha from "~/assets/images/haha.png";
import Love from "~/assets/images/love.png";
import Wow from "~/assets/images/wow.png";

import styles from "./Bottom.module.scss";
import { fetchGetCommentByArtId } from "~/services/commentService";
import { fetchGetReplyCommentByCommentId } from "~/services/replyCommentService";
import {
  fetchGetReactionByUserIdAndArtId,
  fetchGetReactionLength,
} from "~/services/artService";

const cx = classNames.bind(styles);
const validReactions = ["Love", "Haha", "Thank", "GoodIdea", "Wow"];
function Bottom({
  userData,
  pinInformation,
  setListComments,
  setLoadingShowListComment,
  countComment,
  setCountComment,
}) {
  const textareaRef = useRef(null);

  const [inputComment, setInputComment] = useState("");
  const [textareaRows, setTextareaRows] = useState(1);

  const [selectedReaction, setSelectedReaction] = useState(null);
  const [countReaction, setCountReaction] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);

  useEffect(() => {
    let timeout;

    if (mouseIsOver) {
      timeout = setTimeout(() => {
        setShowReactions(true);
      }, 800);
    } else {
      clearTimeout(timeout);
      setShowReactions(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [mouseIsOver, setShowReactions]);

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
  }, [inputComment]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reactionResponse = await fetchGetReactionByUserIdAndArtId(
          pinInformation._id,
          userData._id
        );
        if (reactionResponse) {
          setSelectedReaction(reactionResponse.reaction);
        }
      } catch (error) {
        console.error("Error fetching reaction information:", error);
      }
    };

    fetchData();
  }, [pinInformation._id, userData._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reactionResponse = await fetchGetReactionLength(
          pinInformation._id
        );
        if (reactionResponse) {
          setCountReaction(reactionResponse.reactionLength);
        }
      } catch (error) {
        console.error("Error fetching reaction information:", error);
      }
    };

    fetchData();
  }, [pinInformation._id]);

  const handleCommentChange = (e) => {
    setInputComment(e.target.value);
  };

  const handleReactionClick = (reactionContent) => {
    if (selectedReaction !== reactionContent) {
      const previousReaction = selectedReaction;
      setSelectedReaction(reactionContent);
      const reactionData = {
        userId: userData._id,
        reaction: reactionContent,
      };
      updateReactionCount(previousReaction, reactionContent);
      callApiAddReaction(pinInformation._id, reactionData, previousReaction);
    }
  };

  const handleDefaultClickReaction = () => {
    if (validReactions.includes(selectedReaction)) {
      setSelectedReaction(null);
      const reactionData = {
        userId: userData._id,
        reaction: null,
      };
      setCountReaction((prev) => prev - 1);
      callApiAddReaction(pinInformation._id, reactionData);
    } else {
      setSelectedReaction("Love");
      const reactionData = {
        userId: userData._id,
        reaction: "Love",
      };

      const previousReaction = selectedReaction;
      updateReactionCount(previousReaction, "Love");

      callApiAddReaction(pinInformation._id, reactionData);
    }
  };

  const handleSendComment = () => {
    const commentData = {
      artId: pinInformation._id,
      author: {
        userId: userData._id,
        userName: userData.userName,
        avatar: userData.avatar,
      },
      commentContent: inputComment,
    };
    api
      .post(`/comment/post`, commentData)
      .then((response) => {
        setInputComment("");
        callApiGetAllComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const callApiGetAllComments = async () => {
    setLoadingShowListComment(true);
    try {
      const comments = await fetchGetCommentByArtId(pinInformation._id);
      const countTopLevelComments = comments.length;

      const replyCounts = await Promise.all(
        comments.map((comment) =>
          callApiGetReplyCommentByCommentId(comment._id)
        )
      );

      const countReplyComments = replyCounts.reduce(
        (total, count) => total + count,
        0
      );

      const totalCountComments = countTopLevelComments + countReplyComments;

      setListComments(comments);
      setCountComment(totalCountComments);
      setLoadingShowListComment(false);
    } catch (error) {
      console.error("Error fetching creator information:", error);
    }
  };

  const callApiGetReplyCommentByCommentId = async (commentId) => {
    try {
      const replyResponse = await fetchGetReplyCommentByCommentId(commentId);
      return replyResponse.length;
    } catch (error) {
      console.error(`Error fetching replies for comment ${commentId}:`, error);
      return 0;
    }
  };

  const handleKeyDownComment = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const callApiAddReaction = (artId, reactionData) => {
    api
      .post(`/art/add-reaction/${artId}`, reactionData)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const updateReactionCount = (previousReaction, newReaction) => {
    if (previousReaction) {
      setCountReaction((prev) => prev - 1);
    }
    if (newReaction) {
      setCountReaction((prev) => prev + 1);
    }
  };

  return (
    <div className={cx("interact")}>
      <div className={cx("comment-reaction")}>
        {countComment > 0 ? (
          <div className={cx("number-of-comments")}>
            {countComment} {countComment > 1 ? "Comments" : "Comment"}
          </div>
        ) : (
          <div className={cx("number-of-comments")}>What do you think?</div>
        )}

        <div className={cx("reaction-container")}>
          <div className={cx("number-of-reactions")}>
            {countReaction > 0 && (
              <div className={cx("list-icon")}>
                <img src={Love} alt="icon" className={cx("icon-love")} />
                <img src={Haha} alt="icon" className={cx("icon-haha")} />
                <img src={Wow} alt="icon" className={cx("icon-wow")} />
              </div>
            )}
            <div className={cx("number")}>
              {countReaction > 0 && countReaction}
            </div>
          </div>
          <div
            className={cx("interact-react")}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            onClick={handleDefaultClickReaction}
          >
            <ReactionUI selectedReaction={selectedReaction} />
            {showReactions && (
              <Reaction
                setMouseIsOver={setMouseIsOver}
                handleReactionClick={handleReactionClick}
              />
            )}
          </div>
        </div>
      </div>
      <div className={cx("input-comment")}>
        <div className={cx("user-avatar")}>
          <img
            src={userData.avatar && userData.avatar}
            alt="user-avt"
            className={cx("avatar")}
          />
        </div>
        <div className={cx("input-container")}>
          <textarea
            className={cx("input")}
            placeholder="Add a comment"
            onChange={handleCommentChange}
            onKeyDown={handleKeyDownComment}
            value={inputComment}
            rows={textareaRows}
            ref={textareaRef}
            autoFocus={true}
            spellCheck={false}
          ></textarea>
          {inputComment !== "" && (
            <div className={cx("send-comment-container")}>
              <div
                className={cx("send-comment-btn")}
                onClick={handleSendComment}
              >
                <i className={cx("fa-solid fa-paper-plane-top", "icon")}></i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bottom;
