import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Footer from './components/footer';
import Header from './components/header';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Hall from './components/chat/hall';
import ChatSite from './ChatSite'
import AttendancesSite from './AttendanceSite';
import CoursesSite from './CourseSite';
import SearchSite from './components/profile/ListUser';
import Profile from './UserSite'; // Đường dẫn tùy thuộc vào cấu trúc thư mục của bạn
import ResetPassword from './components/auth/resetPassword';
import ActivateAccount from './components/auth/activateAccount';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


ReactDOM.render(
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<CoursesSite />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      <Route path="/activate-account/:uid/:token/:staff_id" element={<ActivateAccount />} />
      <Route path="/attendance" element={<AttendancesSite />} />
      <Route path="/hall/:slug" element={<ChatSite />} />
      <Route path="/hall" element={<Hall />} />
      <Route path="/search" element={<SearchSite />} />
      <Route path="/user/:staffId" element={<Profile />} />
    </Routes>
    <Footer />
  </Router >,
  document.getElementById('root')
);

reportWebVitals();
