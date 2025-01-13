import React, { useState, useEffect } from 'react';

const EditProfile = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isResetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${currentUser._id}`);
      const result = await response.json();
      if (result.success) {
        const userData = result.data;
        setUser({
          name: userData.profile.name,
          username: userData.username,
          email: userData.email,
          bio: userData.profile.bio,
          avatar: userData.profile.avatar
        });
      } else {
        console.error('Error fetching user data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prevState => ({
          ...prevState,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    } else {
      console.error('Invalid file type. Please select a JPEG, JPG, or PNG file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let avatarUrl = user.avatar;

    if (avatarFile) {
      const formData = new FormData();
      formData.append('image', avatarFile);

      try {
        const uploadResponse = await fetch('http://localhost:4000/api/posts/uploads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          avatarUrl = uploadResult.data.url;
        } else {
          console.error('Error uploading avatar:', uploadResult.message);
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }

    const updatedUser = {
      username: user.username,
      email: user.email,
      profile: {
        name: user.name,
        avatar: avatarUrl,
        bio: user.bio
      }
    };

    try {
      const response = await fetch(`http://localhost:4000/api/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });
      const result = await response.json();
      if (result.success) {
        console.log('Profile updated successfully');
        localStorage.setItem('user', JSON.stringify(result.data));
      } else {
        console.error('Error updating profile:', result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      console.error('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      const result = await response.json();
      if (result.success) {
        console.log('Password reset successfully');
        setResetPasswordModalVisible(false);
      } else {
        console.error('Error resetting password:', result.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <>
      {loading ? (
        <p className='flex justify-center w-[100%] text-[26px]'>Loading...</p>
      ) : (
        <div className="mx-auto flex flex-col content-center items-stretch pt-0 h-[100vh] ">
          <h1 className="text-2xl font-bold mt-4">Edit Profile</h1>
          <form id="editProfileForm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 self-start">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
              <input type="file" id="avatarInput" name="avatar" className="hidden" onChange={handleAvatarChange} />
              <button type="button" className="rounded dark:border-bg-white dark:border-bg-dark max-w-[250px] flex flex-row justify-center items-center mx-auto text-dark-700 dark:text-white hover:text-primary hover:border-primary transition" onClick={() => document.getElementById('avatarInput').click()}>
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
                  <img id="imagePreview" src={user.avatar} alt="User Avatar" className="w-full h-full object-cover object-center" />
                </div>
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" name="name" id="name" value={user.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input type="text" name="username" id="username" value={user.username} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" value={user.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>
            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <textarea name="bio" id="bio" value={user.bio} onChange={handleInputChange} className="mt-1 block w-full h-[100px] border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"></textarea>
            </div>
            <div className="flex flex-row gap-[10px]">
              <button type="submit" className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 transition ease-in-out duration-150">Save Changes</button>
              <button type="button" className="px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-800 transition ease-in-out duration-150" onClick={() => setResetPasswordModalVisible(true)}>Reset Password</button>
            </div>
          </form>
        </div>
      )}

      {isResetPasswordModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input type="password" name="currentPassword" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input type="password" name="newPassword" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setResetPasswordModalVisible(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;