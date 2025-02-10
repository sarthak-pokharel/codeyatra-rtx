import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#2E7D32", // Dark green color
  boxShadow: "none",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "50px",
  display: "flex",
  justifyContent: "center",
}));

const StyledNavLink = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  fontSize: "18px",
  letterSpacing: "1px",
  padding: "6px 24px",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "#ffffff",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: "transparent",
  padding: "10px 24px", // Increased padding
  marginLeft: "24px", // Added margin
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  border: "1px solid #ffffff",
  borderRadius: "4px",
  transition: "all 0.2s ease 0s",
  "&:hover": {
    backgroundColor: "#ffffff",
    color: "#2E7D32", // Dark green color
    borderColor: "transparent",
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            height: "90px",
            display: "flex",
            justifyContent: "space-between", // Added space-between
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                color: "white",
                textDecoration: "none",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              AGRIFUSION
            </Typography>
          </Box>

          {/* Navigation Links */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "20px", // Added gap between nav items
              }}
            >
              <StyledNavLink href="/">Home</StyledNavLink>
              <StyledNavLink href="/About">About Us</StyledNavLink>
              <StyledNavLink href="/Contact">Contact us</StyledNavLink>
            </Box>
          )}

          {/* Login Button */}
          <Box>
            {localStorage.getItem('token') ? <LoginButton variant="outlined" href="/dashboard">
              Dashboard
            </LoginButton> : <LoginButton variant="outlined" href="/login">
              Login
            </LoginButton>}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
