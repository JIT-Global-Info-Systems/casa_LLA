// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { useLeads } from "../context/LeadsContext.jsx"

// export default function Leads({ data = null, onClose }) {
//   const { createLead, updateLead, loading } = useLeads()

//   // Initialize form with either incoming data (edit) or default values (create)
//   const [formData, setFormData] = useState({
//     leadType: "mediator",
//     contactNumber: "",
//     mediatorName: "",
//     mediatorId: "",
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

//   // If `data` changes (i.e., editing), update formData
//   useEffect(() => {
//     if (data) {
//       setFormData(data)
//     }
//   }, [data])

//   const handleFileChange = (fieldName) => (e) => {
//     setFiles(prev => ({
//       ...prev,
//       [fieldName]: e.target.files[0]
//     }))
//   }

//   const handleChange = (key, value) => {
//     setFormData(prev => ({ ...prev, [key]: value }))
//   }

//   const handleSubmit = async () => {
//     try {
//       // Prepare the data according to API requirements
//       const submitData = {
//         ...formData,
//         // Ensure arrays are properly formatted
//         competitorAnalysis: formData.competitorAnalysis.length > 0 ? formData.competitorAnalysis : undefined,
//         checkListPage: formData.checkListPage.length > 0 ? formData.checkListPage : undefined,
//       }

//       if (data) {
//         // Update existing lead
//         await updateLead(data._id, submitData)
//       } else {
//         // Create new lead with files
//         await createLead(submitData, files)
//       }

//       // Close modal on successful submission
//       if (onClose) onClose()
//     } catch (error) {
//       console.error("Error saving lead:", error)
//       // Don't close modal on error - let user try again
//     }
//   }

//   return (
//     // <Card className="p-2">
//     <>
//       <h2 className="text-xl font-semibold mb-4">
//         {data ? "Edit Lead" : "Create Lead"}
//       </h2>

//       <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

//         {/* Radio Type */}
//         <div>
//           <Label>Type</Label>
//           <div className="flex gap-4 mt-2">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={formData.leadType === "mediator"}
//                 onChange={() => handleChange("leadType", "mediator")}
//               />
//               Mediator
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={formData.leadType === "owner"}
//                 onChange={() => handleChange("leadType", "owner")}
//               />
//               Owner
//             </label>
//           </div>
//         </div>

//         {/* Contact Number */}
//         <div>
//           <Label>Contact Number</Label>
//           <Input
//             value={formData.contactNumber}
//             onChange={e => handleChange("contactNumber", e.target.value)}
//           />
//         </div>

//         {/* Mediator Name */}
//         <div>
//           <Label>Mediator Name</Label>
//           <Input
//             value={formData.mediatorName}
//             onChange={e => handleChange("mediatorName", e.target.value)}
//           />
//         </div>

//         {/* Date */}
//         <div>
//           <Label>Date</Label>
//           <Input
//             type="date"
//             value={formData.date}
//             onChange={e => handleChange("date", e.target.value)}
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <Label>Location</Label>
//           <Select
//             value={formData.location}
//             onValueChange={v => handleChange("location", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select location" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="chennai">Chennai</SelectItem>
//               <SelectItem value="blr">Bangalore</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Land Name */}
//         <div>
//           <Label>Land Name</Label>
//           <Input
//             value={formData.landName}
//             onChange={e => handleChange("landName", e.target.value)}
//           />
//         </div>

//         {/* Source Category */}
//         <div>
//           <Label>Source Category</Label>
//           <Select
//             value={formData.sourceCategory}
//             onValueChange={v => handleChange("sourceCategory", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select source category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="online">Online</SelectItem>
//               <SelectItem value="reference">Reference</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Source */}
//         <div>
//           <Label>Source</Label>
//           <Select
//             value={formData.source}
//             onValueChange={v => handleChange("source", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select source" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="facebook">Facebook</SelectItem>
//               <SelectItem value="google">Google</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Zone */}
//         <div>
//           <Label>Zone</Label>
//           <Input value={formData.zone} onChange={e => handleChange("zone", e.target.value)} />
//         </div>

//         {/* Extent */}
//         <div>
//           <Label>Extent</Label>
//           <Input value={formData.extent} onChange={e => handleChange("extent", e.target.value)} />
//         </div>

