import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Footer from './components/footer';
import Header from './components/header';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import UserProfile from './components/profile/userSite';
import AttendancesLoading from './components/attendances/prepareAttendancesData';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


ReactDOM.render(
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/profile/:userName" element={<UserProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/attendance" element={<AttendancesLoading />} />
    </Routes>
    <Footer />
  </Router >,
  document.getElementById('root')
);

reportWebVitals();
