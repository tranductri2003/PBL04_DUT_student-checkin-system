import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    },
    chatBoxContainer: {
        flexGrow: 1,
        overflowY: "auto", // Set overflow-y to auto to enable vertical scrolling
        width: "100%",
    },
    chatBox: {
        height: "500px",
        width: "100%",
        padding: "10px",
    },
    message: {
        margin: "5px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "5px",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
    },
    messageText: {
        marginLeft: "10px",
    },
    messageRight: {
        marginLeft: "auto",
        marginRight: 0,
        flexDirection: "row-reverse",
    },
    messageLeft: {
        marginRight: "auto",
        marginLeft: 0,
        flexDirection: "row",
    },
    messageSender: {
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#4caf50",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(2),
        display: "flex",
        alignItems: "center",
    },
    input: {
        flexGrow: 1,
        marginRight: theme.spacing(2),
    },
    submit: {
        textTransform: "none",
    },
    titleContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#2196f3",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    },
});

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filledForm: false,
            messages: this.props.messages || [], // Sử dụng messages từ props nếu có, nếu không thì mặc định là mảng rỗng
            content: "",
            user_name: localStorage.getItem("user_name"),
            room_name: this.props.room_slug || "nang-bach-khoa",
            room_title: this.props.room_title || "Nẵng Bách Khoa",
        };
        /* This line of code is creating a new instance of the `W3CWebSocket` class and initializing it
        with the WebSocket URL. The URL is constructed using the room name from the component's
        state. The WebSocket URL is used to establish a connection between the client and the server
        for real-time communication. */
        // this.client = new W3CWebSocket("ws://127.0.0.1:8000/ws/" + this.state.room_name + "/");
        this.client = new W3CWebSocket(process.env.REACT_APP_WEBSOCKET_URL + this.state.room_name + "/");

    }
    onButtonClicked = (e) => {
        this.client.send(
            JSON.stringify({
                type: "message",
                message: this.state.content,
                user_name: this.state.user_name,
                room_name: this.state.room_name,
            })
        );
        this.setState({ content: "" });
        e.preventDefault();
    };

    componentDidMount() {
        this.client.onopen = () => {
            console.log("WebSocket Client Connected");
        };
        this.client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            if (dataFromServer) {
                console.log("RECEIVE DATA FROM SERVER", dataFromServer);
                this.setState((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            message: dataFromServer.message,
                            user_name: dataFromServer.user_name,
                        },
                    ],
                }));
                console.log(this.state.messages);
                this.scrollToBottom();
            }
        };
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        const chatboxContainer = document.getElementById("chatbox-container");
        chatboxContainer.scrollTop = chatboxContainer.scrollHeight;
    }

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <div className={classes.root}>
                    <div className={classes.titleContainer}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            <span role="img" aria-label="Chat Icon">
                                💬
                            </span>{" "}
                            Chat Room: {this.state.room_name}
                        </Typography>
                    </div>
                    <div className={classes.chatBoxContainer} id="chatbox-container">
                        <Paper className={classes.chatBox}>
                            {this.state.messages.length > 0 ? (
                                this.state.messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`${classes.message} ${message.user_name === this.state.user_name ? classes.messageRight : classes.messageLeft
                                            }`}
                                    >
                                        <Avatar className={classes.avatar}>
                                            {message.user_name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div className={classes.messageText}>
                                            <Typography variant="subtitle2" className={classes.messageSender}>
                                                {message.user_name}
                                            </Typography>
                                            <Typography variant="body1">{message.message}</Typography>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Typography variant="body1">No Messages in this Room.</Typography>
                            )}
                        </Paper>
                    </div>
                    <form className={classes.form} noValidate onSubmit={this.onButtonClicked}>
                        <TextField
                            className={classes.input}
                            placeholder="Enter text here"
                            variant="outlined"
                            fullWidth
                            value={this.state.content}
                            onChange={(e) => this.setState({ content: e.target.value })}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disableElevation
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles)(ChatApp);
