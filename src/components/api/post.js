import { API_ENDPOINTS } from '../../config';

export const updatePostStatus = async (postId, newStatus) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage

  try {
    const response = await fetch(`${API_ENDPOINTS.POSTS}/${postId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Thêm token vào header
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating post status:', error);
    return { success: false, message: error.message };
  }
};