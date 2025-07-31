import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, claimItem, reset } from '../store/slices/commentSlice';
import './Comments.css';

const Comments = ({ itemId }) => {
  const [newComment, setNewComment] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({
    description: '',
    contact_info: '',
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { comments, isLoading, isError, message } = useSelector((state) => state.comments);

  const itemComments = comments[itemId] || [];

  useEffect(() => {
    if (itemId) {
      dispatch(fetchComments(itemId));
    }
  }, [dispatch, itemId]);

  useEffect(() => {
    if (isError) {
      console.error('Comments error:', message);
    }
    dispatch(reset());
  }, [isError, message, dispatch]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add a comment');
      return;
    }
    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    dispatch(addComment({
      itemId,
      commentData: { content: newComment.trim() }
    }));
    setNewComment('');
  };

  const handleClaimItem = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to claim this item');
      return;
    }
    if (!claimData.description.trim() || !claimData.contact_info.trim()) {
      alert('Please fill in all claim details');
      return;
    }

    dispatch(claimItem({
      itemId,
      claimData
    }));
    setClaimData({ description: '', contact_info: '' });
    setShowClaimForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Comments & Claims</h3>
        <div className="comments-actions">
          {user && (
            <button
              onClick={() => setShowClaimForm(!showClaimForm)}
              className="claim-btn"
            >
              <i className="fas fa-hand-paper"></i>
              {showClaimForm ? 'Cancel Claim' : 'Claim Item'}
            </button>
          )}
        </div>
      </div>

      {/* Claim Form */}
      {showClaimForm && (
        <div className="claim-form">
          <h4>Claim This Item</h4>
          <form onSubmit={handleClaimItem}>
            <div className="form-group">
              <label htmlFor="claimDescription">
                Why do you believe this is your item?
              </label>
              <textarea
                id="claimDescription"
                value={claimData.description}
                onChange={(e) => setClaimData({ ...claimData, description: e.target.value })}
                placeholder="Describe why this item belongs to you..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactInfo">
                Contact Information
              </label>
              <input
                type="text"
                id="contactInfo"
                value={claimData.contact_info}
                onChange={(e) => setClaimData({ ...claimData, contact_info: e.target.value })}
                placeholder="Your phone number or email"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-claim-btn" disabled={isLoading}>
                <i className="fas fa-paper-plane"></i>
                {isLoading ? 'Submitting...' : 'Submit Claim'}
              </button>
              <button
                type="button"
                onClick={() => setShowClaimForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Comment Form */}
      {user && (
        <div className="add-comment-form">
          <form onSubmit={handleAddComment}>
            <div className="comment-input-group">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
              />
              <button type="submit" disabled={isLoading || !newComment.trim()}>
                <i className="fas fa-paper-plane"></i>
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {isLoading && itemComments.length === 0 ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            Loading comments...
          </div>
        ) : itemComments.length === 0 ? (
          <div className="no-comments">
            <i className="fas fa-comment-slash"></i>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          itemComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <i className="fas fa-user-circle"></i>
                  <span>{comment.user_name || comment.username || 'Anonymous'}</span>
                </div>
                <div className="comment-date">
                  {formatDate(comment.created_at)}
                </div>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>

      {!user && (
        <div className="login-prompt">
          <i className="fas fa-info-circle"></i>
          <p>Please login to add comments or claim items.</p>
        </div>
      )}
    </div>
  );
};

export default Comments;