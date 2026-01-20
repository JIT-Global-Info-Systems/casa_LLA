import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function Leads({ data = null, onSubmit }) {
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

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleCheckboxChange = (key, checked) => {
    setFormData(prev => ({ ...prev, [key]: checked }))
  }

  const handleSubmit = () => {
    console.log("Submitting Lead:", formData)
    if (onSubmit) onSubmit(formData)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">
        {data ? "Edit Lead" : "Add New Lead"}
      </h1>

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
            <Input
              value={formData.mediatorName}
              onChange={e => handleChange("mediatorName", e.target.value)}
              placeholder="Enter mediator name"
              className="border-gray-300"
            />
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

          <div className="space-y-2">
            <Label>Location</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                >
                  {formData.location ? (formData.location === "chennai" ? "Chennai" : "Bangalore") : "Select location"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={() => handleChange("location", "chennai")}>
                  Chennai
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChange("location", "blr")}>
                  Bangalore
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              value={formData.source}
              onChange={v => handleChange("source", v)}
              options={[
                { value: "", label: "Select Source" },
                { value: "facebook", label: "Facebook" },
                { value: "google", label: "Google" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label>Zone</Label>
            <Input
              value={formData.zone}
              onChange={e => handleChange("zone", e.target.value)}
              placeholder="Enter zone"
              className="border-gray-300"
            />
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
              value={formData.unit}
              onChange={v => handleChange("unit", v)}
              options={[
                { value: "Acre", label: "Acre" },
                { value: "Sqft", label: "Sqft" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select
              value={formData.propertyType}
              onChange={v => handleChange("propertyType", v)}
              options={[
                { value: "", label: "Select Type" },
                { value: "residential", label: "Residential" },
                { value: "commercial", label: "Commercial" },
              ]}
            />
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
              value={formData.transactionType}
              onChange={v => handleChange("transactionType", v)}
              options={[
                { value: "JV", label: "JV" },
                { value: "Sale", label: "Sale" },
              ]}
            />
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label>Lead Status</Label>
            <Select
              value={formData.leadStatus}
              onChange={v => handleChange("leadStatus", v)}
              options={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
                { value: "Cancelled", label: "Cancelled" },
                { value: "Lost", label: "Lost" },
                { value: "Won", label: "Won" },
                { value: "Purchased", label: "Purchased" }
              ]}
            />
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
      </Card>

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
        <Button variant="outline" onClick={() => window.history.back()} className="border-gray-300">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
          {data ? "Update Lead" : "Submit Lead"}
        </Button>
      </div>
    </div>
  )
}
