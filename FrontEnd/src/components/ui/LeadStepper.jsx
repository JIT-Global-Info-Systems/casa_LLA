

import { Check, Users, Calendar, FileText, ChevronRight } from "lucide-react"


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
    <div className={`w-full relative ${className || ''}`}>
      {/* Topbar-style Header */}
      <header className="fixed top-16 left-0 md:left-52 right-0 z-40 h-16 border-b border-border bg-white shadow-sm mb-4 backdrop-blur-sm bg-white/95">
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 flex-1">
            {/* Stepper Stages in Header */}
            <div className="flex items-center gap-2 w-full overflow-x-auto">
              {STAGES.map((s, index) => {
                const step = index + 1
                const active = step <= activeStep
                const isLast = index === STAGES.length - 1

                return (
                  <div key={s.id} className="flex items-center">
                    <div className="flex items-center gap-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0
                        ${active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                        {active > step ? <Check size={10} /> : step}
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap px-1 ${active ? "text-indigo-700" : "text-gray-500"
                        }`}>
                        {s.label.split(' ')[0]} {/* Show first word of label */}
                      </span>
                    </div>

                    {/* Connecting line */}
                    {!isLast && (
                      <div className="w-4 h-px bg-gray-300 mx-1 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          
        </div>
      </header>

     
    </div>



  )



}











