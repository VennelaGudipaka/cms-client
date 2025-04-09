import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Button,
  IconButton,
  CardActions
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { articleService, blogService, interestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from '../components/Snackbar';
import { confirmDialog } from '../components/ConfirmDialog';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all'
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch interests
        const interestsResponse = await interestService.getAll();
        setInterests(interestsResponse.data);

        // Fetch both articles and blogs
        const [articlesResponse, blogsResponse] = await Promise.all([
          articleService.getAll(),
          blogService.getAll()
        ]);

        let articles = articlesResponse.data.map(item => ({ ...item, type: 'article' }));
        let blogs = blogsResponse.data.map(item => ({ ...item, type: 'blog' }));
        
        // Combine and sort by date
        let allPosts = [...articles, ...blogs].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
      );

        // If user is logged in, prioritize posts matching their interests
        if (user && user.interests) {
          allPosts = allPosts.sort((a, b) => {
            const aMatchesInterest = user.interests.includes(a.category._id);
            const bMatchesInterest = user.interests.includes(b.category._id);
            if (aMatchesInterest && !bMatchesInterest) return -1;
            if (!aMatchesInterest && bMatchesInterest) return 1;
            return 0;
          });
        }

        setPosts(allPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        showSnackbar('Error loading content', 'error');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         (post.author?.username || '').toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || post.category._id === filters.category;
    const matchesType = filters.type === 'all' || post.type === filters.type;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleEdit = (post) => {
    if (post.type === 'article') {
      navigate(`/articles/${post._id}/edit`);
    } else {
      navigate(`/blogs/${post._id}/edit`);
    }
  };

  const handleDelete = async (post) => {
    const confirmed = await confirmDialog({
      title: `Delete ${post.type.charAt(0).toUpperCase() + post.type.slice(1)}`,
      text: `Are you sure you want to delete this ${post.type.toLowerCase()}? This action cannot be undone.`,
      icon: 'warning'
    });

    if (confirmed) {
      try {
        if (post.type === 'article') {
          await articleService.delete(post._id);
        } else {
          await blogService.delete(post._id);
        }
        setPosts(posts.filter(p => p._id !== post._id));
        showSnackbar(`${post.type.charAt(0).toUpperCase() + post.type.slice(1)} deleted successfully`, 'success');
      } catch (error) {
        showSnackbar(`Error deleting ${post.type.toLowerCase()}`, 'error');
      }
    }
  };

  const getAuthorDisplay = (author) => {
    return author?.username ? `By ${author.username}` : 'By Anonymous';
  };

  if (loading) {
    return <Container><LoadingSpinner /></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or author..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {interests.map(interest => (
                  <MenuItem key={interest._id} value={interest._id}>
                    {interest.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="article">Articles</MenuItem>
                <MenuItem value="blog">Blogs</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredPosts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={`${post.type}-${post._id}`}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {post.thumbnail && (
                <CardMedia
                  component="img"
                  height="140"
                  image={post.thumbnail}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getAuthorDisplay(post.author)} • {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip 
                    label={post.category.name} 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    label={post.type} 
                    size="small" 
                    color={post.type === 'article' ? 'primary' : 'secondary'} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {post.introduction || post.summary || ''}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/${post.type}s/${post._id}`)}
                >
                  Read More
                </Button>
                {user && user._id === post.author?._id && (
                  <>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(post)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(post)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
