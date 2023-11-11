import React from 'react';

const styles = {
    leaderboard: {
        fontFamily: 'cursive',
        textAlign: 'center',
        margin: '20px',
    },
    table: {
        borderCollapse: 'collapse',
        width: '80%',
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


const Leaderboard = (props) => {
    const { data } = props;
    console.log(data);

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
                            <td style={styles.cell}>{attendance.attendance_time}</td>
                            <td style={styles.cell}>{attendance.attendance_date}</td>
                            <td style={styles.cell}>{attendance.status ? 'Present' : 'Absent'}</td>
                            <td style={styles.cell}>{attendance.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
