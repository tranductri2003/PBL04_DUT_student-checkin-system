import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import { message, notification } from 'antd';
import jwt_decode from "jwt-decode";
import './activateAccount.css'



function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);

    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { uid, token, staff_id } = useParams();

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleActivate = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        if (uploadedImages.length < 10) {
            setErrorMessage('Vui lòng tải lên ít nhất 10 ảnh.');
            return;
        } else {
            setErrorMessage('');

            const formData = new FormData();
            formData.append('new_password', password);

            // Make the API request using FormData
            axiosInstance.post(`user/confirm-active-account/${uid}/${token}/`, formData)
                .then((response) => {
                    const { message, access_token } = response.data;

                    notification.success({
                        message: 'Success',
                        description: message,
                        placement: 'topRight',
                    });

                    const imageFeaturesFormData = new FormData();
                    uploadedImages.forEach(image => {
                        imageFeaturesFormData.append('image', image.file, image.name);
                        console.log(image.name);
                    });

                    imageFeaturesFormData.forEach((value, key) => {
                        console.log(`${key}: ${value}`);
                    });


                    axiosInstance.post(
                        `${process.env.REACT_APP_AI_URL}create-image-features`,
                        imageFeaturesFormData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${access_token}`,
                            },
                        }
                    )
                        .then(response => {
                            notification.success({
                                message: 'Success',
                                description: "Update face features",
                                placement: 'topRight',
                            });
                        })
                        .catch(error => {
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
        }
    };

    useEffect(() => {
        axiosInstance.get(`/user/${staff_id}`)
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [staff_id]);
    const handleImageUpload = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newImages = filesArray.map(file => ({
                id: Date.now() + file.lastModified, // Tạo id duy nhất cho mỗi ảnh
                file: file, // Lưu trữ file
                name: file.name // Lưu trữ tên file
            }));
            setUploadedImages([...uploadedImages, ...newImages]); // Kết hợp các file mới với danh sách hiện tại
        }
    };

    const handleMouseEnter = (id) => {
        setHoveredId(id);
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
    };

    const handleDeleteImage = (id) => {

        const newImages = uploadedImages.filter(image => image.id !== id);
        newImages.forEach(image => URL.revokeObjectURL(image.url));
        setUploadedImages(newImages);
    };



    if (!userInfo) {
        return <div>Loading...</div>;
    }
    return (
        <form onSubmit={handleActivate}>

            <div className="container">
                <div className="card">
                    <div className="leftColumn">
                        <img src={`${userInfo.avatar}`} alt="User Avatar" className="userAvatar" />
                        <h5 className="userName">{userInfo.full_name}</h5>
                        <h6 className="userEmail">{userInfo.staff_id}</h6>
                        <div>
                            <h5 className="heading">About me</h5>
                            <p className="aboutText">
                                {userInfo.about}
                            </p>
                        </div>
                    </div>
                    <div className="rightColumn">
                        <div>
                            <h6 className="heading">Personal Details</h6>
                            <div className="formRow">

                                <div style={{ width: '49%' }}>
                                    <label htmlFor="fullName" className="boldLabel" >Full Name</label>
                                    <input type="text" id="fullName" placeholder="Họ và tên" className="fullLengthControl" value={userInfo.full_name} />
                                </div>
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="eMail" className="boldLabel" >Email</label>
                                    <input type="email" id="eMail" placeholder="Email" className="fullLengthControl" value={userInfo.email} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="phone" className="boldLabel" >Phone</label>
                                    <input type="text" id="phone" placeholder="Số điện thoại" className="fullLengthControl" value={userInfo.phone_number} />
                                </div>
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="website" className="boldLabel">Date of birth</label>
                                    <input type="text" id="date_of_birth" placeholder="Ngày tháng năm sinh" className="fullLengthControl" value={userInfo.date_of_birth} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h6 className="heading">Education</h6>
                            <div className="formRow">
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="Street" className="boldLabel">University</label>
                                    <input type="text" id="Street" placeholder="Đại học" className="fullLengthControl" value={userInfo.university} />
                                </div>
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="ciTy" className="boldLabel">Faculty</label>
                                    <input type="text" id="ciTy" placeholder="Khoa" className="fullLengthControl" value={userInfo.faculty} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="sTate" className="boldLabel">Class</label>
                                    <input type="text" id="sTate" placeholder="Lớp sinh hoạt" className="fullLengthControl" value={userInfo.class_id} />
                                </div>
                                <div style={{ width: '49%' }}>
                                    <label htmlFor="sTate" className="boldLabel">Password</label>
                                    <input type="text"
                                        id="password"
                                        placeholder="Mật khẩu mới mà bạn muốn thay đổi"
                                        className="fullLengthControl"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />

                                </div>
                            </div>
                            <div style={{ width: '49%' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                // onClick={handleActivate} // Gắn hàm với sự kiện onClick

                                >
                                    Activate
                                </Button>
                                {errorMessage && <div style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="image-upload-container">
                        <div className="image-grid">
                            {uploadedImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="image-item"
                                    onMouseEnter={() => handleMouseEnter(image.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {hoveredId === image.id && (
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteImage(image.id)}
                                        >
                                            X
                                        </button>
                                    )}
                                    <img src={URL.createObjectURL(image.file)} alt="Uploaded" />
                                </div>
                            ))}
                        </div>


                        <div className="file-upload-button-container">
                            {uploadedImages.length < 10 && (
                                <>
                                    <input type="file" id="hidden-file-input" style={{ display: 'none' }} multiple onChange={handleImageUpload} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => document.getElementById('hidden-file-input').click()}
                                    >
                                        Upload Image
                                    </Button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </form>

    );
}



export default Profile;