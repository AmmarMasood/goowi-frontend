import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * LazyLoadPosts Component
 *
 * A full-screen component that displays posts and implements infinite scrolling
 * to fetch more posts when the user reaches the bottom of the page.
 *
 * @param {Object} props
 * @param {Array} props.initialPosts - Initial array of posts to display
 * @param {Function} props.fetchMorePosts - Callback function to fetch more posts
 * @param {Boolean} props.hasMore - Whether there are more posts to fetch
 * @param {Number} props.threshold - Distance from bottom (px) to trigger loading (default: 200)
 * @param {Component} props.LoadingIndicator - Custom loading indicator component
 * @param {Component} props.PostComponent - Custom component to render each post
 */
const LazyLoadPosts = ({
  initialPosts = [],
  fetchMorePosts,
  hasMore = true,
  threshold = 200,
  LoadingIndicator = DefaultLoadingIndicator,
  PostComponent = DefaultPostComponent,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);

  // Load more posts handler
  const loadMorePosts = useCallback(async () => {
    if (!loading && hasMore) {
      try {
        setLoading(true);
        const newPosts = await fetchMorePosts();
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error loading more posts");
        setLoading(false);
      }
    }
  }, [loading, hasMore, fetchMorePosts]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { rootMargin: `0px 0px ${threshold}px 0px` }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMorePosts, hasMore, threshold]);

  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <PostComponent key={post.id || index} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No posts to display</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                loadMorePosts();
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={observerTarget} className="h-4 w-full my-4"></div>

        {loading && <LoadingIndicator />}
      </div>
    </div>
  );
};

// Default components if custom ones aren't provided

const DefaultLoadingIndicator = () => (
  <div className="flex justify-center items-center py-6">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const DefaultPostComponent = ({ post }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
    {post.image && (
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 object-cover rounded-md mb-4"
        loading="lazy"
      />
    )}
    <p className="text-gray-600">{post.content}</p>
    {post.author && (
      <div className="mt-4 flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-8 w-8 rounded-full"
              loading="lazy"
            />
          ) : (
            post.author.name.charAt(0)
          )}
        </div>
        <span className="ml-2 text-sm text-gray-500">{post.author.name}</span>
      </div>
    )}
  </div>
);

export default LazyLoadPosts;
