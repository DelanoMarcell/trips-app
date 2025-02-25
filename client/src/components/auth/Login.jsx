import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Fade,
  InputAdornment,
  Divider,
  LinearProgress
} from "@mui/material";
import { LockOutlined, EmailOutlined } from "@mui/icons-material";
import Cookies from 'js-cookie';
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

        {/* Alert container */}
        <div id="alert"></div>

        {children}
      </Box>
    </Fade>
  </Container>
);

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false); // NEW: State to conditionally show the resend button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      document.getElementById("alert").innerHTML =
        "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Please fill in all fields</p>";
      return;
    }

    setIsLoading(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error && data.error === "Invalid email or password.") {
          document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Invalid email or password.</p>`;
        } else if (
          data.error &&
          data.error === "Please verify your email before logging in."
        ) {
          document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Please verify your email before logging in.</p>`;
          setShowResend(true); // Show the resend verification button
        } else if (data.message && data.message === "Login successful") {
          document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; border-radius: 4px;'>Login successful</p>`;
          // Redirect after a brief delay
          setTimeout(() => {
            
            Cookies.get("role") === "Admin" ? navigate("/dashboard") : navigate("/user-dashboard")
          }, 1000);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        document.getElementById("alert").innerHTML =
          "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Error logging in. Please try again later.</p>";
        setIsLoading(false);
      });
  };

  // NEW: Function to handle requesting a new verification link
  const handleRequestNewVerificationLink = () => {
    setIsLoading(true);

    fetch("/api/auth/new-verification-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>${data.error}</p>`;
        } else if (data.message) {
          document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; border-radius: 4px;'>${data.message}</p>`;
          // Optionally hide the button after a successful request
          setShowResend(false);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error requesting new verification link:", error);
        document.getElementById("alert").innerHTML =
          "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Error requesting new verification link. Please try again later.</p>";
        setIsLoading(false);
      });
  };

  return (
    <AuthContainer title="Welcome Back">
      <Box component="form" onSubmit={handleSubmit} sx={{ position: "relative" }}>
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
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="filled"
          margin="normal"
          name="password"
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
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Box textAlign="right" mt={1}>
          <Link
            to="/forgotpassword"
            style={{
              display: "inline-block",
              padding: "2px 8px",
              color: "#1976d2",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "background-color 0.3s, color 0.3s",
              border: "1px solid #1976d2",
              textAlign: "center"
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
            Reset Password
          </Link>
        </Box>

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
          Sign In
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

        {/* NEW: Conditionally render the button to request a new verification link */}
        {showResend && (
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleRequestNewVerificationLink}
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              position: "relative",
              "&:hover": { boxShadow: 2 }
            }}
          >
            Request New Verification Link
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
        )}

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Box textAlign="center">
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
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
                margin: "8px 0"
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
              Create Account
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthContainer>
  );
}

export default Login;
