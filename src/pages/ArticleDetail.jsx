import { Container, Typography, Paper, Box, Button, Chip, Grid, Divider, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from '../components/Snackbar';
import { confirmDialog } from '../components/ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articleService.getById(id);
        setArticle(response.data);
        setLoading(false);
      } catch (error) {
        showSnackbar('Error fetching article', 'error');
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: 'Delete Article',
      text: 'Are you sure you want to delete this article? This action cannot be undone.',
      icon: 'warning'
    });

    if (confirmed) {
      try {
        await articleService.delete(id);
        showSnackbar('Article deleted successfully', 'success');
        navigate('/');
      } catch (error) {
        showSnackbar('Error deleting article', 'error');
      }
    }
  };

  if (loading) {
    return <Container><LoadingSpinner /></Container>;
  }

  if (!article) {
    return (
      <Container>
        <Alert severity="error">Article not found</Alert>
      </Container>
    );
  }

  const isAuthor = user && article.author?._id === user._id;
  const canEdit = isAuthor || isAdmin;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {article.thumbnail && (
          <Box sx={{ mb: 4, width: '100%', height: '300px', position: 'relative', overflow: 'hidden' }}>
            <img
              src={article.thumbnail}
              alt={article.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          </Box>
        )}

        <Typography variant="h3" gutterBottom>
          {article.title}
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By {article.author.username} • {new Date(article.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Chip 
            label={article.category.name} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>

        {article.tags && article.tags.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {article.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            {article.introduction}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Content
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
        </Box>

        {article.conclusion && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                Conclusion
              </Typography>
              <Typography variant="body1" paragraph>
                {article.conclusion}
              </Typography>
            </Box>
          </>
        )}

        {article.references && article.references.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h4" gutterBottom>
                References
              </Typography>
              <ul>
                {article.references.map((reference, index) => (
                  <li key={index}>
                    <Typography variant="body1">{reference}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </>
        )}

        {canEdit && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {isAuthor && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/articles/${id}/edit`)}
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

export default ArticleDetail;