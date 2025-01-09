import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config';

const useFetchPosts = (initialPage, initialFilters, authorId = null, status = 'APPROVED', isBookmarked = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const fetchPosts = async (page, filters, authorId, status, isBookmarked) => {
    const { sortField, sortType, startDate, endDate, selectedTags, selectedCategories, searchQuery } = filters;

    const requestBody = {
      startDate,
      endDate,
      tagIds: selectedTags.map(tag => tag.value),
      categoryIds: selectedCategories.map(category => category.value),
      search: searchQuery,
      authorId: authorId, // Include authorId in the request body
      isBookmarked: isBookmarked // Include isBookmarked in the request body
    };

    if (status !== null) {
      requestBody.status = Array.isArray(status) ? status : [status]; // Include status in the request body if not null
    }

    if (isBookmarked) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user._id) {
        requestBody.bookmarkedByUserId = user._id; // Include bookmarkedByUserId in the request body
      }
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.SEARCH_POSTS}?size=9&page=${page}&sortField=${sortField}&sortType=${sortType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        if (page === 1) {
          setData(result.data); // Reset data when fetching the first page
        } else {
          setData(prevData => [...prevData, ...result.data]);
        }
        setHasMore(result.data.length > 0);
      } else {
        console.error('Error fetching posts:', result.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, filters, authorId, status, isBookmarked);
  }, [page, filters, authorId, status, isBookmarked]);

  const loadMore = () => {
    setLoadingMore(true);
    setPage(prevPage => prevPage + 1);
  };

  const applyFilters = (newFilters) => {
    setPage(1);
    setData([]); // Reset data when applying new filters
    setFilters(newFilters);
  };

  return { data, loading, hasMore, loadingMore, loadMore, applyFilters };
};

export default useFetchPosts;