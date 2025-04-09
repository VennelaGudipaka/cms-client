import { Box } from '@mui/material';
import { ThreeDots } from 'react-loader-spinner';

const LoadingSpinner = ({ size = 40, color = "#1976d2" }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
    >
      <ThreeDots 
        height={size} 
        width={size * 2} 
        color={color} 
        ariaLabel="loading-indicator"
      />
    </Box>
  );
};

export default LoadingSpinner;
