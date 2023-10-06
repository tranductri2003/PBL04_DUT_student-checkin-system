import React, { useEffect, useState } from 'react';
import Courses from './ViewCourse';
import CourseLoadingComponent from '../../DataLoading';
import axiosInstance from '../../axios';
import queryString from 'query-string';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { notification } from 'antd'
const useStyles = makeStyles((theme) => ({
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    pageButton: {
        margin: theme.spacing(1),
    },
}));



function App() {
    const classes = useStyles(); // Add this line to get the classes object

    const CourseLoading = CourseLoadingComponent(Courses);
    const [appState, setAppState] = useState({
        loading: true,
        courses: null,
        next: null,
        previous: null,
        currentPage: 1,
        maxPage: 1,
        perPage: 1,
    });
    // Lấy các tham số từ URL của FE
    const params = queryString.parse(window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    appState.currentPage = currentPage;


    const queryParams = {
        page: params.page,
    };
    const url = axiosInstance.getUri({
        url: "/course/today/",
        params: queryParams,
    });

    useEffect(() => {
        axiosInstance.get(url).then((response) => {
            console.log(response.data);

            const allCourses = response.data.results;
            console.log(allCourses);

            setAppState({ loading: false, courses: allCourses, next: response.data.next, previous: response.data.previous, maxPage: response.data.count, perPage: response.data.page_size });
            console.log(appState.courses);
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



    // Thêm hàm xử lý khi nhấp nút Previous
    const handlePreviousPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('page')) || 1;
        urlParams.set('page', currentPage - 1);

        // Tạo URL mới với giá trị parameter "page" tăng lên 1
        const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

        // Chuyển hướng trang sang URL mới
        window.location.href = newUrl;
    };

    // Thêm hàm xử lý khi nhấp nút Next
    const handleNextPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('page')) || 1;
        urlParams.set('page', currentPage + 1);

        // Tạo URL mới với giá trị parameter "page" tăng lên 1
        const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

        // Chuyển hướng trang sang URL mới
        window.location.href = newUrl;

    };
    const handlePageNumber = (pageNumber) => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', pageNumber);

        // Tạo URL mới với giá trị parameter "page" tương ứng với số trang được nhấp
        const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

        // Chuyển hướng trang sang URL mới
        window.location.href = newUrl;
    };

    return (
        <div className="App">
            <div style={{ fontFamily: 'cursive', fontSize: '32px', fontWeight: 'bold', marginTop: '30px', marginBottom: '30px' }}>
                <span role="img" aria-label="Class Today">📝</span> Class Today
            </div>
            <div>
                <CourseLoading isLoading={appState.loading} data={appState.courses} />
            </div>
            {/* Container chứa cả dãy số trang và nút Previous và Next */}
            <div className={classes.paginationContainer}>
                {/* Hiển thị nút Previous nếu không phải trang đầu tiên */}
                {appState.previous != null && (
                    <Button variant="contained" color="primary" onClick={handlePreviousPage} className={classes.pageButton}>
                        Previous
                    </Button>
                )}
                {/* Hiển thị dãy số trang */}
                {Array.from({ length: Math.ceil(appState.maxPage / appState.perPage) }, (_, index) => index + 1).map((page) => (
                    <Button
                        key={page}
                        variant={page === appState.currentPage ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => handlePageNumber(page)}
                        className={classes.pageButton}
                    >
                        {page}
                    </Button>
                ))}

                {/* Hiển thị nút Next nếu không phải trang cuối cùng */}
                {appState.next != null && (
                    <Button variant="contained" color="primary" onClick={handleNextPage} className={classes.pageButton}>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}

export default App;
