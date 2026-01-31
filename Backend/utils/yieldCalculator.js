export function convertAreaToCents({ value, unit }) {
  if (unit === "cents") return value;
  if (unit === "acres") return value * 100;
  if (unit === "hectare") return value * 247.105;
  throw new Error("Invalid area unit");
}

const linear = ({ width = 0, length = 0, manualLength = 0, inBetween = 0, nearBoundary = 0 }) => {
  const len = manualLength || length || 0;
  return (width + inBetween + nearBoundary) * len;
};

const boundary = ({ length = 0, nearBoundary = 0 }) =>
  length * nearBoundary;

const percentage = ({ siteArea = 0, manualRoadArea = 0, percentage = 0 }) =>
  (siteArea - manualRoadArea) * percentage;

const sqMeterToCents = sqm =>
  (sqm * 10.764) / 435.6;

const isOSREligible = cents =>
  Math.abs(cents - 247) <= 0.5;

export function calculateYield(data) {
  const areaCents = convertAreaToCents(data.siteArea);

  let totalSqm = 0;

  totalSqm += linear(data.channel || {});
  totalSqm += linear(data.gasLine || {});
  totalSqm += linear(data.htTowerLine || {});

  totalSqm += boundary(data.river || {});
  totalSqm += boundary(data.lake || {});
  totalSqm += boundary(data.railwayBoundary || {});
  totalSqm += boundary(data.burialGround || {});
  totalSqm += boundary(data.highway || {});

  if (data.roadArea)
    totalSqm += data.roadArea.siteArea - data.roadArea.manualRoadArea;

  const osrApplied = isOSREligible(areaCents);
  if (data.osr && osrApplied) totalSqm += percentage(data.osr);
  if (data.tneb) totalSqm += percentage(data.tneb);
  if (data.localBody) totalSqm += percentage(data.localBody);

  const deductionCents = sqMeterToCents(totalSqm);
  const yieldArea = areaCents - deductionCents;

  return {
    totalAreaCents: Number(areaCents.toFixed(2)),
    totalDeductionCents: Number(deductionCents.toFixed(2)),
    yieldArea: Number(yieldArea.toFixed(2)),
    yieldPercentage: Number(((yieldArea / areaCents) * 100).toFixed(2)),
    osrApplied
  };
}
