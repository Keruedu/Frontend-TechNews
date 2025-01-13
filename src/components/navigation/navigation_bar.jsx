import React, { useEffect, useState } from "react";
import NavTag from "./nav_tag";
import ListNavTag from "./listnav_tag";
import { faFire, faMessage, faTag, faGlobe, faUsers, faLink, faHistory, faFile, faCommentDots, faComments, faTachometerAlt, faClipboardCheck, faFolderOpen, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import './nav.css'
import HamburgerMenu from "./HamburgerMenu";

const NavigationBar = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { tag: 'My Feed', icon: faFire, to: '/' },
        ...(user && (user.role === 'ADMIN' || user.role === 'MANAGER') ? [
            ...(user.role === 'ADMIN' ? [{ tag: 'Dashboard', icon: faTachometerAlt, to: '/admin/dashboard' }] : []),
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
        <aside className={`fixed left-0 z-49 w-fit h-full border-r border-gray-700 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
                    <ListNavTag Name='Tags' Array={[{ tag: 'Tags', icon: faTag, to: '/tags' }, { tag: 'Categories', icon: faFolderOpen, to: '/categories' }]} />
                    <ListNavTag Name='Activity' Array={[{ tag: 'Bookmarks', icon: faBookmark, to: '/bookmarks' }, { tag: 'History', icon: faHistory, to: '/history' }]} />
                    <ListNavTag Name='' Array={[{ tag: 'Docs', icon: faFile, to: '/docs' }, { tag: 'Changelog', icon: faLink, to: '/changelog' }]} />
                </ul>
            </div>
        </aside>
    );
};

export default NavigationBar;