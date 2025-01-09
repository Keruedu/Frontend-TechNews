import React, { useState, useEffect } from 'react';
import CKEditor from '../ckeditor/CKeditor.jsx';
import { API_ENDPOINTS } from '../../config';
import { showSuccessAlert, showDeniedAlert } from '../../utils/alert';

const PostForm = ({ postId, initialData, onSubmit }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || null);
    const [tags, setTags] = useState(initialData?.tagsId || []);
    const [newTag, setNewTag] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(initialData?.categoryId?._id || '');
    const maxTitleLength = 250;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.CATEGORIES);
                const result = await response.json();
                if (result.success) {
                    setCategories(result.data);
                } else {
                    console.error('Error fetching categories:', result.message);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleAddTag = () => {
        if (newTag && !tags.some(tag => tag.name === newTag)) {
            setTags([...tags, { name: newTag }]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag.name !== tagToRemove.name));
    };

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(postId ? `${API_ENDPOINTS.POSTS}/${postId}` : API_ENDPOINTS.POSTS, {
                method: postId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags: tags.map(tag => tag.name),
                    categoryId: selectedCategory,
                    thumbnail
                })
            });
            const result = await response.json();
            if (result.success) {
                showSuccessAlert('Success', postId ? 'Post updated successfully' : 'Post created successfully')
                    .then(() => {
                        onSubmit();
                    });
            } else {
                console.error('Error saving post:', result.message);
                showDeniedAlert('Error', 'Error saving post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            showDeniedAlert('Error', 'Error saving post');
        }
    };

    return (
        <div className='flex flex-col justify-center w-[84.2%] p-4'>
            <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Create Post</h1>
            <div className='px-5 mt-6 w-full '>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='relative '>
                        <label className='group w-[240px] h-[160px] relative flex items-center justify-center overflow-hidden border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-pointer'>
                            <input type='file' name='thumbnail' accept='image/png,image/jpeg' className='hidden' onChange={handleThumbnailChange} />
                            {thumbnail ? (
                                <img src={thumbnail} alt='Thumbnail' className='w-full h-full object-cover' />
                            ) : (
                                <>
                                    <svg width='1em' height='1em' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 pointer-events-none'>
                                        <path d='M13 4.2a4 4 0 013.619 2.293c.305.036.615.076.929.12A4 4 0 0121 10.573v4.856a4 4 0 01-3.452 3.962c-1.987.275-3.836.412-5.548.412-1.712 0-3.561-.137-5.548-.412A4 4 0 013 15.43v-4.856a4 4 0 013.452-3.962 49.6 49.6 0 01.93-.12A3.998 3.998 0 0111 4.2h2zM12 9a4 4 0 100 8 4 4 0 000-8zm6 .2a1 1 0 100 2 1 1 0 000-2z' fill='currentColor' fillRule='evenodd'></path>
                                    </svg>
                                    <span className='ml-1.5 flex flex-row font-bold'>Thumbnail</span>
                                </>
                            )}
                        </label>
                    </div>
                    <div className='group flex flex-col items-stretch mt-6 w-full'>
                        <div className='relative flex rounded-2xl flex-row items-center h-12 px-4 overflow-hidden border-l-2 dark:text-gray-400 border-gray-700 dark:bg-gray-700 bg-gray-100 text-black hover:border-l-2 dark:hover:border-white cursor-text group-hover:text-gray-400 dark:focus-within:text-white dark:focus-within:border-white'>
                            <input
                                placeholder='Post Title*'
                                name='title'
                                id='title'
                                maxLength={maxTitleLength}
                                size='1'
                                className='self-stretch text-ellipsis dark:group-hover:placeholder-white focus:text-black dark:focus:text-white dark:focus:placeholder-white  min-w-0 bg-transparent focus:outline-none w-full h-full px-2'
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className='ml-2 font-bold'>
                                {maxTitleLength - title.length}
                            </div>
                        </div>
                    </div>
                    <div className='relative flex flex-col rounded dark:bg-gray-700 bg-white mt-4'>
                        <CKEditor className='w-full h-96'
                            initialData={content}
                            onChange={(data) => setContent(data)}
                        />
                    </div>
                    <div className='relative flex flex-col mt-4'>
                        <label htmlFor='tags' className='font-bold text-gray-700 dark:text-gray-300'>Tags</label>
                        <div className='tags-input flex flex-row items-center'>
                            <input
                                type='text'
                                id='newTag'
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            />
                            <button type='button' onClick={handleAddTag} className='p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'>
                                Add Tag
                            </button>
                        </div>
                        <div className='tags-list flex flex-wrap gap-2 mt-2'>
                            {tags.map((tag, index) => (
                                <div key={index} className='tag-item flex gap-3 items-center pl-[12px] bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100'>
                                    {tag.name}
                                    <button type='button' onClick={() => handleRemoveTag(tag)} className='py-[2px] px-[4px] h-full rounded font-bold dark:bg-white bg-gray-700 text-[#FC538d] dark:text-red-400 hover:text-red-600 dark:hover:text-red-500'>
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='relative flex flex-col mt-4'>
                        <label htmlFor='category' className='font-bold text-gray-700 dark:text-gray-300'>Category</label>
                        <select
                            id='category'
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className='p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        >
                            <option value=''>Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='relative flex flex-col items-center tablet:flex-row mt-5'>
                        <button type='submit' aria-busy='false' className='btn focus:outline-none inline-flex cursor-pointer select-none flex-row items-center border no-underline shadow-none transition duration-200 ease-in-out justify-center font-bold h-10 px-5 rounded bg-blue-500 text-white ml-auto w-full tablet:mt-0 tablet:w-32 laptop:flex'>
                            {postId ? 'Update Post' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm;