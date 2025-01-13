import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalCategories: 0,
    userStats: {
      admin: 0,
      manager: 0,
      user: 0,
      banned: 0
    },
    postStats: {
      approved: 0,
      pending: 0,
      rejected: 0
    },
    userRegistrations: []
  });
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:4000/api/users/statistics',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        alert(error.response?.data?.message || 'Error loading statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Data cho biểu đồ đường
  const lineChartData = {
    labels: stats.userRegistrations?.map(item => item.date) || [],
    datasets: [
      {
        label: 'User Registrations',
        data: stats.userRegistrations?.map(item => item.count) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Data cho biểu đồ tròn
  const pieChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          stats.postStats?.approved || 0,
          stats.postStats?.pending || 0,
          stats.postStats?.rejected || 0
        ],
        backgroundColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(255, 99, 132)'
        ]
      }
    ]
  };

  const handleTimeRangeChange = async (range) => {
    setTimeRange(range);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:4000/api/users/statistics/registrations?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        setStats(prev => ({
          ...prev,
          userRegistrations: response.data.data.registrations
        }));
      }
    } catch (error) {
      console.error('Error fetching registration stats:', error);
    }
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">System Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tổng quan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Overview</h2>
          <div className="space-y-3">
            <p className="dark:text-gray-300">Total Users: {stats.totalUsers}</p>
            <p className="dark:text-gray-300">Total Posts: {stats.totalPosts}</p>
            <p className="dark:text-gray-300">Total Categories: {stats.totalCategories}</p>
          </div>
        </div>

        {/* Thống kê User */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">User Statistics</h2>
          <div className="space-y-3">
            <p className="dark:text-gray-300">Admins: {stats.userStats.admin}</p>
            <p className="dark:text-gray-300">Managers: {stats.userStats.manager}</p>
            <p className="dark:text-gray-300">Users: {stats.userStats.user}</p>
            <p className="dark:text-gray-300">Banned Users: {stats.userStats.banned}</p>
          </div>
        </div>

        {/* Thống kê Post */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Statistics</h2>
          <div className="space-y-3">
            <p className="dark:text-gray-300">Approved: {stats.postStats.approved}</p>
            <p className="dark:text-gray-300">Pending: {stats.postStats.pending}</p>
            <p className="dark:text-gray-300">Rejected: {stats.postStats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Biểu đồ đường */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">User Registrations</h2>
          <div className="mb-4">
            <select 
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <Line data={lineChartData} />
        </div>

        {/* Biểu đồ tròn */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Status Distribution</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Statistics; 