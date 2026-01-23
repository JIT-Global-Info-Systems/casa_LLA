import Lead from "../models/Lead.js";

export const getDashboardStats = async (req, res) => {
  try {
    const dashboardData = await Lead.aggregate([
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
            { $match: { lead_status: "APPROVED" } },
            { $count: "count" }
          ],

          // 5️⃣ Pending Leads
          pendingLeads: [
            { $match: { lead_status: "PENDING" } },
            { $count: "count" }
          ],

          // 6️⃣ Purchased Leads
          purchasedLeads: [
            { $match: { lead_status: "PURCHASED" } },
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
