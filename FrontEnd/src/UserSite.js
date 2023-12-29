import React, { useState, useEffect } from 'react';
import axiosInstance from './axios';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import { message, notification } from 'antd';
import jwt_decode from "jwt-decode";


import './components/profile/Profile.css'

function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật',];
    return daysOfWeek[dayOfWeek];
}
function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { staffId } = useParams();
    var user_staff_id = "";
    var role = "";
    if (localStorage.getItem('access_token')) {
        // Lấy token từ nơi bạn lưu trữ nó, ví dụ localStorage hoặc cookies
        const token = localStorage.getItem("access_token"); // Thay thế bằng cách lấy token từ nơi bạn lưu trữ nó

        // Giải mã token
        const decodedToken = jwt_decode(token);

        // Lấy staff_id từ payload của token
        user_staff_id = decodedToken.staff_id;
        role = decodedToken.role;

        //console.log(role);
    }
    useEffect(() => {
        axiosInstance.get(`/user/${staffId}`)
            .then(response => {
                console.log(response.data);
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [staffId]);

    useEffect(() => {
        axiosInstance.get(`/course/?staff_id=${staffId}`)
            .then(response => {
                setCourseInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [staffId]);
    if (!userInfo) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container">
            <div className="card">
                <div className="leftColumn">
                    <img src={`${userInfo.avatar}`} alt="User Avatar" className="userAvatar" />
                    <h5 className="userName">{userInfo.full_name}</h5>
                    <h6 className="userEmail">{userInfo.staff_id}</h6>
                    <div>
                        <h5 className="heading">About me</h5>
                        <p className="aboutText">
                            {userInfo.about}
                        </p>
                    </div>
                </div>
                <div className="rightColumn">
                    <div>
                        <h6 className="heading">Personal Details</h6>
                        <div className="formRow">

                            <div style={{ width: '49%' }}>
                                <label htmlFor="fullName" className="boldLabel" >Full Name</label>
                                <input type="text" id="fullName" placeholder="Họ và tên" className="fullLengthControl" value={userInfo.full_name} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="eMail" className="boldLabel" >Email</label>
                                <input type="email" id="eMail" placeholder="Email" className="fullLengthControl" value={userInfo.email} />
                            </div>
                        </div>
                        <div className="formRow">
                            <div style={{ width: '49%' }}>
                                <label htmlFor="phone" className="boldLabel" >Phone</label>
                                <input type="text" id="phone" placeholder="Số điện thoại" className="fullLengthControl" value={userInfo.phone_number} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="website" className="boldLabel">Date of birth</label>
                                <input type="url" id="website" placeholder="Ngày tháng năm sinh" className="fullLengthControl" value={userInfo.date_of_birth} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h6 className="heading">Education</h6>
                        <div className="formRow">
                            <div style={{ width: '49%' }}>
                                <label htmlFor="Street" className="boldLabel">University</label>
                                <input type="text" id="Street" placeholder="Đại học" className="fullLengthControl" value={userInfo.university} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="ciTy" className="boldLabel">Faculty</label>
                                <input type="text" id="ciTy" placeholder="Khoa" className="fullLengthControl" value={userInfo.faculty} />
                            </div>
                        </div>
                        <div className="formRow">
                            <div style={{ width: '49%' }}>
                                <label htmlFor="sTate" className="boldLabel">Class</label>
                                <input type="text" id="sTate" placeholder="Lớp sinh hoạt" className="fullLengthControl" value={userInfo.class_id} />
                            </div>
                            {(staffId === user_staff_id || role === 'A') && (
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="sTate" className="boldLabel">Update Password</label>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={openModal}
                                    >
                                        Update
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <ForgotPasswordModal isOpen={isModalOpen} onRequestClose={closeModal} staffId={staffId} />
            </div>


            <div className="card">
                <div className="leaderboard">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="tableHeader">STT</th>
                                <th className="tableHeader">Mã lớp học phần</th>
                                <th className="tableHeader">Tên lớp học phần</th>
                                <th className="tableHeader">Giảng viên</th>
                                <th className="tableHeader">Thời khóa biểu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseInfo && Array.isArray(courseInfo) ? (
                                courseInfo.map((course, index) => (
                                    <tr key={course.id}>
                                        <td className="cell">{index + 1}</td>
                                        <td className="cell">{course.course_id}</td>
                                        <td className="cell">{course.course_name}</td>
                                        <td className="cell">{course.teacher.full_name}</td>
                                        <td className="cell">
                                            {getDayOfWeekName(course.day_of_week)} {course.start_time} - {course.end_time} - {course.room}
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
            </div>
        </div>

    );
}

function ForgotPasswordModal({ isOpen, onRequestClose, staffId }) {
    // Trạng thái và hàm xử lý cho form quên mật khẩu
    const [formData, setFormData] = useState({
        staff_id: '',
        email: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData.new_password, formData.old_password, formData.confirm_new_password)
        if (formData.new_password !== formData.confirm_new_password) {
            setError('New password and confirm new password do not match.');
            return; // Stop the form submission
        }
        if (formData.new_password === formData.old_password) {
            setError('The old password must be different from the new password.');
            return;
        }
        setError('');

        const payload = {
            old_password: formData.old_password,
            new_password: formData.new_password,
        };

        axiosInstance.put(`/user/${staffId}/`, payload)
            .then(response => {
                console.log(response.data);
                notification.success({
                    message: 'Update Password successfully',
                    description: `Your password was updated!!!`,
                    placement: 'topRight'
                })
                // Xử lý thành công (Bạn cũng có thể hiển thị thông báo thành công)
                onRequestClose(); // Đóng modal sau khi gửi yêu cầu
            })
            .catch(error => {
                console.error('Lỗi cập nhật mật khẩu:', error);
                // Xử lý lỗi (Bạn cũng có thể hiển thị thông báo lỗi)
            });
        onRequestClose(); // Đóng modal sau khi gửi
    };

    return (
        <Modal isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },

                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%', // Tăng kích thước chiều rộng
                    height: '60%', // Điều chỉnh chiều cao tự động
                    maxWidth: '600px', // Giới hạn kích thước tối đa
                }
            }}

        >
            <div className="forgotPasswordContainertent">
                <h2>Update Password</h2>
                <form className="forgotPasswordForm" onSubmit={handleSubmit}>
                    <TextField
                        className="forgotPasswordTextField"
                        type="password"
                        name="old_password"
                        label="Old Password"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        className="forgotPasswordTextField"
                        type="password"
                        name="new_password"
                        label="New Password"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        className="forgotPasswordTextField"
                        type="password"
                        name="confirm_new_password"
                        label="Confirm New Password"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                    />
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="modalButton"
                    >
                        Update
                    </Button>
                </form>
            </div>
        </Modal>
    );
}
export default Profile;