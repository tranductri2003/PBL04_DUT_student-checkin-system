import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, makeStyles, TextField } from '@material-ui/core';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import UserStatus from './UserStatus';


const useStyles = makeStyles((theme) => ({
    hall: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px',
        fontFamily: 'cursive',
    },
    welcomeText: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        marginBottom: '20px',
        fontFamily: 'cursive',
    },
    gridContainer: {
        justifyContent: 'center',
    },
    userStatus: {
        flex: '0 0 30%', // UserStatus chiếm 30% của chiều rộng
        marginRight: '10px',
        maxHeight: '600px', // Đặt chiều cao cố định tại đây
        overflowY: 'auto',
        border: '1px solid #ccc', // Để tạo khung bao quanh danh sách
        borderRadius: '5px', // Làm tròn góc của khung
        padding: '10px', // Khoảng cách bên trong khung
    },
    searchInput: {
        marginBottom: '10px',
    },
    room: {
        flex: '1', // Phần Room chiếm phần còn lại của chiều rộng
    },
    roomCard: {
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '15px',
        margin: '10px',
        width: '250px',
        height: '250px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        '&:hover': {
            backgroundColor: '#f5f5f5',
            transform: 'scale(1.02)',
        },
    },
    roomName: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: theme.palette.primary.main,
    },
    roomDescription: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '10px',
    },
    roomId: {
        fontSize: '14px',
        color: '#999',
    },
}));

function ChatHall() {
    const classes = useStyles();
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
        <div className={classes.hall}>
            <Typography className={classes.welcomeText}>
                Welcome to the Chat Hall
            </Typography>

            <Grid container spacing={3} className={classes.gridContainer}>
                <div className={classes.userStatus}>
                    {users && users.length > 0 && users.map((user) => (
                        <UserStatus
                            key={user.id}
                            name={user.full_name}
                            status={userStatus[user.staff_id] || user.status}
                            avt={user.avatar}
                        />
                    ))}
                </div>

                <div className={classes.room}>
                    {/* Use Grid container to create a flex container */}
                    <Grid container spacing={2}>
                        {rooms.map(room => (
                            <Grid item key={room.id} xs={14} sm={6} md={6} lg={4}>
                                <Card className={classes.roomCard} onClick={() => handleCardClick(room.slug)}>
                                    <CardContent>
                                        <Typography className={classes.roomName}>{room.name}</Typography>
                                        <Typography className={classes.roomDescription}>{room.description}</Typography>
                                        <Typography className={classes.roomId}>Room ID: {room.id}</Typography>
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
