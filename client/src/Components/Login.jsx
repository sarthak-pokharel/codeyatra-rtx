import React, { useState } from "react";
import { useColorScheme } from "@mui/joy/styles";
import { Sheet } from "@mui/joy";
import { CssBaseline } from "@mui/joy";
import { Typography } from "@mui/joy";
import { FormControl } from "@mui/joy";
import { FormLabel } from "@mui/joy";
import { Input } from "@mui/joy";
import { Button } from "@mui/joy";
import { Link } from "@mui/joy";
import { Select } from "@mui/joy";
import { Option } from "@mui/joy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      sx={{ width: "max-content" }}
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
    </Select>
  );
}

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendOtp = () => {
    if (!phoneNumber) {
      toast.error("Please provide a valid phone number");
      return;
    }

    setIsOtpSent(true);
  };

  const verifyOtp = () => {
    toast.success("OTP verified successfully");
  };

  return (
    <>
      <CssBaseline />

      <main>
        <ModeToggle />

        <Sheet
          sx={{
            width: 300,
            mx: "auto",
            my: 4,
            py: 3,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
          }}
          variant="outlined"
        >
          <ToastContainer />
          {!isOtpSent ? (
            <div>
              <Typography level="h4" component="h1">
                <b>Welcome!</b>
              </Typography>
              <Typography level="body-sm">Sign in to continue.</Typography>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phone"
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </FormControl>
              <Button sx={{ mt: 1 }} onClick={sendOtp}>
                Send OTP
              </Button>
            </div>
          ) : (
            <div>
              <Typography level="h4" component="h1">
                <b>Enter OTP</b>
              </Typography>
              <FormControl>
                <FormLabel>OTP</FormLabel>
                <Input
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                />
              </FormControl>
              <Button sx={{ mt: 1 }} onClick={verifyOtp}>
                Verify OTP
              </Button>
            </div>
          )}
          <Typography
            endDecorator={<Link href="/sign-up">Sign up</Link>}
            sx={{ fontSize: "sm", alignSelf: "center" }}
          >
            Don't have an account?
          </Typography>
        </Sheet>
      </main>
    </>
  );
};

export default Login;
