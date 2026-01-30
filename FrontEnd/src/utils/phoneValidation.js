/**
 * Phone number validation and formatting utilities
 */

/**
 * Format phone number input to only allow digits and common separators
 * @param {string} value - Raw input value
 * @returns {string} - Formatted phone number
 */
export const formatPhoneInput = (value) => {
  // Remove all non-digit characters except + at the beginning
  const cleaned = value.replace(/[^\d+]/g, '');
  
  // If it starts with +, keep it, otherwise remove any + signs
  if (cleaned.startsWith('+')) {
    return '+' + cleaned.slice(1).replace(/\+/g, '');
  }
  
  return cleaned.replace(/\+/g, '');
};

/**
 * Validate phone number format and length
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  // Check minimum length (10 digits for most countries)
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  // Check maximum length (15 digits as per international standard)
  if (cleaned.length > 15) {
    return { isValid: false, error: 'Phone number cannot exceed 15 digits' };
  }
  
  // Check for valid patterns
  const phoneRegex = /^(\+?[1-9]\d{1,14}|\d{10,15})$/;
  if (!phoneRegex.test(phoneNumber)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Format phone number for display (add separators for readability)
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Formatted phone number for display
 */
export const formatPhoneDisplay = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle international format
  if (cleaned.startsWith('+')) {
    const countryCode = cleaned.slice(1, 3);
    const number = cleaned.slice(3);
    
    if (number.length >= 10) {
      // Format as +XX XXXXX XXXXX
      return `+${countryCode} ${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return cleaned;
  }
  
  // Handle domestic format (10-11 digits)
  if (cleaned.length === 10) {
    // Format as XXX XXX XXXX
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    // Format as X XXX XXX XXXX
    return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return cleaned;
};

/**
 * Check if phone number is in international format
 * @param {string} phoneNumber - Phone number to check
 * @returns {boolean} - True if international format
 */
export const isInternationalFormat = (phoneNumber) => {
  return phoneNumber && phoneNumber.trim().startsWith('+');
};

/**
 * Get country code from international phone number
 * @param {string} phoneNumber - International phone number
 * @returns {string} - Country code or empty string
 */
export const getCountryCode = (phoneNumber) => {
  if (!isInternationalFormat(phoneNumber)) return '';
  
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  return cleaned.slice(0, 2); // Assuming 2-digit country code
};

/**
 * Common phone number patterns for different regions
 */
export const PHONE_PATTERNS = {
  US: /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/,
  INDIA: /^(\+91)?[6-9]\d{9}$/,
  UK: /^(\+44)?[1-9]\d{8,9}$/,
  INTERNATIONAL: /^(\+?[1-9]\d{1,14})$/
};

/**
 * Validate phone number against specific country pattern
 * @param {string} phoneNumber - Phone number to validate
 * @param {string} country - Country code (US, INDIA, UK, INTERNATIONAL)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhoneByCountry = (phoneNumber, country = 'INTERNATIONAL') => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const pattern = PHONE_PATTERNS[country.toUpperCase()];
  if (!pattern) {
    return validatePhoneNumber(phoneNumber); // Fallback to general validation
  }

  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  if (!pattern.test(cleaned)) {
    const countryNames = {
      US: 'US',
      INDIA: 'Indian',
      UK: 'UK',
      INTERNATIONAL: 'international'
    };
    
    return { 
      isValid: false, 
      error: `Please enter a valid ${countryNames[country.toUpperCase()]} phone number` 
    };
  }
  
  return { isValid: true, error: '' };
};