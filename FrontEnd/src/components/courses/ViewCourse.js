import React, { useState } from 'react';
import Modal from 'react-modal';
import AttendanceModal from './AttendanceModal';
import { notification } from 'antd'
import axiosInstance from '../../axios';
import jwt_decode from "jwt-decode";
import './ViewCourse.css';
import Button from '@material-ui/core/Button';



function openModal(setModalIsOpen, setSelectedCourse, course) {
    setSelectedCourse(course);
    setModalIsOpen(true);
}

function closeModal(setModalIsOpen, setSelectedCourse) {
    setSelectedCourse(null);
    setModalIsOpen(false);
}
function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật',];
    return daysOfWeek[dayOfWeek];
}
const Leaderboard = (props) => {
    var staff_id = "";
    var role = "";

    const [filterStaffId, setFilterStaffId] = useState(staff_id);

    const handleFilterChange = (e) => {
        setFilterStaffId(e.target.value);
    };

    const applyFilter = () => {

    };

    if (localStorage.getItem('access_token')) {
        // Lấy token từ nơi bạn lưu trữ nó, ví dụ localStorage hoặc cookies
        const token = localStorage.getItem("access_token"); // Thay thế bằng cách lấy token từ nơi bạn lưu trữ nó

        // Giải mã token
        const decodedToken = jwt_decode(token);

        // Lấy staff_id từ payload của token
        staff_id = decodedToken.staff_id;
        role = decodedToken.role;
        //console.log(role);
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
    const { data } = props;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    return (
        <div>
            <div className="filterContainer">
                <input
                    type="text"
                    placeholder="Enter Staff ID"
                    value={filterStaffId}
                    onChange={handleFilterChange}
                    className="filterInput"
                />

                {/* Updated Filter Button to match AttendanceSite */}
                <Button
                    className="filterButton" // Apply similar className as in AttendanceSite
                    variant="contained"
                    color="primary"
                    onClick={applyFilter}
                >
                    Filter
                </Button>
            </div>
            <div className="leaderboard">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="tableHeader">STT</th>
                            <th className="tableHeader">Mã lớp học phần</th>
                            <th className="tableHeader">Tên lớp học phần</th>
                            <th className="tableHeader">Giảng viên</th>
                            <th className="tableHeader">Thời khóa biểu</th>
                            <th className="tableHeader">Trạng thái điểm danh</th>
                            {role !== 'T' && <th className="tableHeader">Xin giáo viên nghỉ</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data && Array.isArray(data) ? (
                            data.map((course, index) => (
                                <tr key={course.id}>
                                    <td className="cell">{index + 1}</td>
                                    <td className="cell">{course.course_id}</td>
                                    <td className="cell">{course.course_name}</td>
                                    <td className="cell">{course.teacher.full_name}</td>
                                    <td className="cell">
                                        {getDayOfWeekName(course.day_of_week)} {course.start_time} - {course.end_time} - {course.room}
                                    </td>
                                    <td className="cell">
                                        <button className="buttonAttendance" onClick={() => openModal(setModalIsOpen, setSelectedCourse, course)}>
                                            {role === 'T' ? 'Xem' : 'Điểm danh'}
                                        </button>                                </td>
                                    {role !== 'T' && (
                                        <td className="cell">
                                            <button className="buttonAttendance" onClick={() => handleCreateRoom(staff_id, course.teacher.staff_id, localStorage.getItem("full_name"), course.teacher.full_name)}>Nhắn tin</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => closeModal(setModalIsOpen, setSelectedCourse)}
                    className="modalContent" // Sử dụng class CSS ở đây
                    contentLabel="Example Modal"
                    shouldCloseOnOverlayClick={true}
                >
                    <AttendanceModal course={selectedCourse} closeModal={() => closeModal(setModalIsOpen, setSelectedCourse)} />

                </Modal>
            </div>
        </div>
    );
};

export default Leaderboard;
