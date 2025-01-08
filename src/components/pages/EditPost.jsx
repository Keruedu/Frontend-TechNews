import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from './PostForm.jsx';
import { API_ENDPOINTS } from '../../config';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.POSTS}/${id}`);
                const result = await response.json();
                if (result.success) {
                    setInitialData(result.data);
                } else {
                    console.error('Error fetching post:', result.message);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handlePostSubmit = () => {
        // Logic after post update
        console.log('Post updated successfully');
        navigate('/mypost');
    };

    if (!initialData) {
        return <div>Loading...</div>;
    }

    return (
        <PostForm postId={id} initialData={initialData} onSubmit={handlePostSubmit} />
    );
};

export default EditPost;