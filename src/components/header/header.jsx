import React, { useState, useEffect } from 'react';
import Techlogo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import SquareButton from '../button/squarebutton.jsx';
import ProfileButton from '../button/profilebutton.jsx';
import ProfileCard from '../card/profilecard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
    }, []);

    return (
        <header className='flex flex-row items-center justify-between sticky top-0 z-50 px-[16px] py-[12px] border-b-[1px] bg-white text-[#333] dark:bg-[#0e1217] dark:text-[#fff] border-gray-700'>
            <a href='/'><img src={Techlogo} alt="Tech logo" className='h-[30px] w-auto' /></a>
            <div className='flex flex-row gap-[12px]'>
                <SquareButton content={
                    <Link to="/create">
                        <FontAwesomeIcon icon={faPlus} className='icon-border' />
                    </Link>
                } />
                <SquareButton content={
                    <Link to="/notifications">
                        <FontAwesomeIcon icon={faBell} className='icon-border' />
                    </Link>
                } />
                {isLoggedIn ? (
                    <ProfileButton />
                ) : (
                    <div className='flex flex-row gap-[12px]'>
                        <Link to="/login">
                            <button className='bg-blue-500 text-white px-4 py-2 rounded'>Sign In</button>
                        </Link>
                        <Link to="/signup">
                            <button className='bg-green-500 text-white px-4 py-2 rounded'>Sign Up</button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;