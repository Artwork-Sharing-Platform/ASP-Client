import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import api from "~/services/apiService";
import { fetchGetReplyCommentByCommentId } from "~/services/replyCommentService";

import styles from "./ReplyCommentInput.module.scss";
import { fetchGetCommentByArtId } from "~/services/commentService";
const cx = classNames.bind(styles);
function ReplyCommentInput({
  userData,
  pinInformation,
  comment,
  showReplyComment,
  setShowReplyComment,
  setListReplyComments,
  setCountComment,
  setLoadingShowListComment,
}) {
  const textareaRef = useRef(null);
  const [replyContent, setReplyContent] = useState("");
  const [textareaRows, setTextareaRows] = useState(1);

  const handleReplyCommentChange = (e) => {
    setReplyContent(e.target.value);
  };

  useEffect(() => {
    if (showReplyComment) {
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
    }
  }, [replyContent, showReplyComment]);

  const handleSendReplyComment = () => {
    const replyCommentData = {
      commentId: comment._id,
      author: {
        userId: userData._id,
        userName: userData.userName,
        avatar: userData.avatar,
      },
      replyContent: replyContent,
    };

    setReplyContent("");
    api
      .post(`/replyComment/post`, replyCommentData)
      .then((response) => {
        setShowReplyComment(false);
        callApiGetAllReplyComments();
        callApiGetAllComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleKeyDownReplyComment = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReplyComment();
    }
  };

  const callApiGetAllReplyComments = async () => {
    try {
      const commentList = await fetchGetReplyCommentByCommentId(comment._id);
      setListReplyComments(commentList);
    } catch (error) {
      console.error("Error fetching creator information:", error);
    }
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

  return (
    <div className={cx("reply-input")}>
      <div className={cx("comment-input")}>
        <textarea
          className={cx("input")}
          placeholder="Reply"
          onChange={handleReplyCommentChange}
          onKeyDown={handleKeyDownReplyComment}
          value={replyContent}
          rows={textareaRows}
          ref={textareaRef}
          autoFocus={true}
        ></textarea>
      </div>
      <div className={cx("reply-input-action")}>
        <div
          className={cx("cancel-btn")}
          onClick={() => setShowReplyComment(false)}
        >
          Cancel
        </div>
        <button
          className={
            replyContent === ""
              ? cx("save-btn")
              : cx("save-btn", "save-btn-active")
          }
          disabled={replyContent === ""}
          onClick={handleSendReplyComment}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ReplyCommentInput;
