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
import ChatSite from './components/chat/ChatSite'
import AttendancesSite from './components/attendances/AttendanceSite';
import CoursesSite from './components/courses/CourseSite';
//import UserStatus from './components/chat/UserStatus';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


ReactDOM.render(
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<CoursesSite />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/attendance" element={<AttendancesSite />} />
      <Route path="/hall/:slug" element={<ChatSite />} />
      <Route path="/hall" element={<Hall />} />
    </Routes>
    <Footer />
  </Router >,
  document.getElementById('root')
);

reportWebVitals();



