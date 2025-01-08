import React, { useEffect, useState } from "react";
import NavTag from "./nav_tag";
import ListNavTag from "./listnav_tag";
import { faFire, faMessage, faTag, faGlobe, faUsers, faLink, faHistory, faFile, faCommentDots, faComments, faTachometerAlt, faClipboardCheck, faFolderOpen, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import './nav.css'

const NavigantionBar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    return (
        <aside className='w-[15.8%] h-[100vh] fixed left-0 z-49'>
            <div className='flex flex-col overflow-x-hidden overflow-y-auto h-full no-scrollbar pt-[32px] pb-[16px] text-gray-600 dark:text-[#a8b3cf] border-r-[1px] border-gray-700 text-[14px] gap-[20px]'>
                <ul>
                    <NavTag Icon={faFire} Tag='My Feed' to="/" />
                    <NavTag Icon={faMessage} Tag='Custom Feed' to="/customfeed" />
                </ul>
                {user && user.role === 'ADMIN' && (
                    <ListNavTag Name='Admin' Array={[
                        { tag: 'Dashboard', icon: faTachometerAlt, to: '/admin/dashboard' },
                        { tag: 'Review Posts', icon: faClipboardCheck, to: '/admin/review-posts' },
                        { tag: 'Manage Categories', icon: faFolderOpen, to: '/admin/manage-categories' },
                        { tag: 'Manage Accounts', icon: faUserShield, to: '/admin/manage-accounts' }
                    ]} />
                )}
                <ListNavTag Name='Posts' Array={[{ tag: 'My Post', icon: faUsers, to: '/mypost' }, { tag: 'Public Post', icon: faGlobe, to: '/publicpost' }]} />
                <ListNavTag Name='Tags' Array={[{ tag: 'Explore', icon: faFire, to: '/explore' }, { tag: 'Discussion', icon: faMessage, to: '/discussion' }, { tag: 'Tag', icon: faTag, to: '/tag' }]} />
                <ListNavTag Name='Activity' Array={[{ tag: 'Bookmarks', icon: faBookmark, to: '/bookmarks' }, { tag: 'History', icon: faHistory, to: '/history' }]} />
                <ListNavTag Name='' Array={[{ tag: 'Docs', icon: faFile, to: '/docs' }, { tag: 'Changelog', icon: faLink, to: '/changelog' }, { tag: 'Feedback', icon: faComments, to: '/feedback' }]} />
            </div>
        </aside>
    )
}

export default NavigantionBar;