import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CommunityPost {
  _id: string;
  title: string;
  text: string;
  author: {
    name: string;
  };
  createdAt: string;
  likeCount: number;
  commentCount: number;
  tags: string[];
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', text: '' });
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/community');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/community', newPost);
      setNewPost({ title: '', text: '' });
      setShowNewPost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect with fellow learners and share your journey.</p>
        </div>
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="btn btn-primary"
        >
          New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="card mb-8">
          <h2 className="card-title mb-4">Create New Post</h2>
          <form onSubmit={handleSubmitPost}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="What's your post about?"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={newPost.text}
                onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                placeholder="Share your thoughts, questions, or experiences..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewPost(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>By {post.author.name}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{post.text}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <button className="flex items-center space-x-1 hover:text-primary-600">
                  <span>❤️</span>
                  <span>{post.likeCount}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-primary-600">
                  <span>💬</span>
                  <span>{post.commentCount}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
