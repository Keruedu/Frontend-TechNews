import React, { useState } from 'react';
import ListContentCard from '../body/listcontentcard.jsx';
import StatusFilter from '../form/StatusFilter';

const ReviewPosts = () => {
  const [statusFilter, setStatusFilter] = useState(['PENDING']); // Default to PENDING status

  const handleStatusFilterChange = (newStatusFilter) => {
    setStatusFilter(newStatusFilter);
  };

  return (
    <div className='flex flex-col w-[84.2%] p-4'>
      <header className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Review Posts</h1>
        <StatusFilter value={statusFilter} onChange={handleStatusFilterChange} />
      </header>
      <ListContentCard
        width='w-full'
        status={statusFilter.includes('ALL') ? null : statusFilter} // Lọc theo status
        showStatus={true} // Hiển thị status của bài viết
        reviewMode={true}
        isEditable={true}
      />
    </div>
  );
};

export default ReviewPosts;