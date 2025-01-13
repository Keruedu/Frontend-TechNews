import React, { useEffect, useState } from "react";
import NavTag from "./nav_tag";
import ListNavTag from "./listnav_tag";
import { faFire, faMessage, faTag, faGlobe, faUsers, faLink, faHistory, faFile, faCommentDots, faComments, faTachometerAlt, faClipboardCheck, faFolderOpen, faUserShield, faBell } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import './nav.css'
import HamburgerMenu from "./HamburgerMenu";
import axios from 'axios';

const NavigationBar = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:4000/api/notifications/${userData._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUnreadCount(response.data.data.filter(notification => !notification.isRead).length);
            } catch (error) {
                console.error('Error fetching unread notifications count:', error);
            }
        };

        if (userData) {
            fetchUnreadCount();
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { tag: 'My Feed', icon: faFire, to: '/' },
        ...(user && (user.role === 'ADMIN' || user.role === 'MANAGER') ? [
            { tag: 'Review Posts', icon: faClipboardCheck, to: '/admin/review-posts' },
            { tag: 'Manage Categories', icon: faFolderOpen, to: '/admin/manage-categories' },
            ...(user.role === 'ADMIN' ? [{ tag: 'Manage Accounts', icon: faUserShield, to: '/admin/manage-accounts' }] : [])
        ] : []),
        { tag: 'My Post', icon: faUsers, to: '/mypost' },
        { tag: 'Tag', icon: faTag, to: '/tag' },
        { tag: 'Category', icon: faFolderOpen, to: '/category' },
        { tag: 'Bookmarks', icon: faBookmark, to: '/bookmarks' },
        { tag: 'History', icon: faHistory, to: '/history' },
        { tag: 'Docs', icon: faFile, to: '/docs' },
        { tag: 'Changelog', icon: faLink, to: '/changelog' }
    ];

    return (
        <aside className={`fixed left-0 z-49 h-full border-r border-gray-700 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className='flex flex-col h-full pt-8 pb-4 text-gray-600 dark:text-[#a8b3cf] text-[14px] gap-4'>
                {/* <HamburgerMenu navItems={navItems} isOpen={isMenuOpen} toggleMenu={toggleMenu} /> */}
                <ul className={`flex flex-col gap-4 ${isMenuOpen ? 'block' : 'hidden'} md:flex`}>
                    <NavTag Icon={faFire} Tag='My Feed' to="/" />
                    {user && (user.role === 'ADMIN' || user.role === 'MANAGER') && (
                        <ListNavTag Name='Admin' Array={[
                            ...(user.role === 'ADMIN' ? [{ tag: 'Dashboard', icon: faTachometerAlt, to: '/admin/dashboard' }] : []),
                            { tag: 'Review Posts', icon: faClipboardCheck, to: '/admin/review-posts' },
                            { tag: 'Manage Categories', icon: faFolderOpen, to: '/admin/manage-categories' },
                            ...(user.role === 'ADMIN' ? [{ tag: 'Manage Accounts', icon: faUserShield, to: '/admin/manage-accounts' }] : [])
                        ]} />
                    )}
                    <ListNavTag Name='Posts' Array={[{ tag: 'My Post', icon: faUsers, to: '/mypost' }]} />
                    <ListNavTag Name='Tags' Array={[{ tag: 'Tag', icon: faTag, to: '/tag' }, { tag: 'Category', icon: faFolderOpen, to: '/category' }]} />
                    <ListNavTag Name='Activity' Array={[{ tag: 'Bookmarks', icon: faBookmark, to: '/bookmarks' }, { tag: 'History', icon: faHistory, to: '/history' }]} />
                    <ListNavTag Name='' Array={[{ tag: 'Docs', icon: faFile, to: '/docs' }, { tag: 'Changelog', icon: faLink, to: '/changelog' }]} />
                </ul>
                {user && (user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <ListNavTag Name='Admin' Array={[
                        { tag: 'Review Posts', icon: faClipboardCheck, to: '/admin/review-posts' },
                        { tag: 'Manage Categories', icon: faFolderOpen, to: '/admin/manage-categories' },
                        ...(user.role === 'ADMIN' ? [{ tag: 'Manage Accounts', icon: faUserShield, to: '/admin/manage-accounts' }] : [])
                    ]} />
                )}
                <ul>
                    <NavTag Icon={faBell} Tag='Notifications' to="/notifications">
                        {unreadCount > 0 && <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>}
                    </NavTag>
                </ul>
                <ListNavTag Name='Posts' Array={[{ tag: 'My Post', icon: faUsers, to: '/mypost' }]} />
                <ListNavTag Name='Tags' Array={[{ tag: 'Tag', icon: faTag, to: '/tag' }, { tag: 'Category', icon: faFolderOpen, to: '/category' }]} />
                <ListNavTag Name='Activity' Array={[{ tag: 'Bookmarks', icon: faBookmark, to: '/bookmarks' }, { tag: 'History', icon: faHistory, to: '/history' }]} />
                <ListNavTag Name='' Array={[{ tag: 'Docs', icon: faFile, to: '/docs' }, { tag: 'Changelog', icon: faLink, to: '/changelog' }]} />
            </div>
        </aside>
    );
};

export default NavigationBar;