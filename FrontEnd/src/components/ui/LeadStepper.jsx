// // import { CheckCircle } from "lucide-react"

 

// // export default function LeadStepper({ currentStep }) {

// //   const steps = Array.from({ length: 10 }, (_, i) => i + 1)

 

// //   return (

// //     <div className="flex items-center justify-between gap-2">

// //       {steps.map((step) => (

// //         <div key={step} className="flex flex-col items-center">

// //           <div

// //             className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold

// //               ${step <= currentStep ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}

// //           >

// //             {step <= currentStep ? <CheckCircle size={16} /> : step}

// //           </div>

// //           <span className="text-xs mt-1">Step {step}</span>

// //         </div>

// //       ))}

// //     </div>

// //   )

// // }

 

// import { Check } from "lucide-react"

 

// const LEAD_STAGES = [

//   "Tele Caller",

//   "Land Executive",

//   "Analytics Team",

//   "Feasibility Team",

//   "Field study / Product Team",

//   "Management (MD 1st Level)",

//   "CMO / CRO",

//   "Legal",

//   "Liaison",

//   "Finance",

//   "Admin",

// ]

 

// export default function LeadStepper({ stageName, currentStep = 1, onStepChange, className }) {

//   // Find current step number from stage name

//   const stepFromStage = LEAD_STAGES.indexOf(stageName) + 1 || 1

//   const activeStep = currentStep || stepFromStage

 

//   const handleStepClick = (stepNumber) => {

//     if (onStepChange) {

//       onStepChange(stepNumber)

//     }

//   }

 

//   return (

//     <div className={`overflow-x-auto ${className || ''}`}>

//       <div className="flex mb-2 min-w-[900px] items-center">

//         {LEAD_STAGES.map((label, index) => {

//           const step = index + 1

//           const active = step <= activeStep

//           const isLast = index === LEAD_STAGES.length - 1

 

//           return (

//             <div key={step} className="flex items-center">

//               <div className="flex flex-col items-center">

//                 <button

//                   onClick={() => handleStepClick(step)}

//                   className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10

//                   ${active >= step ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}

//                 >

//                   {active > step ? <Check size={14} /> : step}

//                 </button>

 

//                 <span className="text-[11px] text-center mt-1 w-24 text-gray-600 cursor-pointer hover:text-indigo-600"

//                       onClick={() => handleStepClick(step)}>

//                   {label}

//                 </span>

//               </div>

 

//               {/* Connecting line */}

//               {!isLast && (

//                 <div className="w-8 h-px bg-gray-400 mx-1" />

//               )}

//             </div>

//           )

//         })}

//       </div>

//     </div>

//   )

// }

 

 

import { Check } from "lucide-react"

 

const STAGES = [

  { id: "tele_caller", label: "Tele Caller" },

  { id: "land_executive", label: "Land Executive" },

  { id: "analytics_team", label: "Analytics Team" },

  { id: "feasibility_team", label: "Feasibility Team" },

  { id: "field_study_product_team", label: "Field study / Product Team" },

  { id: "management_md_1st_level", label: "Management (MD 1st Level)" },

  { id: "l1_md", label: "L1 MD" },

  { id: "cmo_cro", label: "CMO / CRO" },

  { id: "legal", label: "Legal" },

  { id: "liaison", label: "Liaison" },

  { id: "finance", label: "Finance" },

  { id: "admin", label: "Admin" },

]

 

export default function LeadStepper({ stageName, currentStep = 1, onStepChange, className, isNewLead = false }) {

  // Normalize stageName to match against STAGES

  const findStepIndex = (name) => {

    if (!name) return 0

    const normalized = name.toLowerCase().replace(/[\s_/]/g, '')

 

    // First try to match by id

    const indexById = STAGES.findIndex(s => s.id.toLowerCase().replace(/[\s_/]/g, '') === normalized)

    if (indexById !== -1) return indexById + 1

 

    // Then try to match by label

    const indexByLabel = STAGES.findIndex(s => s.label.toLowerCase().replace(/[\s_/]/g, '') === normalized)

    if (indexByLabel !== -1) return indexByLabel + 1

 

    return 0 // Return 0 if no match found

  }

 

  // For new leads, always show all steps as grey (activeStep = 0)

  // For existing leads, use the stage name or current step

  let activeStep = 0

 

  if (!isNewLead) {

    const stepFromStage = findStepIndex(stageName)

    activeStep = (currentStep === 1 && stepFromStage > 0) ? stepFromStage : (currentStep || stepFromStage)

  }

 

  const handleStepClick = (stepNumber) => {

    if (onStepChange) {

      onStepChange(stepNumber)

    }

  }

 

  return (
    <div className={`w-full ${className || ''}`}>
      <div className="flex mb-2 w-full items-center justify-between">
        {STAGES.map((s, index) => {

          const step = index + 1

          const active = step <= activeStep

          const isLast = index === STAGES.length - 1

 

          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <button

                  onClick={() => handleStepClick(step)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10 flex-shrink-0
                  ${active ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}

                >

                  {active > step ? <Check size={14} /> : step}

                </button>

                <span className="text-[11px] text-center mt-1 px-1 text-gray-600 cursor-pointer hover:text-indigo-600 line-clamp-2"
                  onClick={() => handleStepClick(step)}>

                  {s.label}

                </span>

              </div>

 

              {/* Connecting line */}

              {!isLast && (
                <div className="flex-1 h-px bg-gray-400 mx-1 min-w-[8px]" />
              )}

            </div>

          )

        })}

      </div>

    </div>

  )

}

 

 

 