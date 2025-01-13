import React from 'react';
import NavTag from './nav_tag';
import { faBookmark} from '@fortawesome/free-regular-svg-icons';
//array have 2 properties: Icon and Tag
const ListNavTag = ({ Name, Array }) => {
    return (
        <ul className='flex flex-col'>
            <li className='flex items-center px-[12px] text-[12px] font-bold h-[28px]'>{Name}</li>
            {Array.map((item) => (
                <NavTag key={item.tag} Icon={item.icon} Tag={item.tag} to={item.to} />
            ))}
        </ul>
    );
};

export default ListNavTag;