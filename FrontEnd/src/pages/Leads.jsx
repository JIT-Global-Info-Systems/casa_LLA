

// // import { useState } from "react"
// // import { Input } from "@/components/ui/input"
// // import { Button } from "@/components/ui/button"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Select } from "@/components/ui/select"
// // import { Card, CardContent } from "@/components/ui/card"
// // import { Label } from "@/components/ui/label"

// // export default function Leads() {
// //   const [formData, setFormData] = useState({
// //     contactNumber: "",
// //     mediatorName: "",
// //     date: "",
// //     location: "",
// //     landName: "",
// //     zone: "",
// //     extent: "",
// //     unit: "Acre",
// //     propertyType: "",
// //     fsi: "",
// //     asp: "",
// //     revenue: "",
// //     remark: "",
// //   })

// //   const handleChange = (key, value) => {
// //     setFormData((prev) => ({ ...prev, [key]: value }))
// //   }

// //   const handleSubmit = () => {
// //     console.log("Lead Data:", formData)
// //   }

// //   return (
// //     <Card className="p-8">
// //       <h2 className="text-xl font-semibold mb-6">Create Lead</h2>

// //       <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">

// //         <div>
// //           <Label>Contact Number</Label>
// //           <Input
// //             value={formData.contactNumber}
// //             onChange={(e) => handleChange("contactNumber", e.target.value)}
// //             placeholder="Enter Contact Number"
// //           />
// //         </div>

// //         <div>
// //           <Label>Mediator Name</Label>
// //           <Input
// //             value={formData.mediatorName}
// //             onChange={(e) => handleChange("mediatorName", e.target.value)}
// //             placeholder="Mediator Name"
// //           />
// //         </div>

// //         <div>
// //           <Label>Date</Label>
// //           <Input
// //             type="date"
// //             value={formData.date}
// //             onChange={(e) => handleChange("date", e.target.value)}
// //           />
// //         </div>

// //         <div>
// //           <Label>Location</Label>
// //           <Select
// //             value={formData.location}
// //             onChange={(v) => handleChange("location", v)}
// //             options={[
// //               { value: "chennai", label: "Chennai" },
// //               { value: "bangalore", label: "Bangalore" },
// //             ]}
// //             placeholder="Select Location"
// //           />
// //         </div>

// //         <div>
// //           <Label>Land Name</Label>
// //           <Input
// //             value={formData.landName}
// //             onChange={(e) => handleChange("landName", e.target.value)}
// //             placeholder="Land Name"
// //           />
// //         </div>

// //         <div>
// //           <Label>Zone</Label>
// //           <Input
// //             value={formData.zone}
// //             onChange={(e) => handleChange("zone", e.target.value)}
// //             placeholder="Zone"
// //           />
// //         </div>

// //         <div>
// //           <Label>Extent</Label>
// //           <Input
// //             value={formData.extent}
// //             onChange={(e) => handleChange("extent", e.target.value)}
// //             placeholder="Extent"
// //           />
// //         </div>

// //         <div>
// //           <Label>Unit</Label>
// //           <Select
// //             value={formData.unit}
// //             onChange={(v) => handleChange("unit", v)}
// //             options={[
// //               { value: "Acre", label: "Acre" },
// //               { value: "Sqft", label: "Sqft" },
// //             ]}
// //           />
// //         </div>

// //         <div>
// //           <Label>Property Type</Label>
// //           <Select
// //             value={formData.propertyType}
// //             onChange={(v) => handleChange("propertyType", v)}
// //             options={[
// //               { value: "residential", label: "Residential" },
// //               { value: "commercial", label: "Commercial" },
// //             ]}
// //             placeholder="Select Property Type"
// //           />
// //         </div>

// //         <div>
// //           <Label>FSI</Label>
// //           <Input
// //             value={formData.fsi}
// //             onChange={(e) => handleChange("fsi", e.target.value)}
// //           />
// //         </div>

// //         <div>
// //           <Label>ASP</Label>
// //           <Input
// //             value={formData.asp}
// //             onChange={(e) => handleChange("asp", e.target.value)}
// //           />
// //         </div>

// //         <div>
// //           <Label>Total Revenue (Cr)</Label>
// //           <Input
// //             value={formData.revenue}
// //             onChange={(e) => handleChange("revenue", e.target.value)}
// //           />
// //         </div>
// //         {/* <div className="md:col-span-6">
// //         <hr/>
// //         </div> */}

