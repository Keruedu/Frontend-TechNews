import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tag from './tag';
import DatePost from './datepost.jsx';
import ControlCard from './controlcard.jsx';
import ReadCard from './readcard.jsx';
import Techlogo from '../../assets/react.svg';
import Testimage from '../../assets/Testing.jpg';
import { updatePostStatus } from '../api/post';
import { showSuccessAlert, showDeniedAlert } from '../../utils/alert';

const ContentCard = ({
  ID,
  User = Techlogo,
  Title = 'This is Title',
  Tags = ['Tag1', 'Tag2', 'Tag3'],
  Date,
  Image = Testimage,
  Comments = 12,
  Upvote = 0,
  Author,
  Description,
  Url,
  CommentsCount,
  ReactionsCount,
  ReadingTime,
  UserProfileImage,
  Organization,
  selectionMode = false,
  onPostSelect,
  isSelected = false,
  isEditable = false,
  Status: initialStatus,
  showStatus = false,
  reviewMode = false,
  onStatusChange
}) => {
  const navigate = useNavigate();
  const [showReadCard, setShowReadCard] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleNavigate = () => {
    if (!selectionMode) {
      if (isEditable) {
        navigate(`/edit/${ID}`);
      } else {
        navigate(`/post/${ID}`);
      }
    }
  };

  const handleSelect = () => {
    if (selectionMode && onPostSelect) {
      onPostSelect(ID);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const result = await updatePostStatus(ID, newStatus);
      if (result.success) {
        setStatus(newStatus);
        onStatusChange(ID, newStatus);
        showSuccessAlert('Success', 'Status updated successfully');
      } else {
        console.error('Failed to update status:', result.message);
        showDeniedAlert('Error', 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showDeniedAlert('Error', 'An unexpected error occurred');
    }
  };

  const tagsArray = Array.isArray(Tags) ? Tags : [];
  const statusColor = status === 'APPROVED' ? 'bg-green-500' : status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <>
      <div
        className={`relative flex flex-col p-4 rounded-2xl w-full md:w-1/3 min-w-[262px] h-[386px] border bg-slate-100 text-gray-800 border-gray-400 dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:border-gray-600 ${isSelected ? 'border-blue-500' : ''}`}
        onClick={handleSelect}
      >
        <div className='flex flex-col px-2 justify-between items-start flex-1'>
          <div className='flex flex-col w-full'>
            <div className='flex flex-row items-center gap-4'>
              <div className='flex justify-center items-center size-8'>
                <img className='rounded-full w-full h-full' src={UserProfileImage || User} alt="" />
              </div>
              {showStatus && !reviewMode && (
                <div className={`text-sm ${statusColor} text-white font-bold py-1 px-2 rounded`}>
                  {status}
                </div>
              )}
              {reviewMode && (
                <form className="max-w-sm mx-auto">
                  
                  <select
                    id="status"
                    className={`text-sm ${statusColor} text-white font-bold py-1 px-2 rounded`}
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="APPROVED">Approved</option>
                    <option className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"value="PENDING">Pending</option>
                    <option className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"value="REJECTED">Rejected</option>
                  </select>
                </form>
              )}
            </div>
            <span className='text-2xl font-bold text-left w-full max-h-[64px] truncate cursor-pointer' onClick={handleNavigate}>{Title}</span>
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row gap-2 py-2'>
              {tagsArray.slice(0, 3).map((tag) => (
                <Tag key={tag.id} tagName={`#${tag.name}`} />
              ))}
              {tagsArray.length > 3 && (
                <Tag key="more-tags" tagName={`+${tagsArray.length - 3} more`} />
              )}
            </div>
            <div className='pb-2'>
              <DatePost Data={Date} />
            </div>
          </div>
        </div>
        <div className='w-full cursor-pointer' onClick={handleNavigate}>
          <img src={Image} alt="" className='rounded-xl object-cover w-full max-h-[160px]' />
        </div>
        <ControlCard vote={ReactionsCount} comment={CommentsCount} postId={ID} />
      </div>
      {showReadCard && <ReadCard />}
    </>
  );
};

export default ContentCard;