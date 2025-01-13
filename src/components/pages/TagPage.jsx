import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tag from '../card/tag.jsx';

const TagPage = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tags', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTags(response.data.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="container w-full md:w-[84.2%] border m-4 p-4 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Tags</h1>
      <div className="flex flex-row flex-wrap gap-4">
        {tags.map(tag => (
          <Tag key={tag._id} tagName={tag.name} Link={`/tag/${tag._id}`} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;