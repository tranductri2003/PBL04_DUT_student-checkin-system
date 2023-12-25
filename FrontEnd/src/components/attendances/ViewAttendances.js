import React from 'react';

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
        width: '80%',
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
    avatarCell: {
        padding: '12px',
        textAlign: 'center',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
    },
    authorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minWidth: '150px',
    },
    authorName: {
        marginLeft: '10px',
        textDecoration: 'none',
        fontFamily: 'cursive',
    },
};

const getStatusStyle = (isPresent) => ({
    color: isPresent ? 'green' : 'red',
    fontSize: '20px',
});

const Leaderboard = (props) => {
    const { data } = props;
    console.log(data);
    const formatTime = (timeString) => {
        return timeString.split('.')[0]; // Chỉ lấy phần trước dấu chấm
    };
    return (
        <div style={styles.leaderboard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Subject</th>
                        <th style={styles.tableHeader}>Attendance Time</th>
                        <th style={styles.tableHeader}>Attendance Date</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((attendance, index) => (
                        <tr key={attendance.id}>
                            <td style={styles.cell}>{attendance.course_name}</td>
                            <td style={styles.cell}>{formatTime(attendance.attendance_time)}</td>
                            <td style={styles.cell}>{attendance.attendance_date}</td>
                            <td style={styles.cell}>
                                <span style={getStatusStyle(attendance.status)}>
                                    {attendance.status ? '✔️' : '❌'}
                                </span>
                            </td>
                            <td style={styles.cell}>{attendance.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
