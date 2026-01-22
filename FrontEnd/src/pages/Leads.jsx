import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { locationsAPI } from "@/services/api"
import { useMediators } from "../context/MediatorsContext.jsx"
import { ChevronLeft, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const yesNo = (v) => (v ? "Yes" : "No")

export default function Leads({ data = null, onSubmit, onClose }) {
  const { mediators, loading: mediatorsLoading, fetched: mediatorsFetched, fetchMediators } = useMediators()
  const [formData, setFormData] = useState({
    // Basic Lead Information
    leadType: "mediator",
    contactNumber: "",
    mediatorName: "",
    mediatorId: "",
    date: "",
    location: "",
    zone: "",
    area: "",
    landName: "",
    sourceCategory: "",
    source: "",
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
    lead_stage: "",

    // Yield Calculation (UI-only for now; backend schema doesn’t store these fields yet)
    yield:"",

    // Competitor Analysis (mapped to competitorAnalysis[] on submit)
    competitorDeveloperName: "",
    competitorProjectName: "",
    competitorProductType: "",
    competitorLocation: "",
    competitorPlotSize: "",
    competitorLandExtent: "",
    competitorPriceRange: "",
    competitorApproxPrice: "",
    competitorApproxPriceCent: "",
    competitorTotalUnits: "",
    competitorKeyAmenities: "",
    competitorUSP: "",

    // Site Visit Checklist (mapped to checkListPage[] on submit)
    checkLandLocation: "",
    checkLandExtent: "",
    checkLandZone: "",
    checkLandClassification: "",
    checkGooglePin: "",
    checkApproachRoadWidth: "",
    checkSoilType: "",
    checkSellingPrice: "",
    checkGuidelineValue: "",
    checkLocationSellingPrice: "",
    checkMarketingPrice: "",
    checkRoadWidth: "",
    checkTotalSaleableArea: "",
    checkOwnerName: "",
    checkConsultantName: "",
    checkNotes: "",
    checkProjects: "",
    checkGoogleLocation: "",

    // Checkboxes
    checkEBLine: false,
    checkQuarryCrusher: false,
    checkGovtLandAcquisition: false,
    checkRailwayTrackNOC: false,
    checkBankIssues: false,
    checkDumpyardQuarry: false,
    checkWaterbodyNearby: false,
    checkNearbyHTLine: false,
    checkTempleLand: false,
    checkFutureGovtProjects: false,
    checkFarmLand: false,
    checkLandCleaning: false,
    checkSubDivision: false,
    checkSoilTest: false,
    checkWaterList: false,

    // Special Fields (Checkbox + Upload)
    checkFMBSketch: false,
    fileFMBSketch: null,
    checkPattaChitta: false,
    filePattaChitta: null,

    checkRequests: "",
  })

  const [masters, setMasters] = useState({ locations: [], regions: [], zones: [] })
  const [loading, setLoading] = useState({ locations: false, regions: false, zones: false, submit: false })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)

  const validateForm = (dataToValidate) => {
    const nextErrors = {}

    if (!dataToValidate.contactNumber?.trim()) {
      nextErrors.contactNumber = "Contact number is required"
    } else if (!/^[+]?[0-9]{10,15}$/.test(dataToValidate.contactNumber.replace(/\s/g, ""))) {
      nextErrors.contactNumber = "Invalid contact number format"
    }

    if (!dataToValidate.mediatorName?.trim()) nextErrors.mediatorName = "Mediator/Owner name is required"
    if (!dataToValidate.date) nextErrors.date = "Date is required"
    if (!dataToValidate.location) nextErrors.location = "Location is required"
    if (!dataToValidate.landName?.trim()) nextErrors.landName = "Land name is required"
    if (!dataToValidate.sourceCategory) nextErrors.sourceCategory = "Source category is required"
    if (!dataToValidate.source) nextErrors.source = "Source is required"

    // Numeric fields (soft validation)
    ;["extent", "fsi", "asp", "revenue", "rate", "builderShare"].forEach((k) => {
      const v = dataToValidate[k]
      if (v && isNaN(parseFloat(v))) nextErrors[k] = `${k} must be a number`
    })

    // Files: backend allows only JPG/PNG/JPEG and 2MB
    const validateFile = (fileKey, file) => {
      if (!file) return ""
      const maxSize = 2 * 1024 * 1024
      const allowed = ["image/jpeg", "image/jpg", "image/png"]
      if (file.size > maxSize) return "File size must be less than 2MB"
      if (!allowed.includes(file.type)) return "Invalid file type. Only JPG/PNG images are allowed"
      return ""
    }

    if (dataToValidate.checkFMBSketch) {
      if (!dataToValidate.fileFMBSketch) nextErrors.fileFMBSketch = "FMB Sketch file is required when checkbox is checked"
      else {
        const msg = validateFile("fileFMBSketch", dataToValidate.fileFMBSketch)
        if (msg) nextErrors.fileFMBSketch = msg
      }
    }

    if (dataToValidate.checkPattaChitta) {
      if (!dataToValidate.filePattaChitta) nextErrors.filePattaChitta = "Patta/Chitta file is required when checkbox is checked"
      else {
        const msg = validateFile("filePattaChitta", dataToValidate.filePattaChitta)
        if (msg) nextErrors.filePattaChitta = msg
      }
    }

    return nextErrors
  }

  const fetchLocations = useCallback(async () => {
    setLoading((prev) => ({ ...prev, locations: true, regions: true, zones: true }))
    setApiError(null)
    try {
      const locationsData = await locationsAPI.getAll()
      const transformedLocations = locationsData.map((loc) => ({
        id: loc._id,
        name: loc.location,
        regions: loc.regions || [],
      }))

      const transformedRegions = []
      const transformedZones = []

      locationsData.forEach((location) => {
        if (location.regions?.length > 0) {
          location.regions.forEach((region) => {
            transformedRegions.push({
              id: region._id,
              location: location.location,
              region: region.region,
              zones: region.zones || [],
            })

            if (region.zones?.length > 0) {
              region.zones.forEach((zone) => {
                transformedZones.push({
                  id: zone._id,
                  location: location.location,
                  region: region.region,
                  zone: zone.zone,
                })
              })
            }
          })
        }
      })

      setMasters({ locations: transformedLocations, regions: transformedRegions, zones: transformedZones })
    } catch (err) {
      console.error("Failed to fetch locations:", err)
      setApiError("Failed to load locations. Please try again.")
      toast.error("Failed to load locations")
    } finally {
      setLoading((prev) => ({ ...prev, locations: false, regions: false, zones: false }))
    }
  }, [])

  useEffect(() => {
    fetchLocations()
    // Only fetch mediators if they haven't been fetched yet
    if (!mediatorsFetched && !mediatorsLoading && !mediators.length) {
      fetchMediators()
    }
  }, [fetchLocations, fetchMediators, mediatorsFetched, mediatorsLoading, mediators.length])

  useEffect(() => {
    if (!data) return

    // hydrate from backend schema
    const firstCompetitor = Array.isArray(data.competitorAnalysis) ? data.competitorAnalysis[0] : null
    const firstChecklist = Array.isArray(data.checkListPage) ? data.checkListPage[0] : null

    setFormData((prev) => ({
      ...prev,
      ...data,
      leadStatus: data.lead_status || prev.leadStatus,
      lead_stage: data.lead_stage || prev.lead_stage,
      mediatorId: data.mediatorId || prev.mediatorId,

      // competitor
      competitorDeveloperName: firstCompetitor?.developerName || "",
      competitorProjectName: firstCompetitor?.projectName || "",
      competitorProductType: firstCompetitor?.productType || "",
      competitorLocation: firstCompetitor?.location || "",
      competitorPlotSize: firstCompetitor?.plotUnitSize || "",
      competitorLandExtent: firstCompetitor?.landExtent || "",
      competitorPriceRange: firstCompetitor?.priceRange || "",
      competitorApproxPrice: firstCompetitor?.approxPrice || "",
      competitorApproxPriceCent: firstCompetitor?.approxPriceCent || "",
      competitorTotalUnits: firstCompetitor?.totalPlotsUnits || "",
      competitorKeyAmenities: Array.isArray(firstCompetitor?.keyAmenities) ? firstCompetitor.keyAmenities.join(", ") : "",
      competitorUSP: firstCompetitor?.uspPositioning || "",

      // checklist
      checkLandLocation: firstChecklist?.landLocation || "",
      checkLandExtent: firstChecklist?.landExtent || "",
      checkLandZone: firstChecklist?.landZone || "",
      checkLandClassification: firstChecklist?.classificationOfLand || "",
      checkGooglePin: firstChecklist?.googlePin || "",
      checkApproachRoadWidth: firstChecklist?.approachRoadWidth || "",
      checkSoilType: firstChecklist?.soilType || "",
      checkSellingPrice: firstChecklist?.sellingPrice || "",
      checkGuidelineValue: firstChecklist?.guidelineValue || "",
      checkLocationSellingPrice: firstChecklist?.locationSellingPrice || "",
      checkMarketingPrice: firstChecklist?.marketingPrice || "",
      checkRoadWidth: firstChecklist?.roadWidth || "",
      checkTotalSaleableArea: firstChecklist?.totalSaleableArea || "",
      checkOwnerName: firstChecklist?.ownerName || "",
      checkConsultantName: firstChecklist?.consultantName || "",
      checkNotes: firstChecklist?.notes || "",
      checkProjects: firstChecklist?.projects || "",
      checkGoogleLocation: firstChecklist?.googleLocation || "",

      // checkbox strings -> booleans
      checkEBLine: (firstChecklist?.ebLine || "").toLowerCase() === "yes",
      checkQuarryCrusher: (firstChecklist?.quarryCrusher || "").toLowerCase() === "yes",
      checkGovtLandAcquisition: (firstChecklist?.govtLandAcquisition || "").toLowerCase() === "yes",
      checkRailwayTrackNOC: (firstChecklist?.railwayTrackNoc || "").toLowerCase() === "yes",
      checkBankIssues: (firstChecklist?.bankIssues || "").toLowerCase() === "yes",
      checkDumpyardQuarry: (firstChecklist?.dumpyardQuarryCheck || "").toLowerCase() === "yes",
      checkWaterbodyNearby: (firstChecklist?.waterbodyNearby || "").toLowerCase() === "yes",
      checkNearbyHTLine: (firstChecklist?.nearbyHtLine || "").toLowerCase() === "yes",
      checkTempleLand: (firstChecklist?.templeLand || "").toLowerCase() === "yes",
      checkFutureGovtProjects: (firstChecklist?.futureGovtProjects || "").toLowerCase() === "yes",
      checkFarmLand: (firstChecklist?.farmLand || "").toLowerCase() === "yes",
      checkLandCleaning: (firstChecklist?.landCleaning || "").toLowerCase() === "yes",
      checkSubDivision: (firstChecklist?.subDivision || "").toLowerCase() === "yes",
      checkSoilTest: (firstChecklist?.soilTest || "").toLowerCase() === "yes",
      checkWaterList: (firstChecklist?.waterList || "").toLowerCase() === "yes",
    }))
  }, [data])

  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }))
  const handleCheckboxChange = (key, checked) => setFormData((prev) => ({ ...prev, [key]: checked }))

  const handleFileChange = (key, file) => {
    setFormData((prev) => ({ ...prev, [key]: file || null }))
  }

  const handleLocationChange = (value) => {
    setFormData((prev) => ({ ...prev, location: value, zone: "", area: "" }))
  }

  const handleZoneChange = (value) => {
    setFormData((prev) => ({ ...prev, zone: value, area: "" }))
  }

  const getOptions = useCallback(
    (type) => {
      if (type === "location") return masters.locations.map((l) => ({ value: l.name, label: l.name }))
      if (type === "region") {
        if (!formData.location) return []
        return masters.regions.filter((r) => r.location === formData.location).map((r) => ({ value: r.region, label: r.region }))
      }
      if (type === "zone") {
        if (!formData.location || !formData.zone) return []
        return masters.zones
          .filter((z) => z.location === formData.location && z.region === formData.zone)
          .map((z) => ({ value: z.zone, label: z.zone }))
      }
      return []
    },
    [masters, formData.location, formData.zone],
  )

  const toLeadPayload = () => {
    const competitorAnalysis = [
      {
        developerName: formData.competitorDeveloperName || "",
        projectName: formData.competitorProjectName || "",
        productType: formData.competitorProductType || "",
        location: formData.competitorLocation || "",
        plotUnitSize: formData.competitorPlotSize || "",
        landExtent: formData.competitorLandExtent || "",
        priceRange: formData.competitorPriceRange || "",
        approxPrice: formData.competitorApproxPrice || "",
        approxPriceCent: formData.competitorApproxPriceCent || "",
        totalPlotsUnits: formData.competitorTotalUnits || "",
        keyAmenities: String(formData.competitorKeyAmenities || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        uspPositioning: formData.competitorUSP || "",
      },
    ]

    const checkListPage = [
      {
        landLocation: formData.checkLandLocation || "",
        landExtent: formData.checkLandExtent || "",
        landZone: formData.checkLandZone || "",
        classificationOfLand: formData.checkLandClassification || "",
        googlePin: formData.checkGooglePin || "",
        approachRoadWidth: formData.checkApproachRoadWidth || "",
        ebLine: yesNo(formData.checkEBLine),
        soilType: formData.checkSoilType || "",
        quarryCrusher: yesNo(formData.checkQuarryCrusher),
        sellingPrice: formData.checkSellingPrice || "",
        guidelineValue: formData.checkGuidelineValue || "",
        locationSellingPrice: formData.checkLocationSellingPrice || "",
        marketingPrice: formData.checkMarketingPrice || "",
        roadWidth: formData.checkRoadWidth || "",
        govtLandAcquisition: yesNo(formData.checkGovtLandAcquisition),
        railwayTrackNoc: yesNo(formData.checkRailwayTrackNOC),
        bankIssues: yesNo(formData.checkBankIssues),
        dumpyardQuarryCheck: yesNo(formData.checkDumpyardQuarry),
        waterbodyNearby: yesNo(formData.checkWaterbodyNearby),
        nearbyHtLine: yesNo(formData.checkNearbyHTLine),
        templeLand: yesNo(formData.checkTempleLand),
        futureGovtProjects: yesNo(formData.checkFutureGovtProjects),
        farmLand: yesNo(formData.checkFarmLand),
        totalSaleableArea: formData.checkTotalSaleableArea || "",
        landCleaning: yesNo(formData.checkLandCleaning),
        subDivision: yesNo(formData.checkSubDivision),
        soilTest: yesNo(formData.checkSoilTest),
        waterList: yesNo(formData.checkWaterList),
        ownerName: formData.checkOwnerName || "",
        consultantName: formData.checkConsultantName || "",
        notes: [formData.checkNotes, formData.checkRequests ? `Requests: ${formData.checkRequests}` : ""].filter(Boolean).join("\n"),
        projects: formData.checkProjects || "",
        googleLocation: formData.checkGoogleLocation || "",
      },
    ]

    return {
      // base schema fields
      leadType: formData.leadType,
      contactNumber: formData.contactNumber,
      mediatorName: formData.mediatorName,
      mediatorId: formData.mediatorId,
      date: formData.date,
      location: formData.location,
      zone: formData.zone,
      landName: formData.landName,
      sourceCategory: formData.sourceCategory,
      source: formData.source,
      extent: formData.extent,
      unit: formData.unit,
      propertyType: formData.propertyType,
      fsi: formData.fsi,
      asp: formData.asp,
      revenue: formData.revenue,
      transactionType: formData.transactionType,
      rate: formData.rate,
      builderShare: formData.builderShare,
      refundable: formData.refundable,
      nonRefundable: formData.nonRefundable,
      landmark: formData.landmark,
      frontage: formData.frontage,
      roadWidth: formData.roadWidth,
      sspde: formData.sspde,
      remark: formData.remark,
      lead_stage: formData.lead_stage,

      // backend field name
      lead_status: String(formData.leadStatus || "").toUpperCase(),

      // structured sections
      competitorAnalysis,
      checkListPage,
    }
  }

  const handleSubmit = async () => {
    setErrors({})
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error("Please fix the validation errors")
      return
    }

    setLoading((prev) => ({ ...prev, submit: true }))
    setApiError(null)

    try {
      const leadPayload = toLeadPayload()
      const files = {
        ...(formData.checkFMBSketch && formData.fileFMBSketch ? { fmb_sketch: formData.fileFMBSketch } : {}),
        ...(formData.checkPattaChitta && formData.filePattaChitta ? { patta_chitta: formData.filePattaChitta } : {}),
      }

      if (onSubmit) await onSubmit(leadPayload, files)
      toast.success(data ? "Lead updated successfully" : "Lead created successfully")
    } catch (error) {
      console.error("Submit error:", error)
      const errorMessage = error?.message || "Failed to submit lead. Please try again."
      setApiError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }))
    }
  }

  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
    </div>
  )

  const CheckboxTile = ({ label, checked, onChange }) => (
    <label
      className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${checked ? "bg-indigo-50 border-indigo-200 shadow-sm" : "bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50"}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
      />
      <span className={`text-sm font-medium ${checked ? "text-indigo-900" : "text-gray-600"}`}>{label}</span>
    </label>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onClose && (
              <Button variant="outline" size="icon" onClick={onClose} className="bg-white shadow-sm hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{data ? "Edit Lead" : "New Lead"}</h1>
              <p className="text-gray-500 text-sm mt-1">Fill in the details below to create a new property lead.</p>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setApiError(null)} className="text-red-600 hover:text-red-800 hover:bg-red-100">
              ×
            </Button>
          </div>
        )}

        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <div className="h-2 bg-indigo-500 w-full" />
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Basic Information</CardTitle>
            <CardDescription>Primary contact and property details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700">Lead Type</Label>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                {["mediator", "owner"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange("leadType", type)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                      formData.leadType === type ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={`bg-gray-50/50 ${errors.contactNumber ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.contactNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Mediator/Owner Name</Label>
              {formData.leadType === "mediator" ? (
                <Select 
                  value={formData.mediatorName} 
                  onValueChange={(value) => {
                    handleChange("mediatorName", value)
                    // Also set the mediator ID when a mediator is selected
                    const selectedMediator = mediators.find(m => m.name === value)
                    if (selectedMediator) {
                      handleChange("mediatorId", selectedMediator._id)
                    }
                  }}
                  disabled={mediatorsLoading}
                >
                  <SelectTrigger className={`bg-gray-50/50 ${errors.mediatorName ? "border-red-500 focus:border-red-500" : ""}`}>
                    {mediatorsLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <SelectValue placeholder="Loading mediators..." />
                      </div>
                    ) : (
                      <SelectValue placeholder="Select mediator" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-xl border-gray-200">
                    {mediators.map((mediator) => (
                      <SelectItem key={mediator._id} value={mediator.name}>
                        {mediator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.mediatorName}
                  onChange={(e) => handleChange("mediatorName", e.target.value)}
                  placeholder="Enter owner name"
                  className={`bg-gray-50/50 ${errors.mediatorName ? "border-red-500 focus:border-red-500" : ""}`}
                />
              )}
              {errors.mediatorName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.mediatorName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Mediator ID (optional)</Label>
              <Input value={formData.mediatorId} onChange={(e) => handleChange("mediatorId", e.target.value)} className="bg-gray-50/50" />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date ? String(formData.date).slice(0, 10) : ""}
                onChange={(e) => handleChange("date", e.target.value)}
                className={`bg-gray-50/50 ${errors.date ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.date}
                </p>
              )}
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <Label className="text-indigo-900 font-semibold">Location</Label>
                <Select value={formData.location} onValueChange={handleLocationChange} disabled={loading.locations}>
                  <SelectTrigger className={`bg-white ${errors.location ? "border-red-500 focus:border-red-500" : ""}`}>
                    {loading.locations ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <SelectValue placeholder="Loading locations..." />
                      </div>
                    ) : (
                      <SelectValue placeholder="Select location" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-xl border-gray-200">
                    {getOptions("location").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900 font-semibold">Zone</Label>
                <Select value={formData.zone} onValueChange={handleZoneChange} disabled={!formData.location || loading.regions}>
                  <SelectTrigger className={`bg-white ${errors.zone ? "border-red-500 focus:border-red-500" : ""}`}>
                    {loading.regions ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <SelectValue placeholder="Loading zones..." />
                      </div>
                    ) : (
                      <SelectValue placeholder="Select zone" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-xl border-gray-200">
                    {getOptions("region").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-900 font-semibold">Area</Label>
                <Select value={formData.area} onValueChange={(val) => handleChange("area", val)} disabled={!formData.zone || loading.zones}>
                  <SelectTrigger className={`bg-white ${errors.area ? "border-red-500 focus:border-red-500" : ""}`}>
                    {loading.zones ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <SelectValue placeholder="Loading areas..." />
                      </div>
                    ) : (
                      <SelectValue placeholder="Select area" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-xl border-gray-200">
                    {getOptions("zone").map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Land Name</Label>
              <Input value={formData.landName} onChange={(e) => handleChange("landName", e.target.value)} className={errors.landName ? "border-red-500 focus:border-red-500" : ""} />
            </div>

            <div className="space-y-2">
              <Label>Source Category</Label>
              <Select value={formData.sourceCategory} onValueChange={(v) => handleChange("sourceCategory", v)}>
                <SelectTrigger className={errors.sourceCategory ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-lg">
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="reference">Reference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lead Stage</Label>
              <Select value={formData.lead_stage} onValueChange={(v) => handleChange("lead_stage", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-lg">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="management_hot">Management Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={formData.source} onValueChange={(v) => handleChange("source", v)}>
                <SelectTrigger className={errors.source ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-lg">
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Extent</Label>
                <Input value={formData.extent} onChange={(e) => handleChange("extent", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={formData.unit} onValueChange={(v) => handleChange("unit", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg">
                    <SelectItem value="Acre">Acre</SelectItem>
                    <SelectItem value="Sqft">Sqft</SelectItem>
                    <SelectItem value="Ground">Ground</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(v) => handleChange("propertyType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-lg">
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="space-y-2">
                <Label>FSI</Label>
                <Input value={formData.fsi} onChange={(e) => handleChange("fsi", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ASP</Label>
                <Input value={formData.asp} onChange={(e) => handleChange("asp", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Total Revenue</Label>
                <Input value={formData.revenue} onChange={(e) => handleChange("revenue", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Rate</Label>
                <Input value={formData.rate} onChange={(e) => handleChange("rate", e.target.value)} />
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select value={formData.transactionType} onValueChange={(v) => handleChange("transactionType", v)}>
                  <SelectTrigger className="bg-indigo-50/50 border-indigo-100">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg">
                    <SelectItem value="JV">JV</SelectItem>
                    <SelectItem value="Sale">Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Builder Share (%)</Label>
                <Input value={formData.builderShare} onChange={(e) => handleChange("builderShare", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Refundable Deposit</Label>
                <Input value={formData.refundable} onChange={(e) => handleChange("refundable", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Non-Refundable Deposit</Label>
                <Input value={formData.nonRefundable} onChange={(e) => handleChange("nonRefundable", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Landmark</Label>
              <Input value={formData.landmark} onChange={(e) => handleChange("landmark", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Frontage</Label>
              <Input value={formData.frontage} onChange={(e) => handleChange("frontage", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Road Width</Label>
              <Input value={formData.roadWidth} onChange={(e) => handleChange("roadWidth", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>SSPDE</Label>
              <Select value={formData.sspde} onValueChange={(v) => handleChange("sspde", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 shadow-lg">
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>yield (%)</Label>
              <Input value={formData.yield} onChange={(e) => handleChange("yield", e.target.value)} />
            </div>

            {/* <div className="md:col-span-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"> */}
              <div className="space-y-2">
                <Label className="text-yellow-800">Lead Status</Label>
                <Select value={formData.leadStatus} onValueChange={(v) => handleChange("leadStatus", v)}>
                  <SelectTrigger className="bg-white border-yellow-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-lg">
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
            {/* </div> */}

            <div className="md:col-span-3 space-y-2">
              <Label>Remark</Label>
              <Textarea value={formData.remark} onChange={(e) => handleChange("remark", e.target.value)} rows={3} placeholder="Add any additional context here..." className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

    

        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Developer Name</Label>
              <Input value={formData.competitorDeveloperName} onChange={(e) => handleChange("competitorDeveloperName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input value={formData.competitorProjectName} onChange={(e) => handleChange("competitorProjectName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Input value={formData.competitorProductType} onChange={(e) => handleChange("competitorProductType", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.competitorLocation} onChange={(e) => handleChange("competitorLocation", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Plot / Unit Size</Label>
              <Input value={formData.competitorPlotSize} onChange={(e) => handleChange("competitorPlotSize", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Land Extent</Label>
              <Input value={formData.competitorLandExtent} onChange={(e) => handleChange("competitorLandExtent", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Input value={formData.competitorPriceRange} onChange={(e) => handleChange("competitorPriceRange", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Approx Price</Label>
              <Input value={formData.competitorApproxPrice} onChange={(e) => handleChange("competitorApproxPrice", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Approx Price Cent</Label>
              <Input value={formData.competitorApproxPriceCent} onChange={(e) => handleChange("competitorApproxPriceCent", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Total Plots / Units</Label>
              <Input value={formData.competitorTotalUnits} onChange={(e) => handleChange("competitorTotalUnits", e.target.value)} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Key Amenities (comma separated)</Label>
              <Input value={formData.competitorKeyAmenities} onChange={(e) => handleChange("competitorKeyAmenities", e.target.value)} />
            </div>
            <div className="md:col-span-3 space-y-2">
              <Label>USP / Positioning</Label>
              <Textarea value={formData.competitorUSP} onChange={(e) => handleChange("competitorUSP", e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <CheckCircle2 className="text-green-600" />
              Site Visit Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div>
              <SectionHeader title="Land Details" icon={FileText} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label>Land Location</Label>
                  <Input value={formData.checkLandLocation} onChange={(e) => handleChange("checkLandLocation", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Land Extent</Label>
                  <Input value={formData.checkLandExtent} onChange={(e) => handleChange("checkLandExtent", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Land Zone</Label>
                  <Input value={formData.checkLandZone} onChange={(e) => handleChange("checkLandZone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Classification of Land</Label>
                  <Input value={formData.checkLandClassification} onChange={(e) => handleChange("checkLandClassification", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Google Pin</Label>
                  <Input value={formData.checkGooglePin} onChange={(e) => handleChange("checkGooglePin", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Approach Road Width</Label>
                  <Input value={formData.checkApproachRoadWidth} onChange={(e) => handleChange("checkApproachRoadWidth", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Road Width</Label>
                  <Input value={formData.checkRoadWidth} onChange={(e) => handleChange("checkRoadWidth", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Soil Type</Label>
                  <Input value={formData.checkSoilType} onChange={(e) => handleChange("checkSoilType", e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <SectionHeader title="Valuation & Pricing" icon={FileText} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label>Selling Price</Label>
                  <Input value={formData.checkSellingPrice} onChange={(e) => handleChange("checkSellingPrice", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Guideline Value</Label>
                  <Input value={formData.checkGuidelineValue} onChange={(e) => handleChange("checkGuidelineValue", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Location Selling Price</Label>
                  <Input value={formData.checkLocationSellingPrice} onChange={(e) => handleChange("checkLocationSellingPrice", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Marketing Price</Label>
                  <Input value={formData.checkMarketingPrice} onChange={(e) => handleChange("checkMarketingPrice", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Total Saleable Area</Label>
                  <Input value={formData.checkTotalSaleableArea} onChange={(e) => handleChange("checkTotalSaleableArea", e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <SectionHeader title="Features & Constraints" icon={CheckCircle2} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CheckboxTile label="EB Line" checked={formData.checkEBLine} onChange={(c) => handleCheckboxChange("checkEBLine", c)} />
                <CheckboxTile label="Quarry / Crusher" checked={formData.checkQuarryCrusher} onChange={(c) => handleCheckboxChange("checkQuarryCrusher", c)} />
                <CheckboxTile label="Govt. Land Acquisition" checked={formData.checkGovtLandAcquisition} onChange={(c) => handleCheckboxChange("checkGovtLandAcquisition", c)} />
                <CheckboxTile label="Railway Track NOC" checked={formData.checkRailwayTrackNOC} onChange={(c) => handleCheckboxChange("checkRailwayTrackNOC", c)} />
                <CheckboxTile label="Bank Issues" checked={formData.checkBankIssues} onChange={(c) => handleCheckboxChange("checkBankIssues", c)} />
                <CheckboxTile label="Dumpyard / Quarry" checked={formData.checkDumpyardQuarry} onChange={(c) => handleCheckboxChange("checkDumpyardQuarry", c)} />
                <CheckboxTile label="Waterbody Nearby" checked={formData.checkWaterbodyNearby} onChange={(c) => handleCheckboxChange("checkWaterbodyNearby", c)} />
                <CheckboxTile label="Nearby HT Line" checked={formData.checkNearbyHTLine} onChange={(c) => handleCheckboxChange("checkNearbyHTLine", c)} />
                <CheckboxTile label="Temple Land" checked={formData.checkTempleLand} onChange={(c) => handleCheckboxChange("checkTempleLand", c)} />
                <CheckboxTile label="Future Govt Projects" checked={formData.checkFutureGovtProjects} onChange={(c) => handleCheckboxChange("checkFutureGovtProjects", c)} />
                <CheckboxTile label="Farm Land" checked={formData.checkFarmLand} onChange={(c) => handleCheckboxChange("checkFarmLand", c)} />
                <CheckboxTile label="Land Cleaning" checked={formData.checkLandCleaning} onChange={(c) => handleCheckboxChange("checkLandCleaning", c)} />
                <CheckboxTile label="Sub Division" checked={formData.checkSubDivision} onChange={(c) => handleCheckboxChange("checkSubDivision", c)} />
                <CheckboxTile label="Soil Test" checked={formData.checkSoilTest} onChange={(c) => handleCheckboxChange("checkSoilTest", c)} />
                <CheckboxTile label="Water List" checked={formData.checkWaterList} onChange={(c) => handleCheckboxChange("checkWaterList", c)} />
              </div>
            </div>

            <div>
              <SectionHeader title="Documents" icon={Upload} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${formData.checkFMBSketch ? "border-indigo-400 bg-indigo-50/30" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <input type="checkbox" checked={formData.checkFMBSketch} onChange={(e) => handleCheckboxChange("checkFMBSketch", e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                    <span className="font-semibold text-gray-700">FMB Sketch Available</span>
                  </div>
                  {formData.checkFMBSketch && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Upload File (JPG/PNG, ≤2MB)</Label>
                      <Input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChange("fileFMBSketch", e.target.files?.[0])} className={`bg-white ${errors.fileFMBSketch ? "border-red-500 focus:border-red-500" : ""}`} />
                      {errors.fileFMBSketch && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.fileFMBSketch}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${formData.checkPattaChitta ? "border-indigo-400 bg-indigo-50/30" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <input type="checkbox" checked={formData.checkPattaChitta} onChange={(e) => handleCheckboxChange("checkPattaChitta", e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                    <span className="font-semibold text-gray-700">Patta / Chitta Available</span>
                  </div>
                  {formData.checkPattaChitta && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Upload File (JPG/PNG, ≤2MB)</Label>
                      <Input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChange("filePattaChitta", e.target.files?.[0])} className={`bg-white ${errors.filePattaChitta ? "border-red-500 focus:border-red-500" : ""}`} />
                      {errors.filePattaChitta && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.filePattaChitta}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <SectionHeader title="Additional Details" icon={FileText} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <Input value={formData.checkOwnerName} onChange={(e) => handleChange("checkOwnerName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Consultant Name</Label>
                  <Input value={formData.checkConsultantName} onChange={(e) => handleChange("checkConsultantName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Projects</Label>
                  <Input value={formData.checkProjects} onChange={(e) => handleChange("checkProjects", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Google Location</Label>
                  <Input value={formData.checkGoogleLocation} onChange={(e) => handleChange("checkGoogleLocation", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={formData.checkNotes} onChange={(e) => handleChange("checkNotes", e.target.value)} placeholder="Enter additional notes" rows={3} className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Requests</Label>
                  <Textarea value={formData.checkRequests} onChange={(e) => handleChange("checkRequests", e.target.value)} placeholder="Enter any special requests" rows={3} className="bg-gray-50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-8">
          <Button variant="outline" size="lg" onClick={onClose} className="bg-white border-gray-300" disabled={loading.submit}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg" disabled={loading.submit}>
            {loading.submit ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {data ? "Updating..." : "Submitting..."}
              </div>
            ) : (
              <>{data ? "Update Lead" : "Submit Lead"}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}