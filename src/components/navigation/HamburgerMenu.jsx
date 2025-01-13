import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import NavTag from './nav_tag';

const HamburgerMenu = ({ navItems, isOpen, toggleMenu }) => {
    return (
        <div className="relative">
            <button onClick={toggleMenu} className="p-2 text-gray-600 dark:text-white">
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50">
                    <ul className="flex flex-col p-4">
                        {navItems.map((item) => (
                            <NavTag key={item.tag} Icon={item.icon} Tag={item.tag} to={item.to} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;