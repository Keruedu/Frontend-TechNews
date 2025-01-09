import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ManageAccounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [inputPage, setInputPage] = useState('1');
  const accountPage = 10;
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Lấy danh sách tài khoản theo trang và từ khóa tìm kiếm
  const fetchAccounts = async (page, search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const encodedSearch = encodeURIComponent(search.trim());

      const response = await axios.get(
        `http://localhost:4000/api/users/manage-accounts?page=${page}&limit=${accountPage}&search=${encodedSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setAccounts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      // Chỉ hiển thị alert khi không phải initial mount
      if (!isInitialMount) {
        alert(error.response?.data?.message || 'Error loading accounts');
      }
    } finally {
      setLoading(false);
      if (isInitialMount) setIsInitialMount(false);
    }
  };

  // useEffect cho initial load
  useEffect(() => {
    fetchAccounts(1, searchTerm);
  }, []); // Chỉ chạy một lần khi mount

  // useEffect riêng cho search và pagination
  useEffect(() => {
    if (!isInitialMount) {
      fetchAccounts(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm]); // Chạy khi currentPage hoặc searchTerm thay đổi

  // Xử lý tìm kiếm khi nhấn Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Search initiated with:', searchInput); // Debug log
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }
  };

  // Xử lý thay đổi input tìm kiếm
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Xử lý chuyển trang
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Xử lý hiển thị menu
  const handleActionClick = (account) => {
    setSelectedAccount(selectedAccount === account ? null : account);
  };

  // Xử lý chuyển hướng đến trang chi tiết
  const handleViewDetails = (userId) => {
    navigate(`/admin/accounts/${userId}`);
    setSelectedAccount(null); // Đóng dropdown
  };

  // Xử lý cấm/bỏ cấm tài khoản
  const handleToggleBan = async (account) => {
    try {
      // 1. Lấy token để xác thực
      const token = localStorage.getItem('token');
      
      // 2. Gửi request đến backend
      console.log('Sending request to:', `http://localhost:4000/api/users/${account._id}/toggle-ban`); // Debug log
      const response = await axios.patch(
        `http://localhost:4000/api/users/${account._id}/toggle-ban`,
        {}, // body trống vì chỉ cần id từ URL
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 3. Xử lý response từ backend
      if (response.data.success) {
        // Cập nhật UI
        setAccounts(accounts.map(acc => 
          acc._id === account._id 
            ? { ...acc, isBanned: !acc.isBanned }
            : acc
        ));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error details:', error.response || error); // Chi tiết lỗi
      alert(error.response?.data?.message || 'Error updating ban status');
    }
  };

  // Xử lý thay đổi giá trị input
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setInputPage(value); // Cập nhật giá trị input ngay lập tức
  };

  // Xử lý khi người dùng nhấn Enter hoặc input mất focus
  const handlePageSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const pageNumber = parseInt(inputPage);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        paginate(pageNumber);
      } else {
        setInputPage(currentPage.toString()); // Reset về trang hiện tại nếu giá trị không hợp lệ
      }
    }
  };

  // Cập nhật inputPage khi currentPage thay đổi
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  if (loading) {
    return (
      <div className="ml-[15.8%] min-h-screen w-[84.2%] bg-white dark:bg-[#1E293B] flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="ml-[15.8%] min-h-screen w-[84.2%] bg-white dark:bg-[#1E293B]">
      <div className="p-6 h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Management</h2>
          
          {/* Search Box - tăng width */}
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search by username, full name, or email..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              Press Enter to search
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-left text-gray-700 dark:text-gray-200">Username</th>
                <th className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-left text-gray-700 dark:text-gray-200">Full Name</th>
                <th className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-left text-gray-700 dark:text-gray-200">Email</th>
                <th className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-left text-gray-700 dark:text-gray-200">Role</th>
                <th className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-left text-gray-700 dark:text-gray-200">Status</th>
                <th className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-left text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-gray-800 dark:text-gray-200">
                    {account.username}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-gray-800 dark:text-gray-200">
                    {account.profile?.name || 'Not updated'}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-gray-800 dark:text-gray-200">
                    {account.email}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-6 py-3 text-gray-800 dark:text-gray-200">
                    {account.role}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-6 py-3">
                    <span className={`px-2 py-1 rounded ${account.isBanned ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                      {account.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-6 py-3 relative">
                    <button
                      onClick={() => handleActionClick(account)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    {selectedAccount === account && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <div className="py-1">
                          <button 
                            onClick={() => handleViewDetails(account._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleToggleBan(account)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              account.isBanned 
                                ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20' 
                                : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                            }`}
                          >
                            {account.isBanned ? 'Unban Account' : 'Ban Account'}
                          </button>
                          <button 
                            onClick={() => handleResetPassword(account._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            Reset Password
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - thu hẹp ô input */}
        <div className="mt-6 flex flex-col items-center space-y-4">
          <nav className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow px-2 py-1">
            {/* Previous Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors duration-200 border ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Page Input - thu hẹp width */}
            <div className="flex items-center mx-4 space-x-2">
              <input
                type="text"
                value={inputPage}
                onChange={handlePageInputChange}
                onKeyDown={handlePageSubmit}
                onBlur={handlePageSubmit}
                className="w-12 px-2 py-1 text-center rounded-md border dark:bg-gray-700 
                         dark:text-gray-200 dark:border-gray-600 focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600 dark:text-gray-400">
                of {totalPages}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors duration-200 border ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>

          {/* Total Items Display */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total accounts: {totalItems}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccounts;