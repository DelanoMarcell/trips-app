import { useState } from "react";
import {Link} from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Fade,
  InputAdornment,
  Divider
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

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic
  };

  return (
    <AuthContainer title="Welcome Back">
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          variant="filled"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined color="primary" />
              </InputAdornment>
            ),
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="filled"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined color="primary" />
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link 
          href="#" 
          variant="body2" 
          sx={{ 
            display: 'block', 
            textAlign: 'right', 
            mt: 1,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          Forgot Password?
        </Link>

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
          Sign In
        </Button>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link 
             to="/register"
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