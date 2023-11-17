import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { notification } from 'antd';

const modalStyles = {
    AttendanceModal: {
        fontFamily: 'cursive',
        textAlign: 'center',
        margin: '20px',
    },
    tableContainer: {
        width: '100%',
        overflowX: 'auto',
    },
    tableWrapper: {
        maxHeight: 'calc(90vh - 120px)',
        overflowY: 'auto',
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
        position: 'sticky',
        top: '0',
    },
    cell: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '16px',
    },
    link: {
        textDecoration: 'none',
        color: 'blue',
        cursor: 'pointer',
    },
    tick: {
        fontSize: '20px',
        color: 'green',
    },
    cross: {
        fontSize: '20px',
        color: 'red',
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '5px',
    },
};


function isWithinTimeRange(startTime, endTime) {
    if (startTime && endTime) {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        if (
            currentHours > startHour ||
            (currentHours === startHour && currentMinutes >= startMinute)
        ) {
            if (
                currentHours < endHour ||
                (currentHours === endHour && currentMinutes < endMinute)
            ) {
                return true;
            }
        }
    }
    return false;
}


const AttendanceModal = (props) => {
    const { course } = props;

    const [users, setUsers] = useState([]);
    const [presentStudents, setPresentStudents] = useState([]);
    const [websocket, setWebsocket] = useState(null);

    // Sử dụng useEffect để thiết lập kết nối WebSocket khi trang được tải
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const websocketURL = `${process.env.REACT_APP_CHECK_IN_WEBSOCKET_URL}${course.course_id}/`;
        const client = new W3CWebSocket(websocketURL);

        client.onopen = () => {
            console.log('WebSocket Client Connected');
            client.send(JSON.stringify({ 'access_token': token }));
            console.log('Sent access_token as the first message!');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer) {
                console.log('RECEIVE DATA FROM SERVER', dataFromServer);
                console.log(dataFromServer.message)
                // Lấy student_id từ dữ liệu nhận được

                const studentId = dataFromServer.message.student_id;

                // Cập nhật presentStudents
                setPresentStudents((prevPresentStudents) => {
                    const updatedPresentStudents = { ...prevPresentStudents };

                    // Kiểm tra nếu student_id đã tồn tại trong danh sách presentStudents                        // Cập nhật trạng thái điểm danh của sinh viên
                    updatedPresentStudents[studentId] = true; // Ví dụ: Đánh dấu là đã điểm danh
                    return updatedPresentStudents;
                });

                notification.success({
                    message: dataFromServer.message,
                    description: 'Congratulations!!!',
                    placement: 'topRight'
                });
            }
        };

        setWebsocket(client);

        // Loại bỏ kết nối WebSocket khi Component unmount
        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, []); // Rỗng [] đảm bảo hiệu ứng này chỉ chạy một lần khi trang được tải.

    // Hàm gửi dữ liệu thông qua WebSocket
    const sendWebSocketData = () => {
        if (websocket) {
            const token = localStorage.getItem('access_token');
            websocket.send(JSON.stringify({ 'check_in': token }));
            console.log('Sent check-in signal and access_token via WebSocket');
        }
    };


    useEffect(() => {
        if (course) { // Kiểm tra xem course không phải là null hoặc undefined
            axiosInstance.get(`course/students/${course.course_id}/`)
                .then(response => {
                    setUsers(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi tải dữ liệu users:', error);
                });

            const currentTime = new Date();
            const year = currentTime.getFullYear();
            const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
            const day = currentTime.getDate().toString().padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            axiosInstance.get(`/attendance/?attendance_date=${today}&status=True&course_id=${course.course_id}&page_size=80`)
                .then(response => {
                    setPresentStudents(response.data.results.reduce((map, attendance) => {
                        map[attendance.student_id] = attendance.note;
                        return map;
                    }, {}));
                })
                .catch(error => {
                    console.error('Lỗi khi tải dữ liệu users:', error);
                });
        }
    }, [course]);

    return (
        <div style={modalStyles.AttendanceModal}>
            <div style={modalStyles.tableContainer}>
                <div style={modalStyles.tableWrapper}>
                    <table style={modalStyles.table}>
                        <thead>
                            <tr>
                                <th style={modalStyles.tableHeader}>STT</th>
                                <th style={modalStyles.tableHeader}>Mã số sinh viên</th>
                                <th style={modalStyles.tableHeader}>Họ và tên sinh viên</th>
                                <th style={modalStyles.tableHeader}>Môn học</th>
                                <th style={modalStyles.tableHeader}>Trạng thái điểm danh</th>
                                <th style={modalStyles.tableHeader}>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && Array.isArray(users) ? (
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td style={modalStyles.cell}>{index + 1}</td>
                                        <td style={modalStyles.cell}>{user.staff_id}</td>
                                        <td style={modalStyles.cell}>{user.full_name}</td>
                                        <td style={modalStyles.cell}>
                                            {course ? course.course_name : '-'}
                                        </td>
                                        <td style={modalStyles.cell}>
                                            {presentStudents[user.staff_id] ? (
                                                <span style={modalStyles.tick}>&#10003;</span>
                                            ) : (
                                                <span style={modalStyles.cross}>&#10007;</span>
                                            )}
                                        </td>
                                        <td style={modalStyles.cell}>{presentStudents[user.staff_id] || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No data available</td>
                                </tr>
                            )}
                        </tbody>
                        {isWithinTimeRange(course?.start_time, course?.end_time) ? (
                            <button style={modalStyles.button} onClick={sendWebSocketData}>Điểm danh</button>
                        ) : (
                            <button style={modalStyles.disabledButton} disabled>Điểm danh</button>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;
