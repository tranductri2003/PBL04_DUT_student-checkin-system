import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import Paper from '@material-ui/core/Paper';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom'; // Chỉ import thẻ Link duy nhất từ react-router-dom

import Avatar from '@material-ui/core/Avatar';
import { format } from 'date-fns';
import Profile from './Profile'; // Use the correct relative path here
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
    },
    postTitle: {
        fontSize: '16px',
        textAlign: 'left',
    },
    postText: {
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'baseline',
        fontSize: '12px',
        textAlign: 'left',
        marginBottom: theme.spacing(2),
    },
    card: {
        borderRadius: theme.spacing(2), // Góc bo tròn cho CardView
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Hiệu ứng shadow làm mềm mại CardView
        overflow: 'hidden', // Đảm bảo nội dung không tràn ra ngoài CardView
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease', // Hiệu ứng smooth
        '&:hover': {
            transform: 'scale(1.05)', // Hiệu ứng zoom in khi hover
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)', // Hiệu ứng shadow mạnh hơn khi hover
            backgroundColor: theme.palette.grey[200], // Màu nền thay đổi khi hover
        },
    },

    editedText: {
        fontSize: '12px',
        color: theme.palette.text.secondary,
        textAlign: 'right', // Canh lề phải
    },
    newPostButton: {
        position: 'fixed',
        top: theme.spacing(20), // Cách header 20 spacing (có thể điều chỉnh tùy ý)
        right: theme.spacing(20), // Cách lề phải 2 spacing (có thể điều chỉnh tùy ý)
        borderRadius: '50%',
        zIndex: 999,
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main, // Màu nền chính là màu primary của theme
        color: theme.palette.common.white, // Màu chữ là trắng
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
        },
    },

    statsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.7, // Điều chỉnh mức độ mờ, giá trị từ 0 đến 1
    },
    statsItem: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(2),
        transition: 'opacity 0.3s ease', // Hiệu ứng mờ khi hover
        opacity: 0.7, // Mức độ mờ ban đầu
        '&:hover': {
            opacity: 1, // Hiển thị thông tin rõ hơn khi hover
        },
        color: theme.palette.primary.main, // Đổi màu chữ cho các thông tin này
        fontSize: '14px', // Đổi kích thước chữ cho các thông tin này
    },
}));

const UserSite = (props) => {
    const { posts } = props;
    const { user } = props;
    const classes = useStyles();

    if (!user) {
        return (
            <div className="error-message">
                <p>This profile doesn't exist, sorry</p>
            </div>
        );
    }
    // Lấy token từ nơi bạn lưu trữ nó, ví dụ localStorage hoặc cookies
    const token = "your_jwt_token_here"; // Thay thế bằng cách lấy token từ nơi bạn lưu trữ nó

    // Giải mã token
    const decodedToken = jwt_decode(token);

    // Lấy staff_id từ payload của token
    const staffId = decodedToken.staff_id;

    const isAuthorProfile = () => {
        return staffId === user.user_name;
    };

    // Xử lý dữ liệu và lấy thông tin của người dùng, ví dụ:
    // const userInfo = {
    //     email: user.email,
    //     user_name: user.user_name,
    //     avatar: user.avatar,
    //     firstName: user.first_name,
    //     about: user.about,
    //     // Các thông tin khác của người dùng
    // };
    return (
        <React.Fragment>
            <Profile userInfo={user} />
            <div style={{ fontFamily: 'cursive', fontSize: '32px', fontWeight: 'bold', marginTop: '30px', marginBottom: '30px' }}>
                <span role="img" aria-label="Latest Posts">📝</span> Latest Posts
            </div>
            <Container maxWidth="lg" component="main">
                {isAuthorProfile() && (
                    <>
                        {/* Thêm nút "New Post" ở đây */}
                        <Button
                            className={classes.newPostButton}
                            href={`/profile/${user.user_name}/post/create`}
                            variant="contained"
                            color="primary"
                        >
                            +
                        </Button>
                    </>
                )}
                <Grid container spacing={5} alignItems="flex-end">
                    {posts.map((post) => {
                        return (
                            <Grid item key={post.id} xs={12} md={4}>
                                <Card className={classes.card}>
                                    {/* Sử dụng thẻ Link để điều hướng */}
                                    <Link to={`/post/${post.slug}`} className={classes.link}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={post.image}
                                            title="Image title"
                                        />
                                    </Link>
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h6" component="h2" className={classes.postTitle}>
                                            {post.title.substr(0, 50)}...
                                        </Typography>
                                        <div className={classes.postText}>
                                            <Typography color="textSecondary">
                                                {post.excerpt.substr(0, 40)}...
                                            </Typography>
                                        </div>
                                        {/* Hiển thị dòng chữ "edited at" và thời điểm đã chỉnh sửa */}
                                        <div className={classes.postText}>
                                            <Typography className={classes.editedText}>
                                                edited at{' '}
                                                {format(new Date(post.edited), 'dd-MM-yyyy HH:mm (xxx)')}
                                                ...
                                            </Typography>
                                        </div>
                                        {/* Hiển thị số lượng views, likes và comments */}
                                        <div className={classes.statsContainer}>
                                            <div className={classes.statsItem}>
                                                <VisibilityIcon />
                                                <Typography color="textSecondary">
                                                    {post.num_view}
                                                </Typography>
                                            </div>
                                            <div className={classes.statsItem}>
                                                <ThumbUpIcon />
                                                <Typography color="textSecondary">
                                                    {post.num_like}
                                                </Typography>
                                            </div>
                                            <div className={classes.statsItem}>
                                                <CommentIcon />
                                                <Typography color="textSecondary">
                                                    {post.num_comment}
                                                </Typography>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* Avatar của tác giả */}
                                            <Link to={`/profile/${post.author.user_name}`}>
                                                <Avatar alt={user.user_name} src={user.avatar} />
                                            </Link>

                                            <div style={{ marginLeft: '10px' }}>
                                                <Typography variant="subtitle1" style={{ fontFamily: 'cursive' }}>
                                                    {post.author.user_name}
                                                </Typography>
                                            </div>
                                            {isAuthorProfile() && (
                                                <>
                                                    <Link
                                                        color="textPrimary"
                                                        to={`/profile/${user.user_name}/post/edit/${post.id}`}
                                                        className={classes.link}
                                                    >
                                                        <EditIcon />
                                                    </Link>
                                                    <Link
                                                        color="textPrimary"
                                                        to={`/profile/${user.user_name}/post/delete/${post.id}`}
                                                        className={classes.link}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </Link>
                                                </>
                                            )}
                                        </div>

                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </React.Fragment>
    );
};

export default UserSite;
