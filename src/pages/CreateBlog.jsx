import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import JoditEditor from 'jodit-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { blogService, interestService } from '../services/api';

const CreateBlog = ({placeholder}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    thumbnail:'',
    title: '',
    content: '',
    category: ''
  });
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast.error('Please login to create a blog');
      navigate('/login');
      return;
    }
    
    const fetchInterests = async () => {
      try {
        const response = await interestService.getAll();
        setInterests(response.data);
      } catch (error) {
        toast.error('Error fetching categories');
      }
    };
    fetchInterests();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
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

    if(!formData.thumbnail){
      toast.error('Please enter thumbnail');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      await blogService.create(formData);
      toast.success('Blog created successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating blog');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Blog
        </Typography>
        <form onSubmit={handleSubmit}>
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
                Upload Thumbnail
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
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {interests.map((interest) => (
                <MenuItem key={interest._id} value={interest._id}>
                  {interest.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Content
            </Typography>
            <JoditEditor
              value={formData.content}
              config={config}
              onBlur={handleContentChange}
              onChange={() => {}}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Create Blog
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateBlog; 