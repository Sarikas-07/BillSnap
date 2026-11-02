// Centralised demo data for Stage 1 (no backend).
// Swap this module for real API calls in a later stage.

export const currentUser = {
  name: "Jonathan Mehta",
  email: "jonathan.mehta@example.com",
  plan: "Premium Plan",
  avatarInitials: "JM",
  homeName: "Mehta Residence",
  address: "204, Baner Road, Pune, MH",
};

export const kpis = {
  currentLoad: { value: 24.5, unit: "kW", trend: 4.2 },
  systemHealth: { value: 98.4, unit: "%", trend: 0.6 },
  monthlyUsage: { value: 285, unit: "kWh", trend: -6.1 },
  estimatedBill: { value: 2345, unit: "₹", trend: -3.4 },
};

export const rooms = [
  { id: "living-room", name: "Living Room", devices: 5, usageKwh: 92, monthlyCost: 812, icon: "sofa" },
  { id: "kitchen", name: "Kitchen", devices: 4, usageKwh: 61, monthlyCost: 534, icon: "cooking" },
  { id: "bedroom", name: "Bedroom", devices: 3, usageKwh: 58, monthlyCost: 505, icon: "bed" },
  { id: "utility-room", name: "Utility Room", devices: 2, usageKwh: 42, monthlyCost: 342, icon: "washer" },
  { id: "bathroom", name: "Bathroom", devices: 1, usageKwh: 12, monthlyCost: 98, icon: "shower" },
  { id: "study", name: "Study", devices: 3, usageKwh: 20, monthlyCost: 175, icon: "desk" },
];

export const devices = [
  { id: 1, name: "Air Conditioner", room: "Bedroom", power: "1500 W", hoursDaily: 6, monthlyUnits: "270 kWh", status: true },
  { id: 2, name: "Refrigerator", room: "Kitchen", power: "200 W", hoursDaily: 24, monthlyUnits: "144 kWh", status: true },
  { id: 3, name: "Smart TV", room: "Living Room", power: "120 W", hoursDaily: 4, monthlyUnits: "14.4 kWh", status: true },
  { id: 4, name: "Washing Machine", room: "Utility Room", power: "500 W", hoursDaily: 1, monthlyUnits: "15 kWh", status: false },
  { id: 5, name: "Ceiling Fan", room: "Bedroom", power: "75 W", hoursDaily: 12, monthlyUnits: "27 kWh", status: true },
  { id: 6, name: "LED Bulb (9W)", room: "Bedroom", power: "9 W", hoursDaily: 5, monthlyUnits: "1.35 kWh", status: true },
  { id: 7, name: "Microwave Oven", room: "Kitchen", power: "1200 W", hoursDaily: 0.5, monthlyUnits: "18 kWh", status: true },
  { id: 8, name: "Water Heater", room: "Bathroom", power: "2000 W", hoursDaily: 1, monthlyUnits: "60 kWh", status: true },
];

export const deviceTypes = [
  "Air Conditioner", "Refrigerator", "Smart TV", "Washing Machine", "Ceiling Fan",
  "LED Bulb", "Microwave Oven", "Water Heater", "Geyser", "Water Purifier",
];

export const weeklyProduction = [
  { day: "Mon", usage: 22, saved: 6 },
  { day: "Tue", usage: 28, saved: 8 },
  { day: "Wed", usage: 34, saved: 9 },
  { day: "Thu", usage: 24, saved: 5 },
  { day: "Fri", usage: 30, saved: 10 },
  { day: "Sat", usage: 26, saved: 7 },
  { day: "Sun", usage: 20, saved: 6 },
];

export const consumptionTrend = [
  { date: "01 May", units: 8.2 }, { date: "03 May", units: 9.1 }, { date: "05 May", units: 7.6 },
  { date: "07 May", units: 10.4 }, { date: "09 May", units: 9.8 }, { date: "11 May", units: 8.9 },
  { date: "13 May", units: 11.2 }, { date: "15 May", units: 9.4 }, { date: "17 May", units: 8.1 },
  { date: "19 May", units: 10.9 }, { date: "21 May", units: 9.6 }, { date: "23 May", units: 8.7 },
  { date: "25 May", units: 10.1 }, { date: "27 May", units: 9.3 }, { date: "29 May", units: 8.8 },
];

