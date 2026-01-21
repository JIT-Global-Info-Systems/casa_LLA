// Role-based access control configuration
export const ROLE_ACCESS = {
  tele_caller: ["lead", "mediator", "dashboard", "users", "documents", "masters", "reports"],
  land_executive: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  feasibility_team: ["lead", "mediator", "dashboard", "users", "documents", "masters", "reports"],
  l1_md: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  cmo_cro: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  legal: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  liaison: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  finance: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  management: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  all_team: ["lead", "mediator", "dashboard", "owners", "users", "documents", "masters", "reports"],
  admin: ["*"]
};

// Helper function to check if a role has access to a page
export const hasAccess = (userRole, requiredPage) => {
  const userAccess = ROLE_ACCESS[userRole];

  // Admin has access to everything
  if (userAccess?.includes("*")) {
    return true;
  }

  // Check if the role exists and has access to the required page
  return userAccess?.includes(requiredPage) || false;
};

// Helper function to get all accessible pages for a role
export const getAccessiblePages = (userRole) => {
  const userAccess = ROLE_ACCESS[userRole];

  // Admin has access to everything
  if (userAccess?.includes("*")) {
    return ["*"]; // or return all possible pages if needed
  }

  return userAccess || [];
};

// Helper function to check if user can access any of the provided pages
export const hasAnyAccess = (userRole, requiredPages) => {
  if (!Array.isArray(requiredPages)) {
    return hasAccess(userRole, requiredPages);
  }

  return requiredPages.some(page => hasAccess(userRole, page));
};
