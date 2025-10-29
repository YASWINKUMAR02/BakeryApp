// This file is kept for backward compatibility
// Import the toast context in your components instead
let toastFunction = null;

export const setToastFunction = (fn) => {
  toastFunction = fn;
};

export const showSuccess = (message) => {
  if (toastFunction) {
    toastFunction(message, 'success', 3000);
  }
};

export const showError = (message) => {
  if (toastFunction) {
    toastFunction(message, 'error', 4000);
  }
};

export const showErrorLong = (message) => {
  if (toastFunction) {
    console.log('ERROR MESSAGE:', message); // Log to console
    toastFunction(message, 'error', 10000); // 10 seconds
  }
};

export const showInfo = (message) => {
  if (toastFunction) {
    toastFunction(message, 'success', 3000);
  }
};

export const showWarning = (message) => {
  if (toastFunction) {
    toastFunction(message, 'error', 3000);
  }
};
