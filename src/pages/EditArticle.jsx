import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Box,
  Chip,
  Grid,
  MenuItem
} from '@mui/material';
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import { articleService, interestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EditArticle = ({placeholder}) => {
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    body: '',
    conclusion: '',
    references: [],
    category: '',
    tags: [],
    thumbnail: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch interests
        const interestsResponse = await interestService.getAll();
        setInterests(interestsResponse.data);

        // Fetch article
        const articleResponse = await articleService.getById(id);
        const article = articleResponse.data;
        
        if (!user || article.author._id !== user._id) {
          toast.error('Unauthorized to edit this article');
          navigate('/');
          return;
        }

        setFormData({
          title: article.title,
          introduction: article.introduction,
          body: article.body,
          conclusion: article.conclusion,
          references: article.references || [],
          category: article.category._id, // Use the category ID
          tags: article.tags || [],
          thumbnail: article.thumbnail || ''
        });
        setThumbnailPreview(article.thumbnail || '');
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching data');
        navigate('/');
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleBodyChange = (body) => {
    setFormData({ ...formData, body });
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleReferenceKeyPress = (e) => {
    if (e.key === 'Enter' && referenceInput.trim()) {
      e.preventDefault();
      // Validate URL format
      try {
        new URL(referenceInput.trim());
        setFormData({
          ...formData,
          references: [...formData.references, referenceInput.trim()]
        });
        setReferenceInput('');
      } catch (error) {
        toast.error('Please enter a valid URL');
      }
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const handleDeleteReference = (refToDelete) => {
    setFormData({
      ...formData,
      references: formData.references.filter(ref => ref !== refToDelete)
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    try {
      await articleService.update(id, formData);
      toast.success('Article updated successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating article');
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      height: 500,
      enableDragAndDropFileToEditor: true,
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif"],
        processBeforeUpload: (files) => {
          return new Promise((resolve, reject) => {
            const processed = Array.from(files).map((file) => {
              return new Promise((resolve) => {
                const img = new Image();
                img.onload = function () {
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
  
                  let width = img.width;
                  let height = img.height;
                  const maxSize = 1200;
  
                  if (width > maxSize || height > maxSize) {
                    if (width > height) {
                      height = Math.round((height * maxSize) / width);
                      width = maxSize;
                    } else {
                      width = Math.round((width * maxSize) / height);
                      height = maxSize;
                    }
                  }
  
                  canvas.width = width;
                  canvas.height = height;
                  ctx.drawImage(img, 0, 0, width, height);
  
                  const base64 = canvas.toDataURL("image/jpeg", 0.7);
                  resolve(base64);
                };
                img.onerror = () => resolve(null);
  
                const reader = new FileReader();
                reader.onload = (e) => (img.src = e.target.result);
                reader.readAsDataURL(file);
              });
            });
  
            Promise.all(processed)
              .then((results) => resolve(results.filter(Boolean)))
              .catch(reject);
          });
        },
      },
      removeButtons: ["about"],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: false,
      defaultMode: "1",
      enter: "P",
      language: "en",
      toolbar: true,
      spellcheck: false,
      disablePlugins: "file,about",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "image",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
      ],
      beautifyHTML: false,
      useSearch: false,
      cleanHTML: {
        fillEmptyParagraph: false,
        removeEmptyElements: false,
        removeSpans: false,
        removeScripts: true,
        removeStyleAttributes: false,
      },
    }),
    [placeholder]
  );

  if (loading) {
    return <Container><LoadingSpinner /></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Article
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="thumbnail-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="thumbnail-upload">
                  <Button variant="contained" component="span" sx={{ mb: 2 }}>
                    Change Thumbnail
                  </Button>
                </label>
                {thumbnailPreview && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Body
              </Typography>
              <JoditEditor
                value={formData.body}
                onChange={handleBodyChange}
                config={config}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Conclusion"
                name="conclusion"
                value={formData.conclusion}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {interests.map((interest) => (
                  <MenuItem key={interest._id} value={interest._id}>
                    {interest.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Tags (Press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add References (Press Enter)"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                onKeyPress={handleReferenceKeyPress}
                placeholder="https://example.com"
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.references.map((ref, index) => (
                  <Chip
                    key={index}
                    label={ref}
                    onDelete={() => handleDeleteReference(ref)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Update Article
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditArticle;