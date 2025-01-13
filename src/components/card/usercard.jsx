import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUpdatedUser } from '../api/user';

const UserCard = ({ Image, Name, Username, Organization, userId }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);

    const handleNavigate = () => { 
        navigate(`/user/${Username}`); 
        console.log('To User');
    };

    useEffect(() => {
        if (user && user.following.includes(userId)) {
            setIsFollowing(true);
        }
    }, [userId, user]);

    const handleFollow = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:4000/api/users/${userId}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setIsFollowing(!isFollowing);
                const result = await fetchUpdatedUser(user._id);
                if (!result.success) {
                    console.error('Error fetching updated user data:', result.message);
                }
            } else {
                console.error('Error following the user:', response.statusText);
            }
        } catch (error) {
            console.error('Error following the user:', error);
        }
    };

    return (
        <button 
            className='flex flex-row p-[8px] justify-between items-center gap-3 text-[16px] text-gray-500 dark:text-white border-[1px] border-gray-200 rounded-[16px] w-full md:w-auto' 
        >
            <div className='flex flex-row justify-center items-center gap-[10px]'
                onClick={handleNavigate}>
                <button className='w-[50px] h-[50px] md:w-[40px] md:h-[40px] rounded-full flex justify-center items-center'>
                    <img className='rounded-full w-full h-full object-cover' src={Image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt='User Avatar' />
                </button>
                <div className='flex flex-col items-center md:items-start'>
                    <span className='text-black dark:text-white font-bold'>{Name}</span>
                    <span className='text-[12px] text-left'>@{Username}</span>
                </div>
            </div>
            <button
                className={`mt-2 md:mt-0 h-[32px] transition ease-in-out px-[12px] flex items-center border-[1px] font-bold border-black dark:border-white text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-900 rounded-[8px] ${isFollowing ? 'bg-blue-700 text-blue-200' : ''}`}
                onClick={handleFollow}
                disabled={user && user._id === userId} // Disable the button if user._id matches userId
            >
                {user && user._id === userId ? 'Your Profile' : isFollowing ? 'Following' : 'Follow'}
            </button>
        </button>
    );
};

export default UserCard;