//         {/* Unit */}
//         <div>
//           <Label>Unit</Label>
//           <Select
//             value={formData.unit}
//             onValueChange={v => handleChange("unit", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select unit" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Acre">Acre</SelectItem>
//               <SelectItem value="Sqft">Sqft</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Property Type */}
//         <div>
//           <Label>Property Type</Label>
//           <Select
//             value={formData.propertyType}
//             onValueChange={v => handleChange("propertyType", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select property type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="residential">Residential</SelectItem>
//               <SelectItem value="commercial">Commercial</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* FSI, ASP, Revenue */}
//         <div><Label>FSI</Label><Input value={formData.fsi} onChange={e => handleChange("fsi", e.target.value)} /></div>
//         <div><Label>ASP</Label><Input value={formData.asp} onChange={e => handleChange("asp", e.target.value)} /></div>
//         <div><Label>Total Revenue</Label><Input value={formData.revenue} onChange={e => handleChange("revenue", e.target.value)} /></div>

//         {/* Transaction Type */}
//         <div>
//           <Label>Transaction Type</Label>
//           <Select
//             value={formData.transactionType}
//             onValueChange={v => handleChange("transactionType", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select transaction type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="JV">JV</SelectItem>
//               <SelectItem value="Sale">Sale</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Rate, Builder Share, Refundable, Non-Refundable */}
//         <div><Label>Rate</Label><Input value={formData.rate} onChange={e => handleChange("rate", e.target.value)} /></div>
//         <div><Label>Builder Share (%)</Label><Input value={formData.builderShare} onChange={e => handleChange("builderShare", e.target.value)} /></div>
//         <div><Label>Refundable Deposit</Label><Input value={formData.refundable} onChange={e => handleChange("refundable", e.target.value)} /></div>
//         <div><Label>Non-Refundable Deposit</Label><Input value={formData.nonRefundable} onChange={e => handleChange("nonRefundable", e.target.value)} /></div>

//         {/* Landmark, Frontage, Road Width */}
//         <div><Label>Landmark</Label><Input value={formData.landmark} onChange={e => handleChange("landmark", e.target.value)} /></div>
//         <div><Label>Frontage</Label><Input value={formData.frontage} onChange={e => handleChange("frontage", e.target.value)} /></div>
//         <div><Label>Road Width</Label><Input value={formData.roadWidth} onChange={e => handleChange("roadWidth", e.target.value)} /></div>

//         {/* SSPDE */}
//         <div>
//           <Label>SSPDE</Label>
//           <Select
//             value={formData.sspde}
//             onValueChange={v => handleChange("sspde", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select SSPDE" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Yes">Yes</SelectItem>
//               <SelectItem value="No">No</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Lead Status</Label>
//           <Select
//             value={formData.leadStatus}
//             onValueChange={v => handleChange("leadStatus", v)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select lead status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Pending">Pending</SelectItem>
//               <SelectItem value="Approved">Approved</SelectItem>
//               <SelectItem value="Rejected">Rejected</SelectItem>
//               <SelectItem value="Cancelled">Cancelled</SelectItem>
//               <SelectItem value="Lost">Lost</SelectItem>
//               <SelectItem value="Won">Won</SelectItem>
//               <SelectItem value="Purchased">Purchased</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Remark */}
//         <div className="md:col-span-3">
//           <Label>Remark</Label>
//           <Textarea
//             value={formData.remark}
//             onChange={e => handleChange("remark", e.target.value)}
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="md:col-span-3 flex justify-end gap-2">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Saving..." : (data ? "Update Lead" : "Submit Lead")}
//           </Button>
//         </div>

//       </CardContent>
//     {/* // </Card> */}
//     </>
//   )
// }


import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { locationsAPI, mediatorsAPI } from "@/services/api"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

