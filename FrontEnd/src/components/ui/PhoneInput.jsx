import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { formatPhoneInput, validatePhoneNumber } from '@/utils/phoneValidation';
import { cn } from '@/lib/utils';

const PhoneInput = React.forwardRef(({
  label,
  value = '',
  onChange,
  onValidationChange,
  placeholder = 'Enter phone number',
  required = false,
  disabled = false,
  className,
  showValidation = true,
  country = 'INTERNATIONAL',
  ...props
}, ref) => {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Validate phone number
  const validatePhone = (phoneValue) => {
    if (!required && (!phoneValue || phoneValue.trim() === '')) {
      return { isValid: true, error: '' };
    }

    return validatePhoneNumber(phoneValue);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneInput(rawValue);
    
    setInputValue(formattedValue);
    
    // Validate if touched or if there's a value
    if (touched || formattedValue) {
      const validation = validatePhone(formattedValue);
      setError(validation.error);
      
      // Notify parent of validation state
      if (onValidationChange) {
        onValidationChange(validation.isValid, validation.error);
      }
    }
    
    // Always call onChange to update parent state
    if (onChange) {
      onChange(formattedValue);
    }
  };

  // Handle blur event
  const handleBlur = () => {
    setTouched(true);
    const validation = validatePhone(inputValue);
    setError(validation.error);
    
    if (onValidationChange) {
      onValidationChange(validation.isValid, validation.error);
    }
  };

  // Handle focus event
  const handleFocus = () => {
    // Clear error on focus if field is empty
    if (!inputValue) {
      setError('');
    }
  };

  const hasError = showValidation && touched && error;

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              ref={ref}
              type="tel"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                className,
                hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              {...props}
            />
          </TooltipTrigger>
          <TooltipContent>
            Enter a valid phone number (10-15 digits). International format (+country code) is supported.
          </TooltipContent>
        </Tooltip>
        
        {/* Phone icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={cn(
              "h-4 w-4",
              hasError ? "text-red-400" : "text-gray-400"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper text for valid input */}
      {showValidation && !hasError && inputValue && touched && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Valid phone number
        </p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;