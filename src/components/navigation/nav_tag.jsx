import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';

const NavTag = ({ Icon, Tag, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li className={`transition ease-in-out hover:bg-gray-300 hover:text-[#333] dark:hover:bg-gray-700 dark:hover:text-[#fff] ${isActive ? 'bg-gray-300 text-[#333] dark:bg-gray-700 dark:text-[#fff]' : ''}`}>
            <Link to={to} className='flex flex-row items-center justify-start gap-[12px] w-[100%] h-[28px] px-[12px]'>
                <div className='flex justify-center items-center size-5'>
                    <FontAwesomeIcon icon={Icon} className='text-[16px]' />
                </div>
                <span className='hidden lg:block'>{Tag}</span>
            </Link>
        </li>
    );
};

export default NavTag;