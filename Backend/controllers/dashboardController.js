// import Lead from "../models/Lead.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     const { location } = req.query;
    
//     // Create a base match stage that will be used in all aggregations
//     const matchStage = location ? { location } : {};
    
//     const dashboardData = await Lead.aggregate([
//       // Add a $match stage at the beginning to filter by location if provided
//       ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
//       {
//         $facet: {
//           // 1️⃣ Lead Status Count
//           leadStatusCounts: [
//             ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
//             {
//               $group: {
//                 _id: "$lead_status",
//                 count: { $sum: 1 }
//               }
//             }
//           ],

//           // 2️⃣ Lead Stage Count
//           leadStageCounts: [
//             ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
//             {
//               $group: {
//                 _id: "$lead_stage",
//                 count: { $sum: 1 }
//               }
//             }
//           ],

//           // 3️⃣ Work Stage (Current Role)
//           workStageCounts: [
//             ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
//             {
//               $group: {
//                 _id: "$currentRole",
//                 count: { $sum: 1 }
//               }
//             }
//           ],

//           // 4️⃣ Approved Leads
//           approvedLeads: [
//             { $match: { 
//               lead_status: "APPROVED",
//               ...(location && { location })
//             }},
//             { $count: "count" }
//           ],

//           // 5️⃣ Pending Leads
//           pendingLeads: [
//             { $match: { 
//               lead_status: {$ne: "APPROVED"}||{$ne: "PURCHASED"},
//               ...(location && { location })
//             }},
//             { $count: "count" }
//           ],

//           // 6️⃣ Purchased Leads
//           purchasedLeads: [
//             { $match: { 
//               lead_status: "PURCHASED",
//               ...(location && { location })
//             }},
//             { $count: "count" }
//           ]
//         }
//       }
//     ]);

//     const result = dashboardData[0];

//     // Convert arrays to key-value objects
//     const formatCounts = (arr) =>
//       arr.reduce((acc, item) => {
//         acc[item._id || "UNKNOWN"] = item.count;
//         return acc;
//       }, {});

//     res.status(200).json({
//       message: "Dashboard data fetched successfully",
//       data: {
//         leadStatusCounts: formatCounts(result.leadStatusCounts),
//         leadStageCounts: formatCounts(result.leadStageCounts),
//         workStageCounts: formatCounts(result.workStageCounts),
//         totals: {
//           approvedLeads: result.approvedLeads[0]?.count || 0,
//           pendingLeads: result.pendingLeads[0]?.count || 0,
//           purchasedLeads: result.purchasedLeads[0]?.count || 0
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Dashboard Error:", error);
//     res.status(500).json({
//       message: "Failed to fetch dashboard data",
//       error: error.message
//     });
//   }
// };

import Lead from "../models/Lead.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { location, fromDate, toDate } = req.query;

    // 🔹 Base match object
    const matchStage = {};

    // Location filter
    if (location) {
      matchStage.location = location;
    }

    // Date filter (only if both provided)
    if (fromDate && toDate) {
      matchStage.created_at = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }

    const dashboardData = await Lead.aggregate([
      // 🔹 Apply base filters once
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),

      {
        $facet: {
          // 1️⃣ Lead Status Count
          leadStatusCounts: [
            {
              $group: {
                _id: "$lead_status",
                count: { $sum: 1 }
              }
            }
          ],

          // 2️⃣ Lead Stage Count
          leadStageCounts: [
            {
              $group: {
                _id: "$lead_stage",
                count: { $sum: 1 }
              }
            }
          ],

          // 3️⃣ Work Stage (Current Role)
          workStageCounts: [
            {
              $group: {
                _id: "$currentRole",
                count: { $sum: 1 }
              }
            }
          ],

          // 4️⃣ Approved Leads
          approvedLeads: [
            ...(Object.keys(matchStage).length ? [{ $match: { ...matchStage, lead_status: "APPROVED" } }] : [{ $match: { lead_status: "APPROVED" } }]),
            { $count: "count" }
          ],

          // 5️⃣ Pending Leads
          pendingLeads: [
            ...(Object.keys(matchStage).length ? 
              [{ $match: { ...matchStage, lead_status: { $nin: ["APPROVED", "PURCHASED"] } } }] : 
              [{ $match: { lead_status: { $nin: ["APPROVED", "PURCHASED"] } } }]
            ),
            { $count: "count" }
          ],

          // 6️⃣ Purchased Leads
          purchasedLeads: [
            ...(Object.keys(matchStage).length ? 
              [{ $match: { ...matchStage, lead_status: "PURCHASED" } }] : 
              [{ $match: { lead_status: "PURCHASED" } }]
            ),
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = dashboardData[0];

    const formatCounts = (arr) =>
      arr.reduce((acc, item) => {
        acc[item._id || "UNKNOWN"] = item.count;
        return acc;
      }, {});

    return res.status(200).json({
      message: "Dashboard data fetched successfully",
      filters: {
        location: location || null,
        fromDate: fromDate || null,
        toDate: toDate || null
      },
      data: {
        leadStatusCounts: formatCounts(result.leadStatusCounts),
        leadStageCounts: formatCounts(result.leadStageCounts),
        workStageCounts: formatCounts(result.workStageCounts),
        totals: {
          approvedLeads: result.approvedLeads[0]?.count || 0,
          pendingLeads: result.pendingLeads[0]?.count || 0,
          purchasedLeads: result.purchasedLeads[0]?.count || 0
        }
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};
