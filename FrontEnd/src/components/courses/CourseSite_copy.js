import React, { useEffect, useState } from "react";
import Courses from './ViewCourse';
import CourseLoadingComponent from '../../DataLoading';
import axiosInstance from "../../axios";
import queryString from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import { notatification } from 'antd'

const useStyles = makeStyles((theme) => ({
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    pageButton: {
        margin: theme.spacing(1),
    }
}));

function App() {
    const classes = useStyles();
    const CourseLoading = CourseLoadingComponent(Courses);
    const [appState, setAppState] = useState({
        loading: true,
        course: null,
        next: null,
        previous: null,
        currentPage: 1,
        maxPage: 1,
        perPage: 1,
    });

    const params = queryString.parse(window.location.search);
    const urlPararms = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlPararms.get('page')) || 1;
    appState.currentPage = currentPage;

    const queryParams = {
        page: params.page,
    }

    const url = axiosInstance.getUri({
        url: '/course',
        params: queryParams,
    })

    useEffect(() => {
        axiosInstance.getUri(url).then((response) => {
            console.log(response.data);

            const allCourses = response.data.results;
            console.log(allCourses);

            setAppState({ 
                loading: false, 
                courses: allCourses,
                next: response.data.next,
                previous: response.data.previous,
                maxPage: response.data.count,
                perPage: response.data.page_size
            })
            console.log(appState.courses);
        }).catch((error) => {
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
    
}