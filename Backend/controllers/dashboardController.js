import Lead from "../models/Lead.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Create a base match stage that will be used in all aggregations
    const matchStage = location ? { location } : {};
    
    const dashboardData = await Lead.aggregate([
      // Add a $match stage at the beginning to filter by location if provided
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      {
        $facet: {
          // 1️⃣ Lead Status Count
          leadStatusCounts: [
            ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
            {
              $group: {
                _id: "$lead_status",
                count: { $sum: 1 }
              }
            }
          ],

          // 2️⃣ Lead Stage Count
          leadStageCounts: [
            ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
            {
              $group: {
                _id: "$lead_stage",
                count: { $sum: 1 }
              }
            }
          ],

          // 3️⃣ Work Stage (Current Role)
          workStageCounts: [
            ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
            {
              $group: {
                _id: "$currentRole",
                count: { $sum: 1 }
              }
            }
          ],

          // 4️⃣ Approved Leads
          approvedLeads: [
            { $match: { 
              lead_status: "APPROVED",
              ...(location && { location })
            }},
            { $count: "count" }
          ],

          // 5️⃣ Pending Leads
          pendingLeads: [
            { $match: { 
              lead_status: "PENDING",
              ...(location && { location })
            }},
            { $count: "count" }
          ],

          // 6️⃣ Purchased Leads
          purchasedLeads: [
            { $match: { 
              lead_status: "PURCHASED",
              ...(location && { location })
            }},
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = dashboardData[0];

    // Convert arrays to key-value objects
    const formatCounts = (arr) =>
      arr.reduce((acc, item) => {
        acc[item._id || "UNKNOWN"] = item.count;
        return acc;
      }, {});

    res.status(200).json({
      message: "Dashboard data fetched successfully",
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
