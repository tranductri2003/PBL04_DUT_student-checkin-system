import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
// reactstrap components
import { useParams } from 'react-router-dom';


function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const { staffId } = useParams();

    useEffect(() => {
        // Tải thông tin người dùng từ API
        axiosInstance.get(`/user/${staffId}`)
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [staffId]);

    if (!userInfo) {
        return <div>Loading...</div>;
    }
    const styles = {
        container: {
            paddingTop: '40px',
            color: '#2e323c',
            background: '#f5f6fa',
            position: 'relative',
            height: '100vh', // Chuyển '100%' thành '100vh' để chiếm toàn bộ chiều cao của viewport
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // Cần thêm này nếu bạn muốn căn giữa theo chiều dọc
        },
        card: {
            background: '#ffffff',
            borderRadius: '5px',
            border: 'none',
            marginBottom: '1rem',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Thêm bóng nếu cần
            width: '70%', // Điều chỉnh chiều rộng tổng thể của card
            display: 'flex',
            flexDirection: 'row', // Sắp xếp các item theo hàng ngang
        },
        leftColumn: {
            flex: '1',
            padding: '20px', // Điều chỉnh padding nếu cần
            borderRight: '1px solid #eaeaea', // Đường viền phân cách giữa hai cột
        },
        rightColumn: {
            flex: '2',
            padding: '20px', // Điều chỉnh padding nếu cần
        },
        userAvatar: {
            width: '90px',
            height: '90px',
            borderRadius: '100px',
            margin: '0 auto 1rem auto', // Căn giữa avatar
        },
        userName: {
            textAlign: 'center',
            fontWeight: 'bold',
        },
        userEmail: {
            textAlign: 'center',
            color: '#9fa8b9',
        },
        aboutHeading: {
            textAlign: 'center',
            color: '#007ae1',
            margin: '2rem 0 1rem 0',
        },
        aboutText: {
            textAlign: 'center',
            color: '#2e323c',
        },
        formControl: {
            border: '1px solid #cfd1d8',
            borderRadius: '2px',
            fontSize: '0.825rem',
            background: '#ffffff',
            color: '#2e323c',
        },
        card: {
            background: '#ffffff',
            borderRadius: '5px',
            border: 0,
            marginBottom: '1rem',
        },
        formGroup: {
            marginBottom: '1rem',
        },
        // Đảm bảo phần dưới đây được thêm vào để áp dụng cho các đoạn văn bản trong phần 'About'
        aboutSection: {
            margin: '2rem 0 0 0',
            textAlign: 'center',
        },
    };

    return (
        <div className="container" style={styles.body}>
            <div className="row gutters">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="card h-100" style={styles.card}>
                        <div style={styles.leftColumn}>

                            <div className="card-body">
                                <div className="account-settings">
                                    <div className="user-profile">
                                        <div className="user-avatar">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Maxwell Admin" style={styles.userAvatar} />
                                        </div>
                                        <h5 className="user-name" style={styles.userName}>Yuki Hayashi</h5>
                                        <h6 className="user-email" style={styles.userEmail}>yuki@Maxwell.com</h6>
                                    </div>
                                    <div className="about">
                                        <h5 style={styles.aboutHeading}>About</h5>
                                        <p style={styles.aboutText}>I'm Yuki. Full Stack Designer I enjoy creating user-centric, delightful and human experiences.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.rightColumn}>

                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div className="card h-100">
                            <div className="card-body">
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <h6 className="mb-2 text-primary">Personal Details</h6>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="fullName">Full Name</label>
                                            <input type="text" className="form-control" id="fullName" placeholder="Enter full name" style={styles.formControl} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="eMail">Email</label>
                                            <input type="email" className="form-control" id="eMail" placeholder="Enter email ID" style={styles.input} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text" className="form-control" id="phone" placeholder="Enter phone number" style={styles.input} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="website">Website URL</label>
                                            <input type="url" className="form-control" id="website" placeholder="Website url" style={styles.input} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <h6 className="mt-3 mb-2 text-primary">Address</h6>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="Street">Street</label>
                                            <input type="name" className="form-control" id="Street" placeholder="Enter Street" style={styles.input} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="ciTy">City</label>
                                            <input type="name" className="form-control" id="ciTy" placeholder="Enter City" style={styles.input} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="sTate">State</label>
                                            <input type="text" className="form-control" id="sTate" placeholder="Enter State" style={styles.input} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group" style={styles.formGroup}>
                                            <label htmlFor="zIp">Zip Code</label>
                                            <input type="text" className="form-control" id="zIp" placeholder="Zip Code" style={styles.input} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="text-right">
                                            <button type="button" id="cancel" name="cancel" className="btn btn-secondary" style={styles.button}>Cancel</button>
                                            <button type="button" id="submit" name="submit" className="btn btn-primary" style={styles.button}>Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Profile;
