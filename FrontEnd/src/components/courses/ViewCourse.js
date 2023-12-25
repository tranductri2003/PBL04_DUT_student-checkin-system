import React, { useState } from 'react';
import Modal from 'react-modal';
import AttendanceModal from './AttendanceModal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '90vh',
        width: '70%',
        overflowY: 'auto',
    },
};

const styles = {
    leaderboard: {
        fontFamily: '"Helvetica Neue", Arial, sans-serif', // Updated to a more sophisticated font
        textAlign: 'center',
        margin: '20px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        borderRadius: '10px',
        background: 'linear-gradient(to bottom, #ffffff, #f1f1f1)', // Gradient background

    },
    table: {
        borderCollapse: 'collapse',
        width: '100%',
        border: '1px solid #e0e0e0', // Lighter border color
        margin: '0 auto',
        borderRadius: '10px',
        background: 'white', // White background for the table
    },
    tableHeader: {
        padding: '16px',
        backgroundColor: 'darkblue', // Slightly different header background
        color: 'white', // Màu chữ trắng
        fontSize: '20px', // Larger font size
        fontWeight: '600', // Bold but not too heavy
        borderBottom: '2px solid #e0e0e0', // Header underline
    },
    cell: {
        padding: '12px',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold', // Chữ in đậm
        borderBottom: '2px solid #e0e0e0', // Light borders for cells
        transition: 'background-color 0.3s', // Smooth transition for hover
        '&:hover': {
            backgroundColor: '#f7f7f7',
        },
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '5px',
        fontWeight: 'bold', // Chữ in đậm

    },
    link: {
        textDecoration: 'none',
        color: 'blue',
        cursor: 'pointer',
        fontWeight: 'bold', // Chữ in đậm

    },
};

function openModal(setModalIsOpen, setSelectedCourse, course) {
    setSelectedCourse(course);
    setModalIsOpen(true);
}

function closeModal(setModalIsOpen, setSelectedCourse) {
    setSelectedCourse(null);
    setModalIsOpen(false);
}

const Leaderboard = (props) => {
    const { data } = props;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

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
                                    {course.day_of_week} {course.start_time} - {course.end_time} - {course.room}
                                </td>
                                <td style={styles.cell}>
                                    <button style={styles.button} onClick={() => openModal(setModalIsOpen, setSelectedCourse, course)}>Điểm danh</button>
                                </td>
                                <td><a href='/hall' style={styles.link}>Chat với giáo viên</a></td>
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
                style={customStyles}
                contentLabel="Example Modal"
                shouldCloseOnOverlayClick={true}
            >
                <AttendanceModal course={selectedCourse} closeModal={() => closeModal(setModalIsOpen, setSelectedCourse)} />

            </Modal>
        </div>
    );
};

export default Leaderboard;
