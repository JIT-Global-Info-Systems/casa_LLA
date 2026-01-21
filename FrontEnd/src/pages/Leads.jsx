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
    lead_stage:"",
    currentRole:"Telecaller",

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
            <Label>Lead Stage</Label>
            <Select 
              value={formData.lead_stage || ''}
              onValueChange={(value) => handleChange("lead_stage", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="management_hot">Management Hot</SelectItem>
              </SelectContent>
            </Select>

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
          <div className="space-y-2"><Label>Yield (%)</Label><Input
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




// import { useState, useEffect, useCallback, useMemo } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { locationsAPI, mediatorsAPI } from "@/services/api"
// import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"

// // Configuration for the Checklist to keep JSX clean
// const CHECKLIST_FIELDS = [
//   { id: "checkLandLocation", label: "Land Location" },
//   { id: "checkLandExtent", label: "Land Extent" },
//   { id: "checkLandPrice", label: "Land Price" },
//   { id: "checkApproachRoad", label: "Approach Road" },
//   { id: "checkSoilType", label: "Soil Type" },
//   { id: "checkTopography", label: "Topography" },
//   { id: "checkDrainageWaterLogging", label: "Drainage/Water Logging" },
//   { id: "checkChemistry", label: "Chemistry" },
//   { id: "checkGroundWaterAvailability", label: "Ground Water Availability" },
//   { id: "checkBorewellWater", label: "Borewell Water" },
//   { id: "checkPondTank", label: "Pond/Tank" },
//   { id: "checkNearbyLakes", label: "Nearby Lakes" },
//   { id: "checkElectricity", label: "Electricity" },
//   { id: "checkNearbyActivities", label: "Nearby Activities" },
//   { id: "checkReligiousStructures", label: "Religious Structures" },
//   { id: "checkCemeteryDock", label: "Cemetery/Dock" },
//   { id: "checkNearbyAirport", label: "Nearby Airport" },
//   { id: "checkProximityMetro", label: "Proximity to Metro" },
//   { id: "checkNearbyIndustries", label: "Nearby Industries" },
//   { id: "checkMarketRate", label: "Market Rate" },
//   { id: "checkProjectTypes", label: "Project Types" },
//   { id: "checkLandOwnership", label: "Land Ownership" },
//   { id: "checkNumberOwners", label: "Number of Owners" },
//   { id: "checkMaritalStatus", label: "Marital Status" },
//   { id: "checkLandClassification", label: "Land Classification" },
//   { id: "checkMortgage", label: "Mortgage" },
//   { id: "checkBankLease", label: "Bank Lease" },
//   { id: "checkLitigation", label: "Litigation" },
//   { id: "checkNearbyRailway", label: "Nearby Railway" },
//   { id: "checkGoogleLocation", label: "Google Location" },
// ];

// export default function Leads({ data = null, onSubmit, onClose, currentStep = 1, onStepChange }) {
//   const [formData, setFormData] = useState({
//     leadType: "mediator",
//     contactNumber: "",
//     mediatorName: "",
//     date: new Date().toISOString().split('T')[0],
//     location: "",
//     landName: "",
//     sourceCategory: "",
//     source: "",
//     zone: "",
//     area: "",
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
//     leadStatus: "Pending",
//     remark: "",
//     lead_stage: "",
//     currentRole: "Telecaller",
//     yield: "",
//     // Competitor
//     competitorDeveloperName: "",
//     competitorProjectName: "",
//     competitorProductType: "",
//     competitorLocation: "",
//     competitorPlotSize: "",
//     competitorLandExtent: "",
//     competitorPriceRange: "",
//     competitorApproxPrice: "",
//     competitorApproxPriceRent: "",
//     competitorTotalUnits: "",
//     competitorKeyAmenities: "",
//     competitorUSP: "",
//     // Checklist initialized to false
//     ...CHECKLIST_FIELDS.reduce((acc, field) => ({ ...acc, [field.id]: false }), {}),
//     checkNotes: "",
//     checkRequests: "",
//   })

//   const [masters, setMasters] = useState({ locations: [], regions: [], zones: [], mediators: [] })
//   const [loading, setLoading] = useState(false)

//   // API Fetching
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [locs, meds] = await Promise.all([locationsAPI.getAll(), mediatorsAPI.getAll()]);
      
//       const regions = [];
//       const zones = [];
//       locs.forEach(l => {
//         l.regions?.forEach(r => {
//           regions.push({ id: r._id, location: l.location, region: r.region });
//           r.zones?.forEach(z => {
//             zones.push({ id: z._id, location: l.location, region: r.region, zone: z.zone });
//           });
//         });
//       });

//       setMasters({
//         locations: locs.map(l => ({ id: l._id, name: l.location })),
//         regions,
//         zones,
//         mediators: meds.map(m => ({ id: m._id, name: m.name }))
//       });
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchData() }, [fetchData]);

//   useEffect(() => { if (data) setFormData(data) }, [data]);

//   // Handlers
//   const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

//   const handleLocationChange = (value) => {
//     setFormData(prev => ({ ...prev, location: value, zone: '', area: '' }));
//   };