// //         <div className="md:col-span-3">
// //           <Label>Remark</Label>
// //           <Textarea
// //             value={formData.remark}
// //             onChange={(e) => handleChange("remark", e.target.value)}
// //             placeholder="Enter remarks..."
// //           />
// //         </div>

// //         <div className="md:col-span-3 flex justify-end">
// //           <Button onClick={handleSubmit}>Submit Lead</Button>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Select } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"

// export default function Leads() {
//   const [formData, setFormData] = useState({
//     leadType: "mediator",
//     contactNumber: "",
//     mediatorName: "",
//     date: "",
//     location: "",
//     landName: "",
//     sourceCategory: "",
//     source: "",
//     zone: "",
//     extent: "",
//     unit: "Acre",
//     propertyType: "",
//     fsi: "",
//     asp: "",
//     revenue: "",
//     transactionType: "JV",
//     rate: "",
//     builderShare: "",
//     refundable: "",
//     nonRefundable: "",
//     landmark: "",
//     frontage: "",
//     roadWidth: "",
//     sspde: "No",
//     remark: "",
//   })

//   const handleChange = (key, value) => {
//     setFormData(prev => ({ ...prev, [key]: value }))
//   }

//   const handleSubmit = () => {
//     console.log(formData)
//   }

//   return (
//     <Card className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Create Lead</h2>

//       <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

//         {/* Radio */}
//         <div>
//           <Label>Type</Label>
//           <div className="flex gap-4 mt-2">
//             <label className="flex items-center gap-2">
//               <input type="radio" checked={formData.leadType === "mediator"}
//                 onChange={() => handleChange("leadType", "mediator")} />
//               Mediator
//             </label>

//             <label className="flex items-center gap-2">
//               <input type="radio" checked={formData.leadType === "owner"}
//                 onChange={() => handleChange("leadType", "owner")} />
//               Owner
//             </label>
//           </div>
//         </div>

//         <div>
//           <Label>Contact Number</Label>
//           <Input value={formData.contactNumber}
//             onChange={(e) => handleChange("contactNumber", e.target.value)} />
//         </div>

//         <div>
//           <Label>Mediator Name</Label>
//           <Input value={formData.mediatorName}
//             onChange={(e) => handleChange("mediatorName", e.target.value)} />
//         </div>

//         <div>
//           <Label>Date</Label>
//           <Input type="date" value={formData.date}
//             onChange={(e) => handleChange("date", e.target.value)} />
//         </div>

//         <div>
//           <Label>Location</Label>
//           <Select value={formData.location} onChange={(v) => handleChange("location", v)}
//             options={[
//               { value: "chennai", label: "Chennai" },
//               { value: "blr", label: "Bangalore" },
//             ]}
//           />
//         </div>

//         <div>
//           <Label>Land Name</Label>
//           <Input value={formData.landName}
//             onChange={(e) => handleChange("landName", e.target.value)} />
//         </div>

//         <div>
//           <Label>Source Category</Label>
//           <Select value={formData.sourceCategory}
//             onChange={(v) => handleChange("sourceCategory", v)}
//             options={[
//               { value: "online", label: "Online" },
//               { value: "reference", label: "Reference" },
//             ]}
//           />
//         </div>

//         <div>
//           <Label>Source</Label>
//           <Select value={formData.source}
//             onChange={(v) => handleChange("source", v)}
//             options={[
//               { value: "facebook", label: "Facebook" },
//               { value: "google", label: "Google" },
//             ]}
//           />
//         </div>

//         <div>
//           <Label>Zone</Label>
//           <Input value={formData.zone}
//             onChange={(e) => handleChange("zone", e.target.value)} />
//         </div>

//         <div>
//           <Label>Extent</Label>
//           <Input value={formData.extent}
//             onChange={(e) => handleChange("extent", e.target.value)} />
//         </div>

//         <div>
//           <Label>Unit</Label>
//           <Select value={formData.unit}
//             onChange={(v) => handleChange("unit", v)}
//             options={[
//               { value: "Acre", label: "Acre" },
//               { value: "Sqft", label: "Sqft" },
//             ]}
//           />
//         </div>

//         <div>
//           <Label>Property Type</Label>
//           <Select value={formData.propertyType}
//             onChange={(v) => handleChange("propertyType", v)}
//             options={[
//               { value: "residential", label: "Residential" },
//               { value: "commercial", label: "Commercial" },
//             ]}
//           />
//         </div>

