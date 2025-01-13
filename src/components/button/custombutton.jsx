import React from 'react';

// #a8b3cf
const CustomButton = ({ content, width='w-fit', white = false, px = 'px-[16px]', py = 'py-[8px]'}) => {
    return (
        <>
            {white ? (
                <button 
                className={`flex justify-center flex-row items-center rounded-xl transition ease-in-out bg-slate-100 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-400 dark:hover:text-[#333] text-[#A8B3CF] hover:bg-gray-800 hover:text-white text-[18px] ${width} ${px} ${py} gap-[10px]`} 
            >
                    {content}
                </button>
            ) : (
                <button 
                className={`flex justify-center flex-row items-center rounded-xl transition ease-in-out bg-slate-100 text-gray-700 hover:bg-gray-300 hover:text-[#333] dark:bg-[#1c1f26] dark:text-[#A8B3CF] dark:hover:bg-gray-800 dark:hover:text-white text-[18px] ${width} ${px} ${py} gap-[10px]`} 
            >
                    {content}
                </button>
            )}
        </>
    );
};

export default CustomButton;