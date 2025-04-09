import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/Snackbar';
import { contactService } from '../services/api';

const ContactUs = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactService.create(formData);
      showSnackbar('Message sent successfully!', 'success');
      setFormData(prev => ({
        ...prev,
        description: ''
      }));
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error sending message', 'error');
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
          Contact Us
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 3 }}
        >
          Have a question or feedback? We'd love to hear from you.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={!!user}
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
          <TextField
            fullWidth
            label="Message"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Type your message here..."
            sx={{ mb: { xs: 2, sm: 3 } }}
          />
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
            Send Message
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ContactUs;
