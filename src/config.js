const API_BASE_URL = 'http://localhost:4000/api';

export const API_ENDPOINTS = {
    SEARCH_POSTS: `${API_BASE_URL}/posts/search`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    USERS: `${API_BASE_URL}/users`,
    POSTS: `${API_BASE_URL}/posts`,
    COMMENTS: `${API_BASE_URL}/posts/:id/comments`,
    COMMENT: `${API_BASE_URL}/comments`,
    VIEW: `${API_BASE_URL}/posts/:id/view`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    TAGS: `${API_BASE_URL}/tags`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    UPVOTE: `${API_BASE_URL}/posts/:id/upvote`,
    DOWNVOTE: `${API_BASE_URL}/posts/:id/downvote`,
    BOOKMARK: `${API_BASE_URL}/posts/:id/bookmark`,
    UPLOAD_IMAGE: `${API_BASE_URL}/users/upload`
};