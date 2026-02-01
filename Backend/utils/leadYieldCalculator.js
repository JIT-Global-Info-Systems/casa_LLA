/**
 * Lead Yield Calculator
 * Converts area to cents, computes 12 deductions, then yield and yield percentage.
 * Deductions 1-8 are in sq.meters and converted to cents; 9-12 are in cents.
 */

const CENTS_PER_ACRE = 100;
const CENTS_PER_HECTARE = 247.105;
const SQMT_TO_CENTS = 10.764 / 435.6;

// OSR eligible when area = 9995.74 sq.m or 2.47 acres or 1 hectare (~247 cents)
const OSR_ELIGIBLE_CENTS_MIN = 246.5;
const OSR_ELIGIBLE_CENTS_MAX = 247.7;

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Convert area to cents from any supported unit.
 * @param {{ value: number, unit: string }} area - { value, unit: 'cents'|'acres'|'hectare' }
 * @returns {number} area in cents
 */
function areaToCents(area) {
  if (!area || area.value == null) return 0;
  const value = toNum(area.value);
  const unit = (area.unit || "cents").toLowerCase();
  if (unit === "cents") return value;
  if (unit === "acres") return value * CENTS_PER_ACRE;
  if (unit === "hectare" || unit === "hectares") return value * CENTS_PER_HECTARE;
  return value;
}

/**
 * Check if OSR deduction applies: area ≈ 9995.74 sq.m or 2.47 acres or 1 hectare
 */
function isOSREligible(areaCents) {
  return areaCents > 247.11;
}

/**
 * Deduction 1: Channel - (width + inBetweenSite + nearBySiteBoundary) * manualLength [sq.m]
 */
function deduction1Channel(data) {
  const c = data.channel || {};
  const w = toNum(c.width);
  const inBetween = toNum(c.inBetweenSite);
  const near = toNum(c.nearBySiteBoundary);
  const len = toNum(c.manualLength);
  return (w + inBetween + near) * len;
}

/**
 * Deduction 2: Gas line - (width + inBetweenSite + nearBySiteBoundary) * length [sq.m]
 */
function deduction2GasLine(data) {
  const g = data.gasLine || {};
  const w = toNum(g.width);
  const inBetween = toNum(g.inBetweenSite);
  const near = toNum(g.nearBySiteBoundary);
  const len = toNum(g.length);
  return (w + inBetween + near) * len;
}

/**
 * Deduction 3: HT Tower Line - (width + inBetweenSite + nearBySiteBoundary) * manualLength [sq.m]
 */
function deduction3HtTowerLine(data) {
  const h = data.htTowerLine || {};
  const w = toNum(h.width);
  const inBetween = toNum(h.inBetweenSite);
  const near = toNum(h.nearBySiteBoundary);
  const len = toNum(h.manualLength);
  return (w + inBetween + near) * len;
}

/**
 * Deduction 4: River - nearBySiteBoundary * length [sq.m]
 */
function deduction4River(data) {
  const r = data.river || {};
  return toNum(r.nearBySiteBoundary) * toNum(r.length);
}

/**
 * Deduction 5: Lake - nearBySiteBoundary * length [sq.m]
 */
function deduction5Lake(data) {
  const l = data.lake || {};
  return toNum(l.nearBySiteBoundary) * toNum(l.length);
}

/**
 * Deduction 6: Railway Boundary - nearBySiteBoundary * length [sq.m]
 */
function deduction6RailwayBoundary(data) {
  const r = data.railwayBoundary || {};
  return toNum(r.nearBySiteBoundary) * toNum(r.length);
}

/**
 * Deduction 7: Burial Ground - nearBySiteBoundary * length [sq.m]
 */
function deduction7BurialGround(data) {
  const b = data.burialGround || {};
  return toNum(b.nearBySiteBoundary) * toNum(b.length);
}

/**
 * Deduction 8: State/National Highway - nearBySiteBoundary * length [sq.m]
 */
function deduction8Highway(data) {
  const h = data.highway || {};
  return toNum(h.nearBySiteBoundary) * toNum(h.length);
}

/**
 * Deduction 9: Road Area - (siteArea - manualRoadArea) [cents]
 */
function deduction9ManualRoadArea(data) {
  const r = data.roadArea || {};
  return Math.max(0, toNum(r.manualRoadArea));
}


/**
 * Deduction 10: OSR - (siteArea - manualRoadArea) * (percentage/100) [cents]. Only when OSR eligible.
 */
function deduction10OSR(data, areaCents) {
  if (!isOSREligible(areaCents)) return 0;
  const o = data.osr || {};
  const site = toNum(o.siteArea);
  const manual = toNum(o.manualRoadArea);
  const pct = toNum(o.percentage);
  return Math.max(0, (site - manual) * (pct / 100));
}

/**
 * Deduction 11: TNEB - (siteArea - manualRoadArea) * (percentage/100) [cents]
 */
function deduction11TNEB(data) {
  const t = data.tneb || {};
  const site = toNum(t.siteArea);
  const manual = toNum(t.manualRoadArea);
  const pct = toNum(t.percentage);
  return Math.max(0, (site - manual) * (pct / 100));
}

