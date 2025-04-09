import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import { interestService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageInterests = () => {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await interestService.getAll();
      setInterests(response.data);
    } catch (error) {
      toast.error('Error fetching interests');
    }
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;

    try {
      const response = await interestService.create({ name: newInterest.trim() });
      setInterests([...interests, response.data]);
      setNewInterest('');
      toast.success('Interest added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding interest');
    }
  };

  const handleDeleteInterest = async (id) => {
    try {
      await interestService.delete(id);
      setInterests(interests.filter(interest => interest._id !== id));
      toast.success('Interest deleted successfully');
    } catch (error) {
      toast.error('Error deleting interest');
    }
  };

  if (!user?.isAdmin) {
    return (
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
        <Alert severity="error">
          You don't have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Manage Interests
        </Typography>

        <Box component="form" onSubmit={handleAddInterest} sx={{ mb: 4, maxWidth: 600 }}>
          <TextField
            fullWidth
            label="New Interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit"
            variant="contained"
            disabled={!newInterest.trim()}
          >
            Add Interest
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {interests.map((interest) => (
            <Chip
              key={interest._id}
              label={interest.name}
              onDelete={() => handleDeleteInterest(interest._id)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ManageInterests; 