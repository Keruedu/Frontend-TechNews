import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserCard from '../card/usercard.jsx';
import DatePost from '../card/datepost.jsx';
import Tag from '../card/tag.jsx';
import ControlCard from '../card/controlcard.jsx';
import UserComment from '../comment/user_comment.jsx';
import ListComment from '../comment/listcomment.jsx';
import { API_ENDPOINTS } from '../../config';

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentId, setNewCommentId] = useState(null); // Theo dõi comment mới

    useEffect(() => {
        // Fetch post data
        fetch(`${API_ENDPOINTS.POSTS}/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setPost(data.data);
                } else {
                    console.error('Error fetching post:', data.message);
                }
            })
            .catch((error) => console.error('Error fetching post:', error));

        // Fetch comments
        fetch(`${API_ENDPOINTS.POSTS}/${id}/comments`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setComments(data.data);
                } else {
                    console.error('Error fetching comments:', data.message);
                }
            })
            .catch((error) => console.error('Error fetching comments:', error));
    }, [id]);

    const addComment = (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
        setNewCommentId(newComment._id); // Gắn ID của comment mới
        setTimeout(() => setNewCommentId(null), 2000); // Reset hiệu ứng sau 2 giây
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const {
        title,
        content,
        thumbnail,
        authorId,
        categoryId,
        tagsId,
        createdAt,
        upvotesCount,
        totalCommentsCount,
    } = post;

    return (
        <div className="flex flex-row md:w-4/5 w-full px-10 text-black dark:text-white text-lg">
            <main className="flex flex-col pt-8 px-8 border-x border-gray-300 dark:border-gray-700 w-full gap-4">
                <div className="relative rounded-xl overflow-hidden">
                    <img src={thumbnail} alt="Post Thumbnail" className="w-full h-72 object-cover" />
                </div>
                <UserCard
                    Image={authorId.profile.avatar}
                    Name={authorId.profile.name}
                    Username={authorId.username}
                    Organization={categoryId.name}
                    userId={authorId._id}
                />
                <div className="text-gray-600 dark:text-gray-400">
                    <DatePost Data={createdAt} PostStyle={true} />
                </div>
                <h1 className="text-3xl font-bold mt-6">{title}</h1>
                <div className="flex flex-wrap gap-2">
                    {tagsId.map((tag) => (
                        <Tag
                            key={tag._id}
                            tagName={`#${tag.name}`}
                            PostStyle={true}
                            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                        />
                    ))}
                </div>
                <div
                    className="main-container ck-content w-full mt-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className="flex flex-col mt-6">
                    <ControlCard
                        vote={upvotesCount}
                        comment={totalCommentsCount}
                        PostStyle={true}
                        postId={id}
                    />
                </div>
                <UserComment postId={id} addComment={addComment} />
                <ListComment
                    comments={comments}
                    newCommentId={newCommentId} // Truyền ID comment mới để kích hoạt hiệu ứng
                />
            </main>
        </div>
    );
};

export default Post;
