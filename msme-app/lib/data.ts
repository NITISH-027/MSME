// Mock data matching the Supabase schema defined in supabase-schema.sql
// Replace these with real Supabase queries once you configure your credentials.

export type InventoryItem = {
  id: number;
  item_name: string;
  current_stock: number;
  min_required: number;
  unit: string;
};

export type Machine = {
  id: number;
  name: string;
  status: "Running" | "Idle" | "Under Maintenance";
  efficiency_percent: number;
  max_capacity: number;
  limitations: string;
};

export type Order = {
  id: number;
  client: string;
  product: string;
  quantity: number;
  status: "Pending" | "In Production" | "Ready to Ship" | "Delivered";
  delivery_date: string;
};

export type Trend = {
  id: number;
  keyword: string;
  search_spike_percent: number;
  recommended_action: string;
};

export const inventory: InventoryItem[] = [
  { id: 1,  item_name: "White Fabric",         current_stock: 1200, min_required: 500,  unit: "metres" },
  { id: 2,  item_name: "Black Dye",            current_stock: 80,   min_required: 200,  unit: "litres" },
  { id: 3,  item_name: "Polyester Stuffing",   current_stock: 950,  min_required: 300,  unit: "kg" },
  { id: 4,  item_name: "Cardboard Packaging",  current_stock: 40,   min_required: 150,  unit: "boxes" },
  { id: 5,  item_name: "Zipper",               current_stock: 2500, min_required: 1000, unit: "pieces" },
  { id: 6,  item_name: "Thread (White)",       current_stock: 600,  min_required: 400,  unit: "spools" },
  { id: 7,  item_name: "Thread (Black)",       current_stock: 150,  min_required: 400,  unit: "spools" },
  { id: 8,  item_name: "Plastic Eyes",         current_stock: 3000, min_required: 1500, unit: "pieces" },
  { id: 9,  item_name: "Hang Tags",            current_stock: 90,   min_required: 500,  unit: "pieces" },
  { id: 10, item_name: "Bubble Wrap",          current_stock: 200,  min_required: 300,  unit: "rolls" },
];

export const machines: Machine[] = [
  { id: 1, name: "Sewing Machine A",  status: "Running",           efficiency_percent: 88,  max_capacity: 200, limitations: "Motor needs servicing every 500 hours" },
  { id: 2, name: "Cutting Machine",   status: "Running",           efficiency_percent: 95,  max_capacity: 500, limitations: "Blade sharpening required weekly" },
  { id: 3, name: "Embroidery Unit",   status: "Idle",              efficiency_percent: 0,   max_capacity: 150, limitations: "Awaiting design file upload" },
  { id: 4, name: "Packaging Machine", status: "Running",           efficiency_percent: 100, max_capacity: 300, limitations: "At full capacity – bottleneck identified" },
  { id: 5, name: "Washing Machine",   status: "Under Maintenance", efficiency_percent: 0,   max_capacity: 400, limitations: "Drum bearing replacement in progress" },
  { id: 6, name: "Printing Press",    status: "Running",           efficiency_percent: 72,  max_capacity: 250, limitations: "Ink cartridges running low" },
  { id: 7, name: "Sewing Machine B",  status: "Running",           efficiency_percent: 81,  max_capacity: 200, limitations: "Thread tension adjustment needed" },
  { id: 8, name: "Quality Scanner",   status: "Idle",              efficiency_percent: 0,   max_capacity: 600, limitations: "Awaiting operator assignment" },
];

export const orders: Order[] = [
  { id: 1, client: "Flipkart",        product: "Stuffed Penguin (Large)",   quantity: 500,  status: "In Production",  delivery_date: "2026-03-15" },
  { id: 2, client: "Amazon India",    product: "Stuffed Penguin (Small)",   quantity: 1200, status: "Pending",         delivery_date: "2026-03-22" },
  { id: 3, client: "Myntra",          product: "Stuffed Polar Bear",        quantity: 300,  status: "Ready to Ship",   delivery_date: "2026-03-10" },
  { id: 4, client: "Meesho",          product: "Stuffed Elephant (Grey)",   quantity: 800,  status: "In Production",   delivery_date: "2026-03-18" },
  { id: 5, client: "FirstCry",        product: "Stuffed Bunny (White)",     quantity: 450,  status: "Pending",         delivery_date: "2026-03-28" },
  { id: 6, client: "Snapdeal",        product: "Stuffed Penguin (Large)",   quantity: 200,  status: "Delivered",       delivery_date: "2026-03-05" },
  { id: 7, client: "Reliance Retail", product: "Plush Keychain Penguin",    quantity: 2000, status: "Pending",         delivery_date: "2026-04-01" },
  { id: 8, client: "BigBasket Gifts", product: "Stuffed Penguin Gift Set",  quantity: 150,  status: "In Production",   delivery_date: "2026-03-20" },
];

