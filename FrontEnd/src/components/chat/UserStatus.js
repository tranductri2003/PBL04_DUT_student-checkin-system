import React from 'react';
import { Avatar, Typography, makeStyles } from '@material-ui/core';
import './UserStatus.css';


function UserStatus({ name, avt, status }) {

    return (
        <div className="userStatusContainer">
            <Avatar className="avatar" src={avt} alt={name} />
            <div
                className="statusIndicator"
                style={{
                    backgroundColor: status ? 'green' : 'red',
                }}
            ></div>
            <div className="userInfo">
                <Typography className="userName">{name}</Typography>
                <Typography className="activityStatus">{status}</Typography>
            </div>
        </div>
    );
}

export default UserStatus;
