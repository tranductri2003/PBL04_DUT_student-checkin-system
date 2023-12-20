import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Avatar from '@material-ui/core/Avatar';

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;
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

    const styles = {
        container: {
            paddingTop: '40px',
            color: '#2e323c',
            background: '#f5f6fa',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column', // Set to column to stack children vertically
            justifyContent: 'center',
            alignItems: 'center', // Center children horizontally
            width: '100%', // Ensures the container takes full width of the parent
        },
        card: {
            background: '#ffffff',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            width: '70%',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden', // Prevent content from overflowing the card
            marginBottom: '20px', // Adds spacing between cards
        },
        leftColumn: {
            flex: '1',
            padding: '20px',
            borderRight: '1px solid #eaeaea',
            textAlign: 'center',
        },
        rightColumn: {
            flex: '2',
            padding: '20px',
        },
        userAvatar: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            marginBottom: '1rem',
        },
        userName: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
        },
        userEmail: {
            color: '#9fa8b9',
            fontSize: '1rem', // Increase the font size here

        },
        aboutHeading: {
            color: '#007ae1',
            margin: '1.5rem 0 1rem 0',
        },
        aboutText: {
            color: '#2e323c',
        },
        formControl: {
            border: '1px solid #cfd1d8',
            borderRadius: '2px',
            fontSize: '0.825rem',
            background: '#ffffff',
            color: '#2e323c',
            marginBottom: '0.5rem',
            width: '100%',
            padding: '0.375rem 0.75rem',
            boxSizing: 'border-box',
        },
        formGroup: {
            marginBottom: '1rem',
        },
        formRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
        },
        halfWidthControl: {
            border: '1px solid #cfd1d8',
            borderRadius: '2px',
            fontSize: '0.825rem',
            background: '#ffffff',
            color: '#2e323c',
            width: '48%', // Adjusted to less than half for margin
            padding: '0.375rem 0.75rem',
            boxSizing: 'border-box',
        },
        formRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
        },
        fullLengthControl: {
            border: '1px solid #cfd1d8',
            borderRadius: '2px',
            fontSize: '0.825rem',
            background: '#ffffff',
            color: '#2e323c',
            width: '100%', // Set to full width
            padding: '0.5rem 1rem',
            boxSizing: 'border-box',
            marginRight: '1%', // Add a small margin to the right
        },
        heading: {
            fontSize: '1rem', // Increase the font size as needed
            color: '#007bff', // This is a shade of blue, adjust as desired
            marginBottom: '1rem', // Optional: adds space below the heading
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end', // Aligns the buttons to the right
            marginTop: '1rem',
        },
        cancelButton: {
            backgroundColor: '#6c757d', // Bootstrap's gray color
            color: 'white', // Text color for the cancel button
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            marginRight: '0.5rem', // Adds space between the cancel and update buttons
        },
        updateButton: {
            backgroundColor: '#007bff', // Bootstrap's blue color
            color: 'white', // Text color for the update button
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
        },
        boldLabel: {
            fontWeight: 'bold', // This makes the text bold
            color: '#2e323c', // You can adjust the color if needed
            marginBottom: '0.5rem', // Optional: adds some space below the label
            display: 'block', // Makes the label take the full width
        },









        leaderboard: {
            top: '0', // Đặt top để leaderboard bắt đầu từ đầu của rightColumn
            left: '0', // Đặt left để leaderboard bắt đầu từ bên trái của rightColumn
            width: '100%', // Đảm bảo leaderboard có chiều rộng tối đa
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
        link: {
            textDecoration: 'none',
            color: 'blue',
            cursor: 'pointer',
        },


    };
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.leftColumn}>
                    <img src={`${userInfo.avatar}`} alt="User Avatar" style={styles.userAvatar} />
                    <h5 style={styles.userName}>{userInfo.full_name}</h5>
                    <h6 style={styles.userEmail}>{userInfo.staff_id} </h6>
                    <div>
                        <h5 style={styles.heading}>About me</h5>
                        <p style={styles.aboutText}>
                            {userInfo.about}
                        </p>
                    </div>
                </div>
                <div style={styles.rightColumn}>
                    <div>
                        <h6 style={styles.heading} >Personal Details</h6>
                        <div style={styles.formRow}>

                            <div style={{ width: '49%' }}>
                                <label htmlFor="fullName" style={styles.boldLabel} >Full Name</label>
                                <input type="text" id="fullName" placeholder="Họ và tên" style={styles.fullLengthControl} value={userInfo.full_name} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="eMail" style={styles.boldLabel} >Email</label>
                                <input type="email" id="eMail" placeholder="Email" style={styles.fullLengthControl} value={userInfo.email} />
                            </div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="phone" style={styles.boldLabel} >Phone</label>
                                <input type="text" id="phone" placeholder="Số điện thoại" style={styles.fullLengthControl} value={userInfo.phone_number} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="website" style={styles.boldLabel}>Date of birth</label>
                                <input type="url" id="website" placeholder="Ngày tháng năm sinh" style={styles.fullLengthControl} value={userInfo.date_of_birth} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h6 style={styles.heading} >Education</h6>
                        <div style={styles.formRow}>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="Street" style={styles.boldLabel} >University</label>
                                <input type="text" id="Street" placeholder="Đại học" style={styles.fullLengthControl} value={userInfo.university} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="ciTy" style={styles.boldLabel} >Faculty</label>
                                <input type="text" id="ciTy" placeholder="Khoa" style={styles.fullLengthControl} value={userInfo.faculty} />
                            </div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="sTate" style={styles.boldLabel} >Class</label>
                                <input type="text" id="sTate" placeholder="Lớp sinh hoạt" style={styles.fullLengthControl} value={userInfo.class_id} />
                            </div>
                            <div style={{ width: '49%' }}>
                                <label htmlFor="zIp" style={styles.boldLabel} >Address</label>
                                <input type="text" id="zIp" placeholder="Địa chỉ" style={styles.fullLengthControl} />
                            </div>
                        </div>

                    </div>
                    {/* <div>
                        <div style={styles.buttonContainer}>

                            <div>
                                <button type="button" id="cancel" name="cancel" className="btn btn-secondary" style={styles.cancelButton}>Cancel</button>
                                <button type="button" id="submit" name="submit" className="btn btn-primary" style={styles.updateButton}>Update</button>
                            </div>
                        </div>

                    </div> */}
                </div>
            </div>


            <div style={styles.card}>
                <div style={styles.leaderboard}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>STT</th>
                                <th style={styles.tableHeader}>Mã lớp học phần</th>
                                <th style={styles.tableHeader}>Tên lớp học phần</th>
                                <th style={styles.tableHeader}>Giảng viên</th>
                                <th style={styles.tableHeader}>Thời khóa biểu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseInfo && Array.isArray(courseInfo) ? (
                                courseInfo.map((course, index) => (
                                    <tr key={course.id}>
                                        <td style={styles.cell}>{index + 1}</td>
                                        <td style={styles.cell}>{course.course_id}</td>
                                        <td style={styles.cell}>{course.course_name}</td>
                                        <td style={styles.cell}>{course.teacher.full_name}</td>
                                        <td style={styles.cell}>
                                            {course.day_of_week} {course.start_time} - {course.end_time} - {course.room}
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