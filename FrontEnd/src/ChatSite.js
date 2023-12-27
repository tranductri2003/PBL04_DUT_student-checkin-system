import React, { useEffect, useState } from 'react';
import ChatApp from './components/chat/room';
import MessageLoadingComponent from './DataLoading';
import axiosInstance from './axios';
import { useParams } from 'react-router-dom';
import { notification } from 'antd'; // Import thư viện notification từ antd

function App() {
    const MessageLoading = MessageLoadingComponent(ChatApp);
    const [appState, setAppState] = useState({
        loading: true,
        messages: null,
        title: null,
    });
    const { slug } = useParams();

    useEffect(() => {
        axiosInstance.get("/chat/" + slug + "/").then((res) => {
            const allMessages = res.data.messages;
            console.log(res.data);
            console.log(allMessages);
            setAppState({ loading: false, messages: allMessages, title: res.data.room_name });
            console.log("RECEIVED MASSAGES FROM API!!!");
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
            });
    }, [setAppState, slug]);
    return (
        <div className="App">
            <MessageLoading isLoading={appState.loading} messages={appState.messages} room_slug={slug} room_title={appState.title} />
        </div>
    );
}
export default App;