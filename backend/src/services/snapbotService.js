/**
 * SnapBot — rule-based FAQ/intent engine for BillSnap.
 * Matches the user's message against known intents and answers using
 * their real rooms/appliances/bills data. No external LLM required;
 * swap matchIntent() for an LLM call later without touching the routes.
 */

const Appliance = require("../models/Appliance");
const Bill = require("../models/Bill");
const { generateSavingsTips } = require("./savingsService");

const INTENTS = [
  {
    key: "greeting",
    patterns: [/^hi\b/i, /^hello\b/i, /^hey\b/i],
  },
  {
    key: "highest_appliance",
    patterns: [/most (power|energy|electricity)/i, /which appliance.*most/i, /biggest consumer/i],
  },
  {
    key: "bill_increase",
    patterns: [/why.*(bill|cost).*(higher|increase|more|up)/i, /bill went up/i],
  },
  {
    key: "savings_tips",
    patterns: [/save (money|electricity|power|energy)/i, /saving tips?/i, /reduce.*bill/i, /ways to save/i],
  },
  {
    key: "current_bill",
    patterns: [/(what|how much).*(current|latest|this month).*bill/i, /my bill amount/i],
  },
  {
    key: "prediction",
    patterns: [/predict/i, /next month.*bill/i, /forecast/i],
  },
  {
    key: "risk",
    patterns: [/risk/i, /safe(ty)?/i, /overload/i, /circuit/i],
  },
  {
    key: "room_usage",
    patterns: [/which room.*most/i, /room.*consum/i],
  },
  {
    key: "help",
    patterns: [/what can you do/i, /help/i, /^\?+$/],
  },
];

function matchIntent(message) {
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(message))) return intent.key;
  }
  return "fallback";
}

async function buildAnswer(intent, userId, message) {
  switch (intent) {
    case "greeting":
      return "Hi! I'm SnapBot. Ask me about your bill, appliances, rooms, predictions, or how to save more.";

    case "highest_appliance": {
      const top = await Appliance.findOne({ user: userId }).sort({ monthlyUsageKwh: -1 }).populate("room", "name");
      if (!top) return "You haven't added any appliances yet — add some in Appliance Management and I'll tell you which one uses the most power.";
      return `Your ${top.name} in ${top.room?.name || "your home"} uses the most power — about ${top.monthlyUsageKwh} kWh/month.`;
    }

    case "bill_increase": {
      const bills = await Bill.find({ user: userId }).sort({ createdAt: -1 }).limit(2);
      if (bills.length < 2) return "I need at least two bills on file to compare — upload your last bill from the Bill Upload page.";
      const [latest, prev] = bills;
      const diff = (latest.billAmount || 0) - (prev.billAmount || 0);
      if (diff <= 0) return `Good news — your latest bill (₹${latest.billAmount}) is actually lower than the previous one (₹${prev.billAmount}).`;
      return `Your latest bill (₹${latest.billAmount}) is ₹${diff} higher than the previous one (₹${prev.billAmount}). This is usually driven by higher AC or water heater usage — check the Risk Analysis and Analysis pages for specifics.`;
    }

    case "savings_tips": {
      const appliances = await Appliance.find({ user: userId });
      const tips = generateSavingsTips(appliances);
      const top = tips[0];
      return `Here's my top tip: ${top.title} — ${top.detail}`;
    }

    case "current_bill": {
      const latest = await Bill.findOne({ user: userId }).sort({ createdAt: -1 });
      if (!latest) return "You don't have a bill on file yet. Upload one from the Bill Upload page and I'll remember it.";
      return `Your latest recorded bill is ₹${latest.billAmount} for ${latest.billingMonth || "the most recent cycle"}, covering ${latest.unitsConsumed || "—"} units.`;
    }

    case "prediction":
      return "Head to the Prediction Dashboard — it forecasts your next 1-3 bills using your billing history and seasonal patterns.";

    case "risk":
      return "Check the Risk Analysis page — I flag overloaded circuits, ageing appliances, and standby/phantom loads there, each with a recommendation.";

    case "room_usage": {
      const topAppliance = await Appliance.findOne({ user: userId }).sort({ monthlyUsageKwh: -1 }).populate("room", "name");
      if (!topAppliance) return "Add some rooms and appliances first, and I'll tell you which room uses the most energy.";
      return `Based on your appliances, ${topAppliance.room?.name || "one room"} looks like your biggest consumer right now.`;
    }

    case "help":
      return "I can answer questions about your bill, which appliances use the most power, savings tips, bill predictions, and safety risks. Try asking \"why is my bill higher this month?\"";

    default:
      return "I'm still learning! I can help with questions about your electricity bill, appliances, usage, predictions, and safety risks. Try rephrasing, or check the relevant dashboard page.";
  }
}

async function getSnapbotReply(userId, message) {
  const intent = matchIntent(message);
  const text = await buildAnswer(intent, userId, message);
  return { text, intent };
}

module.exports = { getSnapbotReply, matchIntent };
