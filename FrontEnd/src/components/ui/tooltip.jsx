import * as React from "react"

const TooltipProvider = ({ children }) => {
  return <>{children}</>
}

const Tooltip = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false)
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
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

const TooltipContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none ${className}`}
      {...props}
    >
      {children}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
