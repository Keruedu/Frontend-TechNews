import React from 'react';
import ControlCardCommmet from './controlcard_comment.jsx';

const Comment = ({ Name, Image, Upvote, Date, Content }) => {
    return (
        <div className='flex flex-col gap-[12px] p-[16px] text-[15px] rounded-[24px] border-[1px] text-black dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 transition ease-in-out'>
            <div className='flex flex-row items-center gap-[6px]'>
                <div className='size-10 rounded-[12px] flex justify-center items-center'>
                    <img className='rounded-full' src={Image} alt='User Avatar' />
                </div>
                <div className='flex flex-col'>
                    <span className='font-bold'>{Name}</span>
                    <span className='text-gray-500'>@{Name}- <span>{Date}</span></span>
                </div>
            </div>
            <span>{Content}</span>
            {/* <div className='flex flex-row justify-between items-center mt-[8px]'>
                <ControlCardCommmet />
                <button className='text-gray-700 dark:text-gray-400'>{Upvote} upvotes</button>
            </div> */}
        </div>
    );
};

export default Comment;