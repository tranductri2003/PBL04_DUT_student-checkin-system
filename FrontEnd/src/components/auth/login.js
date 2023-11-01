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
}));

export default function SignIn() {
    const navigate = useNavigate();
    const initialFormData = Object.freeze({
        staff_id: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);

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
                    const socket = new WebSocket('ws://localhost:8000/ws/user/status/');
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
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
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
                            <Link href="/forgotpassword" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}