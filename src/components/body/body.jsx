import React from 'react';
import ListContentCard from './listcontentcard.jsx';
import NavigantionBar from '../navigation/navigation_bar.jsx';
import Header from '../header/header.jsx';
//Notification when user comment on post
const Body = ({content = <ListContentCard/>}) => {
    return (
        <>
            <Header/>
            <main className='flex justify-end flex-row w-[100%]'> 
                <NavigantionBar />
                {content}
            </main>
        </>

    );
}

export default Body;