import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
  Box, 
  Chip, 
  CardMedia 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ContentCard = ({ content, type }) => {
  // Create text preview from content
  const createPreview = (content) => {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail Image */}
      {content.thumbnail && (
        <CardMedia
          component="img"
          height="180"
          image={content.thumbnail}
          alt={content.title || 'Thumbnail'}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {createPreview(content.content)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip 
            label={content.category?.name || 'Uncategorized'} 
            size="small" 
            sx={{ mr: 1, mb: 1 }} 
          />
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          By {content.author?.username || 'Anonymous'} | {new Date(content.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/blogs/${content._id}`}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
};

export default ContentCard;
