

import { useState } from "react";
import {Link} from 'react-router-dom'
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Grid,
  Fade,
  InputAdornment,
  Divider,
  MenuItem
} from "@mui/material";
import { LockOutlined, EmailOutlined, PersonOutlined, PhoneIphoneOutlined } from "@mui/icons-material";

const AuthContainer = ({ children, title }) => (
  <Container maxWidth="xs" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
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
          mb: 4
        }}>
          {title}
        </Typography>
        {children}
      </Box>
    </Fade>
  </Container>
);


export function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    cellphone: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic
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
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Phone Number"
          variant="filled"
          margin="normal"
          name="cellphone"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIphoneOutlined color="primary" />
              </InputAdornment>
            ),
          }}
          value={formData.cellphone}
          onChange={handleChange}
        />

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
        >
          {['User', 'Admin'].map((option) => (
            <MenuItem key={option} value={option.toLowerCase()}>
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
        >
          Create Account
        </Button>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already registered?{' '}
            <Link 
             to="/login"
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthContainer>
  );
}

export default Registration;