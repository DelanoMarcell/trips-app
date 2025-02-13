import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Fade,
  InputAdornment,
  MenuItem
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { LockOutlined, EmailOutlined, PersonOutlined } from "@mui/icons-material";

const AuthContainer = ({ children, title }) => (
  <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
    <Fade in={true} timeout={500}>
      <Box sx={{
        width: "100%",
        p: 4,
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: 'primary.main'
        }
      }}>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 700,
          color: 'text.primary',
          textAlign: 'center',
          mb: 2
        }}>
          {title}
        </Typography>

        <div id="alert"></div>

        {children}
      </Box>
    </Fade>
  </Container>
);

export function Registration() {

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.role) {
      document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Please fill in all fields</p>";
      return;
    }

    if (!validateEmail(formData.email)) {
      document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Invalid email address. Please enter a valid email address</p>";
      return;
    }

    if (!validatePassword(formData.password)) {
      document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Password must be at least 6 characters and include uppercase, lowercase, a number, and a symbol.</p>";
      return;
    }

    setIsLoading(true);
    
    
      // console.log("Form submitted:", formData);
    
      fetch('/api/auth/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        
        if(data.error && data.error === "A user with this email address already exists.") {
          document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>A user with this email address already exists.</p>";
        }else if(data.error && data.error === "Error registering user") {
          document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Error registering user. Please try again later.</p>";
        }

        if(data.message && data.message === "Registration successful") {
          document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; border-radius: 4px;'>Registration successful. Please check your email to verify your account before attempting to login.</p>";
          setFormData({
            name: "",
            surname: "",
            email: "",
            password: "",
            role: "",
          });
        }

        setIsLoading(false);
       
       })
      .catch(error => { 
        console.error('Error registering user:', error);
        document.getElementById('alert').innerHTML = "<p style='padding: 10px; background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a; border-radius: 4px;'>Error registering user. Please try again later.</p>";
        setIsLoading(false);
      });

   

  };

  return (
    <AuthContainer title="Create Account">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="filled"
              name="name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined color="primary" />
                  </InputAdornment>
                ),
              }}
              value={formData.name}
              onChange={handleChange}
              required // Add required attribute for HTML validation
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="filled"
              name="surname"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined color="primary" />
                  </InputAdornment>
                ),
              }}
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

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
            ),
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
            ),
          }}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          select
          label="Role"
          variant="filled"
          margin="normal"
          name="role"
          value={formData.role}
          onChange={handleChange}
          SelectProps={{
            native: false,
            renderValue: (value) => value || "Select your role"
          }}
          required
        >
          {['User', 'Admin'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
            '&:hover': { boxShadow: 2 }
          }}
          type="submit"
          disabled={isLoading} // Disable button while loading
        >
          Create Account
          {isLoading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, borderRadius: 'inherit' }} />}
        </Button>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already registered?{' '}
            <Link to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthContainer>
  );
}

export default Registration;