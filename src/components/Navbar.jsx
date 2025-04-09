import { 
  AppBar, 
  Toolbar, 
  Container, 
  Button, 
  Box, 
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Password as PasswordIcon,
  Logout as LogoutIcon,
  Article as ArticleIcon,
  Book as BookIcon,
  Home as HomeIcon,
  ContactMail as ContactIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useSnackbar } from './Snackbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'changePassword':
        navigate('/change-password');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    logout();
    showSnackbar('Logged out successfully', 'success');
    navigate('/login');
    handleClose();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const renderDrawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List>
        <ListItem button component={RouterLink} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={RouterLink} to="/contact" onClick={toggleDrawer(false)}>
          <ListItemIcon><ContactIcon /></ListItemIcon>
          <ListItemText primary="Contact Us" />
        </ListItem>
        {user ? (
          <>
            <ListItem button component={RouterLink} to="/create-blog" onClick={toggleDrawer(false)}>
              <ListItemIcon><BookIcon /></ListItemIcon>
              <ListItemText primary="Create Blog" />
            </ListItem>
            <ListItem button component={RouterLink} to="/create-article" onClick={toggleDrawer(false)}>
              <ListItemIcon><ArticleIcon /></ListItemIcon>
              <ListItemText primary="Create Article" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => handleMenuAction('profile')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => handleMenuAction('changePassword')}>
              <ListItemIcon><PasswordIcon /></ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/login" onClick={toggleDrawer(false)}>
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register" onClick={toggleDrawer(false)}>
              <ListItemIcon><RegisterIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar position="static" sx={{ width: '100%', backgroundColor: 'primary.main' }}>
      <Container maxWidth={false} disableGutters>
        <Toolbar sx={{ width: '100%', px: { xs: 2, sm: 4 } }}>
          {isMobile ? (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          ) : null}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              flexGrow: 1,
              '&:hover': { color: 'white' },
            }}
          >
            CMS System
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button component={RouterLink} to="/" sx={{ color: 'white' }}>
                Home
              </Button>
              <Button component={RouterLink} to="/contact" sx={{ color: 'white' }}>
                Contact Us
              </Button>
              {user ? (
                <>
                  <Button
                    sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    component={RouterLink}
                    to="/create-blog"
                    startIcon={<BookIcon />}
                  >
                    Create Blog
                  </Button>
                  <Button
                    sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    component={RouterLink}
                    to="/create-article"
                    startIcon={<ArticleIcon />}
                  >
                    Create Article
                  </Button>
                  <IconButton onClick={handleMenu} sx={{ color: 'white' }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{ minWidth: '180px', maxWidth: '250px' }}
                  >
                    <MenuItem onClick={() => handleMenuAction('profile')}>
                      <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuAction('changePassword')}>
                      <ListItemIcon><PasswordIcon fontSize="small" /></ListItemIcon>
                      Change Password
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleMenuAction('logout')}>
                      <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                      <Typography color="error">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={RouterLink} to="/login" sx={{ color: 'white' }}>
                    Login
                  </Button>
                  <Button component={RouterLink} to="/register" sx={{ color: 'white' }}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
      {renderDrawer}
    </AppBar>
  );
};

export default Navbar;
