import React, { useState, useEffect } from 'react';
import Techlogo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import SquareButton from '../button/squarebutton.jsx';
import ProfileButton from '../button/profilebutton.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import ListNavTag from '../navigation/listnav_tag.jsx';

const Header = ({ navItems }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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
                <div className='md:hidden'>
                    <button onClick={toggleMenu} className="p-2 text-gray-600 dark:text-white">
                        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                    </button>
                </div>
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50 md:hidden">
                        <ul className="flex flex-col p-4">
                            {navItems.map((item) => (
                                <li key={item.tag} className="py-2 px-3">
                                    <Link to={item.to} className="text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                        <FontAwesomeIcon icon={item.icon} className="mr-2" />
                                        {item.tag}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;