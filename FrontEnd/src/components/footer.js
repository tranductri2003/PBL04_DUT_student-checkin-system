import React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const footers = [
    {
        title: "About Us",
        description: [
            { label: "Facebook", url: "https://example.com/source-code" },
            { label: "Google", url: "https://example.com/source-code" },
            { label: "Zalo", url: "https://example.com/source-code" },
        ],
    },
    {
        title: "Referrences",
        description: [
            { label: "Github", url: "https://www.facebook.com/tranductri2003/" },
            { label: "Trello", url: "https://www.linkedin.com/in/duc-tri-tran-464343218/" },
            { label: "Figma", url: "https://codeforces.com/profile/tranductri2003" },
        ],
    },
    {
        title: "Contact",
        description: [
            { label: "Address", url: "https://www.facebook.com/tranductri2003/" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/duc-tri-tran-464343218/" },
        ],
    },
];

export default function Footer() {
    return (
        <React.Fragment>
            <Container maxWidth="md" component="footer">
                <Grid container spacing={4} justify="space-evenly">
                    {footers.map((footer) => (
                        <Grid item xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="textPrimary" gutterBottom style={{ fontFamily: 'cursive', fontSize: '28px', fontWeight: 'bold' }}>
                                {footer.title}
                            </Typography>
                            <ul>
                                {footer.description.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.url}
                                            variant="subtitle1"
                                            color="textSecondary"
                                            target="_blank"
                                            rel="noopener"
                                            style={{ fontFamily: 'cursive', fontSize: '18px' }}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Box mt={5} textAlign="center">
                <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'cursive', fontSize: '14px' }}>
                    © {new Date().getFullYear()} Bản quyền Trường Đại học Bách khoa - Đại học Đà Nẵng
                </Typography>
            </Box>
        </React.Fragment>
    );
}
