import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import { SnackbarProvider } from './components/Snackbar';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';

// Components
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import ArticleDetail from './pages/ArticleDetail';
import BlogDetail from './pages/BlogDetail';
import ChangePassword from './pages/ChangePassword';
import ContactUs from './pages/ContactUs';
import CreateArticle from './pages/CreateArticle';
import CreateBlog from './pages/CreateBlog';
import EditArticle from './pages/EditArticle';
import EditBlog from './pages/EditBlog';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh',
              width: '100%'
            }}>
              <Navbar />
              <Box component="main" sx={{ 
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/blogs/:id" element={<BlogDetail />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />

                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/create-article" element={<CreateArticle />} />
                    <Route path="/create-blog" element={<CreateBlog />} />
                    <Route path="/articles/:id/edit" element={<EditArticle />} />
                    <Route path="/blogs/:id/edit" element={<EditBlog />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;