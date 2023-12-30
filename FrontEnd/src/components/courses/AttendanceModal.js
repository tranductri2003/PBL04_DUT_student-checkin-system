import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { notification } from 'antd';
import Webcam from 'react-webcam';
import { FaCheck } from 'react-icons/fa'; // Sử dụng thư viện react-icons cho biểu tượng tick
import './AttendanceModal.css'
import jwt_decode from "jwt-decode";


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

    const [webcamVisible, setWebcamVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const webcamRef = useRef(null);

    const [savedPosition, setSavedPosition] = useState(null);
    const [avatars, setAvatars] = useState({});
    const [role, setRole] = useState('');

    const [isFaceValidated, setIsFaceValidated] = useState(false);
    const [isLocationValidated, setIsLocationValidated] = useState(false);
    const [isValidated, setIsValidated] = useState(false);


    const saveImageToLocalstorage = (imageName, imageData) => {
        localStorage.setItem(imageName, imageData);
    };



    // Function to convert data URI to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }




    const handleCapture = () => {
        const image = webcamRef.current.getScreenshot();
        setCapturedImage(image);
        setWebcamVisible(false);
        saveImageToLocalstorage('check_in_image', image);


        const token = localStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('image', dataURItoBlob(image)); // Convert data URI to Blob

        console.log("FORM DATA", formData);
        axiosInstance.post(
            `${process.env.REACT_APP_AI_URL}face-recognization`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                if (response.data.validated === true) {
                    notification.success({
                        message: 'Face Check',
                        description: `Validated!. Gudjob! `,
                        placement: 'topRight'
                    });
                } else {
                    notification.error({
                        message: 'Face Check',
                        description: `Not Validated!. Please try again!`,
                        placement: 'topRight'
                    });
                }
                setIsFaceValidated(response.data.validated); // Update the face validation status
            })
            .catch(error => {
                console.error('Lỗi khi tải dữ liệu users:', error);
            });
    };


    // Thêm useEffect để theo dõi thay đổi trong isFaceValidated và isLocationValidated
    useEffect(() => {
        // Nếu cả hai điều kiện đều đúng, cập nhật giá trị của isValidated thành true
        if (isFaceValidated && isLocationValidated) {
            setIsValidated(true);
        } else {
            setIsValidated(false);
        }
    }, [isFaceValidated, isLocationValidated]);

    // Sử dụng useEffect để thiết lập kết nối WebSocket khi trang được tải
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwt_decode(token);
            setRole(decodedToken.role);
        }
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
                    message: dataFromServer.message.message,
                    description: 'Congratulations!!!',
                    placement: 'topRight'
                });
            }
        };

        setWebsocket(client);

        // Loại bỏ kết nối WebSocket khi Component unmount
        return () => {
            if (client) {
                client.close();
            }
        };
    }, []); // Rỗng [] đảm bảo hiệu ứng này chỉ chạy một lần khi trang được tải.

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Bán kính trái đất trong km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Khoảng cách trong km
        return distance;
    }

    const handleCheckLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const currentPosition = { latitude, longitude };
                localStorage.setItem('position', JSON.stringify(currentPosition));

                // Show the coordinates on the screen
                notification.info({
                    message: 'Current Location',
                    description: `Latitude: ${latitude}, Longitude: ${longitude}`,
                    placement: 'topRight'
                });


                // Set the saved position to state for rendering on the screen
                setSavedPosition(currentPosition);

                const distance = calculateDistance(
                    latitude,
                    longitude,
                    16.073981,
                    108.149891
                );
                if (distance <= 1000) {
                    // Nếu khoảng cách lớn hơn 1km, thông báo
                    setIsLocationValidated(true);
                    notification.success({
                        message: 'Distance Check',
                        description: `The distance is smaller than 1km. Goood.`,
                        placement: 'topRight'
                    });
                } else {
                    setIsLocationValidated(false);
                    notification.error({
                        message: 'Distance Check',
                        description: `The distance is greater than 1km. Please check in within 1km.`,
                        placement: 'topRight'
                    });
                }
            }, (error) => {
                console.error('Error getting location:', error);
                notification.error({
                    message: 'Error',
                    description: 'Could not retrieve location.',
                    placement: 'topRight'
                });
            });
        } else {
            // Geolocation is not supported
            // Handle the case where geolocation is not supported
            notification.error({
                message: 'Error',
                description: 'Geolocation is not supported by your browser.',
                placement: 'topRight'
            });
        }
    };



    // Hàm gửi dữ liệu thông qua WebSocket
    const sendWebSocketData = () => {
        if (isFaceValidated && isLocationValidated) {
            if (websocket) {
                const token = localStorage.getItem('access_token');
                websocket.send(JSON.stringify({ 'check_in': token }));
                console.log('Sent check-in signal and access_token via WebSocket');
            }
        } else {
            // Show a notification for invalid conditions
            notification.error({
                message: 'Error',
                description: 'Invalid conditions for check-in. Please check face validation and location.',
                placement: 'topRight'
            });
        }
    };

    const turnOnCamera = () => {
        setWebcamVisible(true);
    };



    useEffect(() => {
        if (course) { // Kiểm tra xem course không phải là null hoặc undefined
            axiosInstance.get(`course/students/${course.course_id}/`)
                .then(response => {
                    setUsers(response.data);
                    response.data.forEach(user => {
                        axiosInstance.get(`/user/${user.staff_id}`)
                            .then(resp => {
                                setAvatars(prevAvatars => ({ ...prevAvatars, [user.staff_id]: resp.data.avatar }));
                            })
                            .catch(error => console.error('Error fetching avatar:', error));
                    });
                })
                .catch(error => {
                    console.error('Lỗi khi tải dữ liệu users:', error);
                });

            const currentTime = new Date();
            const year = currentTime.getFullYear();
            const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
            const day = currentTime.getDate().toString().padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            axiosInstance.get(`/attendance/?attendance_date=${today}&status=True&course_id=${course.course_id}&page_size=80&check_in=true`)
                .then(response => {
                    setPresentStudents(response.data.results.reduce((map, attendance) => {
                        map[attendance.student.staff_id] = attendance.note;
                        return map;
                    }, {}));
                })
                .catch(error => {
                    console.error('Lỗi khi tải dữ liệu users:', error);
                });
        }
    }, [course]);

    return (
        <div className="AttendanceModal">

            <div className="tableContainer">
                <div className="tableWrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="tableHeader">Avatar</th>
                                <th className="tableHeader">Mã số sinh viên</th>
                                <th className="tableHeader">Họ và tên sinh viên</th>
                                <th className="tableHeader">Môn học</th>
                                <th className="tableHeader">Trạng thái điểm danh</th>
                                <th className="tableHeader">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && Array.isArray(users) ? (
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="cell">
                                            {
                                                avatars[user.staff_id] &&
                                                <img
                                                    src={avatars[user.staff_id]}
                                                    alt=""
                                                    style={{
                                                        width: '70px',
                                                        height: '70px',
                                                        borderRadius: '10px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            }
                                        </td>
                                        <td className="cell">{user.staff_id}</td>
                                        <td className="cell">{user.full_name}</td>
                                        <td className="cell">
                                            {course ? course.course_name : '-'}
                                        </td>
                                        <td className="cell">
                                            {presentStudents[user.staff_id] ? (
                                                <span className="tick">✔</span>
                                            ) : (
                                                <span className="cross">✗</span>
                                            )}

                                        </td>
                                        <td className="cell">{presentStudents[user.staff_id] || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No data available</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    {role === 'S' && (
                        <>
                            {isWithinTimeRange(course?.start_time, course?.end_time) && (
                                <>
                                    <div className="ButtonContainer">
                                        <button className="cameraButton" onClick={turnOnCamera} disabled={isFaceValidated}>
                                            {isFaceValidated ? <FaCheck /> : 'Bật camera điểm danh'}
                                        </button>
                                        <button className="checkLocationButton" onClick={handleCheckLocation} disabled={isLocationValidated}>
                                            {isLocationValidated ? <FaCheck /> : 'Kiểm tra vị trí'}
                                        </button>
                                    </div>
                                    <div style={{ margin: '20px', textAlign: 'center' }}>
                                        <button className="button" onClick={sendWebSocketData} disabled={!isValidated}>
                                            Điểm danh
                                        </button>
                                    </div>
                                    {webcamVisible && (
                                        <div className="WebcamOverlay">
                                            <Webcam
                                                audio={false}
                                                videoConstraints={{ facingMode: 'user' }}
                                                ref={webcamRef}
                                            />
                                            <button className="CaptureButton" onClick={handleCapture}>Chụp ảnh</button>
                                        </div>
                                    )}
                                </>
                            )}

                        </>
                    )}


                    {savedPosition && (
                        <div style={{ margin: '20px', textAlign: 'center' }}>
                            <h3>Vị trí:</h3>
                            <p><strong>Vĩ độ:</strong> {savedPosition.latitude}</p>
                            <p><strong>Kinh độ:</strong> {savedPosition.longitude}</p>
                        </div>
                    )}

                    {capturedImage && (
                        <div style={{ margin: '20px', textAlign: 'center' }}>
                            <h3>Ảnh đã chụp:</h3>
                            <img
                                src={capturedImage}
                                alt="Captured"
                                style={{
                                    maxWidth: '100%', // Ensure the image doesn't exceed its container width
                                    borderRadius: '10px',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
                                }}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;
