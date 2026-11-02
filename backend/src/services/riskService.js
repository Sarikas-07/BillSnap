/**
 * Rule-based risk engine. Runs entirely in Node against a user's rooms/
 * appliances — no external AI call needed for these heuristics.
 */

const CIRCUIT_LIMIT_WATTS = 3000; // typical Indian household 15A circuit ≈ 3000W safe ceiling
const AGEING_THRESHOLD_YEARS = 5;
const PHANTOM_LOAD_DEVICE_TYPES = ["Smart TV", "Set-Top Box", "Microwave Oven", "Washing Machine"];

function severityRank(sev) {
  return { High: 3, Medium: 2, Low: 1 }[sev] ?? 0;
}

/**
 * @param {Array} appliances - populated appliance docs (with .room populated or room name)
 * @returns {{ riskScore: number, factors: Array }}
 */
function analyzeRisk(appliances) {
  const factors = [];
  const now = new Date().getFullYear();

  // Group by room to check circuit overload
  const byRoom = new Map();
  for (const a of appliances) {
    const roomName = a.room?.name || a.roomName || "Unknown room";
    if (!byRoom.has(roomName)) byRoom.set(roomName, []);
    byRoom.get(roomName).push(a);
  }

  for (const [roomName, list] of byRoom.entries()) {
    const activeWatts = list
      .filter((a) => a.status)
      .reduce((sum, a) => sum + a.powerRatingWatts * (a.quantity || 1), 0);

    if (activeWatts > CIRCUIT_LIMIT_WATTS) {
      factors.push({
        title: `Overloaded Circuit — ${roomName}`,
        severity: "High",
        description: `Active appliances in ${roomName} draw about ${activeWatts}W simultaneously, above the safe ${CIRCUIT_LIMIT_WATTS}W circuit ceiling.`,
        recommendation: "Avoid running high-wattage appliances in this room at the same time, or split them across separate circuits.",
      });
    } else if (activeWatts > CIRCUIT_LIMIT_WATTS * 0.75) {
      factors.push({
        title: `Circuit Nearing Capacity — ${roomName}`,
        severity: "Medium",
        description: `Active load in ${roomName} is around ${activeWatts}W, approaching the ${CIRCUIT_LIMIT_WATTS}W safe ceiling.`,
        recommendation: "Keep an eye on adding more high-power devices to this room.",
      });
    }
  }

  // Ageing appliances
  for (const a of appliances) {
    if (a.installedYear && now - a.installedYear >= AGEING_THRESHOLD_YEARS) {
      factors.push({
        title: `Ageing Appliance — ${a.name}`,
        severity: now - a.installedYear >= 8 ? "High" : "Medium",
        description: `${a.name} has been in use for ${now - a.installedYear}+ years and may draw more power than its rated wattage.`,
        recommendation: "Schedule a maintenance inspection or consider replacing with a 5-star rated model.",
      });
    }
  }

  // Phantom / standby load
  const phantomDevices = appliances.filter(
    (a) => PHANTOM_LOAD_DEVICE_TYPES.includes(a.deviceType) && a.status
  );
  if (phantomDevices.length > 0) {
    factors.push({
      title: `Standby Load — ${phantomDevices.map((d) => d.name).join(", ")}`,
      severity: "Low",
      description: "These devices likely draw phantom power even when idle or on standby overnight.",
      recommendation: "Use a smart power strip to cut standby draw when not in active use.",
    });
  }

  // Score: start at 100 (perfectly safe), subtract weighted severities, floor at 0
  let riskScore = 100;
  for (const f of factors) {
    riskScore -= severityRank(f.severity) * 8;
  }
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Convention: lower score displayed = safer in the UI, so we invert here
  // to match the frontend's "lower is safer" convention (0-100 risk index).
  const riskIndex = 100 - riskScore;

  return { riskScore: riskIndex, factors };
}

module.exports = { analyzeRisk };
