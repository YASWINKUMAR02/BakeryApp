import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
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
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
} from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { itemAPI, categoryAPI } from '../../services/api';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { showSuccess, showError } from '../../utils/toast';

const Items = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    grams: '',
    pieces: 1,
    imageUrl: '',
    categoryId: '',
    stock: 0,
    egglessStock: 0,
    // Cake weight pricing
    pricePerKg: {
      '1': '',
      '1.5': '',
      '2': '',
      '2.5': '',
      '3': '',
    },
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemAPI.getAll();
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (err) {
      showError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      showError('Category name is required');
      return;
    }

    try {
      const response = await categoryAPI.create(newCategory);
      if (response.data.success) {
        showSuccess('Category created successfully!');
        setOpenCategoryDialog(false);
        setNewCategory({ name: '', description: '' });
        await fetchCategories();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditMode(true);
      // Parse pricePerKg if it exists
      let parsedPricePerKg = {
        '1': '',
        '1.5': '',
        '2': '',
        '2.5': '',
        '3': '',
      };
      if (item.pricePerKg) {
        try {
          parsedPricePerKg = JSON.parse(item.pricePerKg);
        } catch (e) {
          console.error('Error parsing pricePerKg:', e);
        }
      }
      
      setCurrentItem({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        grams: item.grams || '',
        pieces: item.pieces || 1,
        imageUrl: item.imageUrl,
        categoryId: item.category?.id || '',
        stock: item.stock || 0,
        egglessStock: item.egglessStock || 0,
        pricePerKg: parsedPricePerKg,
      });
    } else {
      setEditMode(false);
      setCurrentItem({
        id: null,
        name: '',
        description: '',
        price: '',
        grams: '',
        pieces: 1,
        imageUrl: '',
        categoryId: '',
        stock: 0,
        egglessStock: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentItem({
      id: null,
      name: '',
      description: '',
      price: '',
      grams: '',
      pieces: 1,
      imageUrl: '',
      categoryId: '',
      stock: 0,
      egglessStock: 0,
    });
  };

  const handleSave = async () => {
    // Check if selected category requires weight-based pricing
    const categoryName = categories.find(cat => cat.id === currentItem.categoryId)?.name?.toLowerCase() || '';
    const isWeightBasedCategory = categoryName.includes('occasional') || 
                                   categoryName.includes('premium') || 
                                   categoryName.includes('party');
    
    // Validation based on category
    if (!currentItem.name.trim() || !currentItem.categoryId) {
      showError('Name and category are required');
      return;
    }
    
    // For non-weight-based items, validate price and grams
    if (!isWeightBasedCategory && (!currentItem.price || !currentItem.grams)) {
      showError('Price and weight are required');
      return;
    }
    
    // For weight-based items, validate at least one weight price
    if (isWeightBasedCategory) {
      const hasAtLeastOnePrice = currentItem.pricePerKg && Object.values(currentItem.pricePerKg).some(price => price && parseFloat(price) > 0);
      if (!hasAtLeastOnePrice) {
        showError('Please set at least one weight price for this category');
        return;
      }
    }

    try {
      const itemData = {
        name: currentItem.name,
        description: currentItem.description,
        imageUrl: currentItem.imageUrl,
        categoryId: currentItem.categoryId,
        stock: parseInt(currentItem.stock) || 0,
        egglessStock: parseInt(currentItem.egglessStock) || 0,
        featured: currentItem.featured || false,
        available: currentItem.available !== false,
      };
      
      // Add price, grams, pieces only for non-weight-based items
      if (!isWeightBasedCategory) {
        itemData.price = parseFloat(currentItem.price);
        itemData.grams = parseInt(currentItem.grams);
        itemData.pieces = parseInt(currentItem.pieces) || 1;
      } else {
        // For cakes, add weight-based pricing
        // Filter out empty values and convert to numbers
        const cleanedPrices = {};
        Object.keys(currentItem.pricePerKg).forEach(key => {
          const value = currentItem.pricePerKg[key];
          if (value && value !== '' && parseFloat(value) > 0) {
            cleanedPrices[key] = value.toString();
          }
        });
        itemData.pricePerKg = JSON.stringify(cleanedPrices);
        console.log('Saving cake with pricePerKg:', itemData.pricePerKg);
        // Set default values for required fields
        itemData.price = 0;
        itemData.grams = 1000; // Default 1kg
        itemData.pieces = 1;
      }

      if (editMode) {
        await itemAPI.update(currentItem.id, itemData);
        showSuccess('Item updated successfully!');
      } else {
        await itemAPI.create(itemData);
        showSuccess('Item created successfully!');
      }
      handleCloseDialog();
      fetchItems();
    } catch (err) {
      showError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await itemAPI.delete(itemToDelete.id);
      showSuccess('Item deleted successfully!');
      fetchItems();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete item';
      showError(errorMessage);
      console.error('Delete item error:', err);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      <AdminHeader title="Item Management" showBack={true} onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ 
        minHeight: '100vh', 
        background: '#f5f5f5', 
        paddingTop: { xs: '70px', sm: '80px' }, 
        paddingBottom: { xs: '20px', sm: '40px' },
        paddingLeft: { xs: '8px', sm: '16px' },
        paddingRight: { xs: '8px', sm: '16px' },
        marginLeft: { xs: 0, md: sidebarOpen ? '260px' : '70px' },
        transition: 'margin-left 0.3s ease'
      }}>
        <Container maxWidth="lg">
          <Paper sx={{ padding: { xs: '12px', sm: '20px' }, marginBottom: '20px' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: '12px', sm: '0' },
              marginBottom: '20px' 
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Items
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: '10px',
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/categories')}
                  sx={{ 
                    borderColor: '#ff6b35', 
                    color: '#ff6b35', 
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Manage Categories
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{ 
                    background: '#ff6b35', 
                    color: '#fff', 
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Add Item
                </Button>
              </Box>
            </Box>
            
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search items by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search style={{ marginRight: '8px', color: '#666' }} />,
              }}
              size="small"
              style={{ marginBottom: '20px', marginTop: '20px', background: '#fff' }}
            />

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress />
              </Box>
            ) : isMobile ? (
              // Mobile Card View
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.length === 0 ? (
                  <Typography align="center" sx={{ padding: '40px', color: '#666' }}>
                    No items found. Create one to get started!
                  </Typography>
                ) : (
                  items
                    .filter(item => 
                      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <Card key={item.id} sx={{ borderRadius: '8px', boxShadow: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                              {item.name}
                            </Typography>
                            <Chip label={`#${item.id}`} size="small" color="default" />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {item.description?.substring(0, 80)}...
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Price:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.category?.name?.toLowerCase().includes('cake') && item.pricePerKg ? (
                                  <Box component="span" sx={{ color: '#ff6b35' }}>
                                    Weight-based
                                  </Box>
                                ) : (
                                  `₹${item.price?.toFixed(2)}`
                                )}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Weight:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.category?.name?.toLowerCase().includes('cake') ? 'Variable' : `${item.grams}g`}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">Stock:</Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <Chip 
                                  label={`Regular: ${item.stock || 0}`}
                                  size="small" 
                                  color={item.stock === 0 ? 'error' : item.stock <= 10 ? 'warning' : 'success'}
                                  sx={{ fontSize: '0.7rem' }}
                                />
                                {item.egglessStock > 0 && (
                                  <Chip 
                                    label={`🌱 ${item.egglessStock || 0}`}
                                    size="small" 
                                    color={item.egglessStock === 0 ? 'error' : item.egglessStock <= 10 ? 'warning' : 'success'}
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Category:</Typography>
                              <Chip label={item.category?.name} size="small" color="primary" />
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              startIcon={<Edit />}
                              onClick={() => handleOpenDialog(item)}
                              sx={{ textTransform: 'none' }}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteClick(item)}
                              sx={{ textTransform: 'none' }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                )}
              </Box>
            ) : (
              // Desktop Table View
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#f5f7fa' }}>
                      <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Price</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Weight</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Stock</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell align="right" style={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" style={{ padding: '40px' }}>
                          No items found. Create one to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      items
                        .filter(item => 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.description?.substring(0, 50)}...</TableCell>
                          <TableCell>
                            {item.category?.name?.toLowerCase().includes('cake') && item.pricePerKg ? (
                              <Box>
                                <Typography variant="body2" style={{ fontWeight: 600, color: '#ff6b35' }}>
                                  Weight-based
                                </Typography>
                                <Typography variant="caption" style={{ color: '#666' }}>
                                  {(() => {
                                    try {
                                      const prices = JSON.parse(item.pricePerKg);
                                      const priceList = Object.entries(prices)
                                        .filter(([k, v]) => v && parseFloat(v) > 0)
                                        .map(([k, v]) => `${k}kg: ₹${v}`)
                                        .join(', ');
                                      return priceList || 'Not set';
                                    } catch (e) {
                                      return 'Error';
                                    }
                                  })()}
                                </Typography>
                              </Box>
                            ) : (
                              `₹${item.price?.toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell>
                            {item.category?.name?.toLowerCase().includes('cake') ? (
                              <Typography variant="body2" style={{ color: '#666' }}>
                                Variable
                              </Typography>
                            ) : (
                              `${item.grams}g`
                            )}
                          </TableCell>
                          <TableCell>
                            <Box style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                              <Chip 
                                label={`Regular: ${item.stock || 0}`}
                                size="small" 
                                color={item.stock === 0 ? 'error' : item.stock <= 10 ? 'warning' : 'success'}
                                style={{ fontSize: '11px', borderRadius: 0 }}
                              />
                              {item.egglessStock > 0 && (
                                <Chip 
                                  label={`🌱 ${item.egglessStock || 0}`}
                                  size="small" 
                                  color={item.egglessStock === 0 ? 'error' : item.egglessStock <= 10 ? 'warning' : 'success'}
                                  style={{ fontSize: '11px', borderRadius: 0 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={item.category?.name} size="small" color="primary" style={{ borderRadius: 0 }} />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(item)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={currentItem.name}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
            style={{ marginTop: '16px' }}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={currentItem.description}
            onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
          />

          {/* Only show Price, Weight, and Pieces for non-weight-based items */}
          {!(() => {
            const catName = categories.find(cat => cat.id === currentItem.categoryId)?.name?.toLowerCase() || '';
            return (catName.includes('occasional') || catName.includes('premium') || catName.includes('party'));
          })() && (
            <>
              <TextField
                margin="dense"
                label="Price (₹)"
                type="number"
                fullWidth
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
              />

              <TextField
                margin="dense"
                label="Weight (grams)"
                type="number"
                fullWidth
                value={currentItem.grams}
                onChange={(e) => setCurrentItem({ ...currentItem, grams: e.target.value })}
                helperText="Enter weight in grams"
              />

              <TextField
                margin="dense"
                label="Number of Pieces"
                type="number"
                fullWidth
                value={currentItem.pieces}
                onChange={(e) => setCurrentItem({ ...currentItem, pieces: parseInt(e.target.value) || 1 })}
                helperText="How many pieces per item (e.g., 2 pieces of cake)"
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
            </>
          )}

          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={currentItem.imageUrl}
            onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Stock Quantity"
            type="number"
            fullWidth
            value={currentItem.stock || 0}
            onChange={(e) => setCurrentItem({ ...currentItem, stock: parseInt(e.target.value) || 0 })}
            helperText="Available quantity in stock"
            InputProps={{ inputProps: { min: 0 } }}
          />

          {/* Eggless Stock */}
          <Box style={{ marginTop: '16px', padding: '16px', background: '#fef6ee' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px' }}>
              🌱 Eggless Stock (Optional)
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '12px' }}>
              Set separate stock for eggless variant. Regular stock above will be used for egg variant.
            </Typography>
            
            <TextField
              label="🌱 Eggless Stock"
              type="number"
              fullWidth
              value={currentItem.egglessStock || 0}
              onChange={(e) => setCurrentItem({ ...currentItem, egglessStock: parseInt(e.target.value) || 0 })}
              InputProps={{ inputProps: { min: 0 } }}
              helperText="Stock for eggless variant only"
            />
          </Box>

          {/* Weight Pricing - Only show for Occasional, Premium, Party Cakes */}
          {(() => {
            const catName = categories.find(cat => cat.id === currentItem.categoryId)?.name?.toLowerCase() || '';
            return (catName.includes('occasional') || catName.includes('premium') || catName.includes('party'));
          })() && (
            <Box style={{ marginTop: '16px', padding: '16px', background: '#fff3e0', borderRadius: '8px' }}>
              <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px', color: '#ff6b35' }}>
                🎂 Weight-Based Pricing
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
                Set different prices for different weights. Leave empty to use base price.
              </Typography>
              
              <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <TextField
                  label="1 Kg Price (₹)"
                  type="number"
                  value={currentItem.pricePerKg?.['1'] || ''}
                  onChange={(e) => setCurrentItem({ 
                    ...currentItem, 
                    pricePerKg: { ...currentItem.pricePerKg, '1': e.target.value }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="1.5 Kg Price (₹)"
                  type="number"
                  value={currentItem.pricePerKg?.['1.5'] || ''}
                  onChange={(e) => setCurrentItem({ 
                    ...currentItem, 
                    pricePerKg: { ...currentItem.pricePerKg, '1.5': e.target.value }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="2 Kg Price (₹)"
                  type="number"
                  value={currentItem.pricePerKg?.['2'] || ''}
                  onChange={(e) => setCurrentItem({ 
                    ...currentItem, 
                    pricePerKg: { ...currentItem.pricePerKg, '2': e.target.value }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="2.5 Kg Price (₹)"
                  type="number"
                  value={currentItem.pricePerKg?.['2.5'] || ''}
                  onChange={(e) => setCurrentItem({ 
                    ...currentItem, 
                    pricePerKg: { ...currentItem.pricePerKg, '2.5': e.target.value }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="3 Kg Price (₹)"
                  type="number"
                  value={currentItem.pricePerKg?.['3'] || ''}
                  onChange={(e) => setCurrentItem({ 
                    ...currentItem, 
                    pricePerKg: { ...currentItem.pricePerKg, '3': e.target.value }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
            </Box>
          )}

          <Box style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={currentItem.categoryId}
                onChange={(e) => setCurrentItem({ ...currentItem, categoryId: e.target.value })}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => setOpenCategoryDialog(true)}
              style={{ 
                marginTop: '8px', 
                minWidth: '120px',
                borderColor: '#ff6b35',
                color: '#ff6b35'
              }}
            >
              + Add New
            </Button>
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" style={{ background: '#ff6b35', color: '#fff' }}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            style={{ marginTop: '16px' }}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={() => {
            setOpenCategoryDialog(false);
            setNewCategory({ name: '', description: '' });
          }}>
            Cancel
          </Button>
          <Button onClick={handleCreateCategory} variant="contained" style={{ background: '#ff6b35', color: '#fff' }}>
            Create Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Items;
