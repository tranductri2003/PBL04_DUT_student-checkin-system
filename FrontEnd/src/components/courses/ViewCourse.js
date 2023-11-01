import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { notification } from 'antd';

const styles = {
    leaderboard: {
        fontFamily: 'cursive',
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
    disabledButton: {
        backgroundColor: 'gray',
        color: 'white',
        border: 'none',
        cursor: 'not-allowed',
        padding: '10px 20px',
        borderRadius: '5px',
    },
    link: {
        textDecoration: 'none',
        color: 'blue',
        cursor: 'pointer',
    },
};

function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek[dayOfWeek];
}

function isWithinTimeRange(startTime, endTime) {
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
    return false;
}

const Leaderboard = (props) => {
    const { data } = props;
    const [websocket, setWebsocket] = useState(null);

    let course_id = "";
    if (data && Array.isArray(data)) {
        for (const course of data) {
            if (isWithinTimeRange(course.start_time, course.end_time)) {
                course_id = course.course_id;
                break; // Dừng khi tìm thấy lớp học đầu tiên thỏa mãn điều kiện
            }
        }
    }

    // Sử dụng useEffect để thiết lập kết nối WebSocket khi trang được tải
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const websocketURL = `${process.env.REACT_APP_CHECK_IN_WEBSOCKET_URL}${course_id}/`;
        const client = new W3CWebSocket(websocketURL);

        client.onopen = () => {
            console.log('WebSocket Client Connected');
            // client.send(JSON.stringify({ 'access_token': token }));
            // console.log('Sent access_token as the first message!');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer) {
                console.log('RECEIVE DATA FROM SERVER', dataFromServer);

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
            websocket.send(JSON.stringify({ 'access_token': token }));
            console.log('Sent access_token via WebSocket');
        }
    };


    return (
        <div style={styles.leaderboard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>STT</th>
                        <th style={styles.tableHeader}>Mã lớp học phần</th>
                        <th style={styles.tableHeader}>Tên lớp học phần</th>
                        <th style={styles.tableHeader}>Giảng viên</th>
                        <th style={styles.tableHeader}>Thời khóa biểu</th>
                        <th style={styles.tableHeader}>Trạng thái điểm danh</th>
                        <th style={styles.tableHeader}>Xin giáo viên nghỉ</th>
                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) ? (
                        data.map((course, index) => (
                            <tr key={course.id}>
                                <td style={styles.cell}>{index + 1}</td>
                                <td style={styles.cell}>{course.course_id}</td>
                                <td style={styles.cell}>{course.course_name}</td>
                                <td style={styles.cell}>{course.teacher_id}</td>
                                <td style={styles.cell}>
                                    {getDayOfWeekName(course.day_of_week)} {course.start_time} - {course.end_time} - {course.room}
                                </td>
                                <td style={styles.cell}>
                                    {isWithinTimeRange(course.start_time, course.end_time) ? (
                                        <button style={styles.button} onClick={sendWebSocketData}>Điểm danh</button>
                                    ) : (
                                        <button style={styles.disabledButton} disabled>Điểm danh</button>
                                    )}
                                </td>
                                <td><a href='/' style={styles.link}>Chat với giáo viên</a></td>
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