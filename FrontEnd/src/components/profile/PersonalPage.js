
import React from "react";
import axiosInstance from '../../axios';
// reactstrap components
import { Button, Card, Container, Row, Col } from "reactstrap";
import { notification } from 'antd';
import jwt_decode from "jwt-decode";


class Profile extends React.Component {

    handleCreateRoom = (user_name_1, user_name_2, first_name_1, first_name_2) => {
        // Sắp xếp tên người dùng theo thứ tự từ điển
        const sortedUserName = [user_name_1, user_name_2].sort();
        const sortedFirstName = [first_name_1, first_name_2].sort();


        // Tạo slug từ tên người dùng
        const room_slug = `${sortedUserName[0]}-${sortedUserName[1]}`;
        const room_name = `${sortedFirstName[0]} and ${sortedFirstName[1]}`;
        const room_description = `Space for ${first_name_1} and ${first_name_2}`;
        const room_participants = [user_name_1, user_name_2]
        const participants_string = room_participants.join(' ');

        const requestData = {
            name: room_name,
            slug: room_slug,
            description: room_description,
            private: true,
            participants: participants_string,
        };
        axiosInstance.post('/chat/create/', requestData)
            .then(response => {
                console.log('Room created:', response.data);
                notification.success({
                    message: 'Room Created',
                    description: 'Room created successfully!',
                    placement: 'topRight'
                });
            })
            .catch(error => {
                console.error('Error creating room:', error);
                if (error.response && error.response.status === 400 && error.response.data.detail === "Room with this slug already exists") {
                    notification.warning({
                        message: 'Room Already Exists',
                        description: 'A room with this slug already exists.',
                        placement: 'topRight'
                    });
                } else {
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
                }
            });
    };


    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
    }
    render() {
        // Destructure userInfo from props and provide a default value to prevent errors
        const { userInfo } = this.props;
        // Lấy token từ nơi bạn lưu trữ nó, ví dụ localStorage hoặc cookies
        const token = localStorage.getItem('access_token'); // Thay thế bằng cách lấy token từ nơi bạn lưu trữ nó

        // Giải mã token
        const decodedToken = jwt_decode(token);

        // Lấy staff_id từ payload của token
        const staff_id = decodedToken.staff_id;

        // Bây giờ bạn có thể sử dụng biến staffId
        const isAuthorProfile = () => {
            return staff_id === userInfo.staff_id;
        };
        return (
            <>
                <main className="profile-page" ref="main">
                    <section className="section-profile-cover section-shaped my-0">
                        {/* Circles background */}
                        <div className="shape shape-style-1 shape-default alpha-4">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        {/* SVG separator */}
                        <div className="separator separator-bottom separator-skew">
                        </div>
                    </section>
                    <section className="section">
                        <Container>
                            <Card className="card-profile shadow mt--300">
                                <div className="px-4">
                                    <Row className="justify-content-center">
                                        <Col className="order-lg-2" lg="3">
                                            <div className="card-profile-image">
                                                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                                    <img
                                                        alt="..."
                                                        className="profile-avatar rounded-circle" // Thêm lớp CSS mới tạo hình tròn
                                                        src={userInfo.avatar}
                                                    />
                                                </a>
                                            </div>
                                        </Col>
                                        <Col
                                            className="order-lg-3 text-lg-right align-self-lg-center"
                                            lg="4"
                                        >
                                            <div className="card-profile-actions py-4 mt-lg-0">

                                                {isAuthorProfile() && (
                                                    <>
                                                        <Button
                                                            className="float-right"
                                                            color="default"
                                                            href={`/profile/${userInfo.staff_id}/edit`}
                                                            size="sm"
                                                        >
                                                            Update Profile
                                                        </Button>
                                                    </>
                                                )}
                                                {!isAuthorProfile() && (
                                                    <Button
                                                        onClick={() => this.handleCreateRoom(localStorage.getItem('user_name'), userInfo.user_name, localStorage.getItem('first_name'), userInfo.first_name)}
                                                        className="mr-4"
                                                        color="info"
                                                        size="sm"
                                                    >
                                                        SEND MESSAGE
                                                    </Button>)}
                                            </div>
                                        </Col>
                                        <Col className="order-lg-1" lg="4">
                                            <div className="card-profile-stats d-flex justify-content-center">
                                                <div>
                                                    <span className="heading">{userInfo.num_post}</span>
                                                    <span className="description">Posts</span>
                                                </div>
                                                <div>
                                                    <span className="heading">{userInfo.num_view}</span>
                                                    <span className="description">Views</span>
                                                </div>
                                                <div>
                                                    <span className="heading">{userInfo.num_like}</span>
                                                    <span className="description">Likes</span>
                                                </div>
                                                <div>
                                                    <span className="heading">{userInfo.num_comment}</span>
                                                    <span className="description">Comments</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="text-center mt-5">
                                        <h3>
                                            {userInfo.user_name} ({userInfo.first_name}){" "}
                                            <span className="font-weight-light">, {userInfo.age}</span>
                                        </h3>
                                        <div className="h6 font-weight-300">
                                            <i className="ni location_pin mr-2" />
                                            {userInfo.country}
                                        </div>
                                        <div className="h6 mt-4">
                                            <i className="ni business_briefcase-24 mr-2" />
                                            {userInfo.occupation}
                                        </div>
                                        {/* <div>
                                            <i className="ni education_hat mr-2" />
                                            University of Computer Science
                                        </div> */}
                                    </div>
                                    <div className="mt-5 py-5 border-top text-center">
                                        <Row className="justify-content-center">
                                            <Col lg="9">
                                                <p>
                                                    {userInfo.about}
                                                </p>
                                                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                                    Show more
                                                </a>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Card>
                        </Container>
                    </section>
                </main>
            </>
        );
    }
}

export default Profile;
