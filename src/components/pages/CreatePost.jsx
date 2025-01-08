import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm.jsx';

const CreatePost = () => {
    const navigate = useNavigate();

    const handlePostSubmit = () => {
        // Logic after post creation
        console.log('Post created successfully');
        navigate('/');
    };

    return (
        <PostForm onSubmit={handlePostSubmit} />
    );
};

export default CreatePost;