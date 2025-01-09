import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AccountDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Error loading user details:', error);
        alert(error.response?.data?.message || 'Error loading user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-[#1E293B] flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#1E293B]">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Details</h2>
          <button
            onClick={() => navigate('/admin/manage-accounts')}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            &larr; Back to List
          </button>
        </div>

        {/* User Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                <p className="text-gray-800 dark:text-gray-200">{user.username}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-gray-800 dark:text-gray-200">{user.profile?.name || 'Not updated'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
                <p className="text-gray-800 dark:text-gray-200">{user.role}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                <span className={`inline-block px-2 py-1 rounded ${
                  user.isBanned 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {user.isBanned ? 'Banned' : 'Active'}
                </span>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Additional Information</h3>
              
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Created At</label>
                <p className="text-gray-800 dark:text-gray-200">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Last Updated</label>
                <p className="text-gray-800 dark:text-gray-200">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Thêm các thông tin khác nếu cần */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;