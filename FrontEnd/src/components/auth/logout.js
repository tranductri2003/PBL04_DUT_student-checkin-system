import React, { useEffect } from 'react';
import axiosInstance from '../../axios';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
export default function SignUp() {
    const history = useHistory();

    useEffect(() => {
        axiosInstance.post('auth/logout/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.clear();
        axiosInstance.defaults.headers['Authorization'] = null;
        history.push('/login');
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