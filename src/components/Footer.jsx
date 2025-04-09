import { Box, Container, Typography, Link, IconButton, Stack, useTheme, useMediaQuery } from '@mui/material';
import { GitHub as GitHubIcon, LinkedIn as LinkedInIcon, Twitter as TwitterIcon } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 2 },
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 }
          }}
        >
          {/* Left section */}
          <Box 
            sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', md: '30%' }
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              CMS System
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Your one-stop platform for content management
            </Typography>
          </Box>

          {/* Middle section */}
          <Box sx={{ 
            textAlign: 'center',
            order: { xs: 3, md: 2 }
          }}>
            <Stack 
              direction="row" 
              spacing={{ xs: 1, sm: 2 }} 
              sx={{ 
                mb: { xs: 1, sm: 2 },
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                About
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Privacy
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                Terms
              </Link>
            </Stack>
          </Box>

          {/* Right section */}
          <Box sx={{ 
            textAlign: { xs: 'center', md: 'right' },
            order: { xs: 2, md: 3 }
          }}>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: { xs: 1, sm: 2 },
                justifyContent: { xs: 'center', md: 'flex-end' }
              }}
            >
              <IconButton 
                color="inherit" 
                aria-label="GitHub"
                sx={{ 
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  p: { xs: 0.5, sm: 1 }
                }}
              >
                <GitHubIcon fontSize="inherit" />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="LinkedIn"
                sx={{ 
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  p: { xs: 0.5, sm: 1 }
                }}
              >
                <LinkedInIcon fontSize="inherit" />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Twitter"
                sx={{ 
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  p: { xs: 0.5, sm: 1 }
                }}
              >
                <TwitterIcon fontSize="inherit" />
              </IconButton>
            </Stack>
            <Typography 
              variant="body2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {currentYear} CMS System. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
