import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:4000/api/notifications/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  if (!notifications) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-[15.8%] min-h-screen w-[84.2%] bg-white dark:bg-inherit">
      <h2 className="text-3xl font-bold text-center my-8">Notifications</h2>
      <div className="mb-8">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications available.</div>
        ) : (
          notifications.map(notification => (
            <div key={notification._id} className="flex justify-between items-center border-b py-2">
              <Link to={notification.url} className="text-blue-500 hover:underline">
                {notification.message}
              </Link>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;