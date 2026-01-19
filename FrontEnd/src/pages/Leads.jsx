import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useLeads } from "../context/LeadsContext.jsx"

export default function Leads({ data = null, onClose }) {
  const { createLead, updateLead, loading } = useLeads()
  
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
    leadStatus: "Pending",
    remark: "",
    comment: "",
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

  const handleSubmit = async () => {
    try {
      if (data) {
        // Update existing lead
        await updateLead(data._id, formData)
      } else {
        // Create new lead
        await createLead(formData)
      }
      
      // Close modal on successful submission
      if (onClose) onClose()
    } catch (error) {
      console.error("Error saving lead:", error)
    }
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
            onValueChange={v => handleChange("location", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chennai">Chennai</SelectItem>
              <SelectItem value="blr">Bangalore</SelectItem>
            </SelectContent>
          </Select>
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
            onValueChange={v => handleChange("sourceCategory", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source */}
        <div>
          <Label>Source</Label>
          <Select
            value={formData.source}
            onValueChange={v => handleChange("source", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="google">Google</SelectItem>
            </SelectContent>
          </Select>
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
            onValueChange={v => handleChange("unit", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Acre">Acre</SelectItem>
              <SelectItem value="Sqft">Sqft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div>
          <Label>Property Type</Label>
          <Select
            value={formData.propertyType}
            onValueChange={v => handleChange("propertyType", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
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
            onValueChange={v => handleChange("transactionType", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JV">JV</SelectItem>
              <SelectItem value="Sale">Sale</SelectItem>
            </SelectContent>
          </Select>
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
            onValueChange={v => handleChange("sspde", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select SSPDE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Lead Status</Label>
          <Select
            value={formData.leadStatus}
            onValueChange={v => handleChange("leadStatus", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select lead status" />
            </SelectTrigger>
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

        {/* Remark */}
        <div className="md:col-span-3">
          <Label>Remark</Label>
          <Textarea
            value={formData.remark}
            onChange={e => handleChange("remark", e.target.value)}
          />
        </div>

        {/* Comment */}
        <div className="md:col-span-3">
          <Label>Comment</Label>
          <Textarea
            value={formData.comment}
            onChange={e => handleChange("comment", e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : (data ? "Update Lead" : "Submit Lead")}
          </Button>
        </div>

      </CardContent>
    {/* // </Card> */}
    </>
  )
}
