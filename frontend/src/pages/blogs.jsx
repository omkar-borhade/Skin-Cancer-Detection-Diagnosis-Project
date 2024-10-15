// src/pages/Blogs.js
import React from 'react';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Skin Cancer: A Comprehensive Guide',
      excerpt: 'This blog post provides an in-depth look at skin cancer, its causes, symptoms, and prevention methods.',
      date: '2024-10-01',
      link: '/blogs/understanding-skin-cancer'
    },
    {
      id: 2,
      title: 'The Importance of Early Detection in Skin Cancer',
      excerpt: 'Learn why early detection of skin cancer is crucial for effective treatment and better outcomes.',
      date: '2024-10-05',
      link: '/blogs/importance-of-early-detection'
    },
    {
      id: 3,
      title: 'Skin Cancer Treatment Options: What You Need to Know',
      excerpt: 'Explore the various treatment options available for skin cancer and what to expect during treatment.',
      date: '2024-10-10',
      link: '/blogs/skin-cancer-treatment-options'
    },
    // Add more blog posts as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">
              <a href={post.link} className="text-blue-600 hover:underline">{post.title}</a>
            </h2>
            <p className="text-gray-700 mb-4">{post.excerpt}</p>
            <p className="text-gray-500 text-sm">{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
