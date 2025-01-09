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
      <div className="ml-[15.8%] w-[84.2%] h-full flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="ml-[15.8%] w-[84.2%] h-full bg-white dark:bg-[#1E293B]">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Details</h2>
          <button
            onClick={() => navigate('/admin/manage-accounts')}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                     hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            ← Back to List
          </button>
        </div>

        {/* User Details Card */}
        <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Basic Information - Left Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Avatar */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Avatar</label>
                    <div className="p-2">
                      <img 
                        src={user.profile?.avatar || '/default-avatar.png'} 
                        alt="User avatar"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md break-words">
                      {user.username}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md break-words">
                      {user.profile?.name || 'Not updated'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md break-words">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md break-words">
                      {user.role}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.isBanned 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      }`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information - Right Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md break-words whitespace-pre-wrap">
                      {user.profile?.bio || 'No bio provided'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                      {new Date(user.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</label>
                    <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                      {new Date(user.lastLogin).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity Summary</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bookmarks</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {user.bookmarkedPosts?.length || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Upvotes</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {user.upvotedPosts?.length || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Downvotes</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {user.downvotedPosts?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;