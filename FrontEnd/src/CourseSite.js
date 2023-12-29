import React, { useEffect, useState } from 'react';
import Courses from './components/courses/ViewCourse';
import CourseLoadingComponent from './DataLoading';
import axiosInstance from './axios';
import { notification } from 'antd'
import Button from '@material-ui/core/Button';
import './components/courses/CourseSite.css';
import queryString from 'query-string';
import jwt_decode from "jwt-decode";



function getDayOfWeekNumber() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // Trừ đi 1 để chuyển đổi từ 0 là Chủ Nhật thành 0 là Thứ Hai, 1 là Thứ Ba và tiếp tục
    return (dayOfWeek + 6) % 7;
}


function App() {
    const CourseLoading = CourseLoadingComponent(Courses);
    const [appState, setAppState] = useState({
        loading: true,
        courses: null,
    });


    const [selectedStaffId, setSelectedStaffId] = useState('');
    const urlParams = new URLSearchParams(window.location.search);
    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwt_decode(token);
            setUserRole(decodedToken.role); // Hoặc cách lấy role khác tùy thuộc vào cấu trúc token của bạn
        }
    }, []);
    const handleFilter = () => {
        if (selectedStaffId) {
            urlParams.set('staff_id', selectedStaffId);
        } else {
            urlParams.delete('staff_id');
        }
        window.location.search = urlParams.toString();
    }

    const filterParams = queryString.parse(window.location.search);

    const dayOfWeekNumber = getDayOfWeekNumber();
    const queryParams = {
        day_of_week: dayOfWeekNumber,
        staff_id: filterParams.staff_id
    };
    const url = axiosInstance.getUri({
        url: "/course",
        params: queryParams,
    });

    useEffect(() => {
        axiosInstance.get(url).then((response) => {
            console.log(response.data);
            setAppState({ loading: false, courses: response.data });
        })
            .catch((error) => {
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
            });;
    }, [window.location.search]);


    return (
        <div className="App">
            <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: '32px', fontWeight: 'bold', marginTop: '30px', marginBottom: '30px', color: 'darkblue' }}>
                <span role="img" aria-label="Class Today">📝</span> Class Today
            </div>
            {userRole === 'A' && (
                <div className="filterContainer">
                    <input
                        type="text"
                        placeholder="Enter Staff ID"
                        value={selectedStaffId}
                        onChange={e => setSelectedStaffId(e.target.value)}
                        className="filterInput"
                    />

                    {/* Updated Filter Button to match AttendanceSite */}
                    <Button
                        className="filterButton" // Apply similar className as in AttendanceSite
                        variant="contained"
                        color="primary"
                        onClick={handleFilter}
                    >
                        Filter
                    </Button>
                </div>
            )}
            <div>
                <CourseLoading isLoading={appState.loading} data={appState.courses} />
            </div>
        </div>
    );
}

export default App;