/**
 * Deduction 12: Local Body - (siteArea - manualRoadArea) * (percentage/100) [cents]
 */
function deduction12LocalBody(data) {
  const l = data.localBody || {};
  const site = toNum(l.siteArea);
  const manual = toNum(l.manualRoadArea);
  const pct = toNum(l.percentage);
  return Math.max(0, (site - manual) * (pct / 100));
}

/**
 * Convert sq.meters to cents
 */
function sqMeterToCents(sqm) {
  return toNum(sqm) * SQMT_TO_CENTS;
}

/**
 * Road Manual Area (direct deduction) [cents]
 */



/**
 * Full yield calculation: all required fields, 12 deductions, Y, yield (cents), yield percentage.
 * @param {object} data - payload with area, channel, gasLine, htTowerLine, river, lake, railwayBoundary, burialGround, highway, roadArea, osr?, tneb, localBody
 * @returns {object} { areaInCents, deductions, totalDeductionCents (Y), yieldCents, yieldPercentage, inputs }
 */
function calculateLeadYield(data) {
  const areaCents = areaToCents(data.area || {});
  const d1 = deduction1Channel(data);
  const d2 = deduction2GasLine(data);
  const d3 = deduction3HtTowerLine(data);
  const d4 = deduction4River(data);
  const d5 = deduction5Lake(data);
  const d6 = deduction6RailwayBoundary(data);
  const d7 = deduction7BurialGround(data);
  const d8 = deduction8Highway(data);
  const d9 = deduction9ManualRoadArea(data);
  const d10 = deduction10OSR(data, areaCents);
  const d11 = deduction11TNEB(data);
  const d12 = deduction12LocalBody(data);

  const d1_c = sqMeterToCents(d1);
  const d2_c = sqMeterToCents(d2);
  const d3_c = sqMeterToCents(d3);
  const d4_c = sqMeterToCents(d4);
  const d5_c = sqMeterToCents(d5);
  const d6_c = sqMeterToCents(d6);
  const d7_c = sqMeterToCents(d7);
  const d8_c = sqMeterToCents(d8);

  const Y = d1_c + d2_c + d3_c + d4_c + d5_c + d6_c + d7_c + d8_c + d9 + d10 + d11 + d12;
  const yieldCents = Math.max(0, areaCents - Y);
  const yieldPercentage = areaCents > 0 ? yieldCents / areaCents : 0;

  return {
    area: {
      value: toNum((data.area || {}).value),
      unit: (data.area || {}).unit || "cents",
      areaInCents: Number(areaCents.toFixed(4)),
    },
    inputs: {
      channel: data.channel || {},
      gasLine: data.gasLine || {},
      htTowerLine: data.htTowerLine || {},
      river: data.river || {},
      lake: data.lake || {},
      railwayBoundary: data.railwayBoundary || {},
      burialGround: data.burialGround || {},
      highway: data.highway || {},
      roadArea: data.roadArea || {},
      osr: data.osr || null,
      tneb: data.tneb || {},
      localBody: data.localBody || {},
    },
    deductions: {
      deduction1_channel_sqm: Number(d1.toFixed(4)),
      deduction1_channel_cents: Number(d1_c.toFixed(4)),
      deduction2_gasLine_sqm: Number(d2.toFixed(4)),
      deduction2_gasLine_cents: Number(d2_c.toFixed(4)),
      deduction3_htTowerLine_sqm: Number(d3.toFixed(4)),
      deduction3_htTowerLine_cents: Number(d3_c.toFixed(4)),
      deduction4_river_sqm: Number(d4.toFixed(4)),
      deduction4_river_cents: Number(d4_c.toFixed(4)),
      deduction5_lake_sqm: Number(d5.toFixed(4)),
      deduction5_lake_cents: Number(d5_c.toFixed(4)),
      deduction6_railwayBoundary_sqm: Number(d6.toFixed(4)),
      deduction6_railwayBoundary_cents: Number(d6_c.toFixed(4)),
      deduction7_burialGround_sqm: Number(d7.toFixed(4)),
      deduction7_burialGround_cents: Number(d7_c.toFixed(4)),
      deduction8_highway_sqm: Number(d8.toFixed(4)),
      deduction8_highway_cents: Number(d8_c.toFixed(4)),
     deduction9_manualRoadArea_cents: Number(d9.toFixed(4)),
      deduction10_osr_cents: Number(d10.toFixed(4)),
      deduction11_tneb_cents: Number(d11.toFixed(4)),
      deduction12_localBody_cents: Number(d12.toFixed(4)),
    },
    totalDeductionCents: Number(Y.toFixed(4)),
    yieldCents: Number(yieldCents.toFixed(4)),
    yieldPercentage: Number(yieldPercentage.toFixed(4)),
    osrEligible: isOSREligible(areaCents),
  };
}

module.exports = {
  calculateLeadYield,
  areaToCents,
  isOSREligible,
  SQMT_TO_CENTS,
  CENTS_PER_ACRE,
  CENTS_PER_HECTARE,
};
