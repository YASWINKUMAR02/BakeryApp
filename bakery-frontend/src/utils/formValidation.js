// Form Validation Utilities
import { useState } from 'react';

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

/**
 * Password validation
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 50) return 'Password must be less than 50 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
};

/**
 * Simple password validation (for less strict requirements)
 */
export const validatePasswordSimple = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

/**
 * Phone number validation (Indian format)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit mobile number';
  return '';
};

/**
 * Name validation
 */
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 100) return 'Name must be less than 100 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return '';
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Number validation
 */
export const validateNumber = (value, min, max, fieldName = 'Value') => {
  if (!value && value !== 0) return `${fieldName} is required`;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (min !== undefined && num < min) return `${fieldName} must be at least ${min}`;
  if (max !== undefined && num > max) return `${fieldName} must be at most ${max}`;
  return '';
};

/**
 * Address validation
 */
export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Please enter a complete address (at least 10 characters)';
  if (address.length > 500) return 'Address is too long';
  return '';
};

/**
 * Pincode validation (Indian)
 */
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!pincode) return 'Pincode is required';
  if (!pincodeRegex.test(pincode)) return 'Please enter a valid 6-digit pincode';
  return '';
};

/**
 * Credit card validation (basic)
 */
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!cleaned) return 'Card number is required';
  if (!/^\d{13,19}$/.test(cleaned)) return 'Please enter a valid card number';
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) return 'Invalid card number';
  return '';
};

/**
 * CVV validation
 */
export const validateCVV = (cvv) => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
  return '';
};

/**
 * Expiry date validation (MM/YY format)
 */
export const validateExpiryDate = (expiry) => {
  if (!expiry) return 'Expiry date is required';
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) return 'Please enter expiry in MM/YY format';
  
  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expYear = parseInt(year);
  const expMonth = parseInt(month);
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return 'Card has expired';
  }
  
  return '';
};

/**
 * URL validation
 */
export const validateURL = (url) => {
  if (!url) return 'URL is required';
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validate entire form
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Real-time field validation hook
 */
export const useFieldValidation = (initialValue = '', validators = []) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = (val) => {
    for (const validator of validators) {
      const err = validator(val);
      if (err) {
        setError(err);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (touched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  const reset = () => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  };

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    validate: () => validate(value),
    reset,
    setValue,
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordSimple,
  validateConfirmPassword,
  validatePhone,
  validateName,
  validateRequired,
  validateNumber,
  validateAddress,
  validatePincode,
  validateCreditCard,
  validateCVV,
  validateExpiryDate,
  validateURL,
  validateForm,
  useFieldValidation,
};
