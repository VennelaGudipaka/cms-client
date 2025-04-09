import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from '../components/Snackbar';
import { confirmDialog } from '../components/ConfirmDialog';
import { blogService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getById(id);
      setBlog(response.data);
      setLoading(false);
    } catch (error) {
      showSnackbar('Error fetching blog', 'error');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: 'Delete Blog',
      text: 'Are you sure you want to delete this blog? This action cannot be undone.',
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await blogService.delete(id);
        showSnackbar('Blog deleted successfully', 'success');
        navigate('/');
      } catch (error) {
        showSnackbar('Error deleting blog', 'error');
      }
    }
  };

  if (loading) {
    return <Container><LoadingSpinner /></Container>;
  }

  if (!blog) {
    return (
      <Container>
        <Alert severity="error">Blog not found</Alert>
      </Container>
    );
  }

  const isAuthor = user && blog.author?._id === user._id;
  const canEdit = isAuthor || isAdmin;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          {blog.title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            By {blog.author ? blog.author?.username : 'Anonymous'} | {new Date(blog.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Category: {blog.category?.name}
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Box 
          sx={{ mb: 4 }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {canEdit && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {isAuthor && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/blogs/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BlogDetail;