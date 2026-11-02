/**
 * Generates personalised savings tips from a user's appliances.
 * Simple, explainable rules — easy to extend without needing a model.
 */

const RATE_PER_KWH = 6.5; // ₹ approx blended slab rate used for illustrative savings math

function generateSavingsTips(appliances) {
  const tips = [];

  const ac = appliances.filter((a) => a.deviceType === "Air Conditioner" && a.status);
  if (ac.length > 0) {
    const totalHours = ac.reduce((s, a) => s + a.hoursUsedDaily, 0);
    if (totalHours >= 4) {
      const savingKwhPerMonth = ac.reduce((s, a) => s + (a.powerRatingWatts / 1000) * a.quantity, 0) * 30;
      tips.push({
        title: "Reduce AC Usage",
        impact: "High Impact",
        detail: `Reducing AC usage by 1 hour per day can save up to ₹${Math.round(savingKwhPerMonth * RATE_PER_KWH)} per month.`,
        saving: Math.round(savingKwhPerMonth * RATE_PER_KWH),
      });
    }
  }

  const oldBulbs = appliances.filter((a) => a.deviceType.toLowerCase().includes("bulb") && a.powerRatingWatts > 9);
  if (oldBulbs.length > 0) {
    tips.push({
      title: "Use LED Bulbs",
      impact: "Medium Impact",
      detail: "Replace old bulbs with LED to save up to 80% on lighting.",
      saving: 130,
    });
  }

  const standbyDevices = appliances.filter((a) =>
    ["Smart TV", "Set-Top Box", "Microwave Oven"].includes(a.deviceType)
  );
  if (standbyDevices.length > 0) {
    tips.push({
      title: "Unplug Devices",
      impact: "Low Impact",
      detail: "Unplug devices when not in use to avoid standby power consumption.",
      saving: 60,
    });
  }

  const oldAppliances = appliances.filter((a) => a.installedYear && new Date().getFullYear() - a.installedYear >= 6);
  if (oldAppliances.length > 0) {
    tips.push({
      title: "Use 5 Star Rated Appliances",
      impact: "High Impact",
      detail: "5 star rated appliances consume less energy and save more over their lifetime.",
      saving: 200,
    });
  }

  if (tips.length === 0) {
    tips.push({
      title: "You're running efficiently",
      impact: "Low Impact",
      detail: "No major savings opportunities detected right now — keep monitoring your usage trends.",
      saving: 0,
    });
  }

  return tips;
}

module.exports = { generateSavingsTips };