export const roomUsageSplit = [
  { name: "Living Room", value: 92, color: "#2E6FF2" },
  { name: "Kitchen", value: 61, color: "#FDB813" },
  { name: "Bedroom", value: 58, color: "#17B892" },
  { name: "Utility", value: 42, color: "#6EA1FF" },
  { name: "Bathroom", value: 12, color: "#FF8A1E" },
  { name: "Study", value: 20, color: "#8B5CF6" },
];

export const predictionData = [
  { month: "Feb", actual: 2180, predicted: null },
  { month: "Mar", actual: 2260, predicted: null },
  { month: "Apr", actual: 2295, predicted: null },
  { month: "May", actual: 2345, predicted: null },
  { month: "Jun", actual: null, predicted: 2410 },
  { month: "Jul", actual: null, predicted: 2530 },
  { month: "Aug", actual: null, predicted: 2610 },
];

export const billSlabs = [
  { slab: "Slab 1", range: "0 - 100", units: 100, rate: 5.5, amount: 550 },
  { slab: "Slab 2", range: "101 - 300", units: 185, rate: 6.5, amount: 1202.5 },
  { slab: "Slab 3", range: "> 300", units: 0, rate: 7.5, amount: 0 },
];

export const billSummary = {
  totalUnits: 285,
  totalBill: 2345,
  dailyUnits: 9.5,
  carbonFootprint: 205,
  electricityCharge: 1876,
  fixedCharge: 150,
  taxesFees: 319,
  dueDate: "10 June 2026",
  status: "Good",
};

export const savingsTips = [
  { title: "Reduce AC Usage", impact: "High Impact", detail: "Reducing AC usage by 1 hour per day can save up to ₹450 per month.", saving: 450 },
  { title: "Use LED Bulbs", impact: "Medium Impact", detail: "Replace old bulbs with LED to save up to 80% on lighting.", saving: 130 },
  { title: "Unplug Devices", impact: "Low Impact", detail: "Unplug devices when not in use to avoid standby power consumption.", saving: 60 },
  { title: "Use 5 Star Rated Appliances", impact: "High Impact", detail: "5 star rated appliances consume less energy and save more.", saving: 200 },
];

export const riskFactors = [
  { id: 1, title: "Overloaded Circuit — Kitchen", severity: "High", description: "Simultaneous use of microwave and water heater is nearing the circuit's rated capacity.", recommendation: "Avoid running both appliances at the same time." },
  { id: 2, title: "Ageing Water Heater", severity: "Medium", description: "The water heater has been active for 5+ years and shows a rising power draw pattern.", recommendation: "Schedule a maintenance inspection this quarter." },
  { id: 3, title: "Standby Load — Living Room", severity: "Low", description: "TV and set-top box draw phantom load overnight.", recommendation: "Use a smart power strip to cut standby draw." },
  { id: 4, title: "Voltage Fluctuation", severity: "Medium", description: "Minor voltage spikes detected during peak evening hours.", recommendation: "Consider a voltage stabiliser for sensitive electronics." },
];

export const riskScore = 28; // out of 100, lower is safer

export const reportsHistory = [
  { id: "R-2026-05", month: "May 2026", totalBill: 2345, totalUnits: 285, carbon: 205 },
  { id: "R-2026-04", month: "April 2026", totalBill: 2295, totalUnits: 279, carbon: 198 },
  { id: "R-2026-03", month: "March 2026", totalBill: 2260, totalUnits: 271, carbon: 191 },
  { id: "R-2026-02", month: "February 2026", totalBill: 2180, totalUnits: 260, carbon: 182 },
];

export const chatSuggestions = [
  "Why is my bill higher this month?",
  "Which appliance uses the most power?",
  "Give me 3 ways to save on my next bill",
];
