import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import contract from "../assets/contract_farming.jpeg";
import forum from "../assets/forum.jpg";
import business from "../assets/business.jpg";

import Navbar from "./Nav2";

const StyledContainer = styled(Container)({
  padding: "40px",
  backgroundColor: "#e8f5e9",
  borderRadius: "16px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  marginTop: "20px",
});

const Header = styled(Typography)({
  color: "#2e7d32",
  marginBottom: "10px",
  fontWeight: "bold",
});

const Subtitle = styled(Typography)({
  marginBottom: "30px",
  color: "#555",
});

const StyledCard = styled(Card)({
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  transition: "transform 0.3s",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
  },
});

const CardImage = styled("img")({
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
});

const CardTitle = styled(Typography)({
  fontWeight: "bold",
  color: "#2e7d32",
});

const CardDescription = styled(Typography)({
  color: "#555",
  height: "80px",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const StyledCardActions = styled(CardActions)({
  justifyContent: "flex-end",
});

const CallToAction = styled(Box)({
  backgroundColor: "#c8e6c9",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
});

const Testimonial = styled(Box)({
  margin: "20px 0",
  padding: "10px",
  backgroundColor: "#f1f8e9",
  borderRadius: "8px",
});

const Footer = styled(Box)({
  textAlign: "center",
  padding: "20px",
  marginTop: "20px",
  backgroundColor: "#e0f7fa",
  borderRadius: "8px",
});

const Home = () => {
  return (
    <>
      <Navbar />
      <StyledContainer maxWidth="md">
        <Header variant="h2" align="center">
          AgriFusion
        </Header>
        <Subtitle variant="h5" align="center">
          Connecting farmers, industries, and agricultural experts for a
          sustainable future.
        </Subtitle>

        <CallToAction>
          <Typography variant="h4" align="center" color="#2e7d32">
            Start Your Journey with Us!
          </Typography>
          <Typography variant="body1" align="center">
            Join our community to access resources, connect with experts, and
            enhance your agricultural practices.
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="primary">
              Get Started
            </Button>
          </Box>
        </CallToAction>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardImage src={contract} alt="Contract Farming" />
              <CardContent>
                <CardTitle variant="h6">Contract Farming</CardTitle>
                <CardDescription variant="body2">
                  A platform for large-scale contract farmers and industries
                  needing agricultural products.
                </CardDescription>
              </CardContent>
              <StyledCardActions>
                <Button size="small" variant="contained" color="primary">
                  Learn More
                </Button>
              </StyledCardActions>
            </StyledCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardImage src={forum} alt="Farmer Forum" />
              <CardContent>
                <CardTitle variant="h6">Farmer Forum</CardTitle>
                <CardDescription variant="body2">
                  A forum for farmers to ask questions and discuss problems with
                  experienced experts.
                </CardDescription>
              </CardContent>
              <StyledCardActions>
                <Button size="small" variant="contained" color="primary">
                  Join Now
                </Button>
              </StyledCardActions>
            </StyledCard>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardImage src={business} alt="Expert Consultation" />
              <CardContent>
                <CardTitle variant="h6">Expert Consultation</CardTitle>
                <CardDescription variant="body2">
                  Access agricultural experts for consultation and on-site
                  visits.
                </CardDescription>
              </CardContent>
              <StyledCardActions>
                <Button size="small" variant="contained" color="primary">
                  Contact an Expert
                </Button>
              </StyledCardActions>
            </StyledCard>
          </Grid>
        </Grid>

        <Typography variant="h5" align="center" mt={4}>
          What Our Users Say
        </Typography>
        <Testimonial>
          <Typography variant="body1">
            "AgriFusion has transformed the way I approach farming. The
            resources and community support are invaluable!" - Farmer John
          </Typography>
        </Testimonial>
        <Testimonial>
          <Typography variant="body1">
            "The expert consultations helped me improve my crop yield
            significantly!" - Farmer Sarah
          </Typography>
        </Testimonial>

        <Footer>
          <Typography variant="body2">
            © 2025 AgriFusion. All rights reserved.
          </Typography>
          <Typography variant="body2">
            Contact us: info@agrifusion.com
          </Typography>
        </Footer>
      </StyledContainer>
    </>
  );
};

export default Home;
