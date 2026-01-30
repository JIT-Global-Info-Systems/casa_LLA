import React, { createContext, useContext, useState, useCallback } from 'react';
import { leadsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
const LeadsContext = createContext(null);

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [approvedLeads, setApprovedLeads] = useState([]);
  const [purchasedLeads, setPurchasedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState({ submit: false, locations: false, regions: false, zones: false });
  const [formError, setFormError] = useState(null);
  const [masters, setMasters] = useState({ locations: [], regions: [], zones: [] });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getAll();
      setLeads(response.data ?? response);
      const leadsData = response.data || response;
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchApprovedLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getApproved();
      setApprovedLeads(response.data ?? response);
    } catch (err) {
      console.error('Error fetching approved leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getPurchased();
      setPurchasedLeads(response.data ?? response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeadStatuses = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchLeads(),
        fetchApprovedLeads(),
        fetchPurchasedLeads()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLeadById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getById(id);
      let leadData = response.data ?? response;
      
      // Extract the latest assignedTo from history array
      if (leadData.history && Array.isArray(leadData.history) && leadData.history.length > 0) {
        const sortedHistory = leadData.history.sort((a, b) => 
          new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
        
        const latestAssignment = sortedHistory[0];
        if (latestAssignment && latestAssignment.assignedTo) {
          leadData.assignedTo = latestAssignment.assignedTo;
        }
      }
      
      return leadData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.create(leadData);
      setLeads(prev => [...prev, response.data ?? response]);
      toast.success('Lead created successfully', {
        icon: <Check className="w-5 h-5 text-green-500" />,
        duration: 3000
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id, leadData, files = {}) => {
    try {
      setLoading(true);
      setError(null);
 
      
      const response = await leadsAPI.update(id, leadData, files);
      const updated = response.data ?? response;
      
  

      setLeads(prev =>
        prev.map(lead =>
          lead._id === id || lead.id === id
            ? { ...lead, ...updated }
            : lead
        )
      );

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await leadsAPI.delete(id);
      setLeads(prev =>
        prev.filter(lead => lead._id !== id && lead.id !== id)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);
  const clearFormError = useCallback(() => setFormError(null), []);

  // Utility functions for user role management
  const getCurrentUserRole = useCallback(() => {
    const directRole = localStorage.getItem('userRole')
    if (directRole) return directRole

    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        return parsed.role || 'tele_caller'
      } catch (e) {
      }
    }
    return 'tele_caller'
  }, []);

  const getCurrentUserInfo = useCallback(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        return {
          user_id: parsed._id || parsed.id || '',
          name: parsed.name || '',
          role: parsed.role || 'tele_caller'
        }
      } catch (e) {
      }
    }
    return {
      user_id: '',
      name: '',
      role: 'tele_caller'
    }
  }, []);

  const getAssignedUserInfo = useCallback((role, selectedUserId = null, users = []) => {
    // Debug logging to understand the input
    console.log('🔍 getAssignedUserInfo input:', { role, selectedUserId, usersLength: users.length, type: typeof role, isArray: Array.isArray(role) });
    
    // Handle different input types for role parameter
    let roleValue = role;
    
    if (Array.isArray(role)) {
      // If it's an array, take the first element
      roleValue = role[0];
      console.log('🔍 Extracted from array:', roleValue);
      
      // If the extracted element is an object with a role property, extract the role string
      if (roleValue && typeof roleValue === 'object' && roleValue.role) {
        roleValue = roleValue.role;
        console.log('🔍 Extracted role string from object:', roleValue);
      }
    } else if (role && typeof role === 'object' && role.role) {
      // If it's a user object, extract the role string
      roleValue = role.role;
      console.log('🔍 Extracted from object:', roleValue);
    }
    
    if (!roleValue || roleValue === getCurrentUserRole()) {
      return getCurrentUserInfo()
    }
    
    // If a specific user ID is provided, find that user's info
    if (selectedUserId && users.length > 0) {
      const selectedUser = users.find(user => 
        (user._id || user.user_id || user.id) === selectedUserId
      );
      
      if (selectedUser) {
        console.log('🔍 Found selected user:', selectedUser);
        return {
          user_id: selectedUserId,
          name: selectedUser.name || `User ${selectedUserId}`,
          role: roleValue
        };
      }
    }
    
    // Default: create a user object for the role
    const currentUserInfo = getCurrentUserInfo();
    const result = {
      user_id: currentUserInfo.user_id,
      name: `${roleValue && typeof roleValue === 'string' ? roleValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Role'}`,
      role: roleValue
    };
    
    console.log('🔍 getAssignedUserInfo result:', result);
    return result;
  }, [getCurrentUserRole, getCurrentUserInfo]);

  // Form validation
  const validateLeadForm = useCallback((formData) => {
    const nextErrors = {}

    if (!formData.contactNumber?.trim()) {
      nextErrors.contactNumber = "Contact number is required"
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.contactNumber.replace(/\s/g, ""))) {
      nextErrors.contactNumber = "Invalid contact number format"
    }

    if (!formData.mediatorName?.trim()) nextErrors.mediatorName = "Mediator/Owner name is required"
    if (!formData.location) nextErrors.location = "Location is required"
    if (!formData.landName?.trim()) nextErrors.landName = "Land name is required"
    if (!formData.sourceCategory) nextErrors.sourceCategory = "Source category is required"
    if (!formData.source) nextErrors.source = "Source is required"

    // Numeric fields validation
    const numericFields = ["extent", "fsi", "asp", "revenue", "rate", "builderShare"]
    if (numericFields && Array.isArray(numericFields)) {
      numericFields.forEach((k) => {
        const v = formData[k]
        if (v && isNaN(parseFloat(v))) nextErrors[k] = `${k} must be a number`
      })
    }

    // File validation
    const validateFile = (fileKey, file) => {
      if (!file) return ""
      const maxSize = 2 * 1024 * 1024
      const allowed = ["image/jpeg", "image/jpg", "image/png"]
      if (file.size > maxSize) return "File size must be less than 2MB"
      if (!allowed.includes(file.type)) return "Invalid file type. Only JPG/PNG images are allowed"
      return ""
    }

    if (formData.checkFMBSketch) {
      if (!formData.fileFMBSketch) nextErrors.fileFMBSketch = "FMB Sketch file is required when checkbox is checked"
      else {
        const msg = validateFile("fileFMBSketch", formData.fileFMBSketch)
        if (msg) nextErrors.fileFMBSketch = msg
      }
    }

    if (formData.checkPattaChitta) {
      if (!formData.filePattaChitta) nextErrors.filePattaChitta = "Patta/Chitta file is required when checkbox is checked"
      else {
        const msg = validateFile("filePattaChitta", formData.filePattaChitta)
        if (msg) nextErrors.filePattaChitta = msg
      }
    }

    return nextErrors
  }, []);

  // Fetch locations data
  const fetchLocations = useCallback(async () => {
    setFormLoading(prev => ({ ...prev, locations: true, regions: true, zones: true }))
    setFormError(null)

    try {
      const locationsData = await locationsAPI.getAll()
      const transformedLocations = locationsData.map((loc) => ({
        id: loc._id,
        name: loc.location,
        regions: loc.regions || [],
      }))

      const transformedRegions = []
      const transformedZones = []

      if (locationsData && Array.isArray(locationsData)) {
        locationsData.forEach((location) => {
          if (location.regions?.length > 0) {
            const regions = location.regions || []
            if (Array.isArray(regions)) {
              regions.forEach((region) => {
                transformedRegions.push({
                  id: region._id,
                  location: location.location,
                  region: region.region,
                  zones: region.zones || [],
                })

                if (region.zones?.length > 0) {
                  const zones = region.zones || []
                  if (Array.isArray(zones)) {
                    zones.forEach((zone) => {
                      transformedZones.push({
                        id: zone._id,
                        location: location.location,
                        region: region.region,
                        zone: zone.zone,
                      })
                    })
                  }
                }
              })
            }
          }
        })
      }

      setMasters({ locations: transformedLocations, regions: transformedRegions, zones: transformedZones })
    } catch (err) {
      console.error("Failed to fetch locations:", err)
      const errorMsg = err.response?.data?.message || "Failed to load locations. Please try again."
      setFormError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setFormLoading(prev => ({ ...prev, locations: false, regions: false, zones: false }))
    }
  }, []);

  // Transform form data to API payload
  const transformLeadPayload = useCallback((formData, originalData = null) => {
    const yesNo = (v) => (v ? "Yes" : "No")
    const currentRoleValue = getCurrentUserRole()

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
        notes: formData.checkNotes || "",
        projects: formData.checkProjects || "",
        googleLocation: formData.checkGoogleLocation || "",
      },
    ]

    // For new leads, send all fields
    if (!originalData) {
      const currentUserInfo = getCurrentUserInfo();
      const assignedUserInfo = getAssignedUserInfo(formData.assignedTo || currentRoleValue, formData.assignToUser);
      
      const payload = {
        leadType: formData.leadType || "mediator",
        contactNumber: formData.contactNumber || "",
        mediatorName: formData.mediatorName || "",
        date: new Date().toISOString(),
        location: formData.location || "",
        landName: formData.landName || "",
        sourceCategory: formData.sourceCategory || "",
        source: formData.source || "",
        currentRole: [currentUserInfo],
        assignedTo: [assignedUserInfo],
        competitorAnalysis,
        checkListPage,
      }

      // Add optional fields
      const optionalFields = [
        'mediatorId', 'zone', 'unit', 'propertyType', 'fsi', 'asp', 'revenue',
        'transactionType', 'rate', 'builderShare', 'refundable', 'nonRefundable',
        'landmark', 'frontage', 'roadWidth', 'sspde', 'remark', 'lead_stage',
        'inquiredBy', 'L1_Qualification', 'directorSVStatus', 'callDate', 'callTime'
      ]

      if (optionalFields && Array.isArray(optionalFields)) {
        optionalFields.forEach(field => {
          if (formData[field]) {
            if (field === 'lead_stage') payload.lead_stage = formData[field]
            else if (field === 'leadStatus') payload.lead_status = String(formData[field]).toUpperCase()

            else payload[field] = formData[field]
          }
        })
      }

      // ✅ Always send lead_stage
      payload.lead_stage = formData.lead_stage || "Enquired"

      // ✅ Always send lead_status separately
      payload.lead_status = formData.leadStatus ? String(formData.leadStatus).toUpperCase() : "WARM"

      if (formData.callNotes) {
        payload.note = formData.callNotes
        const currentUser = getCurrentUserInfo()
        payload.userId = currentUser.user_id
        payload.role = currentUser.role
        payload.name = currentUser.name || formData.mediatorName || 'Unknown User'
        payload.callDate = formData.callDate
        payload.callTime = formData.callTime
      }

      return payload
    }

    // For existing leads, send only changed fields
    const payload = {}
    
    const addIfChanged = (fieldName, currentValue, originalValue) => {
      // Handle undefined/null values by treating them as empty strings for comparison
      const normalizedCurrent = currentValue === undefined || currentValue === null ? "" : currentValue;
      const normalizedOriginal = originalValue === undefined || originalValue === null ? "" : originalValue;
      
      const currentStr = JSON.stringify(normalizedCurrent)
      const originalStr = JSON.stringify(normalizedOriginal)
      const hasChanged = currentStr !== originalStr
      
      // Only add to payload if the value is not empty or if it actually changed
      if (hasChanged && normalizedCurrent !== "") {
        payload[fieldName] = normalizedCurrent
        console.log(`📝 Adding to payload: ${fieldName} = ${normalizedCurrent}`)
      } else {
        console.log(`⏭️ Skipping ${fieldName}: current="${normalizedCurrent}", original="${normalizedOriginal}", changed=${hasChanged}`)
      }
    }

    // Check base fields
    addIfChanged('leadType', formData.leadType || "mediator", originalData?.leadType || "mediator")
    addIfChanged('contactNumber', formData.contactNumber || "", originalData?.contactNumber || "")
    addIfChanged('mediatorName', formData.mediatorName || "", originalData?.mediatorName || "")
    addIfChanged('location', formData.location || "", originalData?.location || "")
    addIfChanged('landName', formData.landName || "", originalData?.landName || "")
    addIfChanged('sourceCategory', formData.sourceCategory || "", originalData?.sourceCategory || "")
    addIfChanged('source', formData.source || "", originalData?.source || "")
    
    // Handle role assignments
    const currentUserInfo = getCurrentUserInfo();
    const assignedUserInfo = getAssignedUserInfo(formData.assignedTo || currentRoleValue, formData.assignToUser);
    
    // Ensure we're comparing role strings properly
    const originalCurrentRole = Array.isArray(originalData?.currentRole) ? originalData.currentRole[0]?.role : originalData?.currentRole;
    const originalAssignedRole = Array.isArray(originalData?.assignedTo) ? originalData.assignedTo[0]?.role : originalData?.assignedTo;
    
    if (!originalCurrentRole || originalCurrentRole !== currentUserInfo.role) {
      payload.currentRole = [currentUserInfo];
    }
    if (!originalAssignedRole || originalAssignedRole !== assignedUserInfo.role) {
      payload.assignedTo = [assignedUserInfo];
    }
    

    // Check other fields
    const fieldsToCheck = [
      'mediatorId', 'zone', 'extent', 'unit', 'propertyType', 'fsi', 'asp', 'revenue',
      'transactionType', 'rate', 'builderShare', 'refundable', 'nonRefundable',
      'landmark', 'frontage', 'roadWidth', 'sspde', 'remark', 'lead_stage',
      'inquiredBy', 'L1_Qualification', 'directorSVStatus', 'callDate', 'callTime'
    ]

    if (fieldsToCheck && Array.isArray(fieldsToCheck)) {
      fieldsToCheck.forEach(field => {
        addIfChanged(field, formData[field], originalData?.[field])
      })
    }

    // Handle lead_status from either lead_stage (user's selection) or leadStatus (default)
    addIfChanged("lead_stage", formData.lead_stage, originalData?.lead_stage)
    
    addIfChanged(
      "lead_status",
      String(formData.leadStatus).toUpperCase(),
      String(originalData?.lead_status).toUpperCase()
    )
    addIfChanged('notes', formData.callNotes, originalData?.callNotes)

    // Check structured data
    const originalCompetitor = originalData?.competitorAnalysis?.[0] || {}
    const currentCompetitor = competitorAnalysis[0]
    let competitorChanged = false
    
    if (currentCompetitor && typeof currentCompetitor === 'object') {
      Object.keys(currentCompetitor).forEach(key => {
        if (JSON.stringify(currentCompetitor[key]) !== JSON.stringify(originalCompetitor[key])) {
          competitorChanged = true
        }
      })
    }
    
    if (competitorChanged) {
      payload.competitorAnalysis = competitorAnalysis
    }

    const originalChecklist = originalData?.checkListPage?.[0] || {}
    const currentChecklist = checkListPage[0]
    let checklistChanged = false
    
    if (currentChecklist && typeof currentChecklist === 'object') {
      Object.keys(currentChecklist).forEach(key => {
        if (JSON.stringify(currentChecklist[key]) !== JSON.stringify(originalChecklist[key])) {
          checklistChanged = true
        }
      })
    }
    
    if (checklistChanged) {
      payload.checkListPage = checkListPage
    }

    // Only include currentRole and assignedTo if they actually changed
    // Don't force include them for updates to avoid validation issues

    // Ensure required fields are included for updates
    if (!payload.contactNumber && originalData?.contactNumber) {
      payload.contactNumber = originalData.contactNumber;
    }
    if (!payload.date && originalData?.date) {
      payload.date = originalData.date;
    }

    return payload
  }, [getCurrentUserRole, getCurrentUserInfo, getAssignedUserInfo]);

  // Submit lead form
  const submitLeadForm = useCallback(async (formData, originalData = null, files = {}) => {
    const validationErrors = validateLeadForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join('\n')
      toast.error("Please fix the following errors:\n" + errorMessages, {
        duration: 5000,
        style: {
          whiteSpace: 'pre-line',
          maxWidth: '500px'
        }
      })
      throw { validationErrors }
    }

    setFormLoading(prev => ({ ...prev, submit: true }))
    setFormError(null)
    const submitToast = toast.loading(originalData ? 'Updating lead...' : 'Creating lead...')

    try {
      const leadPayload = transformLeadPayload(formData, originalData)
      
      const filesToUpload = {
        ...(formData.checkFMBSketch && formData.fileFMBSketch ? { fmb_sketch: formData.fileFMBSketch } : {}),
        ...(formData.checkPattaChitta && formData.filePattaChitta ? { patta_chitta: formData.filePattaChitta } : {}),
      }

      let result;
      if (originalData) {
        // Update existing lead
        result = await updateLead(originalData._id || originalData.id, leadPayload, filesToUpload)
      } else {
        // Create new lead
        result = await createLead(leadPayload, filesToUpload)
      }

      toast.success(originalData ? 'Lead updated successfully!' : 'Lead created successfully!', {
        id: submitToast,
        duration: 3000
      })

      if (Object.keys(filesToUpload).length > 0) {
        toast.success('Files uploaded successfully', { duration: 2000 })
      }

      return result
    } catch (error) {
      console.error("Submit error:", error)
      let errorMessage = "Failed to submit lead. Please try again."

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      setFormError(errorMessage)
      toast.error(errorMessage, {
        id: submitToast,
        duration: 5000,
        style: {
          whiteSpace: 'pre-line',
          maxWidth: '500px'
        }
      })
      throw error
    } finally {
      setFormLoading(prev => ({ ...prev, submit: false }))
    }
  }, [validateLeadForm, transformLeadPayload, updateLead, createLead]);

  return (
    <LeadsContext.Provider
      value={{
        leads,
        approvedLeads,
        purchasedLeads,
        loading,
        error,
        fetchLeads,
        fetchApprovedLeads,
        fetchPurchasedLeads,
        fetchAllLeadStatuses,
        getLeadById,
        createLead,
        updateLead,
        deleteLead,
        clearError,
        clearFormError,
        // Form utilities
        getCurrentUserRole,
        getCurrentUserInfo,
        getAssignedUserInfo,
        validateLeadForm,
        fetchLocations,
        transformLeadPayload,
        submitLeadForm,
        // Form state
        formLoading,
        formError,
        setFormError,
        masters,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext;
