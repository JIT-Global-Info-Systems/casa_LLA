# Postman: Create Lead with Full Yield Calculation

Use **form-data** for the Body. The backend computes all 12 deductions, total deduction (Y), yield (cents), and yield percentage, and stores them in `yieldCalculation`.

## Required (lead creation)

| Key     | Type | Value |
|---------|------|--------|
| `data`  | Text | `{"contactNumber":"9876543210","date":"2026-01-31"}` |

## Required (auth)

| Key           | Type | Value |
|---------------|------|--------|
| `currentRole` | Text | `[{"user_id":"6967372419429cd4571007c7","role":"admin","name":"Your Name"}]` |

## Area (required for yield; in cents, acres, or hectare)

| Key  | Type | Example |
|------|------|--------|
| `area` | Text | `{"value":247,"unit":"cents"}` or `{"value":2.47,"unit":"acres"}` or `{"value":1,"unit":"hectare"}` |

- **cents**: use as-is.
- **acres**: value × 100 → cents.
- **hectare**: value × 247.105 → cents.

## Yield inputs (all optional; send as JSON strings in form-data)

Deductions 1–8 use **meters** (length/width); values are converted from sq.m to cents. Deductions 9–12 use **cents** (site area / manual road area).

| Key               | Fields | Example value |
|-------------------|--------|----------------|
| `channel`         | width, manualLength, inBetweenSite, nearBySiteBoundary | `{"width":10,"manualLength":20,"inBetweenSite":2,"nearBySiteBoundary":1}` |
| `gasLine`         | width, length, inBetweenSite, nearBySiteBoundary | `{"width":5,"length":15,"inBetweenSite":0,"nearBySiteBoundary":1}` |
| `htTowerLine`     | width, manualLength, inBetweenSite, nearBySiteBoundary | `{"width":8,"manualLength":12,"inBetweenSite":1,"nearBySiteBoundary":0}` |
| `river`           | length, nearBySiteBoundary | `{"length":30,"nearBySiteBoundary":2}` |
| `lake`             | length, nearBySiteBoundary | `{"length":25,"nearBySiteBoundary":1}` |
| `railwayBoundary` | length, nearBySiteBoundary | `{"length":20,"nearBySiteBoundary":1}` |
| `burialGround`    | length, nearBySiteBoundary | `{"length":10,"nearBySiteBoundary":0.5}` |
| `highway`         | length, nearBySiteBoundary | `{"length":40,"nearBySiteBoundary":2}` |
| `roadArea`        | siteArea, manualRoadArea (cents) | `{"siteArea":247,"manualRoadArea":20}` |
| `osr`             | siteArea, manualRoadArea, percentage (cents; only when area ≈ 247 cents / 2.47 acres / 1 hectare) | `{"siteArea":247,"manualRoadArea":20,"percentage":10}` |
| `tneb`            | siteArea, manualRoadArea, percentage (cents) | `{"siteArea":247,"manualRoadArea":20,"percentage":5}` |
| `localBody`       | siteArea, manualRoadArea, percentage (cents) | `{"siteArea":247,"manualRoadArea":20,"percentage":8}` |

## Stored result: `yieldCalculation`

- **area**: value, unit, areaInCents  
- **inputs**: channel, gasLine, htTowerLine, river, lake, railwayBoundary, burialGround, highway, roadArea, osr, tneb, localBody  
- **deductions**: deduction1_channel_sqm/cents … deduction12_localBody_cents  
- **totalDeductionCents**: Y (sum of all deductions in cents)  
- **yieldCents**: Area − Y  
- **yieldPercentage**: (Area − Y) / Area  

## Minimal example (create lead + yield)

**Body type:** form-data

| Key          | Value |
|--------------|--------|
| data         | `{"contactNumber":"9876543210","date":"2026-01-31"}` |
| currentRole  | `[{"user_id":"6967372419429cd4571007c7","role":"admin","name":"Admin"}]` |
| area         | `{"value":247,"unit":"cents"}` |
| roadArea     | `{"siteArea":247,"manualRoadArea":20}` |
| osr          | `{"siteArea":247,"manualRoadArea":20,"percentage":10}` |
| tneb         | `{"siteArea":247,"manualRoadArea":20,"percentage":5}` |
| localBody    | `{"siteArea":247,"manualRoadArea":20,"percentage":8}` |

**URL:** `POST http://localhost:5000/api/leads/create`

Response includes `data.yieldCalculation` with all required fields, 12 deductions, `yieldCents`, and `yieldPercentage`.
