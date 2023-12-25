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

        //localStorage.setItem('access_token', res.data.access);
        const access_token = localStorage.getItem('access_token');
        const socket = new WebSocket(`${process.env.REACT_APP_STATUS_WEBSOCKET_URL}`);
        socket.onopen = () => {
            const message_token = "off" + access_token;
            socket.send(JSON.stringify({ "access_token": message_token }));
            console.log('Access logout token sent via WebSocket (logout):', message_token);
        };

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