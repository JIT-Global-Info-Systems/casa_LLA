import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

/**
 * Common tooltip components for frequently used actions
 */

export const RefreshTooltip = ({ children, entityName = "data" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Refresh the {entityName} list to get the latest data
    </TooltipContent>
  </Tooltip>
);

export const AddTooltip = ({ children, entityName = "item" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Create a new {entityName}
    </TooltipContent>
  </Tooltip>
);

export const EditTooltip = ({ children, entityName = "item" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Edit this {entityName}
    </TooltipContent>
  </Tooltip>
);

export const ViewTooltip = ({ children, entityName = "item" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      View {entityName} details
    </TooltipContent>
  </Tooltip>
);

export const DeleteTooltip = ({ children, entityName = "item", disabled = false, reason = "" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {disabled 
        ? `Cannot delete: ${reason}` 
        : `Delete this ${entityName}`
      }
    </TooltipContent>
  </Tooltip>
);

export const SaveTooltip = ({ children, isValid = true, isUpdating = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {!isValid 
        ? "Please fill in all required fields correctly" 
        : isUpdating 
          ? "Save changes" 
          : "Create new record"
      }
    </TooltipContent>
  </Tooltip>
);

export const CancelTooltip = ({ children, action = "return to list" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Cancel and {action}
    </TooltipContent>
  </Tooltip>
);

export const SearchTooltip = ({ children, searchFields = "name, email" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Search by {searchFields}
    </TooltipContent>
  </Tooltip>
);

export const FilterTooltip = ({ children, filterType = "items" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Filter {filterType}
    </TooltipContent>
  </Tooltip>
);

export const StatusToggleTooltip = ({ children, currentStatus, entityName = "item" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {currentStatus === "active" 
        ? `Click to deactivate this ${entityName}` 
        : `Click to activate this ${entityName}`
      }
    </TooltipContent>
  </Tooltip>
);

export const ActionsMenuTooltip = ({ children, entityName = "item" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {entityName} actions menu
    </TooltipContent>
  </Tooltip>
);

export const DateFilterTooltip = ({ children, type = "from" }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      Filter items created {type === "from" ? "from" : "up to"} this date
    </TooltipContent>
  </Tooltip>
);

export const RequiredFieldTooltip = ({ children, fieldName }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {fieldName} is required
    </TooltipContent>
  </Tooltip>
);

export const ValidationTooltip = ({ children, message }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent>
      {message}
    </TooltipContent>
  </Tooltip>
);