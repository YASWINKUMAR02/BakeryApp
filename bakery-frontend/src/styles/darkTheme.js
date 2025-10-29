// Dark Theme Styles for Frost and Crinkle Bakery App

export const darkTheme = {
  // Background colors
  background: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
  },

  // Text colors
  text: {
    primary: '#fff',
    secondary: '#ccc',
    tertiary: '#999',
    muted: '#666',
  },

  // Accent colors (Pink theme)
  accent: {
    primary: '#ff69b4',
    secondary: '#ffb6c1',
    gradient: 'linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%)',
  },

  // Border colors
  border: {
    primary: '#333',
    secondary: '#444',
    accent: 'rgba(255, 182, 193, 0.3)',
  },

  // Component styles
  components: {
    // Container
    container: {
      minHeight: '100vh',
      background: '#1a1a1a',
      paddingTop: '70px',
    },

    // Paper/Card
    paper: {
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '16px',
      padding: '30px',
    },

    // Button Primary
    buttonPrimary: {
      background: 'linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%)',
      color: '#fff',
      textTransform: 'none',
      fontWeight: 600,
      padding: '12px 32px',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(255, 105, 180, 0.3)',
    },

    // Button Secondary
    buttonSecondary: {
      borderColor: '#ffb6c1',
      color: '#ffb6c1',
      textTransform: 'none',
      fontWeight: 600,
      padding: '12px 32px',
      borderRadius: '12px',
    },

    // TextField
    textField: {
      '& .MuiOutlinedInput-root': {
        color: '#fff',
        backgroundColor: '#0a0a0a',
        '& fieldset': { borderColor: '#444' },
        '&:hover fieldset': { borderColor: '#ffb6c1' },
        '&.Mui-focused fieldset': { borderColor: '#ffb6c1' },
      },
      '& .MuiInputLabel-root': {
        color: '#999',
        backgroundColor: '#1a1a1a',
        padding: '0 8px',
      },
      '& .MuiInputLabel-root.Mui-focused': { color: '#ffb6c1' },
      '& .MuiInputBase-input::placeholder': {
        color: '#666',
        opacity: 1,
      },
    },

    // Select
    select: {
      color: '#fff',
      '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': { borderColor: '#333' },
        '&:hover fieldset': { borderColor: '#ffb6c1' },
      },
      '& .MuiInputLabel-root': { color: '#999' },
      '& .MuiSelect-icon': { color: '#999' },
    },

    // Menu
    menu: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '12px',
    },

    // Table
    table: {
      '& .MuiTableCell-root': {
        color: '#fff',
        borderColor: '#333',
      },
      '& .MuiTableHead-root .MuiTableCell-root': {
        backgroundColor: '#0a0a0a',
        fontWeight: 600,
      },
    },
  },
};

// Helper function to get TextField styles
export const getTextFieldStyles = () => darkTheme.components.textField;

// Helper function to get Button styles
export const getButtonStyles = (variant = 'primary') => {
  return variant === 'primary'
    ? darkTheme.components.buttonPrimary
    : darkTheme.components.buttonSecondary;
};

// Helper function to get Select MenuProps
export const getSelectMenuProps = () => ({
  PaperProps: {
    style: darkTheme.components.menu,
  },
});
