import React from 'react';
import { Button } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

/**
 * ActionButton with built-in status checking and tooltips
 * Automatically disables and shows reason when action is not allowed
 * 
 * @example
 * <ActionButton
 *   enabled={deleteState.enabled}
 *   reason={deleteState.reason}
 *   onClick={() => handleDelete(user)}
 *   variant="ghost"
 *   size="sm"
 * >
 *   <Trash2 className="h-4 w-4" />
 * </ActionButton>
 */
const ActionButton = ({
  enabled = true,
  reason = null,
  tooltip = null,
  onClick,
  children,
  variant = 'ghost',
  size = 'sm',
  className = '',
  showTooltipWhenEnabled = false,
  ...props
}) => {
  const isDisabled = !enabled;
  const tooltipText = reason || tooltip;
  const shouldShowTooltip = tooltipText && (isDisabled || showTooltipWhenEnabled);

  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={enabled ? onClick : undefined}
      disabled={isDisabled}
      className={`${className} ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      {...props}
    >
      {children}
    </Button>
  );

  if (shouldShowTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default ActionButton;
