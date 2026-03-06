export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { salesData, oeeData, machines as mockMachines, orders as mockOrders } from "@/lib/data";
import type { Machine, Order } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { TrendingUp, IndianRupee, Zap } from "lucide-react";
import { AnalyticsCharts } from "./AnalyticsCharts";
import ExportReportButton from "@/components/ExportReportButton";

async function fetchMachines(): Promise<Machine[]> {
  if (!supabase) return mockMachines;
  const { data, error } = await supabase
    .from("machines")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.error("Failed to fetch machines from Supabase, falling back to mock data:", error.message);
    return mockMachines;
  }
  return (data as Machine[] | null) ?? mockMachines;
}

async function fetchOrders(): Promise<Order[]> {
  if (!supabase) return mockOrders;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.error("Failed to fetch orders from Supabase, falling back to mock data:", error.message);
    return mockOrders;
  }
  return (data as Order[] | null) ?? mockOrders;
}

export default async function AnalyticsPage() {
  const [machines, orders] = await Promise.all([fetchMachines(), fetchOrders()]);

  // KPI calculations (from mock sales/oee data)
  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalCosts   = salesData.reduce((s, d) => s + d.costs, 0);
  const totalProfit  = totalRevenue - totalCosts;
  const avgOEE       = Math.round(oeeData.reduce((s, d) => s + d.oee, 0) / oeeData.length);
  const avgDefect    = (oeeData.reduce((s, d) => s + d.defect_rate, 0) / oeeData.length).toFixed(1);

  // Real metrics derived from Supabase data
  const efficiencyData = machines.map((m) => ({
    name: m.name,
    efficiency: m.efficiency_percent,
    status: m.status,
  }));

  const statusCounts: Record<string, number> = {};
  for (const order of orders) {
    statusCounts[order.status] = (statusCounts[order.status] ?? 0) + 1;
  }
  const orderPipelineData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">
              Sales performance, system efficiency, OEE and defect rates.
            </p>
          </div>
          <ExportReportButton />
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Total Revenue (6M)" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={IndianRupee} color="text-green-600" bg="bg-green-50" />
        <KPICard label="Total Costs (6M)"   value={`₹${(totalCosts / 100000).toFixed(1)}L`}   icon={IndianRupee} color="text-red-600"   bg="bg-red-50" />
        <KPICard label="Net Profit (6M)"    value={`₹${(totalProfit / 100000).toFixed(1)}L`}   icon={TrendingUp}  color="text-blue-600"  bg="bg-blue-50" />
        <KPICard label="Avg OEE (Week)"     value={`${avgOEE}%`}                               icon={Zap}         color="text-purple-600" bg="bg-purple-50" />
      </div>

      {/* All charts (client component — Recharts requires browser APIs) */}
      <AnalyticsCharts
        salesData={salesData}
        oeeData={oeeData}
        efficiencyData={efficiencyData}
        orderPipelineData={orderPipelineData}
        avgOEE={avgOEE}
        avgDefect={avgDefect}
      />

      {/* Profit breakdown table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Profit Breakdown</CardTitle>
          <CardDescription>Revenue, costs, and profit margin per month</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Month</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Costs</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Profit</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salesData.map((row) => {
                const profit = row.revenue - row.costs;
                const margin = ((profit / row.revenue) * 100).toFixed(1);
                return (
                  <tr key={row.month} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.month}</td>
                    <td className="px-4 py-3 text-right text-green-700 font-medium">₹{row.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-red-600">₹{row.costs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-blue-700 font-semibold">₹{profit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${Number(margin) >= 30 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {margin}%
                      </span>
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

function KPICard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`rounded-lg p-2 ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
