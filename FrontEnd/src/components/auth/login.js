import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
//MaterialUI
import { w3cwebsocket as W3CWebSocket } from "websocket";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { message, notification } from 'antd';
import Modal from 'react-modal';
import './login.css';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default function SignIn() {
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        staff_id: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
        // Ẩn label khi modal mở
        document.querySelectorAll('.loginLabel').forEach(label => {
            label.style.display = 'none';
        });
    };

    // Hàm đóng modal và hiển thị lại label
    const closeModal = () => {
        setIsModalOpen(false);
        // Hiển thị lại label khi modal đóng
        document.querySelectorAll('.loginLabel').forEach(label => {
            label.style.display = 'block';
        });
    };

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosInstance
            .post(`auth/login/`, {
                staff_id: formData.staff_id,
                password: formData.password,
            })
            .then((res) => {
                localStorage.setItem('email', res.data.user.email);
                localStorage.setItem('full_name', res.data.user.full_name);
                localStorage.setItem('university', res.data.user.university);
                localStorage.setItem('faculty', res.data.user.faculty);
                localStorage.setItem('class_id', res.data.user.class_id);
                localStorage.setItem('about', res.data.user.about);
                localStorage.setItem('phone_number', res.data.user.phone_number);
                localStorage.setItem('date_of_birth', res.data.user.date_of_birth);

                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access_token');
                console.log("SENT REQUEST TO WEBSOCKET");
                if (res.data.access != null) {
                    const socket = new WebSocket(`${process.env.REACT_APP_STATUS_WEBSOCKET_URL}`);
                    socket.onopen = () => {
                        const access_token = res.data.access; // Lấy access token từ phản hồi đăng nhập
                        const message_token = "onl" + access_token;
                        socket.send(JSON.stringify({ "access_token": message_token }));
                        console.log('Access token sent via WebSocket:', message_token);
                    };
                }
                //console.log(socket.url)

                //this.client = new W3CWebSocket('ws://localhost:8000/ws/user/status/');
                navigate('/');
                //Kết nối WebSocket và gửi access token
                // const socket = new WebSocket('ws://localhost:8000/ws/user/status/');
                // console.log(socket.url)
                // socket.onopen = () => {
                //     const access_token = res.data.access; // Lấy access token từ phản hồi đăng nhập
                //     socket.send(JSON.stringify({ access_token }));
                //     console.log('Access token sent via WebSocket:', access_token);
                // };

                // Kích hoạt tái render cho thành phần Header sau khi đăng nhập thành công
                window.dispatchEvent(new Event('storage'));
                notification.success({
                    message: 'Sign in successfully',
                    description: `Welcome ${res.data.user.full_name}!!!`,
                    placement: 'topRight'
                })





            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        // Xử lý thông tin đăng nhập sai
                        notification.warning({
                            message: 'Login Failed',
                            description: 'No active account found with the given credentials, please active your account through your mail or register new account!',
                            placement: 'topRight',
                        });
                    } else {
                        // Xử lý lỗi khác
                        notification.error({
                            message: 'Error',
                            description: 'Error logging in. Please try again.',
                            placement: 'topRight',
                        });
                    }
                } else {
                    console.error('An error occurred:', error.message);
                }
            });
    };


    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}></Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="staff_id"
                        label="Staff Id"
                        name="staff_id"
                        autoComplete="Staff Id"
                        autoFocus
                        onChange={handleChange}
                        className="loginLabel"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        className="loginLabel"
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link variant="body2" onClick={openModal}>
                                Forgot password?
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <ForgotPasswordModal isOpen={isModalOpen} onRequestClose={closeModal} />

        </Container>
    );
}

function ForgotPasswordModal({ isOpen, onRequestClose }) {
    // Trạng thái và hàm xử lý cho form quên mật khẩu
    const [formData, setFormData] = useState({
        staff_id: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Gửi yêu cầu đặt lại mật khẩu tới server với trường staff_id
            await axiosInstance.post('/user/send-reset-password/', formData);
            // Đóng modal sau khi gửi
            onRequestClose();
            // Hiển thị thông báo thành công
            notification.success({
                message: 'Check your email',
                description: 'Please check your mail to reset your password!',
                placement: 'topRight'
            });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error sending reset password email:', error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    // Xử lý thông tin đăng nhập sai
                    notification.warning({
                        message: 'Error',
                        description: 'An error occurred while processing your request',
                        placement: 'topRight',
                    });
                } else {
                    // Xử lý lỗi khác
                    notification.error({
                        message: 'Error',
                        description: 'Error. Please try again.',
                        placement: 'topRight',
                    });
                }
            } else {
                console.error('An error occurred:', error.message);
            }
        }
    };

    return (
        <Modal isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },

                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%', // Tăng kích thước chiều rộng
                    height: '35%', // Điều chỉnh chiều cao tự động
                    maxWidth: '600px', // Giới hạn kích thước tối đa
                }
            }}

        >
            <div className="forgotPasswordContainertent">
                <h2>Forgot Password</h2>
                <form className="forgotPasswordForm" onSubmit={handleSubmit}>
                    <TextField
                        className="forgotPasswordTextField"
                        type="text"
                        name="staff_id"
                        label="Staff Id"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="modalButton"
                    >
                        Send Reset Password Email
                    </Button>
                </form>
            </div>
        </Modal>
    );
}