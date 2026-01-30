import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ children, delayDuration = 700 }) => {
  return <div data-tooltip-delay={delayDuration}>{children}</div>
}

const Tooltip = ({ children, delayDuration = 700 }) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [showTimeout, setShowTimeout] = React.useState(null)
  const [hideTimeout, setHideTimeout] = React.useState(null)
  
  const showTooltip = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(null)
    }
    
    const timeout = setTimeout(() => {
      setIsVisible(true)
    }, delayDuration)
    setShowTimeout(timeout)
  }
  
  const hideTooltip = () => {
    if (showTimeout) {
      clearTimeout(showTimeout)
      setShowTimeout(null)
    }
    
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, 100)
    setHideTimeout(timeout)
  }
  
  React.useEffect(() => {
    return () => {
      if (showTimeout) clearTimeout(showTimeout)
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [showTimeout, hideTimeout])

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {React.Children.map(children, child => {
        if (child.type === TooltipTrigger) {
          return child
        }
        if (child.type === TooltipContent && isVisible) {
          return child
        }
        return null
      })}
    </div>
  )
}

const TooltipTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref, ...props })
  }
  return <div ref={ref} {...props}>{children}</div>
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ 
  className = "", 
  children, 
  side = "top",
  align = "center",
  sideOffset = 8,
  ...props 
}, ref) => {
  const getPositionClasses = () => {
    const positions = {
      top: {
        center: "bottom-full left-1/2 transform -translate-x-1/2",
        start: "bottom-full left-0",
        end: "bottom-full right-0"
      },
      bottom: {
        center: "top-full left-1/2 transform -translate-x-1/2",
        start: "top-full left-0", 
        end: "top-full right-0"
      },
      left: {
        center: "right-full top-1/2 transform -translate-y-1/2",
        start: "right-full top-0",
        end: "right-full bottom-0"
      },
      right: {
        center: "left-full top-1/2 transform -translate-y-1/2",
        start: "left-full top-0",
        end: "left-full bottom-0"
      }
    }
    return positions[side][align]
  }

  const getArrowClasses = () => {
    const arrows = {
      top: "absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900",
      bottom: "absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900",
      left: "absolute left-full top-1/2 transform -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900",
      right: "absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 border-4 border-transparent border-r-gray-900"
    }
    return arrows[side]
  }

  const marginClass = {
    top: `mb-${sideOffset}`,
    bottom: `mt-${sideOffset}`,
    left: `mr-${sideOffset}`,
    right: `ml-${sideOffset}`
  }[side]

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95",
        getPositionClasses(),
        marginClass,
        className
      )}
      {...props}
    >
      {children}
      <div className={getArrowClasses()} />
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
