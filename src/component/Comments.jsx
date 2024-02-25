import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../api";

const Comments = ({ commentsUrl, currentUserId }) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  const rootComments = sortBy === "newest"
    ? backendComments.filter((comment) => comment.parentId === null)
    : backendComments
        .filter((comment) => comment.parentId === null)
        .sort((a, b) => {
          if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0; // Default for invalid sort criteria
        });

        const getReplies = (commentId) =>
        backendComments
          .filter((comment) => comment.parentId === commentId)
          .sort((a, b) => {
            if (sortBy === "newest") {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortBy === "oldest") {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0; // Default for invalid sort criteria
          });
    
    const addComment = (text, parentId) => {
        createCommentApi(text, parentId).then((comment) => {
        setBackendComments([comment, ...backendComments]);
        setActiveComment(null);
        });
    };

    const updateComment = (text, commentId) => {
        updateCommentApi(text).then(() => {
        const updatedBackendComments = backendComments.map((backendComment) => {
            if (backendComment.id === commentId) {
            return { ...backendComment, body: text };
            }
            return backendComment;
        });
        setBackendComments(updatedBackendComments);
        setActiveComment(null);
        });
    };
    const deleteComment = (commentId) => {
        if (window.confirm("Are you sure you want to remove comment?")) {
        deleteCommentApi().then(() => {
            const updatedBackendComments = backendComments.filter(
            (backendComment) => backendComment.id !== commentId);
            setBackendComments(updatedBackendComments);
        });
        }
    };

    useEffect(() => {
        getCommentsApi().then((data) => {
            setBackendComments(data);
        });
    }, []);

    const handleSortComments = (event) => {
        setSortBy(event.target.value);
    };

    const sortComments = (comments) => {
        switch (sortBy) {
          case "most_replies":
            return comments.slice().sort((a, b) => getReplies(b.id).length - getReplies(a.id).length);
          case "least_replies":
            return comments.slice().sort((a, b) => getReplies(a.id).length - getReplies(b.id).length);
          default:
            return comments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    };

    return (
        <div className="comments">
        <h3 className="comments-title">Comments</h3>
        <div className="comment-form-title">Write comment</div>
        <CommentForm submitLabel="POST" handleSubmit={addComment} />
        <div className="comment-sort">
            <button onClick={handleSortComments}>Sort By:</button>
            <select value={sortBy} onChange={handleSortComments}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_replies">Most Replies</option>
            <option value="least_replies">Least Replies</option>
            </select>
        </div>
        <div className="comments-container">
            {sortComments(rootComments).map((rootComment) => (
                <Comment
                    key={rootComment.id}
                    comment={rootComment}
                    replies={getReplies(rootComment.id)}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    addComment={addComment}
                    deleteComment={deleteComment}
                    updateComment={updateComment}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
        </div>
    );
};

export default Comments;
