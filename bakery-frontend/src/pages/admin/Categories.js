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
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
} from '@mui/icons-material';
import { categoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';
import { showSuccess, showError } from '../../utils/toast';

const Categories = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch categories');
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({ id: null, name: '' });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory({ id: null, name: '' });
    setError('');
  };

  const handleSave = async () => {
    if (!currentCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      if (editMode) {
        await categoryAPI.update(currentCategory.id, { name: currentCategory.name });
        setSuccess('Category updated successfully');
        showSuccess('Category updated successfully');
      } else {
        await categoryAPI.create({ name: currentCategory.name });
        setSuccess('Category created successfully');
        showSuccess('Category created successfully');
      }
      handleCloseDialog();
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed';
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoryAPI.delete(categoryToDelete.id);
      setSuccess('Category deleted successfully');
      showSuccess('Category deleted successfully');
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete category');
      showError('Failed to delete category');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <AdminHeader title="Category Management" showBack={true} />
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: '80px', paddingBottom: '40px', marginLeft: sidebarOpen ? '260px' : '70px', transition: 'margin-left 0.3s ease' }}>
        <Container maxWidth="lg">
          {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
          {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

          <Paper style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Categories ({categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())).length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                style={{ background: '#ff6b35', color: '#fff', textTransform: 'none' }}
              >
                Add Category
              </Button>
            </Box>
            
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search style={{ marginRight: '8px', color: '#666' }} />,
              }}
              size="small"
              style={{ marginBottom: '20px', background: '#fff' }}
            />

            {loading ? (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow style={{ background: '#f5f7fa' }}>
                      <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell align="right" style={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" style={{ padding: '40px' }}>
                          No categories found. Create one to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories
                        .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((category) => (
                        <TableRow key={category.id} hover>
                          <TableCell>{category.id}</TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell align="right">
                            <IconButton color="primary" onClick={() => handleOpenDialog(category)}>
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(category)}>
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
        <DialogTitle>{editMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            style={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" style={{ background: '#ff6b35', color: '#fff' }}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>?
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

export default Categories;
