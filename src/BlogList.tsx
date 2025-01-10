import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

interface Blog {
  id: number;
  title: string;
  content: string | Array<{ type: string; content: string }>;
  image_path?: string;
  created_at: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<Blog[]>(`${process.env.REACT_APP_API_BASE_URL_BLOG}/api/bloglist`);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blog posts. Please try again later.');
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatTitleForUrl = (title: string): string => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  const getContentPreview = (content: string | Array<{ type: string; content: string }>): string => {
    if (Array.isArray(content)) {
      const textContent = content.find(item => item.type === 'text');
      if (textContent) {
        const sanitizedContent = DOMPurify.sanitize(textContent.content, { ALLOWED_TAGS: [] });
        return sanitizedContent.substring(0, 100) + '...';
      }
    } else if (typeof content === 'string') {
      const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
      return sanitizedContent.substring(0, 100) + '...';
    }
    return 'No preview available';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! An Error Occurred</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12 tracking-tight">
          Our Latest Blog Posts
        </h1>
        {blogs.length === 0 ? (
          <p className="text-center text-white text-xl">No blog posts found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/title/${formatTitleForUrl(blog.title)}`} className="block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2">
                    {blog.image_path && (
                      <img 
                        className="h-48 w-full object-cover" 
                        src={`${process.env.REACT_APP_MEDIA_BASE_URL}${blog.image_path}`} 
                        alt={blog.title} 
                      />
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-3 hover:text-pink-500 transition duration-300">{blog.title}</h2>
                      <p className="text-gray-600 mb-4">
                        {getContentPreview(blog.content)}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-5 w-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;