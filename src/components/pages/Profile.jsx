import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePost from '../card/profilepost';
import { API_ENDPOINTS } from '../../config';

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalViews, setTotalViews] = useState(0);
    const [totalUpvotes, setTotalUpvotes] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchPosts = async () => {
        try {
            if (!user) {
                console.error('User not logged in');
                return;
            }

            const response = await fetch(API_ENDPOINTS.SEARCH_POSTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authorId: user._id })
            });

            const result = await response.json();
            if (result.success) {
                const postsWithAuthorInfo = result.data.map(post => ({
                    ...post,
                    authorAvatar: user.profile.avatar,
                    author: user.username
                }));
                setPosts(postsWithAuthorInfo);

                // Calculate total views and upvotes
                const views = postsWithAuthorInfo.reduce((acc, post) => acc + post.views, 0);
                const upvotes = postsWithAuthorInfo.reduce((acc, post) => acc + post.upvotesCount, 0);
                setTotalViews(views);
                setTotalUpvotes(upvotes);
            } else {
                console.error('Error fetching posts:', result.message);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.USERS}/${user._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.success) {
                setFollowersCount(result.data.followers.length);
                setFollowingCount(result.data.following.length);
            } else {
                console.error('Error fetching user details:', result.message);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchUserDetails();
    }, []);

    return (
        <>
            {loading ? (
                <p className='flex justify-center w-[100%] text-[26px]'>Loading...</p>
            ) : (
                <div class="mx-auto flex flex-row items-stretch pt-0 h-full">
                    <div className="flex flex-col bg-background-primary border-r border-gray-700">
                        <header className="flex h-12 items-center px-4 my-2 pt-4">
                            <h2 className="mr-auto font-bold typo-body">Posts</h2>
                        </header>
                        <div className="flex flex-col gap-4 p-4">
                        {posts.length === 0 ? (
                                <div className="flex flex-col items-center w-full">
                                    <p className="text-gray-500 whitespace-nowrap">You have not posted anything yet.</p>
                                    <button
                                        onClick={() => navigate('/create')}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md transition ease-in-out duration-150 font-bold hover:bg-blue-700"
                                    >
                                        New Post
                                    </button>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <ProfilePost
                                        key={post._id}
                                        title={post.title}
                                        content={post.content}
                                        author={post.author}
                                        createdAt={post.createdAt}
                                        authorAvatar={post.authorAvatar}
                                        postUrl={`/post/${post._id}`}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div class="py-4 flex flex-col gap-6 laptop:my-0 w-full border-r border-gray-700">
                        <header class="flex h-12 items-center px-4 -mb-2">
                            <h2 class="mr-auto font-bold typo-body">Profile</h2>
                            <div class="text-text-tertiary typo-callout">
                                <a href="/edit-profile" class="btn focus-outline inline-flex cursor-pointer select-none flex-row
                items-center border no-underline shadow-none transition
                duration-200 ease-in-out typo-callout justify-center font-bold h-8 px-3 rounded-10 btn-secondary">
                                    Edit profile
                                </a>
                            </div>
                        </header>
                        <div class="relative flex h-24 mx-4">
                            <div class="absolute left-0 top-0 -z-1 size-full rounded-26 bg-background-subtle"></div>
                            <img class="object-cover w-24 h-24 rounded-26 border-4 border-background-default" loading="eager" type="avatar" fetchpriority="auto" alt="mxq's profile" src={user.profile.avatar} />
                        </div>
                        <div class="relative flex flex-col gap-6 px-4">
                            <div class="flex flex-col text-text-quaternary typo-caption2 gap-3">
                                <div class="flex items-center">
                                    <h2 class="max-w-full shrink truncate font-bold text-text-primary typo-title3">{user.profile.name}</h2>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-text-secondary typo-footnote max-w-full shrink truncate">@{user.username}</span>
                                    <span class="mx-1">•</span>
                                    <div class="text-text-quaternary typo-caption2">
                                    Joined&nbsp;<time dateTime="2024-10-30">{new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</time>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center text-text-tertiary typo-footnote">
                                <div class="flex flex-col gap-3">
                                    <div class="flex flex-row gap-2">
                                        <div class="flex items-center gap-1">
                                            <b class="text-text-primary typo-subhead">{followersCount}</b>
                                            <span class="capitalize">Followers</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <b class="text-text-primary typo-subhead">{followingCount}</b>
                                            <span class="capitalize">Following</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <div class="flex items-center gap-1">
                                            <b class="text-text-primary typo-subhead">{totalViews}</b>
                                            <span class="capitalize">Views</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <b class="text-text-primary typo-subhead">{totalUpvotes}</b>
                                            <span class="capitalize">Upvotes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            )}
        </>
    );

};

export default Profile;