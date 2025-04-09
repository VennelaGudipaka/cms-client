import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/Snackbar';
import { userService, articleService, blogService, interestService } from '../services/api';
import { confirmDialog } from '../components/ConfirmDialog';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInterests, setUserInterests] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        setLoading(true);
        const [articlesRes, blogsRes] = await Promise.all([
          articleService.getByUser(user._id),
          blogService.getByUser(user._id)
        ]);
        
        setArticles(articlesRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        showSnackbar('Error fetching your content', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserContent();
    }
  }, [user, showSnackbar]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDelete = async (id, type) => {
    const confirmed = await confirmDialog({
      title: `Delete ${type}`,
      text: `Are you sure you want to delete this ${type.toLowerCase()}? This action cannot be undone.`,
      icon: 'warning'
    });

    if (confirmed) {
      try {
        if (type === 'Article') {
          await articleService.delete(id);
          setArticles(articles.filter(article => article._id !== id));
        } else {
          await blogService.delete(id);
          setBlogs(blogs.filter(blog => blog._id !== id));
        }
        showSnackbar(`${type} deleted successfully`, 'success');
      } catch (error) {
        showSnackbar(`Error deleting ${type.toLowerCase()}`, 'error');
      }
    }
  };

  const handleEdit = (item, type) => {
    navigate(`/${type.toLowerCase()}s/${item._id}/edit`);
  };

  const handleView = (item, type) => {
    navigate(`/${type.toLowerCase()}s/${item._id}`);
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmDialog({
      title: 'Delete Account',
      text: 'Are you sure you want to delete your account? This will permanently delete all your articles, blogs, and account information. This action cannot be undone.',
      icon: 'warning',
      confirmButtonText: 'Yes, Delete My Account',
      confirmButtonColor: '#d33',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    });

    if (confirmed) {
      try {
        await userService.deleteAccount();
        showSnackbar('Your account has been deleted successfully', 'success');
        logout();
        navigate('/');
      } catch (error) {
        showSnackbar(error.response?.data?.message || 'Error deleting account', 'error');
      }
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'center', 
              mb: 3 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 2 : 0 }}>
                <Avatar
                  sx={{ width: 100, height: 100, mr: 3 }}
                  src={user.avatar}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4">{user.username}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Interests:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {user.interests.map(interest => (
                        <Chip
                          key={interest._id}
                          label={interest.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAccount}
                sx={{ mt: isMobile ? 2 : 0 }}
              >
                Delete My Account
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
            >
              <Tab label={`Articles (${articles.length})`} />
              <Tab label={`Blogs (${blogs.length})`} />
            </Tabs>
            <Divider />

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                {articles.length > 0 ? (
                  articles.map(article => (
                    <Grid item xs={12} sm={6} md={4} key={article._id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {article.thumbnail && (
                          <CardMedia
                            component="img"
                            height="140"
                            image={article.thumbnail}
                            alt={article.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {article.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Chip 
                              label={article.category.name} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {article.introduction}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => handleView(article, 'Article')}>
                            Read More
                          </Button>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEdit(article, 'Article')}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(article._id, 'Article')}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center">
                      You haven't created any articles yet.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {blogs.length > 0 ? (
                  blogs.map(blog => (
                    <Grid item xs={12} sm={6} md={4} key={blog._id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {blog.thumbnail && (
                          <CardMedia
                            component="img"
                            height="140"
                            image={blog.thumbnail}
                            alt={blog.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {blog.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Chip 
                              label={blog.category.name} 
                              size="small" 
                              color="secondary"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {blog.summary}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => handleView(blog, 'Blog')}>
                            Read More
                          </Button>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEdit(blog, 'Blog')}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(blog._id, 'Blog')}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography align="center">
                      You haven't created any blogs yet.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;