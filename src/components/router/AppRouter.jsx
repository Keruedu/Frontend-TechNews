import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Profile from '../pages/Profile.jsx';
import Settings from '../pages/Settings.jsx';
import Signup from '../pages/Signup.jsx';
import Login from '../pages/Login.jsx';
import Body from '../body/body.jsx';
import Post from '../pages/Post.jsx';
import User from '../pages/User.jsx';
import Header from '../header/header.jsx';
import NavigantionBar from '../navigation/navigation_bar.jsx';
import ListContentCard from '../body/listcontentcard.jsx';
import CreatePost from '../pages/CreatePost.jsx'; 
import EditProfile from '../pages/EditProfile.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ReviewPosts from '../pages/ReviewPosts.jsx';
import ManageCategories from '../pages/ManageCategories.jsx';
import ManageAccounts from '../pages/ManageAccounts.jsx';
import MyPost from '../pages/MyPost.jsx';
import EditPost from '../pages/EditPost.jsx';
import AccountDetails from '../pages/AccountDetails.jsx';

const AppRouter = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    const ProtectedRoute = ({ children, roles }) => {
        if (!user || !roles.includes(user.role)) {
            return <Navigate to="/" />;
        }
        return children;
    };

    const AdminProtectedRoute = ({ children }) => {
        if (!user || user.role !== 'ADMIN') {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Body content={<ListContentCard />} />} />
                <Route path="/create" element={<Body content={<CreatePost />} />} />
                <Route path="/customfeed" element={<Body content={<div>Custom Feed Content</div>} />} />
                <Route path="/mypost" element={<Body content={<MyPost />} />} />
                <Route path="/publicpost" element={<Body content={<div>Public Post Content</div>} />} />
                <Route path="/explore" element={<Body content={<div>Explore Content</div>} />} />
                <Route path="/discussion" element={<Body content={<div>Discussion Content</div>} />} />
                <Route path="/tag" element={<Body content={<div>Tag Content</div>} />} />
                <Route path="/bookmarks" element={<Body content={<ListContentCard isBookmarked={true} />} />} />
                <Route path="/history" element={<Body content={<div>History Content</div>} />} />
                <Route path="/docs" element={<Body content={<div>Docs Content</div>} />} />
                <Route path="/changelog" element={<Body content={<div>Changelog Content</div>} />} />
                <Route path="/feedback" element={<Body content={<div>Feedback Content</div>} />} />
                <Route path="/category" element={<Body content={<div>Category Content</div>} />} />
                <Route path="/post/:id" element={<Body content={<Post />} />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/user" element={<Body content={<User />} />} />
                <Route path="/profile" element={<Body content={<Profile />} />} />
                <Route path="/edit-profile" element={<Body content={<EditProfile />} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN', 'MANAGER']}><Body content={<Dashboard />} /></ProtectedRoute>} />
                <Route path="/admin/review-posts" element={<ProtectedRoute roles={['ADMIN', 'MANAGER']}><Body content={<ReviewPosts />} /></ProtectedRoute>} />
                <Route path="/admin/manage-categories" element={<ProtectedRoute roles={['ADMIN', 'MANAGER']}><Body content={<ManageCategories />} /></ProtectedRoute>} />
                <Route path="/admin/manage-accounts" element={<AdminProtectedRoute><Body content={<ManageAccounts />} /></AdminProtectedRoute>} />
                <Route path="/admin/accounts/:userId" element={<ProtectedRoute><Body content={<AccountDetails />} /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<Body content={<EditPost />} />} /> {/* Add route for editing posts */}
            </Routes>
        </Router>
    );
};

export default AppRouter;