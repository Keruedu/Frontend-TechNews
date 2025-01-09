import React, { useState, useEffect } from 'react';
import ListContentCard from '../body/listcontentcard.jsx';
import StatusFilter from '../form/StatusFilter';
import { API_ENDPOINTS } from '../../config';
import { showSuccessAlert, showDeniedAlert } from '../../utils/alert';

const MyPost = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Thêm state để trigger re-fetch
  const [statusFilter, setStatusFilter] = useState(['ALL']); // Thêm state để lưu trữ bộ lọc trạng thái

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPosts([]); // Clear selected posts when toggling mode
  };

  const handlePostSelect = (postId) => {
    setSelectedPosts((prevSelected) =>
      prevSelected.includes(postId)
        ? prevSelected.filter((id) => id !== postId)
        : [...prevSelected, postId]
    );
  };

  const handleDeleteSelectedPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_ENDPOINTS.POSTS}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postIds: selectedPosts })
      });

      const result = await response.json();
      if (result.success) {
        console.log('Posts deleted successfully');
        showSuccessAlert('Success', 'Posts deleted successfully');
        // Refresh the list of posts
        setSelectedPosts([]);
        setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch
      } else {
        console.error('Error deleting posts:', result.message);
        showDeniedAlert('Error', 'Error deleting posts');
      }
    } catch (error) {
      console.error('Error deleting posts:', error);
      showDeniedAlert('Error', error.message);
    }
  };

  const handleStatusFilterChange = (newStatusFilter) => {
    setStatusFilter(newStatusFilter);
    setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col w-[84.2%] p-4'>
      <header className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>My Posts</h1>
        <div className='flex items-center gap-4'>
          <StatusFilter value={statusFilter} onChange={handleStatusFilterChange} />
          {selectionMode && selectedPosts.length > 0 && (
            <button
              onClick={handleDeleteSelectedPosts}
              className='bg-red-500 text-white px-4 py-2 rounded mr-4'
            >
              Delete Selected
            </button>
          )}
          <button
            onClick={toggleSelectionMode}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            {selectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
          </button>
        </div>
      </header>
      <ListContentCard
        key={refreshKey} // Thêm key để re-render component khi refreshKey thay đổi
        width='w-full'
        selectionMode={selectionMode}
        onPostSelect={handlePostSelect}
        selectedPosts={selectedPosts}
        authorId={user._id} // Truyền authorId của người dùng đang đăng nhập
        isEditable={true} // Thêm prop để xác định có thể chỉnh sửa bài viết
        status={statusFilter.includes('ALL') ? null : statusFilter} // Lọc theo status
        showStatus={true} // Hiển thị status của bài viết
      />
    </div>
  );
};

export default MyPost;