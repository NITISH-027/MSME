"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { salesData, oeeData } from "@/lib/data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity, IndianRupee, Zap } from "lucide-react";

const formatRupee = (value: number) =>
  `₹${(value / 1000).toFixed(0)}K`;

export default function AnalyticsPage() {
  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalCosts   = salesData.reduce((s, d) => s + d.costs, 0);
  const totalProfit  = totalRevenue - totalCosts;
  const avgOEE       = Math.round(oeeData.reduce((s, d) => s + d.oee, 0) / oeeData.length);
  const avgDefect    = (oeeData.reduce((s, d) => s + d.defect_rate, 0) / oeeData.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sales performance, system efficiency, OEE and defect rates.
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Total Revenue (6M)" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={IndianRupee} color="text-green-600" bg="bg-green-50" />
        <KPICard label="Total Costs (6M)"   value={`₹${(totalCosts / 100000).toFixed(1)}L`}   icon={IndianRupee} color="text-red-600"   bg="bg-red-50" />
        <KPICard label="Net Profit (6M)"    value={`₹${(totalProfit / 100000).toFixed(1)}L`}   icon={TrendingUp}  color="text-blue-600"  bg="bg-blue-50" />
        <KPICard label="Avg OEE (Week)"     value={`${avgOEE}%`}                               icon={Zap}         color="text-purple-600" bg="bg-purple-50" />
      </div>

      {/* Revenue vs Costs Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Sales Performance — Revenue vs. Costs (Last 6 Months)
          </CardTitle>
          <CardDescription>
            Monthly revenue and cost comparison. Profit margin is the gap between the two bars.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={salesData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatRupee} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value?: number | string, name?: string) => [`₹${Number(value ?? 0).toLocaleString()}`, name ?? ""]}
                contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costs"   name="Costs"   fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* OEE & Defect Rate Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            System Efficiency — OEE & Defect Rate (This Week)
          </CardTitle>
          <CardDescription>
            Overall Equipment Effectiveness (OEE) and defect rates across the factory floor.
            Target OEE: 85%+, Target Defect Rate: &lt;3%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={oeeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                domain={[60, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 8]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value?: number | string, name?: string) => [
                  `${value ?? 0}%`,
                  name ?? "",
                ]}
                contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="oee"
                name="OEE (%)"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ fill: "#8b5cf6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="defect_rate"
                name="Defect Rate (%)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ fill: "#f59e0b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* OEE benchmarks */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <BenchmarkCard label="World Class OEE" value="85%+" color="text-green-600" bg="bg-green-50" />
            <BenchmarkCard label="Your Avg OEE" value={`${avgOEE}%`} color={avgOEE >= 80 ? "text-blue-600" : "text-red-600"} bg={avgOEE >= 80 ? "bg-blue-50" : "bg-red-50"} />
            <BenchmarkCard label="Avg Defect Rate" value={`${avgDefect}%`} color={Number(avgDefect) < 3 ? "text-green-600" : "text-yellow-600"} bg={Number(avgDefect) < 3 ? "bg-green-50" : "bg-yellow-50"} />
          </div>
        </CardContent>
      </Card>

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

function BenchmarkCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`rounded-lg p-3 ${bg}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
