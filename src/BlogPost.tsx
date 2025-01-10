import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';

interface BlogContent {
  type: 'text' | 'image' | 'video';
  content: string;
}

interface Blog {
  title: string;
  content: BlogContent[];
  created_at: string;
}

const BlogPost: React.FC = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { title } = useParams<{ title: string }>();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!title) throw new Error('Title is undefined');
        const formattedTitle = title.replace(/-/g, ' ');
        const response = await axios.get<Blog>(`${process.env.REACT_APP_API_BASE_URL_BLOG}/api/blog/title/${encodeURIComponent(formattedTitle)}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to fetch the blog post. Please try again later.');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [title]);

  const renderContent = (block: BlogContent, index: number) => {
    const fadeInVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    switch (block.type) {
      case 'text':
        return (
          <motion.div
            key={index}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
          />
        );
      case 'image':
        return (
          <motion.div
            key={index}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8"
          >
            <img
              src={`${process.env.REACT_APP_MEDIA_BASE_URL}${block.content}`}
              alt="Blog content"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </motion.div>
        );
      case 'video':
        return (
          <motion.div
            key={index}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8"
          >
            <video
              src={`${process.env.REACT_APP_MEDIA_BASE_URL}${block.content}`}
              controls
              className="w-full h-auto rounded-lg shadow-md"
            ></video>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! An Error Occurred</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/blog"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't seem to exist.</p>
          <Link
            to="/blog"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8"
        >
          <Link to="/blog" className="text-pink-600 hover:text-pink-800 mb-6 inline-flex items-center transition duration-300 ease-in-out transform hover:-translate-x-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Blog List
          </Link>
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800 leading-tight">{blog.title}</h1>
          <div className="mb-8 text-sm text-gray-500 flex items-center">
            <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Published on: {new Date(blog.created_at).toLocaleDateString()}
          </div>
          {blog.content.map((block, index) => renderContent(block, index))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;