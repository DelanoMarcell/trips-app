import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        }
          else if(data.error && data.error === "Please verify your email before logging in.") {
            document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Please verify your email before logging in.</p>`;
          
        } else if (data.message && data.message === "Login successful") {
          document.getElementById("alert").innerHTML = `<p style='padding: 10px; background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; border-radius: 4px;'>Login successful</p>`;
          // Redirect after a brief delay
          setTimeout(() => {
            navigate("/dashboard");
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
          type="password"
          variant="filled"
          margin="normal"
          name="password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined color="primary" />
              </InputAdornment>
            )
          }}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Box textAlign="right" mt={1}>
          <Link
            to="/forgot-password"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Forgot Password?
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

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Box textAlign="center">
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1976d2", textDecoration: "none" }}>
              Create Account
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthContainer>
  );
}

export default Login;
