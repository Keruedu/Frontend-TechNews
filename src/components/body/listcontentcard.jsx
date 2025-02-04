import React, { useState } from 'react';
import ContentCard from '../card/contentcard.jsx';
import Filter from '../form/Filter.jsx';
import useFetchPosts from '../hook/useFetchPosts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ListContentCard = ({ width = 'md:w-[84.2%]', selectionMode = false, onPostSelect, selectedPosts = [], authorId = null, isEditable = false, status = 'APPROVED', showStatus = false, reviewMode = false, isBookmarked = false }) => {
  const { data, loading, hasMore, loadingMore, loadMore, applyFilters } = useFetchPosts(1, {
    sortField: 'createdAt',
    sortType: 'desc',
    startDate: '',
    endDate: '',
    selectedTags: [],
    selectedCategories: [],
    searchQuery: '',
  }, authorId, status, isBookmarked);

  const [posts, setPosts] = useState(data);

  const handleStatusChange = (postId, newStatus) => {
    setPosts((prevData) =>
      prevData.map((post) =>
        post._id === postId ? { ...post, status: newStatus } : post
      )
    );
  };
  return (
    <div className={`flex flex-col px-[40px] py-[20px] gap-[40px] w-full ${width}`}>
      <Filter onApplyFilters={applyFilters} />
      <div className='flex flex-row flex-wrap justify-center items-center gap-[30px] w-[100%]'>
        {data.map((da, index) => (
          <ContentCard
            ID={da._id}
            key={index}
            Title={da.title}
            Image={da.thumbnail}
            Author={da.authorId.profile.name}
            Date={da.createdAt}
            Description={da.content}
            Url={da.url}
            CommentsCount={da.totalCommentsCount}
            ReactionsCount={da.upvotesCount}
            ReadingTime={da.readingTime}
            Tags={da.tagsId}
            Category={da.categoryId}
            UserProfileImage={da.authorId.profile.avatar}
            Organization={da.organization ? da.organization.name : null}
            selectionMode={selectionMode}
            onPostSelect={onPostSelect}
            isSelected={selectedPosts.includes(da._id)}
            isEditable={isEditable}
            Status={da.status} // Pass the status of the post
            showStatus={showStatus} // Pass the showStatus prop
            reviewMode={reviewMode}
            onStatusChange={handleStatusChange} // Truyền callback để cập nhật trạng thái
          />
        ))}
      </div>
      {hasMore && (
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded mt-4 self-center flex items-center'
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
              Loading...
            </>
          ) : (
            'Load More'
          )}
        </button>
      )}
    </div>
  );
};

export default ListContentCard;