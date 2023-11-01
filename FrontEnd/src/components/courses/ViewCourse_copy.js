import React from "react";

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

function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek[dayOfWeek];
}

const Leaderboard = (props) =>  {
    const { data } = props;
    console.log(data);
    return (
        <div style={ styles.leaderboard }>
            <table style={style.table}>
                <thread>
                    <tr>
                        <th style={styles.tableHeader}>ID</th>
                        <th style={styles.tableHeader}>Tên Môn Học</th>
                        <th style={styles.tableHeader}>Ngày</th>
                        <th style={styles.tableHeader}>Giờ</th>
                        <th style={styles.tableHeader}>Trạng thái</th>
                    </tr>
                </thread>
                <tbody>
                    {
                        data && Array.isArray(data) ? (
                            data.map((course, index) => (
                                <tr key={courses.id}>
                                    <td style={styles.cell}>{courses.course_id}</td>
                                    <td style={styles.cell}>{courses.course_name}</td>
                                    <td style={styles.cell}>{getDayOfWeekName(courses.day_of_week)}</td>                                <td style={styles.cell}>{courses.start_time}</td>
                                    {/* <td style={styles.cell}>{attendance.status ? 'Present' : 'Absent'}</td>*/}
                                    <td style={styles.cell}>default</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No data available</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard;