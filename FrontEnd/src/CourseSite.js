import React, { useEffect, useState } from 'react';
import Courses from './components/courses/ViewCourse';
import CourseLoadingComponent from './DataLoading';
import axiosInstance from './axios';
import { notification } from 'antd'
import styled from 'styled-components';

const RoundedTextContainer = styled.div`
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 32px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 10px 20px;
    background: linear-gradient(to right, #00416A, #001022);
    -webkit-background-clip: text;
    color: transparent;
    border-radius: 10px; /* Điều chỉnh giá trị này để làm tròn góc */
    display: inline-block;
`;

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


    const dayOfWeekNumber = getDayOfWeekNumber();
    const queryParams = {
        day_of_week: dayOfWeekNumber,
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
    }, [setAppState, url]);


    return (
        <div className="App">
            <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: '32px', fontWeight: 'bold', marginTop: '30px', marginBottom: '30px', color: 'darkblue' }}>
                <span role="img" aria-label="Class Today">📝</span> Class Today
            </div>
            <div>
                <CourseLoading isLoading={appState.loading} data={appState.courses} />
            </div>
        </div>
    );
}

export default App;
