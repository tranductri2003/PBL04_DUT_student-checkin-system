import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import { message, notification } from 'antd';
import jwt_decode from "jwt-decode";
import './activateAccount.css'

function getDayOfWeekName(dayOfWeek) {
    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật',];
    return daysOfWeek[dayOfWeek];
}
function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const { staffId } = useParams();
    var user_staff_id = "";
    var role = "";
    if (localStorage.getItem('access_token')) {
        // Lấy token từ nơi bạn lưu trữ nó, ví dụ localStorage hoặc cookies
        const token = localStorage.getItem("access_token"); // Thay thế bằng cách lấy token từ nơi bạn lưu trữ nó

        // Giải mã token
        const decodedToken = jwt_decode(token);

        // Lấy staff_id từ payload của token
        user_staff_id = decodedToken.staff_id;
        role = decodedToken.role;

        //console.log(role);
    }

    const handleActivate = () => {
        console.log("Tên các file ảnh đã được tải lên:");
        uploadedImages.forEach(image => {
            console.log(image.name);
        });
    };

    useEffect(() => {
        axiosInstance.get(`/user/102210096`)
            .then(response => {
                console.log(response.data);
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [staffId]);
    const handleImageUpload = (event) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newImagesUrls = filesArray.map((file, index) => ({
                id: Date.now() + index, // Tạo id duy nhất cho mỗi ảnh
                url: URL.createObjectURL(file),
                name: file.name // Lưu trữ tên file
            }));
            setUploadedImages([...uploadedImages, ...newImagesUrls]); // Kết hợp các ảnh mới với danh sách hiện tại
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
                                <input type="url" id="website" placeholder="Ngày tháng năm sinh" className="fullLengthControl" value={userInfo.date_of_birth} />
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
                                <input type="text" id="Password" placeholder="Mật khẩu hiện tại" className="fullLengthControl" value='123456789' />
                            </div>
                        </div>
                        <div style={{ width: '49%' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleActivate} // Gắn hàm với sự kiện onClick

                            >
                                Activate
                            </Button>
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
                                <img src={image.url} alt="Uploaded" />
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

    );
}



export default Profile;