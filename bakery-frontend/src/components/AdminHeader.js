import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Box,
} from '@mui/material';
import {
  Logout,
  AdminPanelSettings,
  Dashboard,
  Category,
  Inventory,
  Receipt,
  People,
  StickyNote2,
  Delete,
  Add,
  Menu,
  ArrowBack,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';
import AdminOrderAlert from './AdminOrderAlert';

const AdminHeader = ({ title = 'Admin Dashboard', showBack = false, onMenuClick, sidebarOpen = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('admin_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        setNotes([]);
      }
    }
  }, []);

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem('admin_notes', JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        createdAt: new Date().toLocaleString(),
      };
      const updatedNotes = [note, ...notes];
      saveNotes(updatedNotes);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDashboardClick = () => {
    if (location.pathname === '/admin/dashboard') {
      window.location.reload();
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <>
      {/* Admin Order Alert */}
      <AdminOrderAlert />
      
      <AppBar position="fixed" elevation={0} style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ padding: { xs: '8px 12px', sm: '8px 24px' }, minHeight: { xs: '60px', sm: '70px' } }}>
          {onMenuClick && (
            <IconButton
              onClick={onMenuClick}
              sx={{ marginRight: '8px', color: '#333', display: { xs: 'flex', md: 'none' } }}
            >
              {sidebarOpen ? <ArrowBack /> : <Menu />}
            </IconButton>
          )}
          <img 
            src="/LOGOO.png" 
            alt="Frost and Crinkle Logo" 
            style={{
              height: window.innerWidth < 600 ? '40px' : '55px',
              width: window.innerWidth < 600 ? '120px' : '160px',
              objectFit: 'contain',
              borderRadius: '8px',
              marginRight: window.innerWidth < 600 ? '8px' : '16px',
              cursor: 'pointer',
            }}
            onClick={handleDashboardClick}
          />
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, fontWeight: 700, color: '#333', cursor: 'pointer', fontSize: { xs: '0.95rem', sm: '1.25rem' }, display: { xs: 'none', sm: 'block' } }}
            onClick={handleDashboardClick}
          >
            Admin Panel
          </Typography>
        
        {user && (
          <>
            <Button
              color="inherit"
              onClick={handleDashboardClick}
              startIcon={<Dashboard />}
              sx={{ marginRight: { xs: '8px', sm: '20px' }, color: '#333', display: { xs: 'none', md: 'flex' } }}
            >
              Dashboard
            </Button>
            
            {/* Notifications */}
            <div style={{ marginRight: '12px' }}>
              <Notifications iconColor="#333" hoverColor="#666" />
            </div>
            
            {/* Notes */}
            <IconButton
              onClick={() => setNotesOpen(true)}
              style={{ color: '#333', marginRight: '12px' }}
            >
              <Badge badgeContent={notes.length} color="error">
                <StickyNote2 />
              </Badge>
            </IconButton>
            
            <Typography variant="body2" sx={{ marginRight: { xs: '8px', sm: '20px' }, color: '#333', display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <AdminPanelSettings style={{ fontSize: '18px', marginRight: '6px', color: '#ff6b9d' }} />
              {user?.name}
            </Typography>
            
            <IconButton
              onClick={handleLogout}
              sx={{ color: '#333', display: { xs: 'flex', sm: 'none' } }}
            >
              <Logout />
            </IconButton>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{ color: '#333', display: { xs: 'none', sm: 'flex' } }}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>

    {/* Notes Dialog */}
    <Dialog 
      open={notesOpen} 
      onClose={() => setNotesOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c239b3 100%)', color: '#fff' }}>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StickyNote2 />
          Admin Notes
        </Box>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '20px' }}>
        <Box style={{ marginBottom: '20px' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAddNote();
              }
            }}
            variant="outlined"
          />
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            style={{
              marginTop: '10px',
              background: 'linear-gradient(135deg, #ff6b9d 0%, #c239b3 100%)',
              color: '#fff',
              textTransform: 'none',
            }}
          >
            Add Note
          </Button>
        </Box>

        {notes.length === 0 ? (
          <Box style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            <StickyNote2 style={{ fontSize: 48, marginBottom: '10px', opacity: 0.3 }} />
            <Typography variant="body2">No notes yet. Add your first note above!</Typography>
          </Box>
        ) : (
          <List style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notes.map((note) => (
              <ListItem
                key={note.id}
                style={{
                  background: '#f5f9ff',
                  marginBottom: '10px',
                  borderRadius: 0,
                  border: '1px solid #e0e0e0',
                }}
              >
                <ListItemText
                  primary={note.text}
                  secondary={note.createdAt}
                  primaryTypographyProps={{
                    style: { fontWeight: 500, color: '#1a1a1a' }
                  }}
                  secondaryTypographyProps={{
                    style: { fontSize: '12px', color: '#666' }
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteNote(note.id)}
                    style={{ color: '#f44336' }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '16px 24px' }}>
        <Button onClick={() => setNotesOpen(false)} style={{ textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default AdminHeader;
