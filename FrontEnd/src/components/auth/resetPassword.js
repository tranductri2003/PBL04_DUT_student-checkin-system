import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Container, Paper, Typography, makeStyles } from '@material-ui/core';
import axiosInstance from '../../axios';
import { notification } from 'antd';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    paper: {
        padding: theme.spacing(3),
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    textField: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

function ConfirmResetPassword() {
    const classes = useStyles();
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosInstance.post(`user/confirm-reset-password/${uid}/${token}/`, { password })
            .then((response) => {
                notification.success({
                    message: 'Success',
                    description: response.data.message,
                    placement: 'topRight',
                });
                // Redirect or show a success message
            })
            .catch((error) => {
                if (error.response) {
                    notification.error({
                        message: 'Error',
                        description: error.response.data.error,
                        placement: 'topRight',
                    });
                } else {
                    console.error('An error occurred:', error.message);
                }
            });
    };

    return (
        <Container className={classes.container}>
            <Paper className={classes.paper} elevation={3}>
                <Typography variant="h5">Confirm Password Reset</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={classes.textField}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                        Reset Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default ConfirmResetPassword;
