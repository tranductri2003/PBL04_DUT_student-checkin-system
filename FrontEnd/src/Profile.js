import React, { useState, useEffect } from 'react';
import axiosInstance from './axios';
import { useParams } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Avatar from '@material-ui/core/Avatar';
import './components/profile/Profile.css'

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật',];
    return daysOfWeek[dayOfWeek];
}
function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);

    const { staffId } = useParams();

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
                            <div style={{ width: '49%' }}>
                                <label htmlFor="zIp" className="boldLabel">Address</label>
                                <input type="text" id="zIp" placeholder="Địa chỉ" className="fullLengthControl" />
                            </div>
                        </div>

                    </div>
                </div>
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

export default Profile;