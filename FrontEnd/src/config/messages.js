

export const MESSAGES = {
  // ============ LEADS ============
  LEAD: {
    CREATE: {
      CONFIRM: null,
      SUCCESS: "Lead created successfully",
      ERROR: "Could not create lead. Please try again.",
      LOADING: "Creating lead...",
    },
    UPDATE: {
      CONFIRM: null,
      SUCCESS: "Lead updated successfully",
      ERROR: "Could not update lead. Please try again.",
      LOADING: "Updating lead...",
    },
    DELETE: {
      CONFIRM: "Delete this lead? This cannot be undone.",
      SUCCESS: "Lead deleted successfully",
      ERROR: "Could not delete lead. Please try again.",
      LOADING: "Deleting lead...",
    },
    LOAD: {
      SUCCESS: null,
      ERROR: "Could not load leads. Please try again.",
      LOADING: "Loading leads...",
    },
    REFRESH: {
      SUCCESS: "Leads refreshed",
      ERROR: "Could not refresh leads. Please try again.",
      LOADING: "Refreshing leads...",
    },
    APPROVE: {
      CONFIRM: "Approve this lead?",
      SUCCESS: "Lead approved",
      ERROR: "Could not approve lead. Please try again.",
      LOADING: "Approving lead...",
    },
    PURCHASE: {
      CONFIRM: "Mark this lead as purchased?",
      SUCCESS: "Lead marked as purchased",
      ERROR: "Could not process purchase. Please try again.",
      LOADING: "Processing purchase...",
    },
    VIEW: {
      SUCCESS: null,
      ERROR: "Could not load lead details. Please try again.",
      LOADING: "Loading details...",
    },
    FILE_UPLOAD: {
      SUCCESS: "Files uploaded successfully",
      ERROR: "Upload failed. Please check file size and format.",
      LOADING: "Uploading files...",
    },
  },

  // ============ USERS ============
  USER: {
    CREATE: {
      CONFIRM: null,
      SUCCESS: "User created and login details sent via email",
      ERROR: "Could not create user. Please try again.",
      LOADING: "Creating user...",
    },
    UPDATE: {
      CONFIRM: null,
      SUCCESS: "User updated successfully",
      ERROR: "Could not update user. Please try again.",
      LOADING: "Updating user...",
    },
    DELETE: {
      CONFIRM: "Remove this user? They will lose access immediately.",
      SUCCESS: "User removed successfully",
      ERROR: "Could not remove user. Please try again.",
      LOADING: "Removing user...",
    },
    LOAD: {
      SUCCESS: null,
      ERROR: "Could not load users. Please try again.",
      LOADING: "Loading users...",
    },
    STATUS_TOGGLE: {
      SUCCESS: "User status updated",
      ERROR: "Could not update status. Please try again.",
      LOADING: "Updating status...",
    },
    REFRESH: {
      SUCCESS: "Users refreshed",
      ERROR: "Could not refresh users. Please try again.",
      LOADING: "Refreshing users...",
    },
  },

  // ============ AUTHENTICATION ============
  AUTH: {
    LOGIN: {
      SUCCESS: "Welcome back",
      ERROR: "Incorrect email or password",
      LOADING: "Signing in...",
    },
    LOGOUT: {
      SUCCESS: "Signed out successfully",
      LOADING: "Signing out...",
    },
    PASSWORD_RESET: {
      CONFIRM: "Reset your password? A verification code will be sent to your email.",
      SUCCESS: "If this email is registered, you will receive a verification code shortly",
      ERROR: "Could not process your request. Please try again.",
      LOADING: "Sending verification code...",
    },
    PASSWORD_CHANGE: {
      CONFIRM: null,
      SUCCESS: "Password changed successfully",
      ERROR: "Could not change password. Please check your current password.",
      LOADING: "Changing password...",
    },
    OTP_VERIFY: {
      SUCCESS: "Verification successful",
      ERROR: "Verification code is incorrect or has expired",
      LOADING: "Verifying code...",
    },
  },

  // ============ MEDIATORS ============
  MEDIATOR: {
    CREATE: {
      CONFIRM: null,
      SUCCESS: "Mediator created successfully",
      ERROR: "Could not create mediator. Please try again.",
      LOADING: "Creating mediator...",
    },
    UPDATE: {
      CONFIRM: null,
      SUCCESS: "Mediator updated successfully",
      ERROR: "Could not update mediator. Please try again.",
      LOADING: "Updating mediator...",
    },
    DELETE: {
      CONFIRM: "Delete this mediator? This cannot be undone.",
      SUCCESS: "Mediator deleted successfully",
      ERROR: "Could not delete mediator. Please try again.",
      LOADING: "Deleting mediator...",
    },
    LOAD: {
      SUCCESS: null,
      ERROR: "Could not load mediators. Please try again.",
      LOADING: "Loading mediators...",
    },
  },

  // ============ DOCUMENTS ============
  DOCUMENT: {
    UPLOAD: {
      SUCCESS: "Document uploaded successfully",
      ERROR: "Upload failed. Please check file size and format.",
      LOADING: "Uploading document...",
    },
    DELETE: {
      CONFIRM: "Delete this document? This cannot be undone.",
      SUCCESS: "Document deleted successfully",
      ERROR: "Could not delete document. Please try again.",
      LOADING: "Deleting document...",
    },
  },

  // ============ PROFILE ============
  PROFILE: {
    UPDATE: {
      CONFIRM: null,
      SUCCESS: "Profile updated successfully",
      ERROR: "Could not update profile. Please try again.",
      LOADING: "Updating profile...",
    },
    LOAD: {
      SUCCESS: null,
      ERROR: "Could not load profile. Please try again.",
      LOADING: "Loading profile...",
    },
  },

  // ============ GENERIC ============
  GENERIC: {
    CANCELLED: "Cancelled",
    NO_RESULTS: "No results found",
    REQUIRED_FIELD: "This field is required",
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_PHONE: "Please enter a valid phone number",
    FILE_SIZE_ERROR: "File is too large. Maximum size is 5MB.",
    FILE_TYPE_ERROR: "Invalid file type. Please upload JPG, PNG, or PDF.",
    NETWORK_ERROR: "Connection lost. Please check your internet.",
    TRY_AGAIN: "Please try again.",
  },
};

export default MESSAGES;
