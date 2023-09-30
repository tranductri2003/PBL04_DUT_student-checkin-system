import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    loadingText: {
        fontFamily: 'cursive',
        fontSize: '24px',
        color: theme.palette.primary.main,
        marginBottom: '16px',
    },
    updateText: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: theme.palette.text.secondary,
    },
    dotPulse: {
        width: '8px',
        height: '8px',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '50%',
        marginRight: '8px',
        animation: '$pulse 1.5s infinite',
    },
    '@keyframes pulse': {
        '0%, 100%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.5)',
        },
    },
}));

function PostLoading(Component) {
    const classes = useStyles();

    return function PostLoadingComponent({ isLoading, ...props }) {
        if (!isLoading) return <Component {...props} />;

        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress color="primary" size={80} style={{ marginBottom: '16px' }} />
                <Typography variant="h5" className={classes.loadingText}>
                    Loading data, please wait...
                </Typography>
                <div className={classes.updateText}>
                    <div className={classes.dotPulse} />
                    <Typography variant="body2">
                        Fetching latest updates
                    </Typography>
                </div>
            </Box>
        );
    };
}

export default PostLoading;