//         <div><Label>FSI</Label><Input value={formData.fsi} onChange={(e)=>handleChange("fsi",e.target.value)} /></div>
//         <div><Label>ASP</Label><Input value={formData.asp} onChange={(e)=>handleChange("asp",e.target.value)} /></div>
//         <div><Label>Total Revenue</Label><Input value={formData.revenue} onChange={(e)=>handleChange("revenue",e.target.value)} /></div>

//         <div>
//           <Label>Transaction Type</Label>
//           <Select value={formData.transactionType}
//             onChange={(v) => handleChange("transactionType", v)}
//             options={[
//               { value: "JV", label: "JV" },
//               { value: "Sale", label: "Sale" },
//             ]}
//           />
//         </div>

//         <div><Label>Rate</Label><Input value={formData.rate} onChange={(e)=>handleChange("rate",e.target.value)} /></div>
//         <div><Label>Builder Share (%)</Label><Input value={formData.builderShare} onChange={(e)=>handleChange("builderShare",e.target.value)} /></div>
//         <div><Label>Refundable Deposit</Label><Input value={formData.refundable} onChange={(e)=>handleChange("refundable",e.target.value)} /></div>
//         <div><Label>Non-Refundable Deposit</Label><Input value={formData.nonRefundable} onChange={(e)=>handleChange("nonRefundable",e.target.value)} /></div>

//         <div><Label>Landmark</Label><Input value={formData.landmark} onChange={(e)=>handleChange("landmark",e.target.value)} /></div>
//         <div><Label>Frontage</Label><Input value={formData.frontage} onChange={(e)=>handleChange("frontage",e.target.value)} /></div>
//         <div><Label>Road Width</Label><Input value={formData.roadWidth} onChange={(e)=>handleChange("roadWidth",e.target.value)} /></div>

//         <div>
//           <Label>SSPDE</Label>
//           <Select value={formData.sspde}
//             onChange={(v) => handleChange("sspde", v)}
//             options={[
//               { value: "Yes", label: "Yes" },
//               { value: "No", label: "No" },
//             ]}
//           />
//         </div>

//         <div className="md:col-span-3">
//           <Label>Remark</Label>
//           <Textarea value={formData.remark}
//             onChange={(e) => handleChange("remark", e.target.value)} />
//         </div>

//         <div className="md:col-span-3 flex justify-end">
//           <Button onClick={handleSubmit}>Submit</Button>
//         </div>

