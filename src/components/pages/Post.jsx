import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Techlogo from '../../assets/react.svg';
import Testimage from '../../assets/Testing.jpg';
import Tag from '../card/tag.jsx';
import DatePost from '../card/datepost.jsx';
import ControlCard from '../card/controlcard.jsx';
import Comment from '../comment/comment.jsx';
import UserComment from '../comment/user_comment.jsx';
import ListComment from '../comment/listcomment.jsx';
import UserCard from '../card/usercard.jsx';
import { API_ENDPOINTS } from '../../config';

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Fetch post data by ID
        fetch(`${API_ENDPOINTS.POSTS}/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setPost(data.data);
                } else {
                    console.error('Error fetching post:', data.message);
                }
            })
            .catch(error => console.error('Error fetching post:', error));

        // Fetch comments for the post
        fetch(`${API_ENDPOINTS.POSTS}/${id}/comments`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setComments(data.data);
                } else {
                    console.error('Error fetching comments:', data.message);
                }
            })
            .catch(error => console.error('Error fetching comments:', error));

        // Increase view count
        fetch(`${API_ENDPOINTS.POSTS}/${id}/view`, {
            method: 'PATCH',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console.error('Error increasing view count:', data.message);
            }
        })
        .catch(error => console.error('Error increasing view count:', error));
    }, [id]);

    const addComment = (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
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
        totalCommentsCount
    } = post;

    return (
        <div className='flex flex-row w-[84.2%] px-[130px] text-black dark:text-white font-[17px]'>
            <main className='flex flex-col pt-[32px] px-[32px] border-x-[1px] border-gray-400 dark:border-gray-700 w-[66.5%] gap-[24px]'>
                <span className='text-[32px] font-bold mt-[24px]'>{title}</span>
                {/* <div className='border-l-[1px] border-purple-500 px-[16px] '>
                    <p>
                        <span className='text-purple-500'>TLDR</span> {content}
                    </p>
                </div> */}
                <div className='flex flex-row gap-[10px]'>
                    {tagsId.map((tag) => (
                        <Tag key={tag._id} tagName={`#${tag.name}`} PostStyle={true} />
                    ))}
                </div>
                <div>
                    <DatePost Data={createdAt} PostStyle={true} />
                </div>
                <div className='main-container ck-content' dangerouslySetInnerHTML={{ __html: content }} />
                <div>
                    <img src={thumbnail} alt="" className='rounded-xl' />
                </div>
                <div className='flex flex-col'>
                    <div className='flex flex-row gap-[10px] text-gray-400 my-[10px]'>
                        <span>{upvotesCount} Upvotes</span>
                        <span>{totalCommentsCount} Comments</span>
                    </div>
                    <ControlCard vote={upvotesCount} comment={totalCommentsCount} PostStyle={true} postId={id}/>
                </div>
                
                <UserComment postId={id} addComment={addComment} />
                <ListComment comments={comments} />
            </main>
            <aside className='flex flex-col w-[33.5%] border-r-[1px] border-gray-400 dark:border-gray-700 px-[16px] py-[32px]'>
            <UserCard 
                    Image={authorId.profile.avatar} 
                    Name={authorId.profile.name} 
                    Username={authorId.username} 
                    Organization={categoryId.name}
                    userId={authorId._id}
                />
            </aside>
        </div>
    );
}

export default Post;