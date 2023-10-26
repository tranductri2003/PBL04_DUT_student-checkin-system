import React from 'react';
import { Avatar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    userStatusContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    avatar: {
        width: '40px',
        height: '40px',
        marginRight: '10px',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        display: 'block',
    },
    userInfo: {
        flex: '1',
    },
    userName: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px',
    },
    activityStatus: {
        fontSize: '14px',
        color: '#666',
    },
}));

function UserStatus({ name, avt, status }) {
    const classes = useStyles();

    return (
        <div className={classes.userStatusContainer}>
            <Avatar className={classes.avatar} src={avt} alt={name} />
            <div
                className={classes.statusIndicator}
                style={{
                    backgroundColor: status == true ? 'green' : 'red',
                }}
            ></div>
            <div className={classes.userInfo}>
                <Typography className={classes.userName}>{name}</Typography>
                <Typography className={classes.activityStatus}>{status}</Typography>
            </div>
        </div>
    );
}

export default UserStatus;
