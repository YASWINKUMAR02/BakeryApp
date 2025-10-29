import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { MyLocation, Close, CheckCircle } from '@mui/icons-material';

const LocationPicker = ({ open, onClose, onSelectLocation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationData, setLocationData] = useState(null);

  // Coimbatore city boundaries (approximate)
  const COIMBATORE_BOUNDS = {
    north: 11.1271,
    south: 10.9014,
    east: 77.0595,
    west: 76.8847,
  };

  const isInCoimbatore = (lat, lng) => {
    return (
      lat >= COIMBATORE_BOUNDS.south &&
      lat <= COIMBATORE_BOUNDS.north &&
      lng >= COIMBATORE_BOUNDS.west &&
      lng <= COIMBATORE_BOUNDS.east
    );
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');
    setLocationData(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Check if location is in Coimbatore
        if (isInCoimbatore(lat, lng)) {
          setLocationData({
            lat,
            lng,
            address: 'location',
          });
          setLoading(false);
        } else {
          setError('Your location is outside Coimbatore. Delivery is only available within Coimbatore city.');
          setLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location access denied. Please enable location services in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out.';
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = () => {
    if (!locationData) {
      setError('Please get your current location first');
      return;
    }

    onSelectLocation(locationData);
    onClose();
    // Reset state
    setLocationData(null);
    setError('');
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setLocationData(null);
    setError('');
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          Verify Delivery Location
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" style={{ marginBottom: '20px' }}>
          Click the button below to get your current location. We'll verify if you're within Coimbatore city for delivery.
        </Alert>

        {error && (
          <Alert severity="error" style={{ marginBottom: '20px' }}>
            {error}
          </Alert>
        )}

        {locationData && (
          <Alert severity="success" icon={<CheckCircle />} style={{ marginBottom: '20px' }}>
            <Typography variant="body2" style={{ fontWeight: 600, marginBottom: '8px' }}>
              ✓ Location Verified - You're in Coimbatore!
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Coordinates: {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
            </Typography>
          </Alert>
        )}

        <Box style={{ textAlign: 'center', padding: '20px 0' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} style={{ color: '#fff' }} /> : <MyLocation />}
            onClick={handleGetLocation}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#e91e63',
              color: '#fff',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 32px',
            }}
          >
            {loading ? 'Getting Location...' : 'Get My Current Location'}
          </Button>
        </Box>

        <Typography variant="caption" color="textSecondary" style={{ display: 'block', textAlign: 'center', marginTop: '16px' }}>
          Note: You need to allow location access when prompted by your browser
        </Typography>
      </DialogContent>

      <DialogActions style={{ padding: '16px 24px' }}>
        <Button
          onClick={handleClose}
          startIcon={<Close />}
          style={{
            color: '#666',
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!locationData || loading}
          style={{
            background: locationData && !loading ? '#4caf50' : '#ccc',
            color: '#fff',
            textTransform: 'none',
          }}
        >
          Confirm Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPicker;
