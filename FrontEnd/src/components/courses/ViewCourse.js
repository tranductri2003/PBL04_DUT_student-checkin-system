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