//   // Memoized Options for performance
//   const filteredRegions = useMemo(() => 
//     masters.regions.filter(r => r.location === formData.location), 
//   [masters.regions, formData.location]);
//   const filteredZones = useMemo(() => 
//     masters.zones.filter(z => z.location === formData.location && z.region === formData.zone), 
//   [masters.zones, formData.location, formData.zone]);

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-6">
      
//       {/* Progress Indicator */}
//       <div className="flex items-center justify-between mb-8 px-4">
//         {[1, 2, 3].map((step) => (
//           <div key={step} className="flex items-center">
//             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
//               currentStep >= step ? "bg-primary border-primary text-white" : "border-gray-300 text-gray-400"
//             }`}>
//               {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
//             </div>
//             {step < 3 && <div className={`w-20 h-1 mx-2 ${currentStep > step ? "bg-primary" : "bg-gray-200"}`} />}
//           </div>
//         ))}
//       </div>

//       {/* STEP 1: Basic Information */}
//       {currentStep === 1 && (
//         <Card className="shadow-md border-t-4 border-t-primary">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Basic Lead Information</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <Label>Lead Type</Label>
//               <div className="flex gap-4 p-2 border rounded-md bg-gray-50/50">
//                 {['mediator', 'owner'].map(type => (
//                   <label key={type} className="flex items-center gap-2 capitalize cursor-pointer font-medium">
//                     <input type="radio" checked={formData.leadType === type} onChange={() => handleChange("leadType", type)} />
//                     {type}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Contact Number</Label>
//               <Input value={formData.contactNumber} onChange={e => handleChange("contactNumber", e.target.value)} placeholder="9876543210" />
//             </div>

//             <div className="space-y-2">
//               <Label>Location</Label>
//               <Select value={formData.location} onValueChange={handleLocationChange}>
//                 <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
//                 <SelectContent>
//                   {masters.locations.map(l => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Zone</Label>
//               <Select value={formData.zone} onValueChange={v => handleChange("zone", v)} disabled={!formData.location}>
//                 <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
//                 <SelectContent>
//                   {filteredRegions.map(r => <SelectItem key={r.id} value={r.region}>{r.region}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Area</Label>
//               <Select value={formData.area} onValueChange={v => handleChange("area", v)} disabled={!formData.zone}>
//                 <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
//                 <SelectContent>
//                   {filteredZones.map(z => <SelectItem key={z.id} value={z.zone}>{z.zone}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Transaction Type</Label>
//               <Select value={formData.transactionType} onValueChange={v => handleChange("transactionType", v)}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="JV">Joint Venture (JV)</SelectItem>
//                   <SelectItem value="Sale">Outright Sale</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="md:col-span-3">
//               <Label>Remark</Label>
//               <Textarea value={formData.remark} onChange={e => handleChange("remark", e.target.value)} placeholder="Internal notes..." rows={3} />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* STEP 2: Competitor Analysis */}
//       {currentStep === 2 && (
//         <Card className="shadow-md border-t-4 border-t-blue-500">
//           <CardHeader><CardTitle>Competitor Analysis</CardTitle></CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label>Developer Name</Label>
//               <Input value={formData.competitorDeveloperName} onChange={e => handleChange("competitorDeveloperName", e.target.value)} />
//             </div>
//             <div className="space-y-2">
//               <Label>Approx Price</Label>
//               <Input type="number" value={formData.competitorApproxPrice} onChange={e => handleChange("competitorApproxPrice", e.target.value)} />
//             </div>
//             <div className="md:col-span-3">
//               <Label>USP / Positioning</Label>
//               <Textarea value={formData.competitorUSP} onChange={e => handleChange("competitorUSP", e.target.value)} rows={3} />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* STEP 3: Site Checklist */}
//       {currentStep === 3 && (
//         <Card className="shadow-md border-t-4 border-t-green-500">
//           <CardHeader><CardTitle>Site Visit Checklist</CardTitle></CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//               {CHECKLIST_FIELDS.map((field) => (
//                 <div key={field.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
//                   <Checkbox 
//                     id={field.id} 
//                     checked={formData[field.id]} 
//                     onCheckedChange={(checked) => handleChange(field.id, checked)} 
//                   />
//                   <Label htmlFor={field.id} className="cursor-pointer text-sm font-medium">{field.label}</Label>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* NAVIGATION CONTROLS */}
//       <div className="flex justify-between items-center pt-6 border-t">
//         <Button variant="ghost" onClick={onClose} className="text-gray-500">Cancel</Button>
        
//         <div className="flex gap-3">
//           {currentStep > 1 && (
//             <Button variant="outline" onClick={() => onStepChange(currentStep - 1)}>
//               <ChevronLeft className="w-4 h-4 mr-2" /> Back
//             </Button>
//           )}

//           {currentStep < 3 ? (
//             <Button onClick={() => onStepChange(currentStep + 1)}>
//               Next <ChevronRight className="w-4 h-4 ml-2" />
//             </Button>
//           ) : (
//             <Button onClick={() => onSubmit(formData)} className="bg-green-600 hover:bg-green-700">
//               Submit Lead
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }