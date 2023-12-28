import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../../axios';
import { notification } from 'antd';
import { Button } from "reactstrap";
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';


const styles = {
    leaderboard: {
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        textAlign: 'center',
        margin: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ddd',
        margin: '0 auto',
    },
    tableHeader: {
        padding: '16px',
        backgroundColor: '#f2f2f2',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    cell: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '16px',
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '5px',
    },
    link: {
        textDecoration: 'none',
        color: 'blue',
        cursor: 'pointer',
    },
};


const Leaderboard = () => {
    let staff_id = "";
    if (localStorage.getItem('access_token')) {
        // Lấy token từ nơi bạn lưu trữ nó, ví dụ localStorage hoặc cookies
        const token = localStorage.getItem("access_token"); // Thay thế bằng cách lấy token từ nơi bạn lưu trữ nó

        // Giải mã token
        const decodedToken = jwt_decode(token);

        // Lấy staff_id từ payload của token
        staff_id = decodedToken.staff_id;
    }


    const handleCreateRoom = (staff_id_1, staff_id_2, full_name_1, full_name_2) => {
        // Sắp xếp tên người dùng theo thứ tự từ điển
        const sortedUserName = [staff_id_1, staff_id_2].sort();
        const sortedFirstName = [full_name_1, full_name_2].sort();


        // Tạo slug từ tên người dùng
        const room_slug = `${sortedUserName[0]}-${sortedUserName[1]}`;
        const room_name = `${sortedFirstName[0]} and ${sortedFirstName[1]}`;
        const room_description = `Phòng chat của ${full_name_1} và ${full_name_2}`;
        const room_participants = [staff_id_1, staff_id_2]
        const participants_string = room_participants.join(' ');

        const requestData = {
            name: room_name,
            slug: room_slug,
            description: room_description,
            private: true,
            participants: participants_string,
        };
        console.log(requestData);
        axiosInstance.post('/chat/create/', requestData)
            .then(response => {
                console.log('Room created:', response.data);
                notification.success({
                    message: 'Room Created',
                    description: 'Room created successfully!',
                    placement: 'topRight'
                });
            })
            .catch(error => {
                console.error('Error creating room:', error);
                if (error.response && error.response.status === 400 && error.response.data.detail === "Room with this slug already exists") {
                    notification.warning({
                        message: 'Room Already Exists',
                        description: 'A room with this slug already exists.',
                        placement: 'topRight'
                    });
                } else {
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
                }
            });
    };



    const search = 'user?full_name=';
    const [appState, setAppState] = useState({
        search: '',
        users: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        let searchTerm = new URLSearchParams(window.location.search).get('search');


        axiosInstance.get(search + searchTerm).then((res) => {
            const allUsers = res.data;
            setAppState({ users: allUsers });
            console.log(res.data);
        }).catch((error) => {
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
        });;
    }, [setAppState]);


    return (
        <div style={styles.leaderboard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>STT</th>
                        <th style={styles.tableHeader}>Staff id</th>
                        <th style={styles.tableHeader}>Họ và tên</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>SDT</th>
                        <th style={styles.tableHeader}>Lớp</th>
                        <th style={styles.tableHeader}>Nhắn tin</th>
                    </tr>
                </thead>
                <tbody>
                    {appState.users.results && Array.isArray(appState.users.results) ? (
                        appState.users.results.map((user, index) => (
                            <tr key={user.id}>
                                <td style={styles.cell}>{index + 1}</td>
                                <td style={styles.cell}>
                                    <a
                                        href={`/user/${user.staff_id}`}
                                        style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/user/${user.staff_id}`);
                                        }}
                                    >
                                        {user.staff_id}
                                    </a>
                                </td>                                <td style={styles.cell}>{user.full_name}</td>
                                <td style={styles.cell}>{user.email}</td>
                                <td style={styles.cell}>{user.phone_number}</td>
                                <td style={styles.cell}>{user.class_id}</td>
                                <td style={styles.cell}>
                                    <button style={styles.button} onClick={() => handleCreateRoom(staff_id, user.staff_id, localStorage.getItem("full_name"), user.full_name)}>Nhắn tin</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
