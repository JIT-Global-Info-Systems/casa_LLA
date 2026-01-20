// import { CheckCircle } from "lucide-react"

// export default function LeadStepper({ currentStep }) {
//   const steps = Array.from({ length: 10 }, (_, i) => i + 1)

//   return (
//     <div className="flex items-center justify-between gap-2">
//       {steps.map((step) => (
//         <div key={step} className="flex flex-col items-center">
//           <div
//             className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
//               ${step <= currentStep ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}
//           >
//             {step <= currentStep ? <CheckCircle size={16} /> : step}
//           </div>
//           <span className="text-xs mt-1">Step {step}</span>
//         </div>
//       ))}
//     </div>
//   )
// }

import { Check } from "lucide-react"

const LEAD_STAGES = [
  "Tele Caller",
  "Land Executive",
  "Analytics Team",
  "Feasibility Team",
  "Field study / Product Team",
  "Management (MD 1st Level)",
  "CMO / CRO",
  "Legal",
  "Liaison",
  "Finance",
  "Admin",
]

export default function LeadStepper({ stageName, currentStep = 1, onStepChange, className }) {
  // Find current step number from stage name
  const stepFromStage = LEAD_STAGES.indexOf(stageName) + 1 || 1
  const activeStep = currentStep || stepFromStage

  const handleStepClick = (stepNumber) => {
    if (onStepChange) {
      onStepChange(stepNumber)
    }
  }

  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <div className="flex mb-2 min-w-[900px] items-center">
        {LEAD_STAGES.map((label, index) => {
          const step = index + 1
          const active = step <= activeStep
          const isLast = index === LEAD_STAGES.length - 1

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(step)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10
                  ${active >= step ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                >
                  {active > step ? <Check size={14} /> : step}
                </button>

                <span className="text-[11px] text-center mt-1 w-24 text-gray-600 cursor-pointer hover:text-indigo-600"
                      onClick={() => handleStepClick(step)}>
                  {label}
                </span>
              </div>
              
              {/* Connecting line */}
              {!isLast && (
                <div className="w-8 h-px bg-gray-400 mx-1" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