//       </CardContent>
//     </Card>
//   )
// }

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Leads({ data = null, onSubmit }) {
  // Initialize form with either incoming data (edit) or default values (create)
  const [formData, setFormData] = useState({
    leadType: "mediator",
    contactNumber: "",
    mediatorName: "",
    date: "",
    location: "",
    landName: "",
    sourceCategory: "",
    source: "",
    zone: "",
    extent: "",
    unit: "Acre",
    propertyType: "",
    fsi: "",
    asp: "",
    revenue: "",
    transactionType: "JV",
    rate: "",
    builderShare: "",
    refundable: "",
    nonRefundable: "",
    landmark: "",
    frontage: "",
    roadWidth: "",
    sspde: "No",
    remark: "",
  })

  // If `data` changes (i.e., editing), update formData
  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    console.log("Submitting Lead:", formData)
    if (onSubmit) onSubmit(formData)
  }

  return (
    // <Card className="p-2">
    <>
      <h2 className="text-xl font-semibold mb-4">
        {data ? "Edit Lead" : "Create Lead"}
      </h2>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Radio Type */}
        <div>
          <Label>Type</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.leadType === "mediator"}
                onChange={() => handleChange("leadType", "mediator")}
              />
              Mediator
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.leadType === "owner"}
                onChange={() => handleChange("leadType", "owner")}
              />
              Owner
            </label>
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <Label>Contact Number</Label>
          <Input
            value={formData.contactNumber}
            onChange={e => handleChange("contactNumber", e.target.value)}
          />
        </div>

        {/* Mediator Name */}
        <div>
          <Label>Mediator Name</Label>
          <Input
            value={formData.mediatorName}
            onChange={e => handleChange("mediatorName", e.target.value)}
          />
        </div>

        {/* Date */}
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={e => handleChange("date", e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <Label>Location</Label>
          <Select
            value={formData.location}
            onChange={v => handleChange("location", v)}
            options={[
              { value: "chennai", label: "Chennai" },
              { value: "blr", label: "Bangalore" },
            ]}
          />
        </div>

        {/* Land Name */}
        <div>
          <Label>Land Name</Label>
          <Input
            value={formData.landName}
            onChange={e => handleChange("landName", e.target.value)}
          />
        </div>

        {/* Source Category */}
        <div>
          <Label>Source Category</Label>
          <Select
            value={formData.sourceCategory}
            onChange={v => handleChange("sourceCategory", v)}
            options={[
              { value: "online", label: "Online" },
              { value: "reference", label: "Reference" },
            ]}
          />
        </div>

        {/* Source */}
        <div>
          <Label>Source</Label>
          <Select
            value={formData.source}
            onChange={v => handleChange("source", v)}
            options={[
              { value: "facebook", label: "Facebook" },
              { value: "google", label: "Google" },
            ]}
          />
        </div>

        {/* Zone */}
        <div>
          <Label>Zone</Label>
          <Input value={formData.zone} onChange={e => handleChange("zone", e.target.value)} />
        </div>

        {/* Extent */}
        <div>
          <Label>Extent</Label>
          <Input value={formData.extent} onChange={e => handleChange("extent", e.target.value)} />
        </div>

        {/* Unit */}
        <div>
          <Label>Unit</Label>
          <Select
            value={formData.unit}
            onChange={v => handleChange("unit", v)}
            options={[
              { value: "Acre", label: "Acre" },
              { value: "Sqft", label: "Sqft" },
            ]}
          />
        </div>

        {/* Property Type */}
        <div>
          <Label>Property Type</Label>
          <Select
            value={formData.propertyType}
            onChange={v => handleChange("propertyType", v)}
            options={[
              { value: "residential", label: "Residential" },
              { value: "commercial", label: "Commercial" },
            ]}
          />
        </div>

        {/* FSI, ASP, Revenue */}
        <div><Label>FSI</Label><Input value={formData.fsi} onChange={e => handleChange("fsi", e.target.value)} /></div>
        <div><Label>ASP</Label><Input value={formData.asp} onChange={e => handleChange("asp", e.target.value)} /></div>
        <div><Label>Total Revenue</Label><Input value={formData.revenue} onChange={e => handleChange("revenue", e.target.value)} /></div>

        {/* Transaction Type */}
        <div>
          <Label>Transaction Type</Label>
          <Select
            value={formData.transactionType}
            onChange={v => handleChange("transactionType", v)}
            options={[
              { value: "JV", label: "JV" },
              { value: "Sale", label: "Sale" },
            ]}
          />
        </div>

        {/* Rate, Builder Share, Refundable, Non-Refundable */}
        <div><Label>Rate</Label><Input value={formData.rate} onChange={e => handleChange("rate", e.target.value)} /></div>
        <div><Label>Builder Share (%)</Label><Input value={formData.builderShare} onChange={e => handleChange("builderShare", e.target.value)} /></div>
        <div><Label>Refundable Deposit</Label><Input value={formData.refundable} onChange={e => handleChange("refundable", e.target.value)} /></div>
        <div><Label>Non-Refundable Deposit</Label><Input value={formData.nonRefundable} onChange={e => handleChange("nonRefundable", e.target.value)} /></div>

        {/* Landmark, Frontage, Road Width */}
        <div><Label>Landmark</Label><Input value={formData.landmark} onChange={e => handleChange("landmark", e.target.value)} /></div>
        <div><Label>Frontage</Label><Input value={formData.frontage} onChange={e => handleChange("frontage", e.target.value)} /></div>
        <div><Label>Road Width</Label><Input value={formData.roadWidth} onChange={e => handleChange("roadWidth", e.target.value)} /></div>

        {/* SSPDE */}
        <div>
          <Label>SSPDE</Label>
          <Select
            value={formData.sspde}
            onChange={v => handleChange("sspde", v)}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
        </div>

        {/* Remark */}
        <div className="md:col-span-3">
          <Label>Remark</Label>
          <Textarea
            value={formData.remark}
            onChange={e => handleChange("remark", e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-end">
          <Button onClick={handleSubmit}>
            {data ? "Update Lead" : "Submit Lead"}
          </Button>
        </div>

      </CardContent>
    {/* // </Card> */}
    </>
  )
}