export const trends: Trend[] = [
  { id: 1, keyword: "Penguin Reels",         search_spike_percent: 400, recommended_action: "Launch limited-edition Penguin plush series. Current stock of white & black materials can yield ~500 units. Expected margin: 40%." },
  { id: 2, keyword: "Eco-Friendly Toys",     search_spike_percent: 280, recommended_action: "Source organic cotton and natural dyes. Premium pricing (+25%) can increase margin. Promote sustainability certifications." },
  { id: 3, keyword: "Customised Gifts",      search_spike_percent: 320, recommended_action: "Add personalised name embroidery service. Requires embroidery unit activation. Upsell potential: ₹150 per unit." },
  { id: 4, keyword: "Festive Gifting 2026",  search_spike_percent: 190, recommended_action: "Pre-produce 1,000 gift sets for Diwali. Begin now to meet October demand spike." },
  { id: 5, keyword: "Miniature Collections", search_spike_percent: 230, recommended_action: "Develop a 5-piece miniature animal set. Low material cost, high perceived value. Expected ROI: 60%." },
  { id: 6, keyword: "ASMR Unboxing",         search_spike_percent: 175, recommended_action: "Invest in premium packaging with tissue paper and ribbon. Improves brand recall and social sharing." },
  { id: 7, keyword: "Pet Lookalike Toys",    search_spike_percent: 310, recommended_action: "Offer custom pet-lookalike plush orders. Partner with Instagram pet influencers for promotions." },
  { id: 8, keyword: "AR Toy Integration",    search_spike_percent: 150, recommended_action: "Explore AR QR code on packaging linking to animated stories. Low-cost tech upgrade with high engagement value." },
];

// Analytics mock data
export const salesData = [
  { month: "Oct 2025", revenue: 420000, costs: 280000 },
  { month: "Nov 2025", revenue: 510000, costs: 310000 },
  { month: "Dec 2025", revenue: 680000, costs: 380000 },
  { month: "Jan 2026", revenue: 390000, costs: 260000 },
  { month: "Feb 2026", revenue: 540000, costs: 330000 },
  { month: "Mar 2026", revenue: 620000, costs: 350000 },
];

export const oeeData = [
  { day: "Mon", oee: 74, defect_rate: 4.2 },
  { day: "Tue", oee: 80, defect_rate: 3.1 },
  { day: "Wed", oee: 78, defect_rate: 3.8 },
  { day: "Thu", oee: 85, defect_rate: 2.5 },
  { day: "Fri", oee: 82, defect_rate: 2.9 },
  { day: "Sat", oee: 70, defect_rate: 5.1 },
];

// Gantt / schedule mock data
export type ScheduleJob = {
  id: number;
  machine: string;
  job: string;
  start: number; // hour (0-24)
  duration: number; // hours
  color: string;
};

export const scheduleJobs: ScheduleJob[] = [
  { id: 1, machine: "Sewing Machine A",  job: "Penguin Large (Flipkart)",  start: 8,  duration: 4, color: "bg-blue-500" },
  { id: 2, machine: "Sewing Machine A",  job: "Polar Bear (Myntra)",       start: 13, duration: 3, color: "bg-purple-500" },
  { id: 3, machine: "Cutting Machine",   job: "Penguin Small (Amazon)",    start: 7,  duration: 6, color: "bg-green-500" },
  { id: 4, machine: "Cutting Machine",   job: "Bunny White (FirstCry)",    start: 14, duration: 3, color: "bg-teal-500" },
  { id: 5, machine: "Embroidery Unit",   job: "Custom Embroidery Batch",   start: 9,  duration: 5, color: "bg-yellow-500" },
  { id: 6, machine: "Packaging Machine", job: "Polar Bear (Myntra) Pack",  start: 8,  duration: 8, color: "bg-orange-500" },
  { id: 7, machine: "Printing Press",    job: "Hang Tags Print",           start: 10, duration: 4, color: "bg-pink-500" },
  { id: 8, machine: "Sewing Machine B",  job: "Elephant Grey (Meesho)",    start: 8,  duration: 7, color: "bg-indigo-500" },
];
