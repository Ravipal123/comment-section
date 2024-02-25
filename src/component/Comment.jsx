import { useState } from "react";
import CommentForm from "./CommentForm";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

const Comment = ({comment,replies,setActiveComment,activeComment,updateComment,deleteComment,addComment,parentId = null,
  currentUserId,
}) => {

  const isEditing = activeComment && activeComment.id === comment.id && activeComment.type === "editing";
  const isReplying = activeComment && activeComment.id === comment.id && activeComment.type === "replying";
  const canReply = Boolean(currentUserId);
  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();
    const [show, setshow] = useState(<FaRegBookmark/>)

    return (
        <div key={comment.id} className="comment">
        <div className="comment-image-container">
            <img width='40px' height='40px' src="http://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png" />
        </div>
        <div className="comment-right-part">
            <div className="comment-content">
            <div className="comment-author">{comment.username}</div>
            <div>{createdAt}</div>
            </div>
            {!isEditing && <div className="comment-text">{comment.body}</div>}
            {isEditing && (
            <CommentForm
                submitLabel="Update"
                hasCancelButton
                initialText={comment.body}
                handleSubmit={(text) => updateComment(text, comment.id)}
                handleCancel={() => {
                setActiveComment(null);
                }}
            />
            )}
            <div className="comment-actions">
            {canReply && (
                <div
                className="comment-action"
                onClick={() =>
                    setActiveComment({ id: comment.id, type: "replying" })
                }
                >
                Reply
                </div>
            )}
            
                <div
                className="comment-action"
                onClick={() =>
                    setActiveComment({ id: comment.id, type: "editing" })
                }
                >
                Edit
                </div>
            
            
                <div
                className="comment-action"
                onClick={() => deleteComment(comment.id)}
                >
                Delete
                </div>
                <button 
                    className="marked-button"
                    onClick={() => setshow(!show)}>
                    {show ? <FaRegBookmark/> : <FaBookmark/>}
                </button>
                
                
            
            </div>
            {isReplying && (
            <CommentForm
                submitLabel="Reply"
                handleSubmit={(text) => addComment(text, replyId)}
            />
            )}
            
            {replies.length > 0 && (
            <div className="replies">
                {replies.map((reply) => (
                <Comment
                    comment={reply}
                    key={reply.id}
                    setActiveComment={setActiveComment}
                    activeComment={activeComment}
                    updateComment={updateComment}
                    deleteComment={deleteComment}
                    addComment={addComment}
                    parentId={comment.id}
                    replies={[]}
                    currentUserId={currentUserId}
                />
                
                ))}
            </div>
            )}
        </div>
        </div>
    );
};

export default Comment;
