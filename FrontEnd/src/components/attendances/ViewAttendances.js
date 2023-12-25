import React from 'react';
import './ViewAttendances.css'; // Import CSS fil


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
        <div className="leaderboard">
            <table className="table">
                <thead>
                    <tr>
                        <th className="tableHeader">Subject</th>
                        <th className="tableHeader">Attendance Time</th>
                        <th className="tableHeader">Attendance Date</th>
                        <th className="tableHeader">Status</th>
                        <th className="tableHeader">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((attendance, index) => (
                        <tr key={attendance.id}>
                            <td className="cell">{attendance.course_name}</td>
                            <td className="cell">{formatTime(attendance.attendance_time)}</td>
                            <td className="cell">{attendance.attendance_date}</td>
                            <td className="cell">
                                <span className={`status ${attendance.status ? 'statusPresent' : 'statusAbsent'}`}>
                                    {attendance.status ? '✔️' : '❌'}
                                </span>
                            </td>
                            <td className="cell">{attendance.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default Leaderboard;
