import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { locationsAPI, leadsAPI } from "@/services/api"
import { ChevronLeft, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
 
export default function Leads({ data = null, onSubmit, onClose }) {
  // --- 1. State Management (Logic remains unchanged) ---
  const [formData, setFormData] = useState({
    // Basic Lead Information
    leadType: "mediator",
    contactNumber: "",
    mediatorName: "",
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
 
    // Yield Calculation
    yieldSaleable: "",
    yieldCommon: "",
    yieldTotal: "",
    yieldEfficiency: "",
 
    // Competitor Analysis
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
 
    // Check List Page
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
 
  // Validation schema
  const validateForm = (data) => {
    const errors = {}
 
    // Required fields validation
    if (!data.contactNumber?.trim()) {
      errors.contactNumber = 'Contact number is required'
    } else if (!/^[+]?[0-9]{10,15}$/.test(data.contactNumber.replace(/\s/g, ''))) {
      errors.contactNumber = 'Invalid contact number format'
    }
 
    if (!data.mediatorName?.trim()) {
      errors.mediatorName = 'Mediator/Owner name is required'
    }
 
    if (!data.date) {
      errors.date = 'Date is required'
    }
 
    if (!data.location) {
      errors.location = 'Location is required'
    }
 
    if (!data.landName?.trim()) {
      errors.landName = 'Land name is required'
    }
 
    if (!data.sourceCategory) {
      errors.sourceCategory = 'Source category is required'
    }
 
    if (!data.source) {
      errors.source = 'Source is required'
    }
 
    // Numeric validation
    if (data.extent && isNaN(parseFloat(data.extent))) {
      errors.extent = 'Extent must be a number'
    }
 
    if (data.fsi && isNaN(parseFloat(data.fsi))) {
      errors.fsi = 'FSI must be a number'
    }
 
    if (data.asp && isNaN(parseFloat(data.asp))) {
      errors.asp = 'ASP must be a number'
    }
 
    if (data.revenue && isNaN(parseFloat(data.revenue))) {
      errors.revenue = 'Revenue must be a number'
    }
 
    if (data.rate && isNaN(parseFloat(data.rate))) {
      errors.rate = 'Rate must be a number'
    }
 
    if (data.builderShare && isNaN(parseFloat(data.builderShare))) {
      errors.builderShare = 'Builder share must be a number'
    }
 
    // File validation
    if (data.checkFMBSketch && !data.fileFMBSketch) {
      errors.fileFMBSketch = 'FMB Sketch file is required when checkbox is checked'
    }
 
    if (data.checkPattaChitta && !data.filePattaChitta) {
      errors.filePattaChitta = 'Patta/Chitta file is required when checkbox is checked'
    }
 
    return errors
  }
 
  // Location Logic
  const [masters, setMasters] = useState({
    locations: [],
    regions: [],
    zones: [],
  })
  const [loading, setLoading] = useState({ locations: false, regions: false, zones: false, submit: false })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
 
  const fetchLocations = useCallback(async () => {
    setLoading(prev => ({ ...prev, locations: true, regions: true, zones: true }));
    setApiError(null);
    try {
      const locationsData = await locationsAPI.getAll();
      const transformedLocations = locationsData.map(loc => ({
        id: loc._id,
        name: loc.location,
        regions: loc.regions || []
      }));
 
      const transformedRegions = [];
      const transformedZones = [];
 
      locationsData.forEach(location => {
        if (location.regions?.length > 0) {
          location.regions.forEach(region => {
            transformedRegions.push({
              id: region._id,
              location: location.location,
              region: region.region,
              zones: region.zones || []
            });
 
            if (region.zones?.length > 0) {
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
 
      setMasters({
        locations: transformedLocations,
        regions: transformedRegions,
        zones: transformedZones
      });
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setApiError('Failed to load locations. Please try again.');
      toast.error('Failed to load locations');
    } finally {
      setLoading(prev => ({ ...prev, locations: false, regions: false, zones: false }));
    }
  }, []);
 
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);
 
  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }))
    }
  }, [data])
 
  // Handlers
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }
 
  const handleCheckboxChange = (key, checked) => {
    setFormData(prev => ({ ...prev, [key]: checked }))
  }
 
  const handleFileChange = (key, file) => {
    // File validation
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
 
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [key]: 'File size must be less than 5MB' }));
        toast.error('File size must be less than 5MB');
        return;
      }
 
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [key]: 'Invalid file type. Only images, PDF and Word documents are allowed' }));
        toast.error('Invalid file type');
        return;
      }
 
      // Clear error for this field if validation passes
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
 
    setFormData(prev => ({ ...prev, [key]: file }))
  }
 
  const handleLocationChange = (value) => {
    setFormData(prev => ({ ...prev, location: value, zone: '', area: '' }));
  };
 
  const handleZoneChange = (value) => {
    setFormData(prev => ({ ...prev, zone: value, area: '' }));
  };
 
  const getOptions = useCallback((type) => {
    if (type === 'location') return masters.locations.map(l => ({ value: l.name, label: l.name }));
    if (type === 'region') {
      if (formData.location) {
        return masters.regions
          .filter(r => r.location === formData.location)
          .map(r => ({ value: r.region, label: r.region }));
      }
      return [];
    }
    if (type === 'zone') {
      if (formData.location && formData.zone) {
        return masters.zones
          .filter(z => z.location === formData.location && z.region === formData.zone)
          .map(z => ({ value: z.zone, label: z.zone }));
      }
      return [];
    }
    return [];
  }, [masters, formData.location, formData.zone]);
 
  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});
 
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
 
    setLoading(prev => ({ ...prev, submit: true }));
    setApiError(null);
 
    try {
      if (data) {
        await leadsAPI.update(data._id, formData);
        toast.success('Lead updated successfully');
      } else {
        await leadsAPI.create(formData);
        toast.success('Lead created successfully');
      }
 
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.message || 'Failed to submit lead. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  }
 
  // Helper component for Consistent Section Headings
  const SectionHeader = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
    </div>
  )
 
  // Helper component for Checkbox Tiles
  const CheckboxTile = ({ label, checked, onChange }) => (
    <label
      className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${checked
          ? 'bg-indigo-50 border-indigo-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
        }
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
      />
      <span className={`text-sm font-medium ${checked ? 'text-indigo-900' : 'text-gray-600'}`}>
        {label}
      </span>
    </label>
  )
 
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onClose && (
              <Button variant="outline" size="icon" onClick={onClose} className="bg-white shadow-sm hover:bg-gray-100">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>
            )}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {data ? "Edit Lead" : "New Lead"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Fill in the details below to create a new property lead.</p>
            </div>
          </div>
        </div>
 
        {/* API Error Alert */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setApiError(null)}
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              ×
            </Button>
          </div>
        )}
 
        {/* --- Section 1: Basic Lead Information --- */}
        <Card className="border-0 shadow-md bg-white overflow-hidden">
            <div className="h-2 bg-indigo-500 w-full" /> {/* Accent Bar */}
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Basic Information</CardTitle>
            <CardDescription>Primary contact and property details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700">Lead Type</Label>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                {['mediator', 'owner'].map((type) => (
                    <button
                        key={type}
                        onClick={() => handleChange("leadType", type)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                            formData.leadType === type
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
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
                onChange={e => handleChange("contactNumber", e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={`bg-gray-50/50 ${errors.contactNumber ? 'border-red-500 focus:border-red-500' : ''}`}
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
              <Input
                value={formData.mediatorName}
                onChange={e => handleChange("mediatorName", e.target.value)}
                className={`bg-gray-50/50 ${errors.mediatorName ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.mediatorName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.mediatorName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={e => handleChange("date", e.target.value)}
                className={`bg-gray-50/50 ${errors.date ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.date}
                </p>
              )}
            </div>
 
            {/* Location Group */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-2">
                    <Label className="text-indigo-900 font-semibold">Location</Label>
                    <Select value={formData.location} onValueChange={handleLocationChange} disabled={loading.locations}>
                    <SelectTrigger className={`bg-white ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}>
                      {loading.locations ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <SelectValue placeholder="Loading locations..." />
                        </div>
                      ) : (
                        <SelectValue placeholder="Select location" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[50] shadow-xl border-gray-200">
                        {getOptions('location').map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
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
                    <SelectTrigger className={`bg-white ${errors.zone ? 'border-red-500 focus:border-red-500' : ''}`}>
                      {loading.regions ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <SelectValue placeholder="Loading zones..." />
                        </div>
                      ) : (
                        <SelectValue placeholder="Select zone" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[50] shadow-xl border-gray-200">
                        {getOptions('region').map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                    </SelectContent>
                    </Select>
                    {errors.zone && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.zone}
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label className="text-indigo-900 font-semibold">Area</Label>
                    <Select value={formData.area} onValueChange={(val) => handleChange('area', val)} disabled={!formData.zone || loading.zones}>
                    <SelectTrigger className={`bg-white ${errors.area ? 'border-red-500 focus:border-red-500' : ''}`}>
                      {loading.zones ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <SelectValue placeholder="Loading areas..." />
                        </div>
                      ) : (
                        <SelectValue placeholder="Select area" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[50] shadow-xl border-gray-200">
                        {getOptions('zone').map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                    </SelectContent>
                    </Select>
                    {errors.area && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.area}
                      </p>
                    )}
                </div>
            </div>
 
            <div className="space-y-2">
              <Label>Land Name</Label>
              <Input
                value={formData.landName}
                onChange={e => handleChange("landName", e.target.value)}
                className={errors.landName ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.landName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.landName}
                </p>
              )}
            </div>
 
            <div className="space-y-2">
              <Label>Source Category</Label>
              <Select value={formData.sourceCategory} onValueChange={(v) => handleChange("sourceCategory", v)}>
                <SelectTrigger className={errors.sourceCategory ? 'border-red-500 focus:border-red-500' : ''}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[50] shadow-lg">
                    <SelectItem value="online">Online</SelectItem><SelectItem value="reference">Reference</SelectItem>
                </SelectContent>
              </Select>
              {errors.sourceCategory && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.sourceCategory}
                </p>
              )}
            </div>
 
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={formData.source} onValueChange={(v) => handleChange("source", v)}>
                <SelectTrigger className={errors.source ? 'border-red-500 focus:border-red-500' : ''}>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[50] shadow-lg">
                    <SelectItem value="facebook">Facebook</SelectItem><SelectItem value="google">Google</SelectItem><SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.source}
                </p>
              )}
            </div>
 
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Extent</Label>
                  <Input
                    value={formData.extent}
                    onChange={e => handleChange("extent", e.target.value)}
                    className={errors.extent ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.extent && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.extent}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={formData.unit} onValueChange={(v) => handleChange("unit", v)}>
                        <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                        <SelectContent className="bg-white z-[50] shadow-lg">
                            <SelectItem value="Acre">Acre</SelectItem><SelectItem value="Sqft">Sqft</SelectItem><SelectItem value="Ground">Ground</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
 
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={formData.propertyType} onValueChange={(v) => handleChange("propertyType", v)}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent className="bg-white z-[50] shadow-lg">
                    <SelectItem value="residential">Residential</SelectItem><SelectItem value="commercial">Commercial</SelectItem><SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
 
            {/* Financials Group */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>FSI</Label>
                  <Input
                    value={formData.fsi}
                    onChange={e => handleChange("fsi", e.target.value)}
                    className={errors.fsi ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.fsi && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.fsi}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>ASP</Label>
                  <Input
                    value={formData.asp}
                    onChange={e => handleChange("asp", e.target.value)}
                    className={errors.asp ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.asp && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.asp}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Total Revenue</Label>
                  <Input
                    value={formData.revenue}
                    onChange={e => handleChange("revenue", e.target.value)}
                    className={errors.revenue ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.revenue && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.revenue}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Rate</Label>
                  <Input
                    value={formData.rate}
                    onChange={e => handleChange("rate", e.target.value)}
                    className={errors.rate ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.rate && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.rate}
                    </p>
                  )}
                </div>
            </div>
 
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select value={formData.transactionType} onValueChange={(v) => handleChange("transactionType", v)}>
                        <SelectTrigger className="bg-indigo-50/50 border-indigo-100"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-white z-[50] shadow-lg"><SelectItem value="JV">JV</SelectItem><SelectItem value="Sale">Sale</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Builder Share (%)</Label>
                    <Input
                      value={formData.builderShare}
                      onChange={e => handleChange("builderShare", e.target.value)}
                      className={errors.builderShare ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    {errors.builderShare && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.builderShare}
                      </p>
                    )}
                </div>
                <div className="space-y-2"><Label>Refundable Deposit</Label><Input value={formData.refundable} onChange={e => handleChange("refundable", e.target.value)} /></div>
                <div className="space-y-2"><Label>Non-Refundable Deposit</Label><Input value={formData.nonRefundable} onChange={e => handleChange("nonRefundable", e.target.value)} /></div>
            </div>
 
            <div className="space-y-2"><Label>Landmark</Label><Input value={formData.landmark} onChange={e => handleChange("landmark", e.target.value)} /></div>
            <div className="space-y-2"><Label>Frontage</Label><Input value={formData.frontage} onChange={e => handleChange("frontage", e.target.value)} /></div>
            <div className="space-y-2"><Label>Road Width</Label><Input value={formData.roadWidth} onChange={e => handleChange("roadWidth", e.target.value)} /></div>
            <div className="space-y-2">
              <Label>SSPDE</Label>
              <Select value={formData.sspde} onValueChange={(v) => handleChange("sspde", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white z-[50] shadow-lg"><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
              </Select>
            </div>
 
            <div className="md:col-span-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="space-y-2">
                    <Label className="text-yellow-800">Lead Status</Label>
                    <Select value={formData.leadStatus} onValueChange={(v) => handleChange("leadStatus", v)}>
                        <SelectTrigger className="bg-white border-yellow-300"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white z-[50] shadow-lg">
                            <SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem><SelectItem value="Lost">Lost</SelectItem><SelectItem value="Won">Won</SelectItem><SelectItem value="Purchased">Purchased</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
 
            <div className="md:col-span-3 space-y-2">
                <Label>Remark</Label>
                <Textarea value={formData.remark} onChange={e => handleChange("remark", e.target.value)} rows={3} placeholder="Add any additional context here..." className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>
 
        {/* --- Section 2: Yield Calculation --- */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Yield Calculation</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>Saleable Area (sq ft)</Label><Input value={formData.yieldSaleable} onChange={e => handleChange("yieldSaleable", e.target.value)} /></div>
            <div className="space-y-2"><Label>Common Area (sq ft)</Label><Input value={formData.yieldCommon} onChange={e => handleChange("yieldCommon", e.target.value)} /></div>
            <div className="space-y-2"><Label>Total Built-up Area (sq ft)</Label><Input value={formData.yieldTotal} onChange={e => handleChange("yieldTotal", e.target.value)} /></div>
            <div className="space-y-2"><Label>Efficiency (%)</Label><Input value={formData.yieldEfficiency} onChange={e => handleChange("yieldEfficiency", e.target.value)} /></div>
          </CardContent>
        </Card>
 
        {/* --- Section 3: Competitor Analysis --- */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Developer Name</Label><Input value={formData.competitorDeveloperName} onChange={e => handleChange("competitorDeveloperName", e.target.value)} /></div>
            <div className="space-y-2"><Label>Project Name</Label><Input value={formData.competitorProjectName} onChange={e => handleChange("competitorProjectName", e.target.value)} /></div>
            <div className="space-y-2"><Label>Product Type</Label><Input value={formData.competitorProductType} onChange={e => handleChange("competitorProductType", e.target.value)} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={formData.competitorLocation} onChange={e => handleChange("competitorLocation", e.target.value)} /></div>
            <div className="space-y-2"><Label>Plot / Unit Size</Label><Input value={formData.competitorPlotSize} onChange={e => handleChange("competitorPlotSize", e.target.value)} /></div>
            <div className="space-y-2"><Label>Land Extent</Label><Input value={formData.competitorLandExtent} onChange={e => handleChange("competitorLandExtent", e.target.value)} /></div>
            <div className="space-y-2"><Label>Price Range</Label><Input value={formData.competitorPriceRange} onChange={e => handleChange("competitorPriceRange", e.target.value)} /></div>
            <div className="space-y-2"><Label>Approx Price</Label><Input value={formData.competitorApproxPrice} onChange={e => handleChange("competitorApproxPrice", e.target.value)} /></div>
            <div className="space-y-2"><Label>Approx Price Cent</Label><Input value={formData.competitorApproxPriceCent} onChange={e => handleChange("competitorApproxPriceCent", e.target.value)} /></div>
            <div className="space-y-2"><Label>Total Plots / Units</Label><Input value={formData.competitorTotalUnits} onChange={e => handleChange("competitorTotalUnits", e.target.value)} /></div>
            <div className="md:col-span-2 space-y-2"><Label>Key Amenities</Label><Input value={formData.competitorKeyAmenities} onChange={e => handleChange("competitorKeyAmenities", e.target.value)} /></div>
            <div className="md:col-span-3 space-y-2"><Label>USP / Positioning</Label><Textarea value={formData.competitorUSP} onChange={e => handleChange("competitorUSP", e.target.value)} rows={2} /></div>
          </CardContent>
        </Card>
 
        {/* --- Section 4: Site Visit Checklist --- */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                <CheckCircle2 className="text-green-600" />
                Site Visit Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
 
            {/* Group 1: Land Details */}
            <div>
                <SectionHeader title="Land Details" icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2"><Label>Land Location</Label><Input value={formData.checkLandLocation} onChange={e => handleChange("checkLandLocation", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Land Extent</Label><Input value={formData.checkLandExtent} onChange={e => handleChange("checkLandExtent", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Land Zone</Label><Input value={formData.checkLandZone} onChange={e => handleChange("checkLandZone", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Classification of Land</Label><Input value={formData.checkLandClassification} onChange={e => handleChange("checkLandClassification", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Google Pin</Label><Input value={formData.checkGooglePin} onChange={e => handleChange("checkGooglePin", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Approach Road Width</Label><Input value={formData.checkApproachRoadWidth} onChange={e => handleChange("checkApproachRoadWidth", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Road Width</Label><Input value={formData.checkRoadWidth} onChange={e => handleChange("checkRoadWidth", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Soil Type</Label><Input value={formData.checkSoilType} onChange={e => handleChange("checkSoilType", e.target.value)} /></div>
                </div>
            </div>
 
            {/* Group 2: Pricing */}
            <div>
                <SectionHeader title="Valuation & Pricing" icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-2"><Label>Selling Price</Label><Input value={formData.checkSellingPrice} onChange={e => handleChange("checkSellingPrice", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Guideline Value</Label><Input value={formData.checkGuidelineValue} onChange={e => handleChange("checkGuidelineValue", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Location Selling Price</Label><Input value={formData.checkLocationSellingPrice} onChange={e => handleChange("checkLocationSellingPrice", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Marketing Price</Label><Input value={formData.checkMarketingPrice} onChange={e => handleChange("checkMarketingPrice", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Total Saleable Area</Label><Input value={formData.checkTotalSaleableArea} onChange={e => handleChange("checkTotalSaleableArea", e.target.value)} /></div>
                </div>
            </div>
 
            {/* Group 3: Features Checklist */}
            <div>
                <SectionHeader title="Features & Constraints" icon={CheckCircle2} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CheckboxTile label="EB Line" checked={formData.checkEBLine} onChange={c => handleCheckboxChange("checkEBLine", c)} />
                    <CheckboxTile label="Quarry / Crusher" checked={formData.checkQuarryCrusher} onChange={c => handleCheckboxChange("checkQuarryCrusher", c)} />
                    <CheckboxTile label="Govt. Land Acquisition" checked={formData.checkGovtLandAcquisition} onChange={c => handleCheckboxChange("checkGovtLandAcquisition", c)} />
                    <CheckboxTile label="Railway Track NOC" checked={formData.checkRailwayTrackNOC} onChange={c => handleCheckboxChange("checkRailwayTrackNOC", c)} />
                    <CheckboxTile label="Bank Issues" checked={formData.checkBankIssues} onChange={c => handleCheckboxChange("checkBankIssues", c)} />
                    <CheckboxTile label="Dumpyard / Quarry" checked={formData.checkDumpyardQuarry} onChange={c => handleCheckboxChange("checkDumpyardQuarry", c)} />
                    <CheckboxTile label="Waterbody Nearby" checked={formData.checkWaterbodyNearby} onChange={c => handleCheckboxChange("checkWaterbodyNearby", c)} />
                    <CheckboxTile label="Nearby HT Line" checked={formData.checkNearbyHTLine} onChange={c => handleCheckboxChange("checkNearbyHTLine", c)} />
                    <CheckboxTile label="Temple Land" checked={formData.checkTempleLand} onChange={c => handleCheckboxChange("checkTempleLand", c)} />
                    <CheckboxTile label="Future Govt Projects" checked={formData.checkFutureGovtProjects} onChange={c => handleCheckboxChange("checkFutureGovtProjects", c)} />
                    <CheckboxTile label="Farm Land" checked={formData.checkFarmLand} onChange={c => handleCheckboxChange("checkFarmLand", c)} />
                    <CheckboxTile label="Land Cleaning" checked={formData.checkLandCleaning} onChange={c => handleCheckboxChange("checkLandCleaning", c)} />
                    <CheckboxTile label="Sub Division" checked={formData.checkSubDivision} onChange={c => handleCheckboxChange("checkSubDivision", c)} />
                    <CheckboxTile label="Soil Test" checked={formData.checkSoilTest} onChange={c => handleCheckboxChange("checkSoilTest", c)} />
                    <CheckboxTile label="Water List" checked={formData.checkWaterList} onChange={c => handleCheckboxChange("checkWaterList", c)} />
                </div>
            </div>
 
            {/* Group 4: Documents Upload */}
            <div>
                <SectionHeader title="Documents" icon={Upload} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* FMB Sketch */}
                    <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${formData.checkFMBSketch ? 'border-indigo-400 bg-indigo-50/30' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center gap-3 mb-3">
                             <input type="checkbox" checked={formData.checkFMBSketch} onChange={e => handleCheckboxChange("checkFMBSketch", e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                             <span className="font-semibold text-gray-700">FMB Sketch Available</span>
                        </div>
                        {formData.checkFMBSketch && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Upload File</Label>
                                <Input
                                  type="file"
                                  onChange={(e) => handleFileChange('fileFMBSketch', e.target.files[0])}
                                  className={`bg-white ${errors.fileFMBSketch ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                {errors.fileFMBSketch && (
                                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.fileFMBSketch}
                                  </p>
                                )}
                            </div>
                        )}
                    </div>
 
                    {/* Patta Chitta */}
                    <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${formData.checkPattaChitta ? 'border-indigo-400 bg-indigo-50/30' : 'border-gray-200 bg-gray-50'}`}>
                         <div className="flex items-center gap-3 mb-3">
                             <input type="checkbox" checked={formData.checkPattaChitta} onChange={e => handleCheckboxChange("checkPattaChitta", e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                             <span className="font-semibold text-gray-700">Patta / Chitta Available</span>
                        </div>
                        {formData.checkPattaChitta && (
                             <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                 <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Upload File</Label>
                                 <Input
                                   type="file"
                                   onChange={(e) => handleFileChange('filePattaChitta', e.target.files[0])}
                                   className={`bg-white ${errors.filePattaChitta ? 'border-red-500 focus:border-red-500' : ''}`}
                                 />
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
 
            {/* Group 5: Additional Info */}
            <div>
                <SectionHeader title="Additional Details" icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Owner Name</Label><Input value={formData.checkOwnerName} onChange={e => handleChange("checkOwnerName", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Consultant Name</Label><Input value={formData.checkConsultantName} onChange={e => handleChange("checkConsultantName", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Projects</Label><Input value={formData.checkProjects} onChange={e => handleChange("checkProjects", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Google Location</Label><Input value={formData.checkGoogleLocation} onChange={e => handleChange("checkGoogleLocation", e.target.value)} /></div>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={formData.checkNotes} onChange={e => handleChange("checkNotes", e.target.value)} placeholder="Enter additional notes" rows={3} className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Requests</Label>
                        <Textarea value={formData.checkRequests} onChange={e => handleChange("checkRequests", e.target.value)} placeholder="Enter any special requests" rows={3} className="bg-gray-50" />
                    </div>
                </div>
            </div>
 
          </CardContent>
        </Card>
 
        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              className="bg-white border-gray-300"
              disabled={loading.submit}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg"
              disabled={loading.submit}
            >
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
 
 