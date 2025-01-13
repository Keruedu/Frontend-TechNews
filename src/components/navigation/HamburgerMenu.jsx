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
        </div>
    );
};

export default HamburgerMenu;