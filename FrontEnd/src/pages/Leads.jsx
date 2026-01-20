import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { locationsAPI } from "@/services/api" // Ensure this path is correct in your project
import { ChevronLeft } from "lucide-react"

export default function Leads({ data = null, onSubmit, onClose }) {
  // 1. Unified Form State
  const [formData, setFormData] = useState({
    // Basic Lead Information
    leadType: "mediator",
    contactNumber: "",
    mediatorName: "",
    date: "",
    location: "",
    zone: "",
    area: "", // Added from File 2 for granularity
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

    // Yield Calculation (From File 1)
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

  // 2. Location Logic (From File 2)
  const [masters, setMasters] = useState({
    locations: [],
    regions: [],
    zones: [],
  })
  const [loading, setLoading] = useState({ locations: false, regions: false, zones: false })

  // Fetch locations from API
  const fetchLocations = useCallback(async () => {
    setLoading(prev => ({ ...prev, locations: true, regions: true, zones: true }));
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

  // 3. Handlers
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleCheckboxChange = (key, checked) => {
    setFormData(prev => ({ ...prev, [key]: checked }))
  }

  const handleLocationChange = (value) => {
    setFormData(prev => ({ ...prev, location: value, zone: '', area: '' }));
  };

  const handleZoneChange = (value) => {
    setFormData(prev => ({ ...prev, zone: value, area: '' }));
  };

  // Helper to filter dropdown options
  const getOptions = useCallback((type) => {
    if (type === 'location') return masters.locations.map(l => ({ value: l.name, label: l.name }));

    if (type === 'region') { // Used for "Zone" dropdown
      if (formData.location) {
        return masters.regions
          .filter(r => r.location === formData.location)
          .map(r => ({ value: r.region, label: r.region }));
      }
      return [];
    }

    if (type === 'zone') { // Used for "Area" dropdown
      if (formData.location && formData.zone) {
        return masters.zones
          .filter(z => z.location === formData.location && z.region === formData.zone)
          .map(z => ({ value: z.zone, label: z.zone }));
      }
      return [];
    }
    return [];
  }, [masters, formData.location, formData.zone]);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(formData)
  }

  return (
    <div className="flex-1 space-y-6 p-1">
      {/* Header with Back Button (if onClose provided) */}
      <div className="flex items-center gap-2 mb-6">
        {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
        )}
        <h1 className="text-2xl font-bold">
            {data ? "Edit Lead" : "Add New Lead"}
        </h1>
      </div>

      {/* Section 1: Basic Lead Information */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Basic Lead Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Lead Type */}
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
            />
          </div>

          <div className="space-y-2">
            <Label>Mediator/Owner Name</Label>
            <Input
              value={formData.mediatorName}
              onChange={e => handleChange("mediatorName", e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={e => handleChange("date", e.target.value)}
            />
          </div>

          {/* Dynamic Location Fields */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              value={formData.location}
              onValueChange={handleLocationChange}
              disabled={loading.locations}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {getOptions('location').map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Zone</Label>
            <Select
              value={formData.zone}
              onValueChange={handleZoneChange}
              disabled={!formData.location || loading.regions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {getOptions('region').map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Area</Label>
            <Select
              value={formData.area}
              onValueChange={(val) => handleChange('area', val)}
              disabled={!formData.zone || loading.zones}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {getOptions('zone').map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
            />
          </div>

          <div className="space-y-2">
            <Label>Source Category</Label>
            <Select value={formData.sourceCategory} onValueChange={(v) => handleChange("sourceCategory", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Source</Label>
            <Select value={formData.source} onValueChange={(v) => handleChange("source", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Extent</Label>
            <Input
              value={formData.extent}
              onChange={e => handleChange("extent", e.target.value)}
              placeholder="Enter extent"
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select value={formData.unit} onValueChange={(v) => handleChange("unit", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Acre">Acre</SelectItem>
                <SelectItem value="Sqft">Sqft</SelectItem>
                <SelectItem value="Ground">Ground</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={formData.propertyType} onValueChange={(v) => handleChange("propertyType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixed">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2"><Label>FSI</Label><Input value={formData.fsi} onChange={e => handleChange("fsi", e.target.value)} /></div>
          <div className="space-y-2"><Label>ASP</Label><Input value={formData.asp} onChange={e => handleChange("asp", e.target.value)} /></div>
          <div className="space-y-2"><Label>Total Revenue</Label><Input value={formData.revenue} onChange={e => handleChange("revenue", e.target.value)} /></div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select value={formData.transactionType} onValueChange={(v) => handleChange("transactionType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JV">JV</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2"><Label>Rate</Label><Input value={formData.rate} onChange={e => handleChange("rate", e.target.value)} /></div>
          <div className="space-y-2"><Label>Builder Share (%)</Label><Input value={formData.builderShare} onChange={e => handleChange("builderShare", e.target.value)} /></div>
          <div className="space-y-2"><Label>Refundable Deposit</Label><Input value={formData.refundable} onChange={e => handleChange("refundable", e.target.value)} /></div>
          <div className="space-y-2"><Label>Non-Refundable Deposit</Label><Input value={formData.nonRefundable} onChange={e => handleChange("nonRefundable", e.target.value)} /></div>

          <div className="space-y-2"><Label>Landmark</Label><Input value={formData.landmark} onChange={e => handleChange("landmark", e.target.value)} /></div>
          <div className="space-y-2"><Label>Frontage</Label><Input value={formData.frontage} onChange={e => handleChange("frontage", e.target.value)} /></div>
          <div className="space-y-2"><Label>Road Width</Label><Input value={formData.roadWidth} onChange={e => handleChange("roadWidth", e.target.value)} /></div>

          <div className="space-y-2">
            <Label>SSPDE</Label>
            <Select value={formData.sspde} onValueChange={(v) => handleChange("sspde", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lead Status</Label>
            <Select value={formData.leadStatus} onValueChange={(v) => handleChange("leadStatus", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
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
      <Card>
        <CardHeader>
          <CardTitle>Yield Calculation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Saleable Area (sq ft)</Label>
            <Input value={formData.yieldSaleable} onChange={e => handleChange("yieldSaleable", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Common Area (sq ft)</Label>
            <Input value={formData.yieldCommon} onChange={e => handleChange("yieldCommon", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Total Built-up Area (sq ft)</Label>
            <Input value={formData.yieldTotal} onChange={e => handleChange("yieldTotal", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Efficiency (%)</Label>
            <Input value={formData.yieldEfficiency} onChange={e => handleChange("yieldEfficiency", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
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
          <div className="space-y-2"><Label>Price / Rent</Label><Input value={formData.competitorApproxPriceRent} onChange={e => handleChange("competitorApproxPriceRent", e.target.value)} /></div>
          <div className="space-y-2"><Label>Total Units</Label><Input value={formData.competitorTotalUnits} onChange={e => handleChange("competitorTotalUnits", e.target.value)} /></div>
          <div className="md:col-span-2 space-y-2"><Label>Key Amenities</Label><Input value={formData.competitorKeyAmenities} onChange={e => handleChange("competitorKeyAmenities", e.target.value)} /></div>
          <div className="md:col-span-3 space-y-2">
            <Label>USP / Positioning</Label>
            <Textarea value={formData.competitorUSP} onChange={e => handleChange("competitorUSP", e.target.value)} rows={2} />
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
            {[
              { key: "checkLandLocation", label: "Land Location" },
              { key: "checkLandExtent", label: "Land Extent" },
              { key: "checkLandPrice", label: "Land Price" },
              { key: "checkApproachRoad", label: "Approach Road" },
              { key: "checkSoilType", label: "Soil Type" },
              { key: "checkTopography", label: "Topography / Undulations" },
              { key: "checkDrainageWaterLogging", label: "Drainage / Water Logging" },
              { key: "checkSoilType2", label: "Soil Type (Test)" },
              { key: "checkChemistry", label: "Chemistry / pH Quantity" },
              { key: "checkGroundWaterAvailability", label: "Ground Water Availability" },
              { key: "checkBorewellWater", label: "Borewell Water" },
              { key: "checkPondTank", label: "Pond / Tank" },
              { key: "checkNearbyLakes", label: "Nearby Lakes" },
              { key: "checkElectricity", label: "Electricity" },
              { key: "checkNearbyActivities", label: "Nearby Activities / Stock" },
              { key: "checkReligiousStructures", label: "Religious Structures" },
              { key: "checkCemeteryDock", label: "Cemetery / Dock" },
              { key: "checkNearbyAirport", label: "Nearby Airport" },
              { key: "checkProximityMetro", label: "Proximity to Metro / HS Rail" },
              { key: "checkNearbyIndustries", label: "Nearby Industries" },
              { key: "checkMarketRate", label: "Market Rate" },
              { key: "checkProjectTypes", label: "Project Types" },
              { key: "checkLandOwnership", label: "Land Ownership" },
              { key: "checkNumberOwners", label: "Number of Owners" },
              { key: "checkMaritalStatus", label: "Marital Status" },
              { key: "checkLandClassification", label: "Land Classification" },
              { key: "checkMortgage", label: "Mortgage" },
              { key: "checkBankLease", label: "Bank Lease" },
              { key: "checkLitigation", label: "Litigation" },
              { key: "checkNearbyRailway", label: "Nearby Railway Deck" },
              { key: "checkGoogleLocation", label: "Google Location" },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={formData[item.key]}
                  onChange={e => handleCheckboxChange(item.key, e.target.checked)}
                  className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.checkNotes}
                onChange={e => handleChange("checkNotes", e.target.value)}
                placeholder="Enter additional notes"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Requests</Label>
              <Textarea
                value={formData.checkRequests}
                onChange={e => handleChange("checkRequests", e.target.value)}
                placeholder="Enter any special requests"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
          {data ? "Update Lead" : "Submit Lead"}
        </Button>
      </div>
    </div>
  )
}
