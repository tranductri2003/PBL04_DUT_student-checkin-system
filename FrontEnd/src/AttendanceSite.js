import React, { useEffect, useState } from 'react';
import Attendances from './components/attendances/ViewAttendances';
import AttendanceLoadingComponent from './DataLoading';
import axiosInstance from './axios';
import queryString from 'query-string';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { notification, Select, DatePicker } from 'antd'

const { Option } = Select;


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
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    filterSelect: {
        width: '150px',
        marginRight: '20px',
    },
    datePicker: {
        width: '150px',
    },
}));



function AttendanceSite() {
    const classes = useStyles(); // Add this line to get the classes object

    const AttendanceLoading = AttendanceLoadingComponent(Attendances);
    const [appState, setAppState] = useState({
        loading: true,
        attendances: null,
        next: null,
        previous: null,
        currentPage: 1,
    });

    const [selectedSubject, setSelectedSubject] = useState(null); // State cho select
    const [selectedStatus, setSelectedStatus] = useState(''); // State cho select
    const [selectedDate, setSelectedDate] = useState(null); // State cho datetime picker
    const [subjects, setSubjects] = useState([]); // Thêm dòng này

    useEffect(() => {
        // Gọi API để lấy danh sách các môn học
        axiosInstance.get("/course")
            .then((response) => {
                const subjectsData = response.data;
                console.log(response.data);

                setSubjects(subjectsData); // Cập nhật danh sách môn học

                // Đã tải xong, có thể ẩn loading indicator nếu bạn sử dụng nó
                setAppState((prevAppState) => ({ ...prevAppState, loading: false }));

                // Đã tải xong, có thể ẩn loading indicator nếu bạn sử dụng nó
            })
            .catch((error) => {
                // Xử lý lỗi khi gọi API
                console.error('An error occurred while fetching subjects:', error);

                // Đã xảy ra lỗi, có thể xử lý theo cách bạn muốn, ví dụ, hiển thị thông báo lỗi
                notification.error({
                    message: 'Error',
                    description: 'An error occurred while fetching subjects.',
                    placement: 'topRight'
                });

                // Đã xảy ra lỗi, có thể ẩn loading indicator nếu bạn sử dụng nó
            });
    }, []);
    // Lấy các tham số từ URL của FE
    //const params = queryString.parse(window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    appState.currentPage = currentPage;

    const handleFilter = () => {
        // Xây dựng URL mới với các tham số lọc
        const urlParams = new URLSearchParams(window.location.search);

        // Lọc theo tên khóa học
        if (selectedSubject) {
            urlParams.set('course_id', selectedSubject);
        } else {
            urlParams.delete('course_id');
        }

        // Lọc theo trạng thái
        if (selectedStatus === 'True' || selectedStatus === 'False') {
            urlParams.set('status', selectedStatus);
        } else {
            urlParams.delete('status');
        }
        // Lọc theo ngày tháng năm
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            urlParams.set('attendance_date', formattedDate);
        } else {
            urlParams.delete('attendance_date');
        }

        //const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

        // Chuyển hướng trang sang URL mới
        window.location.search = urlParams.toString();
    }


    // const queryParams = {
    //     page: params.page,
    // };


    // const url = axiosInstance.getUri({
    //     url: "attendance/",
    //     params: queryParams,
    // });

    useEffect(() => {
        const queryParams = queryString.parse(window.location.search);
        queryParams.pageSize = 20; // Số lượng mục tối đa trên mỗi trang

        const fetchUrl = axiosInstance.getUri({
            url: "attendance/",
            params: queryParams,
        });

        axiosInstance.get(fetchUrl).then((response) => {
            console.log(response.data);
            const totalItems = response.data.count;
            const itemsPerPage = queryParams.pageSize;
            const maxPages = Math.ceil(totalItems / itemsPerPage);

            if (response.data && response.data.results) {
                const allAttendances = response.data.results;
                setAppState({
                    loading: false,
                    attendances: allAttendances,
                    next: response.data.next,
                    previous: response.data.previous,
                    maxPage: maxPages,
                    perPage: itemsPerPage,
                });
            } else {
                // Handle the case where response data is null or missing data
                notification.error({
                    message: 'Data Error',
                    description: 'No data received from the server.',
                    placement: 'topRight'
                });
            }
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
            <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: '32px', fontWeight: 'bold', marginTop: '30px', marginBottom: '30px', color: "darkblue" }}>
                <span role="img" aria-label="Attendance History">📝</span> Attendance History
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <div className={classes.filterContainer}>
                    <Select
                        className={classes.filterSelect}
                        placeholder="Select Subject"
                        value={selectedSubject}
                        onChange={value => setSelectedSubject(value)}
                        style={{ minWidth: '400px' }}  // Đặt chiều rộng của Select
                    >
                        {subjects.map(subject => (
                            <Option key={subject.id} value={subject.course_id}>
                                {subject.course_name} ({subject.course_id})
                            </Option>
                        ))}
                    </Select>
                    <Select
                        className={classes.filterSelect}
                        placeholder="Select Status"
                        onChange={value => setSelectedStatus(value)}
                    >
                        <Option value="True">Present</Option>
                        <Option value="False">Absent</Option>
                    </Select>
                    <DatePicker
                        className={classes.datePicker}
                        placeholder="Select Date"
                        onChange={date => setSelectedDate(date)}
                    />
                    <Button
                        className={classes.filterButton}
                        variant="contained"
                        color="primary"
                        onClick={handleFilter}
                    >
                        Filter
                    </Button>
                </div>
            </div>



            <div>
                <AttendanceLoading isLoading={appState.loading} data={appState.attendances} />
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
                {Array.from({ length: appState.maxPage }, (_, index) => index + 1)
                    .filter(page => page <= Math.ceil(appState.maxPage)) //queryParams.pageSize
                    .map((page) => (
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

export default AttendanceSite;