export default function Leads({ data = null, onSubmit, onClose, currentStep = 1, onStepChange }) {
  const [formData, setFormData] = useState({
    // Basic Lead Information
    leadType: "mediator",
    contactNumber: "",
    mediatorName: "",
    date: "",
    location: "",
    landName: "",
    sourceCategory: "",
    source: "",
    zone: "",
    area: "",
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
    leadStatus: "Pending",
    remark: "",

    // Yield Calculation
    yield: "",

    // Competitor Analysis
    competitorDeveloperName: "",
    competitorProjectName: "",
    competitorProductType: "",
    competitorLocation: "",
    competitorPlotSize: "",
    competitorLandExtent: "",
    competitorPriceRange: "",
    competitorApproxPrice: "",
    competitorApproxPriceRent: "",
    competitorTotalUnits: "",
    competitorKeyAmenities: "",
    competitorUSP: "",

    // Site Checklist
    checkLandLocation: false,
    checkLandExtent: false,
    checkLandPrice: false,
    checkApproachRoad: false,
    checkSoilType: false,
    checkTopography: false,
    checkDrainageWaterLogging: false,
    checkSoilType2: false,
    checkChemistry: false,
    checkGroundWaterAvailability: false,
    checkBorewellWater: false,
    checkPondTank: false,
    checkNearbyLakes: false,
    checkElectricity: false,
    checkNearbyActivities: false,
    checkReligiousStructures: false,
    checkCemeteryDock: false,
    checkNearbyAirport: false,
    checkProximityMetro: false,
    checkNearbyIndustries: false,
    checkMarketRate: false,
    checkProjectTypes: false,
    checkLandOwnership: false,
    checkNumberOwners: false,
    checkMaritalStatus: false,
    checkLandClassification: false,
    checkMortgage: false,
    checkBankLease: false,
    checkLitigation: false,
    checkNearbyRailway: false,
    checkGoogleLocation: false,
    checkNotes: "",
    checkRequests: "",
  })

  // State for locations, regions, zones, and mediators
  const [masters, setMasters] = useState({
    locations: [],
    regions: [],
    zones: [],
    mediators: [],
  })
  const [loading, setLoading] = useState({ locations: false, regions: false, zones: false, mediators: false })

  // Fetch locations and mediators from API
  const fetchLocations = useCallback(async () => {
    setLoading(prev => ({ ...prev, locations: true, regions: true, zones: true }));
    try {
      const locationsData = await locationsAPI.getAll();
      // Transform API data to match component structure
      const transformedLocations = locationsData.map(loc => ({
        id: loc._id,
        name: loc.location,
        status: loc.status,
        regions: loc.regions || [],
        created_by: loc.created_by,
        created_at: loc.created_at,
        updated_at: loc.updated_at,
        updated_by: loc.updated_by
      }));
      
      // Extract regions and zones from locations data
      const transformedRegions = [];
      const transformedZones = [];
      
      locationsData.forEach(location => {
        if (location.regions && location.regions.length > 0) {
          location.regions.forEach(region => {
            transformedRegions.push({
              id: region._id,
              location: location.location,
              region: region.region,
              zones: region.zones || []
            });
            
            if (region.zones && region.zones.length > 0) {
              region.zones.forEach(zone => {
                transformedZones.push({
                  id: zone._id,
                  location: location.location,
                  region: region.region,
                  zone: zone.zone
                });
              });
            }
          });
        }
      });
      
      setMasters(prev => ({ 
        ...prev, 
        locations: transformedLocations,
        regions: transformedRegions,
        zones: transformedZones
      }));
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(prev => ({ ...prev, locations: false, regions: false, zones: false }));
    }
  }, []);

  const fetchMediators = useCallback(async () => {
    setLoading(prev => ({ ...prev, mediators: true }));
    try {
      const mediatorsData = await mediatorsAPI.getAll();
      // Transform API data to match component structure
      const transformedMediators = mediatorsData.map(mediator => ({
        id: mediator._id,
        name: mediator.name,
        email: mediator.email,
        phone: mediator.phone_number,
        status: mediator.status
      }));
      
      setMasters(prev => ({ 
        ...prev, 
        mediators: transformedMediators
      }));
    } catch (err) {
      console.error('Failed to fetch mediators:', err);
    } finally {
      setLoading(prev => ({ ...prev, mediators: false }));
    }
  }, []);

  // Fetch locations and mediators on component mount
  useEffect(() => {
    fetchLocations();
    fetchMediators();
  }, [fetchLocations, fetchMediators]);

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleLocationChange = (value) => {
    setFormData(prev => ({ ...prev, location: value, zone: '', area: '' }));
  };

  const handleZoneChange = (value) => {
    setFormData(prev => ({ ...prev, zone: value, area: '' }));
  };

  const getOptions = useCallback((type, selectedLocation = null) => {
    if (type === 'location') return masters.locations.map(l => ({ value: l.name, label: l.name }));
    if (type === 'mediator') return masters.mediators.map(m => ({ value: m.name, label: m.name }));
    if (type === 'region') {
      if (selectedLocation) {
        // Filter regions by selected location
        return masters.regions
          .filter(r => r.location === selectedLocation)
          .map(r => ({ value: r.region, label: r.region }));
      }
      return masters.regions.map(r => ({ value: r.region, label: r.region }));
    }
    if (type === 'zone') {
      if (selectedLocation && formData.zone) {
        // Filter zones by selected location and region
        return masters.zones
          .filter(z => z.location === selectedLocation && z.region === formData.zone)
          .map(z => ({ value: z.zone, label: z.zone }));
      }
      return [];
    }
    return [];
  }, [masters, formData.zone]);

  const handleCheckboxChange = (key, checked) => {
    setFormData(prev => ({ ...prev, [key]: checked }))
  }

  const handleSubmit = () => {
    console.log("Submitting Lead:", formData)
    if (onSubmit) onSubmit(formData)
  }

  return (
    <div className="flex-1 space-y-2 p-2">
      {/* Form Content */}
      {/* Section 1: Basic Lead Information */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Basic Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Radio */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.leadType === "mediator"}
                  onChange={() => handleChange("leadType", "mediator")}
                  className="cursor-pointer"
                />
                Mediator
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.leadType === "owner"}
                  onChange={() => handleChange("leadType", "owner")}
                  className="cursor-pointer"
                />
                Owner
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input
              value={formData.contactNumber}
              onChange={e => handleChange("contactNumber", e.target.value)}
              placeholder="Enter contact number"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Mediator Name</Label>
            <Select
              value={formData.mediatorName || ''}
              onValueChange={(value) => handleChange("mediatorName", value)}
              disabled={loading.mediators}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select mediator" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {getOptions('mediator').map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={e => handleChange("date", e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Location, Zone, Area - Full Width Fields */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              value={formData.location || ''}
              onValueChange={handleLocationChange}
              disabled={loading.locations}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {getOptions('location').map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Zone</Label>
            <Select
              value={formData.zone || ''}
              onValueChange={handleZoneChange}
              disabled={!formData.location || loading.regions}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {getOptions('region', formData.location).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Area</Label>
            <Select
              value={formData.area || ''}
              onValueChange={(value) => handleChange('area', value)}
              disabled={!formData.location || !formData.zone || loading.zones}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {getOptions('zone', formData.location).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Land Name</Label>
            <Input
              value={formData.landName}
              onChange={e => handleChange("landName", e.target.value)}
              placeholder="Enter land name"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Source Category</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                >
                  {formData.sourceCategory ? (formData.sourceCategory === "online" ? "Online" : "Reference") : "Select category"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => handleChange("sourceCategory", "online")}>
                  Online
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChange("sourceCategory", "reference")}>
                  Reference
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <Label>Source</Label>
            <Select
              value={formData.source || ''}
              onValueChange={(value) => handleChange("source", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div className="space-y-2">
            <Label>Extent</Label>
            <Input
              value={formData.extent}
              onChange={e => handleChange("extent", e.target.value)}
              placeholder="Enter extent"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={formData.unit || ''}
              onValueChange={(value) => handleChange("unit", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="Acre">Acre</SelectItem>
                <SelectItem value="Sqft">Sqft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select
              value={formData.propertyType || ''}
              onValueChange={(value) => handleChange("propertyType", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2"><Label>FSI</Label><Input
            value={formData.fsi}
            onChange={e => handleChange("fsi", e.target.value)}
            placeholder="Enter FSI"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>ASP</Label><Input
            value={formData.asp}
            onChange={e => handleChange("asp", e.target.value)}
            placeholder="Enter ASP"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Total Revenue</Label><Input
            value={formData.revenue}
            onChange={e => handleChange("revenue", e.target.value)}
            placeholder="Enter revenue"
            className="border-gray-300"
          /></div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select
              value={formData.transactionType || ''}
              onValueChange={(value) => handleChange("transactionType", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="JV">JV</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2"><Label>Rate</Label><Input
            value={formData.rate}
            onChange={e => handleChange("rate", e.target.value)}
            placeholder="Enter rate"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Builder Share (%)</Label><Input
            value={formData.builderShare}
            onChange={e => handleChange("builderShare", e.target.value)}
            placeholder="Enter percentage"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Refundable Deposit</Label><Input
            value={formData.refundable}
            onChange={e => handleChange("refundable", e.target.value)}
            placeholder="Enter amount"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Non-Refundable Deposit</Label><Input
            value={formData.nonRefundable}
            onChange={e => handleChange("nonRefundable", e.target.value)}
            placeholder="Enter amount"
            className="border-gray-300"
          /></div>

          <div className="space-y-2"><Label>Landmark</Label><Input
            value={formData.landmark}
            onChange={e => handleChange("landmark", e.target.value)}
            placeholder="Enter landmark"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Frontage</Label><Input
            value={formData.frontage}
            onChange={e => handleChange("frontage", e.target.value)}
            placeholder="Enter frontage"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Road Width</Label><Input
            value={formData.roadWidth}
            onChange={e => handleChange("roadWidth", e.target.value)}
            placeholder="Enter width"
            className="border-gray-300"
          /></div>
          <div className="space-y-2"><Label>Yield</Label><Input
            value={formData.yield}
            onChange={e => handleChange("yield", e.target.value)}
            placeholder="Enter width"
            className="border-gray-300"
          /></div>

          <div className="space-y-2">
            <Label>SSPDE</Label>
            <Select
              value={formData.sspde || ''}
              onValueChange={(value) => handleChange("sspde", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select SSPDE" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lead Status</Label>
            <Select
              value={formData.leadStatus || ''}
              onValueChange={(value) => handleChange("leadStatus", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select lead status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Purchased">Purchased</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 space-y-2">
            <Label>Remark</Label>
            <Textarea
              value={formData.remark}
              onChange={e => handleChange("remark", e.target.value)}
              placeholder="Enter any remarks"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Yield Calculation */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Yield Calculation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Saleable Area (sq ft)</Label>
            <Input
              value={formData.yieldSaleable}
              onChange={e => handleChange("yieldSaleable", e.target.value)}
              placeholder="Enter saleable area"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Common Area (sq ft)</Label>
            <Input
              value={formData.yieldCommon}
              onChange={e => handleChange("yieldCommon", e.target.value)}
              placeholder="Enter common area"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Total Built-up Area (sq ft)</Label>
            <Input
              value={formData.yieldTotal}
              onChange={e => handleChange("yieldTotal", e.target.value)}
              placeholder="Enter total area"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Efficiency (%)</Label>
            <Input
              value={formData.yieldEfficiency}
              onChange={e => handleChange("yieldEfficiency", e.target.value)}
              placeholder="Enter efficiency"
              className="border-gray-300"
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Section 3: Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Developer Name</Label>
            <Input
              value={formData.competitorDeveloperName}
              onChange={e => handleChange("competitorDeveloperName", e.target.value)}
              placeholder="Enter developer name"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={formData.competitorProjectName}
              onChange={e => handleChange("competitorProjectName", e.target.value)}
              placeholder="Enter project name"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Product Type</Label>
            <Input
              value={formData.competitorProductType}
              onChange={e => handleChange("competitorProductType", e.target.value)}
              placeholder="Enter product type"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.competitorLocation}
              onChange={e => handleChange("competitorLocation", e.target.value)}
              placeholder="Enter location"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Plot / Unit Size</Label>
            <Input
              value={formData.competitorPlotSize}
              onChange={e => handleChange("competitorPlotSize", e.target.value)}
              placeholder="Enter plot size"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Land Extent</Label>
            <Input
              value={formData.competitorLandExtent}
              onChange={e => handleChange("competitorLandExtent", e.target.value)}
              placeholder="Enter land extent"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Input
              value={formData.competitorPriceRange}
              onChange={e => handleChange("competitorPriceRange", e.target.value)}
              placeholder="Enter price range"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Approx Price</Label>
            <Input
              value={formData.competitorApproxPrice}
              onChange={e => handleChange("competitorApproxPrice", e.target.value)}
              placeholder="Enter approx price"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Approx Price / Rent</Label>
            <Input
              value={formData.competitorApproxPriceRent}
              onChange={e => handleChange("competitorApproxPriceRent", e.target.value)}
              placeholder="Enter price/rent"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label>Total Plots / Units</Label>
            <Input
              value={formData.competitorTotalUnits}
              onChange={e => handleChange("competitorTotalUnits", e.target.value)}
              placeholder="Enter total units"
              className="border-gray-300"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Key Amenities</Label>
            <Input
              value={formData.competitorKeyAmenities}
              onChange={e => handleChange("competitorKeyAmenities", e.target.value)}
              placeholder="Enter key amenities"
              className="border-gray-300"
            />
          </div>
          <div className="md:col-span-3 space-y-2">
            <Label>USP / Positioning</Label>
            <Textarea
              value={formData.competitorUSP}
              onChange={e => handleChange("competitorUSP", e.target.value)}
              placeholder="Enter unique selling proposition"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Site Visit Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Site Visit Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkLandLocation}
                onChange={e => handleCheckboxChange("checkLandLocation", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Land Location</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkLandExtent}
                onChange={e => handleCheckboxChange("checkLandExtent", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Land Extent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkLandPrice}
                onChange={e => handleCheckboxChange("checkLandPrice", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Land Price</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkApproachRoad}
                onChange={e => handleCheckboxChange("checkApproachRoad", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Approach Road</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkSoilType}
                onChange={e => handleCheckboxChange("checkSoilType", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Soil Type</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkTopography}
                onChange={e => handleCheckboxChange("checkTopography", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Topography / Undulations</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkDrainageWaterLogging}
                onChange={e => handleCheckboxChange("checkDrainageWaterLogging", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Drainage / Water Logging</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkSoilType2}
                onChange={e => handleCheckboxChange("checkSoilType2", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Soil Type (Test)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkChemistry}
                onChange={e => handleCheckboxChange("checkChemistry", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Chemistry / pH Quantity</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkGroundWaterAvailability}
                onChange={e => handleCheckboxChange("checkGroundWaterAvailability", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Ground Water Availability</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkBorewellWater}
                onChange={e => handleCheckboxChange("checkBorewellWater", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Borewell Water</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkPondTank}
                onChange={e => handleCheckboxChange("checkPondTank", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Pond / Tank</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkNearbyLakes}
                onChange={e => handleCheckboxChange("checkNearbyLakes", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Nearby Lakes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkElectricity}
                onChange={e => handleCheckboxChange("checkElectricity", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Electricity</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkNearbyActivities}
                onChange={e => handleCheckboxChange("checkNearbyActivities", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Nearby Activities / Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkReligiousStructures}
                onChange={e => handleCheckboxChange("checkReligiousStructures", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Religious Structures</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkCemeteryDock}
                onChange={e => handleCheckboxChange("checkCemeteryDock", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Cemetery / Dock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkNearbyAirport}
                onChange={e => handleCheckboxChange("checkNearbyAirport", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Nearby Airport</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkProximityMetro}
                onChange={e => handleCheckboxChange("checkProximityMetro", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Proximity to Metro / HS Rail</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkNearbyIndustries}
                onChange={e => handleCheckboxChange("checkNearbyIndustries", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Nearby Industries</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkMarketRate}
                onChange={e => handleCheckboxChange("checkMarketRate", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Market Rate</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkProjectTypes}
                onChange={e => handleCheckboxChange("checkProjectTypes", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Project Types</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkLandOwnership}
                onChange={e => handleCheckboxChange("checkLandOwnership", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Land Ownership</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkNumberOwners}
                onChange={e => handleCheckboxChange("checkNumberOwners", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Number of Owners</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkMaritalStatus}
                onChange={e => handleCheckboxChange("checkMaritalStatus", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Marital Status</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkLandClassification}
                onChange={e => handleCheckboxChange("checkLandClassification", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Land Classification</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkMortgage}
                onChange={e => handleCheckboxChange("checkMortgage", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Mortgage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkBankLease}
                onChange={e => handleCheckboxChange("checkBankLease", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Bank Lease</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkLitigation}
                onChange={e => handleCheckboxChange("checkLitigation", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Litigation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkNearbyRailway}
                onChange={e => handleCheckboxChange("checkNearbyRailway", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Nearby Railway Deck</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkGoogleLocation}
                onChange={e => handleCheckboxChange("checkGoogleLocation", e.target.checked)}
                className="cursor-pointer"
              />
              <span>Google Location</span>
            </label>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.checkNotes}
                onChange={e => handleChange("checkNotes", e.target.value)}
                placeholder="Enter additional notes"
                rows={3}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>Requests</Label>
              <Textarea
                value={formData.checkRequests}
                onChange={e => handleChange("checkRequests", e.target.value)}
                placeholder="Enter any special requests"
                rows={3}
                className="border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} className="border-gray-300">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
          {data ? "Update Lead" : "Submit Lead"}
        </Button>
      </div>
    </div>
  )
}


