import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Fade,
  InputAdornment,
  LinearProgress,
  Alert
} from "@mui/material";
import { EmailOutlined, ArrowBack } from "@mui/icons-material";

const AuthContainer = ({ children, title }) => (
  <Container
    maxWidth="xs"
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "background.paper",
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: "primary.main"
          }
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "text.primary",
            textAlign: "center",
            mb: 2
          }}
        >
          {title}
        </Typography>

        {children}
      </Box>
    </Fade>
  </Container>
);

export function ForgotPassword() {
  // "request" displays the email form; "verify" shows the reset code & new password form.
  const [step, setStep] = useState("request");
  const [formDataEmail, setFormDataEmail] = useState({ email: "" });
  const [formDataReset, setFormDataReset] = useState({
    resetCode: "",
    newPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false); // NEW: State to toggle password visibility

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    return re.test(password);
  };

  const handleEmailChange = (e) => {
    setFormDataEmail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetChange = (e) => {
    setFormDataReset((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!formDataEmail.email) {
      setAlert({ message: "Please fill in all fields.", severity: "error" });
      return;
    }

    if (!validateEmail(formDataEmail.email)) {
      setAlert({
        message: "Please enter a valid email address.",
        severity: "error"
      });
      return;
    }

    setIsLoading(true);

    fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataEmail)
    })
      .then((response) =>
        response.json().then((data) => {
          if (!response.ok) throw data;
          return data;
        })
      )
      .then((data) => {
        setAlert({
          message:
            "If this email is registered, a reset code has been sent to your email.",
          severity: "success"
        });
        // Switch to the verification form.
        setStep("verify");
        setIsLoading(false);
      })
      .catch((error) => {
        setAlert({
          message: error.error || "An error occurred. Please try again later.",
          severity: "error"
        });
        setIsLoading(false);
      });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();

    if (!formDataReset.resetCode || !formDataReset.newPassword) {
      setAlert({ message: "Please fill in all fields.", severity: "error" });
      return;
    }

    if (!validatePassword(formDataReset.newPassword)) {
      setAlert({
        message:
          "Password must be at least 6 characters and contain at least one digit, one lowercase letter, one uppercase letter, and one special character.",
        severity: "error"
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      email: formDataEmail.email,
      resetCode: formDataReset.resetCode,
      newPassword: formDataReset.newPassword
    };

    fetch("/api/auth/verify-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((response) =>
        response.json().then((data) => {
          if (!response.ok) throw data;
          return data;
        })
      )
      .then((data) => {
        setAlert({
          message: data.message || "Your password has been reset successfully.",
          severity: "success"
        });
        setIsLoading(false);
        // Optionally navigate to the login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        setAlert({
          message:
            error.error ||
            "Your reset code is invalid or has expired. Please request a new one by going back.",
          severity: "error"
        });
        setIsLoading(false);
      });
  };

  const handleBack = () => {
    // Clear the reset code and new password fields.
    setFormDataReset({ resetCode: "", newPassword: "" });
    // Go back to the email request form.
    setStep("request");
    // Clear any alerts.
    setAlert({ message: "", severity: "" });
  };

  return (
    <AuthContainer title="Forgot Password">
      {alert.message && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {step === "request" && (
        <Box component="form" onSubmit={handleEmailSubmit} sx={{ position: "relative" }}>
          <TextField
            fullWidth
            label="Email"
            variant="filled"
            margin="normal"
            name="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="primary" />
                </InputAdornment>
              )
            }}
            value={formDataEmail.email}
            onChange={handleEmailChange}
            required
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              position: "relative",
              "&:hover": { boxShadow: 2 }
            }}
          >
            Send reset code
            {isLoading && (
              <LinearProgress
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  borderRadius: "inherit"
                }}
              />
            )}
          </Button>
          <hr></hr>
          <Link 
  to="/login" 
  style={{ 
    display: "inline-block",
    padding: "8px 16px",
    color: "#1976d2",
    fontWeight: "bold",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "background-color 0.3s, color 0.3s",
    border: "1px solid #1976d2",
    textAlign: "center",
    margin: "12px 2px",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#1976d2";
    e.target.style.color = "#fff";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#1976d2";
  }}
>
Back to Login
</Link>
        </Box>
      )}

      {step === "verify" && (
        <Box component="form" onSubmit={handleResetSubmit} sx={{ position: "relative" }}>
          <TextField
            fullWidth
            label="Reset Code"
            variant="filled"
            margin="normal"
            name="resetCode"
            value={formDataReset.resetCode}
            onChange={handleResetChange}
            required
          />

          <TextField
            fullWidth
            label="New Password"
            variant="filled"
            margin="normal"
            name="newPassword"
            type={showPassword ? "text" : "password"} // Modified: Toggle between text and password
            value={formDataReset.newPassword}
            InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setShowPassword((prev) => !prev)} // NEW: Toggle password visibility
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
            onChange={handleResetChange}
            required
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              position: "relative",
              "&:hover": { boxShadow: 2 }
            }}
          >
            Verify Code & Reset Password
            {isLoading && (
              <LinearProgress
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  borderRadius: "inherit"
                }}
              />
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            type="button"
            disabled={isLoading}
            onClick={handleBack}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              position: "relative",
              "&:hover": { boxShadow: 2 }
            }}
          >
            <ArrowBack sx={{ mr: 1 }} /> Back
          </Button>
        </Box>
      )}
    </AuthContainer>
  );
}

export default ForgotPassword;
