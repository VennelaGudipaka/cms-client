import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/Snackbar';
import { useAuth } from '../context/AuthContext';
import { interestService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [interests, setInterests] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch available interests
  useState(() => {
    const fetchInterests = async () => {
      try {
        const response = await interestService.getAll();
        setAvailableInterests(response.data);
      } catch (error) {
        showSnackbar('Error fetching interests', 'error');
      }
    };
    fetchInterests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interestId) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }
    try {
      await register({ ...formData, interests }); // Now sending interest IDs
      showSnackbar('Registration successful! Please verify your email.', 'success');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Registration failed', 'error');
    }
  };
  

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: { xs: 2, sm: 3 } }}
          />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select your interests
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              mb: { xs: 2, sm: 3 },
              '& > *': { margin: '4px !important' }
            }}
          >
            {availableInterests.map((interest) => (
              <Chip
                key={interest._id} // Use interest ID as key
                label={interest.name} // Display interest name
                onClick={() => handleInterestChange(interest._id)} // Use ID for selection
                color={interests.includes(interest._id) ? "primary" : "default"}
                variant={interests.includes(interest._id) ? "filled" : "outlined"}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: interests.includes(interest._id)
                      ? 'primary.dark'
                      : 'action.hover'
                  }
                }}
              />
            ))}
          </Stack>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              mt: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 1.5 }
            }}
          >
            Register
          </Button>
          <Box
            sx={{
              mt: { xs: 2, sm: 3 },
              textAlign: 'center'
            }}
          >
            <Typography variant="body2">
              Already have an account?{' '}
              <RouterLink
                to="/login"
                style={{
                  color: 'primary.main',
                  textDecoration: 'none'
                }}
              >
                Login here
              </RouterLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;