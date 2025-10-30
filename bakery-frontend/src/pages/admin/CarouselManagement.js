import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { carouselAPI, categoryAPI, itemAPI } from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';

const CarouselManagement = () => {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    linkType: 'CATEGORY',
    linkValue: '',
    displayOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slidesRes, categoriesRes, itemsRes] = await Promise.all([
        carouselAPI.getAll(),
        categoryAPI.getAll(),
        itemAPI.getAll(),
      ]);
      
      if (slidesRes.data.success) setSlides(slidesRes.data.data);
      if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
      if (itemsRes.data.success) setItems(itemsRes.data.data);
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slide = null) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData(slide);
    } else {
      setEditingSlide(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        buttonText: '',
        linkType: 'CATEGORY',
        linkValue: '',
        displayOrder: slides.length,
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlide(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingSlide) {
        await carouselAPI.update(editingSlide.id, formData);
        showSuccess('Carousel slide updated successfully');
      } else {
        await carouselAPI.create(formData);
        showSuccess('Carousel slide created successfully');
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save carousel slide');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this carousel slide?')) {
      try {
        await carouselAPI.delete(id);
        showSuccess('Carousel slide deleted successfully');
        fetchData();
      } catch (error) {
        showError('Failed to delete carousel slide');
      }
    }
  };

  const handleMoveUp = async (slide, index) => {
    if (index === 0) return;
    const prevSlide = slides[index - 1];
    try {
      await Promise.all([
        carouselAPI.update(slide.id, { ...slide, displayOrder: prevSlide.displayOrder }),
        carouselAPI.update(prevSlide.id, { ...prevSlide, displayOrder: slide.displayOrder }),
      ]);
      fetchData();
    } catch (error) {
      showError('Failed to reorder slides');
    }
  };

  const handleMoveDown = async (slide, index) => {
    if (index === slides.length - 1) return;
    const nextSlide = slides[index + 1];
    try {
      await Promise.all([
        carouselAPI.update(slide.id, { ...slide, displayOrder: nextSlide.displayOrder }),
        carouselAPI.update(nextSlide.id, { ...nextSlide, displayOrder: slide.displayOrder }),
      ]);
      fetchData();
    } catch (error) {
      showError('Failed to reorder slides');
    }
  };

  return (
    <>
      <AdminHeader title="Carousel Management" showBack={true} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ 
        minHeight: '100vh', 
        background: '#f5f5f5',
        marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
        marginTop: '70px',
        transition: 'margin-left 0.3s ease',
        padding: 3,
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Manage Carousel Slides
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ background: '#e91e63', '&:hover': { background: '#c2185b' } }}
          >
            Add Slide
          </Button>
        </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Button Text</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Link Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slides.map((slide, index) => (
              <TableRow key={slide.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveUp(slide, index)}
                      disabled={index === 0}
                    >
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveDown(slide, index)}
                      disabled={index === slides.length - 1}
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{slide.title}</TableCell>
                <TableCell>{slide.buttonText}</TableCell>
                <TableCell>{slide.linkType}</TableCell>
                <TableCell>
                  <Switch checked={slide.active} disabled />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(slide)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSlide ? 'Edit Carousel Slide' : 'Add Carousel Slide'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              fullWidth
              required
              helperText="Enter image URL (e.g., from Unsplash)"
            />
            <TextField
              label="Button Text"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Link Type</InputLabel>
              <Select
                value={formData.linkType}
                onChange={(e) => setFormData({ ...formData, linkType: e.target.value, linkValue: '' })}
                label="Link Type"
              >
                <MenuItem value="CATEGORY">Category</MenuItem>
                <MenuItem value="ITEM">Item</MenuItem>
                <MenuItem value="CUSTOM_URL">Custom URL</MenuItem>
              </Select>
            </FormControl>
            
            {formData.linkType === 'CATEGORY' && (
              <TextField
                label="Category ID"
                value={formData.linkValue}
                onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                fullWidth
                type="number"
                placeholder="Enter category ID (e.g., 1, 15)"
                helperText="Enter the category ID number"
              />
            )}
            
            {formData.linkType === 'ITEM' && (
              <TextField
                label="Item ID"
                value={formData.linkValue}
                onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                fullWidth
                type="number"
                placeholder="Enter item ID"
                helperText="Enter the item ID number"
              />
            )}
            
            {formData.linkType === 'CUSTOM_URL' && (
              <TextField
                label="Custom URL"
                value={formData.linkValue}
                onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                fullWidth
                placeholder="/shop or https://example.com"
              />
            )}
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ background: '#e91e63', '&:hover': { background: '#c2185b' } }}
          >
            {editingSlide ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
          </>
        )}
      </Box>
    </>
  );
};

export default CarouselManagement;
