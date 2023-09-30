import React, { useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay thế useHistory
import { notification } from 'antd';
export default function SignUp() {
    const navigate = useNavigate(); // Sử dụng useNavigate thay thế useHistory

    useEffect(() => {
        axiosInstance.post('auth/logout/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.clear();
        axiosInstance.defaults.headers['Authorization'] = null;
        navigate('/login'); // Sử dụng navigate để điều hướng thay vì history.push
        // Kích hoạt tái render cho thành phần Header sau khi đăng xuất thành công
        window.dispatchEvent(new Event('storage'));
        notification.success({
            message: 'Sign out successfully',
            description: 'See you later',
            placement: 'topRight'
        });
    });
    return <div>Logout</div>;
}