import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Convert area into cents
 * cents      -> same
 * acres      -> acres * 100
 * hectare    -> hectare * 247.105
 */
function convertAreaToCents({ value, unit }) {
  if (!value || value <= 0) return 0;

  switch (unit) {
    case "cents":
      return value;
    case "acres":
      return value * 100;
    case "hectare":
      return value * 247.105;
    default:
      throw new Error("Invalid area unit");
  }
}

/**
 * (width + inBetween + nearBoundary) * length
 * Used for Channel, Gas Line, HT Tower Line
 */
function linearDeduction({
  width = 0,
  length = 0,
  inBetween = 0,
  nearBoundary = 0
}) {
  return (width + inBetween + nearBoundary) * length;
}

/**
 * nearBoundary * length
 * Used for River, Lake, Railway, Burial, Highway
 */
function boundaryDeduction({
  length = 0,
  nearBoundary = 0
}) {
  return nearBoundary * length;
}

/**
 * (siteArea - manualRoadArea) * percentage
 * Used for OSR, TNEB, Local Body
 */
function percentageDeduction({
  siteArea = 0,
  manualRoadArea = 0,
  percentage = 0
}) {
  return (siteArea - manualRoadArea) * percentage;
}

/**
 * Convert sq.meters to cents
 * Formula: (sq.m * 10.764) / 435.6
 */
function sqMeterToCents(value = 0) {
  return (value * 10.764) / 435.6;
}

/**
 * OSR applicable only for:
 * 9995.74 sq.m OR 2.47 acres OR 1 hectare
 * ≈ 247 cents
 */
function isOSREligible(areaCents) {
  const OSR_CENTS = 247;
  const TOLERANCE = 0.5; // handles rounding issues

  return Math.abs(areaCents - OSR_CENTS) <= TOLERANCE;
}

function calculateYield({
  area,

  channel,
  gasLine,
  htTowerLine,

  river,
  lake,
  railwayBoundary,
  burialGround,
  highway,

  roadArea,

  osr,        // optional & conditional
  tneb,
  localBody
}) {
  // Step 1: Convert area to cents
  const totalAreaCents = convertAreaToCents(area);

  // Step 2: Deduction 1–3 (Linear)
  const deduction1 = linearDeduction(channel);
  const deduction2 = linearDeduction(gasLine);
  const deduction3 = linearDeduction(htTowerLine);

  // Step 3: Deduction 4–8 (Boundary)
  const deduction4 = boundaryDeduction(river);
  const deduction5 = boundaryDeduction(lake);
  const deduction6 = boundaryDeduction(railwayBoundary);
  const deduction7 = boundaryDeduction(burialGround);
  const deduction8 = boundaryDeduction(highway);

  // Step 4: Deduction 9 (Road Area)
  const deduction9 =
    (roadArea?.siteArea || 0) -
    (roadArea?.manualRoadArea || 0);

  // Step 5: Deduction 10 (OSR – conditional)
  const deduction10 =
    osr && isOSREligible(totalAreaCents)
      ? percentageDeduction(osr)
      : 0;

  // Step 6: Deduction 11 & 12
  const deduction11 = tneb ? percentageDeduction(tneb) : 0;
  const deduction12 = localBody ? percentageDeduction(localBody) : 0;

  // Step 7: Total deductions (sq.m)
  const totalDeductionSqMeter =
    deduction1 +
    deduction2 +
    deduction3 +
    deduction4 +
    deduction5 +
    deduction6 +
    deduction7 +
    deduction8 +
    deduction9 +
    deduction10 +
    deduction11 +
    deduction12;

  // Step 8: Convert total deduction to cents
  const Y = sqMeterToCents(totalDeductionSqMeter);

  // Step 9: Yield calculation
  const yieldArea = totalAreaCents - Y;
  const yieldPercentage = yieldArea / totalAreaCents;

  return {
    totalAreaCents,
    osrApplied: isOSREligible(totalAreaCents),
    totalDeductionSqMeter,
    totalDeductionCents: Y,
    yieldArea,
    yieldPercentage
  };
}

// Create context
const YieldContext = createContext();

// Initial yield data structure
const initialYieldData = {
  area: { value: '', unit: 'cents' },
  channel: { width: 0, length: 0, inBetween: 0, nearBoundary: 0 },
  gasLine: { width: 0, length: 0, inBetween: 0, nearBoundary: 0 },
  htTowerLine: { width: 0, length: 0, inBetween: 0, nearBoundary: 0 },
  river: { length: 0, nearBoundary: 0 },
  lake: { length: 0, nearBoundary: 0 },
  railwayBoundary: { length: 0, nearBoundary: 0 },
  burialGround: { length: 0, nearBoundary: 0 },
  highway: { length: 0, nearBoundary: 0 },
  roadArea: { siteArea: 0, manualRoadArea: 0 },
  osr: { siteArea: 0, manualRoadArea: 0, percentage: 0 },
  tneb: { siteArea: 0, manualRoadArea: 0, percentage: 0 },
  localBody: { siteArea: 0, manualRoadArea: 0, percentage: 0 }
};

// Provider component
export function YieldProvider({ children }) {
  const [yieldData, setYieldData] = useState(initialYieldData);
  const [yieldResult, setYieldResult] = useState(null);

  const updateYieldData = useCallback((field, value) => {
    setYieldData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateNestedYieldData = useCallback((parentField, childField, value) => {
    setYieldData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  }, []);

  const calculateYieldPercentage = useCallback(() => {
    console.log('🚀 YieldContext: calculateYieldPercentage called');
    console.log('🚀 YieldContext: Current yieldData:', yieldData);
    
    try {
      const result = calculateYield(yieldData);
      console.log('✅ YieldContext: Calculation successful:', result);
      setYieldResult(result);
      return result;
    } catch (error) {
      console.error('❌ YieldContext: Error calculating yield:', error);
      return null;
    }
  }, [yieldData]);

  const resetYieldData = useCallback(() => {
    setYieldData(initialYieldData);
    setYieldResult(null);
  }, []);

  const value = {
    yieldData,
    yieldResult,
    updateYieldData,
    updateNestedYieldData,
    calculateYieldPercentage,
    resetYieldData
  };

  return (
    <YieldContext.Provider value={value}>
      {children}
    </YieldContext.Provider>
  );
}

// Hook to use the context
export function useYield() {
  const context = useContext(YieldContext);
  if (!context) {
    throw new Error('useYield must be used within a YieldProvider');
  }
  return context;
}

export { calculateYield, convertAreaToCents, isOSREligible };
