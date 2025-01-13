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
    totalTags: 0,
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
  const [pieTimeRange, setPieTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [postStats, setPostStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0
  });

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
    labels: stats.userRegistrations?.map(item => {
      // Format đã được xử lý từ backend
      return item.date;
    }) || [],
    datasets: [{
      label: 'User Registrations',
      data: stats.userRegistrations?.map(item => item.count) || [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      pointStyle: 'line'
    }]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'line',
          color: 'rgb(160, 160, 160)'
        }
      }
    }
  };

  // Data cho biểu đồ tròn
  const pieChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [postStats.approved, postStats.pending, postStats.rejected],
      backgroundColor: [
        'rgb(75, 192, 192)',  // Xanh cho Approved
        'rgb(255, 205, 86)',  // Vàng cho Pending
        'rgb(255, 99, 132)'   // Đỏ cho Rejected
      ],
      borderWidth: 1
    }]
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

      console.log('Response data:', response.data); // Debug log

      if (response.data.success) {
        // Kiểm tra xem dữ liệu có đúng cấu trúc không
        console.log('Setting state with:', response.data.data.registrations); // Debug log
        
        setStats(prev => {
          const newStats = {
            ...prev,
            userRegistrations: response.data.data.registrations
          };
          console.log('New state:', newStats); // Debug log
          return newStats;
        });
      }
    } catch (error) {
      console.error('Error fetching registration stats:', error);
    }
  };

  const handlePieTimeRangeChange = async (range) => {
    setPieTimeRange(range);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:4000/api/users/statistics/posts?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        setPostStats(response.data.data.postStats);
      }
    } catch (error) {
      console.error('Error fetching post stats:', error);
    }
  };

  // Load dữ liệu mặc định cho cả hai biểu đồ
  useEffect(() => {
    console.log('Initial loading...'); // Debug log
    handleTimeRangeChange('week'); // Load biểu đồ đường
    handlePieTimeRangeChange('week'); // Load biểu đồ tròn
  }, []);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="flex-1 p-4 ml-[200px] mr-4">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">System Statistics</h1>
        
        {/* Grid cho các card thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Overview */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Overview</h2>
            <div className="space-y-3">
              <p className="dark:text-gray-300">Total Users: {stats.totalUsers}</p>
              <p className="dark:text-gray-300">Total Posts: {stats.totalPosts}</p>
              <p className="dark:text-gray-300">Total Categories: {stats.totalCategories}</p>
              <p className="dark:text-gray-300">Total Tags: {stats.totalTags}</p>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">User Statistics</h2>
            <div className="space-y-3">
              <p className="dark:text-gray-300">Admins: {stats.userStats.admin}</p>
              <p className="dark:text-gray-300">Managers: {stats.userStats.manager}</p>
              <p className="dark:text-gray-300">Users: {stats.userStats.user}</p>
              <p className="dark:text-gray-300">Banned Users: {stats.userStats.banned}</p>
            </div>
          </div>

          {/* Post Statistics */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Statistics</h2>
            <div className="space-y-3">
              <p className="dark:text-gray-300">Approved: {stats.postStats.approved}</p>
              <p className="dark:text-gray-300">Pending: {stats.postStats.pending}</p>
              <p className="dark:text-gray-300">Rejected: {stats.postStats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Grid cho các biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* User Registrations Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
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
            <div className="h-[300px]">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Post Status Distribution */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Post Status Distribution</h2>
            <div className="mb-4">
              <select 
                value={pieTimeRange}
                onChange={(e) => handlePieTimeRangeChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="flex justify-center items-center h-[300px]">
              <div className="w-[250px]">
                <Pie data={pieChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 