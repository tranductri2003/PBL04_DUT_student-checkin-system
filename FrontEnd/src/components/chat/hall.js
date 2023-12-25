import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, makeStyles, TextField } from '@material-ui/core';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import UserStatus from './UserStatus';
import './hall.css'; // Import CSS file




function ChatHall() {
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState(''); // Added this line
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState({});

    // dùng cho lấy dữ liệu tất cả người dùng
    useEffect(() => {
        axiosInstance.get(`user/?role=T`)
            .then(response => {
                setUsers(response.data.results);
                console.log(response.data.results);
            })
            .catch(error => {
                console.error('Lỗi khi tải dữ liệu users:', error);
                // Xử lý lỗi cho dữ liệu users
            });
    }, []);

    useEffect(() => {
        const socket = new WebSocket(`${process.env.REACT_APP_STATUS_WEBSOCKET_URL}`);

        socket.onopen = () => {
            console.log('Kết nối WebSocket đã mở');

        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'user.status') {
                // Cập nhật trạng thái của người dùng
                setUserStatus((prevUserStatus) => ({
                    ...prevUserStatus,
                    [data.staff_id]: data.status,
                }));
            }
        };

        socket.onclose = (event) => {
            console.log('Kết nối WebSocket đã đóng:', event);
        };

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);








    useEffect(() => {
        axiosInstance.get('chat/')
            .then(response => {
                const data = response.data;
                setRooms(data.rooms);
            })
            .catch((error) => {
                if (error.response) {
                    // Xử lý lỗi từ phản hồi của server (status code không thành công)
                    console.error('An error occurred while fetching data:', error.response.data);
                    console.error('Status code:', error.response.status);

                    if (error.response.status === 400) {
                        notification.error({
                            message: 'Bad Request',
                            description: 'The request sent to the server is invalid.',
                            placement: 'topRight'
                        });
                    } else if (error.response.status === 401) {
                        notification.warning({
                            message: 'Unauthorized',
                            description: 'You are not authorized to perform this action.',
                            placement: 'topRight'
                        });
                    } else if (error.response.status === 403) {
                        notification.warning({
                            message: 'Forbidden',
                            description: 'You do not have permission to access this resource.',
                            placement: 'topRight'
                        });
                    } else if (error.response.status === 404) {
                        notification.error({
                            message: 'Not Found',
                            description: 'The requested resource was not found on the server.',
                            placement: 'topRight'
                        });
                    } else if (error.response.status === 405) {
                        notification.error({
                            message: 'Method Not Allowed',
                            description: 'The requested HTTP method is not allowed for this resource.',
                            placement: 'topRight'
                        });
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'An error occurred while fetching data from the server.',
                            placement: 'topRight'
                        });
                    }
                } else if (error.request) {
                    // Xử lý lỗi không có phản hồi từ server
                    console.error('No response received from the server:', error.request);
                    notification.error({
                        message: 'No Response',
                        description: 'No response received from the server.',
                        placement: 'topRight'
                    });
                } else {
                    // Xử lý lỗi khác
                    console.error('An error occurred:', error.message);
                    notification.error({
                        message: 'Error',
                        description: 'An error occurred while processing the request.',
                        placement: 'topRight'
                    });
                }
            });
    }, []);
    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const filteredUsers = users.filter(user => {
        return user.full_name.toLowerCase().includes(searchKeyword.toLowerCase());
    });





    const handleCardClick = (slug) => {
        navigate(`/hall/${slug}`);
    };


    return (
        <div className='hall'>
            <Typography className="welcomeText">
                Welcome to the Chat Hall
            </Typography>

            <Grid container spacing={3} className="gridContainer">
                <div className="userStatus">
                    {users && users.length > 0 && users.map((user) => (
                        <UserStatus
                            key={user.id}
                            name={user.full_name}
                            status={userStatus[user.staff_id] || user.status}
                            avt={user.avatar}
                        />
                    ))}
                </div>

                <div className="room">
                    {/* Use Grid container to create a flex container */}
                    <Grid container spacing={2}>
                        {rooms.map(room => (
                            <Grid item key={room.id} xs={14} sm={6} md={6} lg={4}>
                                <Card className='roomCard' onClick={() => handleCardClick(room.slug)}>
                                    <CardContent>
                                        <Typography className="roomName">{room.name}</Typography>
                                        <Typography className="roomDescription">{room.description}</Typography>
                                        <Typography className="roomId">Room ID: {room.id}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
        </div>
    );
}
export default ChatHall;
