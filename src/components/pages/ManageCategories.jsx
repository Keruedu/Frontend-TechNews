import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [modalType, setModalType] = useState('');
  const [modalInput, setModalInput] = useState('');
  const [modalSlug, setModalSlug] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isTagsVisible, setIsTagsVisible] = useState(true);

  const fetchCategoriesAndTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const categoriesResponse = await axios.get('http://localhost:4000/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tagsResponse = await axios.get('http://localhost:4000/api/tags', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(Array.isArray(categoriesResponse.data.data) ? categoriesResponse.data.data : []);
      setTags(Array.isArray(tagsResponse.data.data) ? tagsResponse.data.data : []);
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
    }
  };
  
  useEffect(() => {
    

    fetchCategoriesAndTags();
  }, []);

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = modalType === 'category' ? 'http://localhost:4000/api/categories' : 'http://localhost:4000/api/tags';
      const response = await axios.post(endpoint, { name: modalInput, slug: modalSlug }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setModalInput('');
        setModalSlug('');
        setModalType('');
        fetchCategoriesAndTags();
      } else {
        console.error('Error adding item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = deleteItem.type === 'category' ? `http://localhost:4000/api/categories/${deleteItem.id}` : `http://localhost:4000/api/tags/${deleteItem.id}`;
      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setDeleteItem(null);
        fetchCategoriesAndTags();
      } else {
        console.error('Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSetDeleteItem = (type, id) => {
    setDeleteItem({ type, id });
  };

  return (
    <div className="ml-[15.8%] min-h-screen w-[84.2%] bg-white dark:bg-inherit">
      <h2 className="text-3xl font-bold text-center my-8">Manage Categories & Tags</h2>
      <div className="mb-8 border rounded-lg p-4 w-[60%] mx-auto">    
        <div className="flex flex-row justify-between items-center" onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}>
          <h3 className="text-2xl font-semibold items-center">Categories
          <FontAwesomeIcon className="mx-4" icon={isCategoriesVisible ? faChevronUp : faChevronDown} />
          </h3>
          
          <button onClick={(e) => { e.stopPropagation(); setModalType('category'); }} className=" bg-blue-500 text-white px-4 py-2 my-auto rounded z-20 items-center justify-center align-middle">Add Category</button>
        </div>
        {isCategoriesVisible && (
          <ul>
            {categories.map(category => (
              <li key={category._id} className="flex justify-between items-center">
                <span>{category.name}</span>
                <button onClick={() => handleSetDeleteItem('category', category._id)} className="text-red-500 text-2xl hover:bg-opacity-35 hover:bg-red-500 w-32 rounded-full">-</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-8 border rounded-lg p-4 w-[60%] mx-auto">
        <div className="flex flex-row justify-between items-center" onClick={() => setIsTagsVisible(!isTagsVisible)}>
          <h3 className="text-2xl font-semibold">Tags
          <FontAwesomeIcon className="mx-4" icon={isTagsVisible ? faChevronUp : faChevronDown} />
          </h3>
          
          <button onClick={(e) => { e.stopPropagation(); setModalType('tag'); }} className="bg-blue-500 text-white px-4 py-2 my-auto rounded z-20 items-center justify-center align-middle">Add Tag</button>
        </div>
        {isTagsVisible && (
          <ul>
            {tags.map(tag => (
              <li key={tag._id} className="flex justify-between items-center">
                <span>{tag.name}</span>
                <button onClick={() => handleSetDeleteItem('tag', tag._id)} className="text-red-500 text-2xl hover:bg-opacity-35 hover:bg-red-500 w-32 rounded-full">-</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">Add {modalType}</h3>
            <input
              type="text"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 text-black"
              placeholder="Enter name..."
            />
            <input
              type="text"
              value={modalSlug}
              onChange={(e) => setModalSlug(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 text-black"
              placeholder="Enter slug..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setModalType(''); setModalInput(''); setModalSlug(''); }} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg ">
            <h3 className="text-xl font-semibold mb-4 text-black">Confirm Delete</h3>
            <p className="text-black">Are you sure you want to delete this {deleteItem.type}?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setDeleteItem(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;