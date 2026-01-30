import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Enhanced Button Component with Double-Click Prevention
 * 
 * Features:
 * - Automatic double-click prevention for async operations
 * - Loading states with spinner
 * - Customizable delay for re-enabling
 * - Maintains all original button functionality
 * 
 * Props:
 * - loading: boolean - Shows loading spinner and disables button
 * - preventDoubleClick: boolean - Enable/disable double-click prevention (default: true)
 * - doubleClickDelay: number - Delay in ms before re-enabling button (default: 1000)
 * - All standard button props (onClick, disabled, children, etc.)
 * 
 * Usage:
 * <Button onClick={handleSubmit} loading={isSubmitting}>
 *   Submit Form
 * </Button>
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 active:transition-transform",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 shadow-sm hover:shadow-md",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    onClick,
    disabled,
    loading = false,
    preventDoubleClick = true,
    doubleClickDelay = 1000,
    children,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(false);
    const timeoutRef = React.useRef(null);

    // Clean up timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleClick = async (event) => {
      // For submit buttons in forms, let the form handle submission
      const buttonType = props.type || 'button';
      
      if (buttonType === 'submit') {
        // Don't interfere with form submission - let the form's onSubmit handle it
        return;
      }
      
      if (disabled || isDisabled || isLoading || loading) {
        event.preventDefault();
        return;
      }

      if (preventDoubleClick) {
        setIsDisabled(true);
        setIsLoading(true);
      }

      try {
        if (onClick) {
          const result = onClick(event);
          
          // If onClick returns a promise, wait for it
          if (result && typeof result.then === 'function') {
            await result;
          }
        }
      } catch (error) {
        console.error('Button click error:', error);
      } finally {
        if (preventDoubleClick) {
          // Keep button disabled for a short period to prevent double clicks
          timeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            setIsDisabled(false);
          }, doubleClickDelay);
        }
      }
    };

    const isButtonDisabled = disabled || isDisabled || loading;
    const showLoading = isLoading || loading;

    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={isButtonDisabled}
        {...props}
      >
        {showLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
