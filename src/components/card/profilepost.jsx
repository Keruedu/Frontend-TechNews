import React from "react";
import ControlCard from './controlcard.jsx';

const ProfilePost = ({ title, content, author, createdAt, authorAvatar, postUrl }) => {
    return (
        <div className="group relative w-[40vw] flex flex-col py-6 px-4 border-b border-border-subtlest-tertiary rounded-16 hover:bg-surface-float">

            <a title={title} href={postUrl} className="focus-outline absolute inset-0 block h-full w-full rounded-16"></a>
            <div className="flex flex-col">
                <div className="flex flex-row items-center mb-2">
                    <a className="z-1 ml-2 flex min-w-0 shrink items-center no-underline" href={postUrl}>
                        <img className="object-cover w-10 h-10 rounded-full" loading="lazy" type="avatar" fetchpriority="auto" alt={`${author}'s profile`} src={authorAvatar} />
                    </a>
                    <div className="grid items-center mr-2 flex-1 ml-4">
                        <div className="items-center truncate text-text-tertiary typo-footnote">
                            {author}<span className="mx-1">•</span>
                            <time title={new Date(createdAt).toString()} dateTime={createdAt}>{new Date(createdAt).toLocaleDateString()}</time>
                        </div>
                        @{author}
                    </div>
                    {/* <span className="relative ml-auto flex flex-row laptop:mouse:invisible laptop:mouse:group-hover:visible">
                        <button aria-label="Options" className="btn focus-outline inline-flex cursor-pointer select-none flex-row
                        items-center border no-underline shadow-none transition
                        duration-200 ease-in-out typo-callout justify-center font-bold iconOnly h-8 w-8 p-0 rounded-10 btn-tertiary my-auto">
                            <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 pointer-events-none rotate-90">
                                
                            </svg>
                        </button>
                    </span> */}
                </div>
                <div className="my-2 flex flex-col mobileXL:flex-row">
                    <div className="mr-4 flex-1">
                        <h3 className="multi-truncate font-bold text-text-primary typo-title3 line-clamp-4 multi-truncate mt-4 break-words">{title}</h3>
                        {/* <p className="text-text-secondary typo-body2 line-clamp-3">{content}</p> */}
                    </div>
                </div>
                
            </div>
            {/* <div className="pointer-events-none relative flex flex-1 flex-col w-[50%]">
                    <div className="flex flex-row items-center mt-4">
                        <ControlCard />
                    </div>
                </div> */}
        </div>
    );
};

export default ProfilePost;