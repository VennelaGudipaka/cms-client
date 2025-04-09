import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { articleService, blogService, interestService, adminService, contactService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/Snackbar';
import { confirmDialog } from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '20px 0' }}>
    {value === index && children}
  </div>
);

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [interests, setInterests] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const { user, isAdmin } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesRes, blogsRes, interestsRes, usersRes, contactsRes] = await Promise.all([
          articleService.getAll(),
          blogService.getAll(),
          interestService.getAll(),
          adminService.getAllUsers(),
          contactService.getAll()
        ]);

        setArticles(articlesRes.data);
        setBlogs(blogsRes.data);
        setInterests(interestsRes.data);
        setUsers(usersRes.data);
        setContacts(contactsRes.data);
      } catch (error) {
        showSnackbar('Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewItem = (item, type) => {
    navigate(`/${type}s/${item._id}`);
  };

  const handleDeleteArticle = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete Article',
      text: 'Are you sure you want to delete this article? This action cannot be undone.',
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await articleService.delete(id);
        setArticles(articles.filter(article => article._id !== id));
        showSnackbar('Article deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Error deleting article', 'error');
      }
    }
  };

  const handleDeleteBlog = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete Blog',
      text: 'Are you sure you want to delete this blog? This action cannot be undone.',
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await blogService.delete(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
        showSnackbar('Blog deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Error deleting blog', 'error');
      }
    }
  };

  const handleDeleteInterest = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete Interest',
      text: 'Are you sure you want to delete this interest? This action cannot be undone.',
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await interestService.delete(id);
        setInterests(interests.filter(interest => interest._id !== id));
        showSnackbar('Interest deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Error deleting interest', 'error');
      }
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest.trim()) {
      showSnackbar('Interest name cannot be empty', 'error');
      return;
    }

    try {
      const response = await interestService.create({ name: newInterest.trim() });
      setInterests([...interests, response.data]);
      setNewInterest('');
      setOpenDialog(false);
      showSnackbar('Interest added successfully', 'success');
    } catch (error) {
      showSnackbar('Error adding interest', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u._id === userId);
    if (!userToDelete) return;

    const confirmed = await confirmDialog({
      title: 'Delete User',
      text: `Are you sure you want to delete ${userToDelete.username}? This will also delete all their articles and blogs.`,
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        showSnackbar('User deleted successfully', 'success');
      } catch (error) {
        showSnackbar(error.response?.data?.message || 'Error deleting user', 'error');
      }
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const updatedContact = await contactService.updateStatus(contactId, newStatus);
      setContacts(contacts.map(contact => 
        contact._id === contactId ? updatedContact.data : contact
      ));
      showSnackbar('Status updated successfully', 'success');
    } catch (error) {
      showSnackbar('Error updating status', 'error');
    }
  };

  const handleDeleteContact = async (contactId) => {
    const confirmed = await confirmDialog({
      title: 'Delete Contact',
      text: 'Are you sure you want to delete this contact message? This action cannot be undone.',
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await contactService.delete(contactId);
        setContacts(contacts.filter(contact => contact._id !== contactId));
        showSnackbar('Contact deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Error deleting contact', 'error');
      }
    }
  };

  if (loading) {
    return <Container><LoadingSpinner /></Container>;
  }

  if (!user || !isAdmin) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Articles" />
            <Tab label="Blogs" />
            <Tab label="Interests" />
            <Tab label="Users" />
            <Tab label="Contacts" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Manage Articles
          </Typography>
          <List>
            {articles.map(article => (
              <ListItem 
                key={article._id}
                button
                onClick={() => handleViewItem(article, 'article')}
              >
                <ListItemText
                  primary={article.title}
                  secondary={`By ${article.author?.username || 'Anonymous'} • ${new Date(article.createdAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteArticle(article._id);
                  }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Manage Blogs
          </Typography>
          <List>
            {blogs.map(blog => (
              <ListItem 
                key={blog._id}
                button
                onClick={() => handleViewItem(blog, 'blog')}
              >
                <ListItemText
                  primary={blog.title}
                  secondary={`By ${blog.author?.username || 'Anonymous'} • ${new Date(blog.createdAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBlog(blog._id);
                  }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Manage Interests
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Interest
            </Button>
          </Box>
          <List>
            {interests.map(interest => (
              <ListItem 
                key={interest._id}
                button
                onClick={() => handleViewItem(interest, 'interest')}
              >
                <ListItemText
                  primary={interest.name}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteInterest(interest._id);
                  }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Manage Users
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={user.role === 'admin' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Contact Messages
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.description}</TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="resolved">Resolved</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteContact(contact._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Add Interest Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Interest</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Interest Name"
            fullWidth
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddInterest} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
