import React, { useEffect, useState } from "react";
import NavTag from "./nav_tag";
import ListNavTag from "./listnav_tag";
import { faFire, faMessage, faTag, faGlobe, faUsers, faLink, faHistory, faFile, faCommentDots, faComments, faTachometerAlt, faClipboardCheck, faFolderOpen, faUserShield, faBell } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import './nav.css';
import axios from 'axios';

const NavigationBar = () => {
    const [user, setUser] = useState(null);
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

    return (
        <aside className='w-[15.8%] h-[100vh] fixed left-0 z-49'>
            <div className='max-w-[190px] flex flex-col overflow-x-hidden overflow-y-auto h-full no-scrollbar pt-[32px] pb-[16px] text-gray-600 dark:text-[#a8b3cf] border-r-[1px] border-gray-700 text-[14px] gap-[20px]'>
                <ul>
                    <NavTag Icon={faFire} Tag='My Feed' to="/" />
                    <NavTag Icon={faMessage} Tag='Custom Feed' to="/customfeed" />
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