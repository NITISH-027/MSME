export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trends as mockTrends, inventory as mockInventory } from "@/lib/data";
import type { Trend, InventoryItem } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import {
  Lightbulb,
  TrendingUp,
  Flame,
  Beaker,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

function spikeBadge(pct: number) {
  if (pct >= 300) return { variant: "destructive" as const, label: "Viral 🔥" };
  if (pct >= 200) return { variant: "default" as const,     label: "Hot 📈" };
  return { variant: "secondary" as const, label: "Rising" };
}

function spikeBarColor(pct: number) {
  if (pct >= 300) return "bg-red-500";
  if (pct >= 200) return "bg-orange-500";
  return "bg-blue-500";
}

// Hardcoded actionable R&D suggestions that link trends to inventory
const rdSuggestions = [
  {
    trend: "Penguin Reels",
    spike: 400,
    title: "Limited-Edition Penguin Plush Launch",
    materials: ["White Fabric: 1,200m available ✅", "Black Dye: 80L (LOW ⚠️ — order 120L more)"],
    units: 500,
    margin: 40,
    effort: "Low",
    icon: "🐧",
    action: "Manufacture 500 limited-edition Penguin Plush units. Source Black Dye urgently. Launch on Flipkart & Instagram within 10 days to capitalise on viral momentum.",
  },
  {
    trend: "Customised Gifts",
    spike: 320,
    title: "Personalised Embroidered Toy Service",
    materials: ["Thread (White): 600 spools ✅", "Thread (Black): 150 spools (LOW ⚠️)"],
    units: 300,
    margin: 35,
    effort: "Medium",
    icon: "🧵",
    action: "Activate the Embroidery Unit and offer custom name embroidery. Upsell at ₹150 extra per unit. Partner with gifting portals for Valentine's Day and birthdays.",
  },
  {
    trend: "Eco-Friendly Toys",
    spike: 280,
    title: "Organic Cotton Stuffed Animal Line",
    materials: ["Polyester Stuffing: 950 kg ✅", "White Fabric: 1,200m ✅"],
    units: 400,
    margin: 45,
    effort: "High",
    icon: "🌿",
    action: "Source organic cotton and natural dyes. Repackage existing toys with eco-labels. Premium price segment (+25%). Apply for GreenCo certification for B2B credibility.",
  },
  {
    trend: "Pet Lookalike Toys",
    spike: 310,
    title: "Custom Pet-Lookalike Plush Orders",
    materials: ["Polyester Stuffing: 950 kg ✅", "Plastic Eyes: 3,000 pieces ✅"],
    units: 200,
    margin: 55,
    effort: "Medium",
    icon: "🐾",
    action: "Accept custom orders via Instagram DMs. Partner with pet influencers (10K+ followers) for promotions. Charge ₹600–₹1,200 per custom unit. Expected margin: 55%.",
  },
];

export default async function InnovationPage() {
  let trends: Trend[] = mockTrends;
  let inventory: InventoryItem[] = mockInventory;

  if (supabase) {
    const [trendsRes, inventoryRes] = await Promise.all([
      supabase.from("trends").select("*").order("search_spike_percent", { ascending: false }),
      supabase.from("inventory").select("*").order("id", { ascending: true }),
    ]);
    if (trendsRes.data) trends = trendsRes.data as Trend[];
    if (inventoryRes.data) inventory = inventoryRes.data as InventoryItem[];
  }

  const maxSpike = Math.max(...trends.map((t) => t.search_spike_percent));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Innovation Tracking</h2>
        <p className="text-sm text-gray-500 mt-1">
          Trend radar, viral market signals, and AI-powered R&D suggestions tailored to your inventory.
        </p>
      </div>

      {/* Trend Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trend Radar — Live Market Signals
          </CardTitle>
          <CardDescription>
            Social media & search trend spikes. Higher bar = stronger opportunity signal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trends.map((trend) => {
            const { variant, label } = spikeBadge(trend.search_spike_percent);
            const pct = Math.round((trend.search_spike_percent / maxSpike) * 100);
            return (
              <div key={trend.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-800">{trend.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-sm font-bold text-green-700">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      +{trend.search_spike_percent}%
                    </span>
                    <Badge variant={variant}>{label}</Badge>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${spikeBarColor(trend.search_spike_percent)} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{trend.recommended_action}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* R&D Suggestions Engine */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Actionable R&D Suggestions</h3>
          <Badge variant="default" className="ml-2">AI-Powered</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Based on trending signals and your <strong>current inventory</strong>, here are the top opportunities
          your factory can act on <em>right now</em>.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rdSuggestions.map((s) => (
            <Card key={s.trend} className="border-l-4 border-l-purple-400">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <CardTitle className="text-sm">{s.title}</CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Triggered by: <strong>{s.trend}</strong> (+{s.spike}%)
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={s.effort === "Low" ? "success" : s.effort === "Medium" ? "warning" : "secondary"}
                  >
                    {s.effort} Effort
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* KPIs */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-blue-50 p-2.5">
                    <p className="text-xs text-gray-500">Estimated Units</p>
                    <p className="text-lg font-bold text-blue-700">{s.units}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2.5">
                    <p className="text-xs text-gray-500">Expected Margin</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                      <p className="text-lg font-bold text-green-700">{s.margin}%</p>
                    </div>
                  </div>
                </div>

                {/* Material Check */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                    <Beaker className="h-3.5 w-3.5" />
                    Material Readiness Check
                  </p>
                  <ul className="space-y-1">
                    {s.materials.map((m) => (
                      <li key={m} className={`text-xs px-2 py-1 rounded ${m.includes("LOW") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Recommendation */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
                  <p className="text-xs font-semibold text-purple-800 mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Recommended Action
                  </p>
                  <p className="text-xs text-purple-700 leading-relaxed">{s.action}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inventory snapshot for innovation planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-teal-600" />
            Raw Material Availability for Innovation
          </CardTitle>
          <CardDescription>
            Current stock snapshot to inform your R&D production decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Material</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Available</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Unit</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">R&D Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => {
                const ratio = item.current_stock / item.min_required;
                const ready = ratio >= 1.5 ? "High" : ratio >= 1 ? "Medium" : "Low";
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.item_name}</td>
                    <td className="px-4 py-3 text-right text-gray-700 font-semibold">{item.current_stock.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={ready === "High" ? "success" : ready === "Medium" ? "warning" : "destructive"}
                      >
                        {ready}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
