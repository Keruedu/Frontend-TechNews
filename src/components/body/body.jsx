import React, { useEffect, useState } from "react";
import ListContentCard from './listcontentcard.jsx';
import NavigantionBar from '../navigation/navigation_bar.jsx';
import Header from '../header/header.jsx';
import { faFire, faMessage, faTag, faGlobe, faUsers, faLink, faHistory, faFile, faCommentDots, faComments, faTachometerAlt, faClipboardCheck, faFolderOpen, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
//Notification when user comment on post
const Body = ({content = <ListContentCard/>}) => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);
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
        <>
            <Header navItems={navItems} />
            <main className='flex justify-end flex-row w-[100%]'> 
                <NavigantionBar />
                {content}
            </main>
        </>

    );
}

export default Body;