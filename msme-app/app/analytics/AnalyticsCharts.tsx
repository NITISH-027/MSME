"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity, BarChart2, ShoppingCart } from "lucide-react";

export type SalesDataPoint = { month: string; revenue: number; costs: number };
export type OeeDataPoint = { day: string; oee: number; defect_rate: number };
export type EfficiencyDataPoint = { name: string; efficiency: number; status: string };
export type OrderPipelinePoint = { status: string; count: number };

const formatRupee = (value: number) => `₹${(value / 1000).toFixed(0)}K`;

const PIE_COLORS: Record<string, string> = {
  Pending:          "#f59e0b",
  "In Production":  "#3b82f6",
  "Ready to Ship":  "#8b5cf6",
  Delivered:        "#10b981",
};
const FALLBACK_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f97316"];

function efficiencyFill(entry: EfficiencyDataPoint): string {
  if (entry.status === "Under Maintenance") return "#ef4444";
  if (entry.status === "Idle") return "#9ca3af";
  if (entry.efficiency >= 85) return "#10b981";
  if (entry.efficiency >= 70) return "#3b82f6";
  return "#f59e0b";
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 rounded-lg bg-gray-50 border border-dashed border-gray-200">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
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

export function AnalyticsCharts({
  salesData,
  oeeData,
  efficiencyData,
  orderPipelineData,
  avgOEE,
  avgDefect,
}: {
  salesData: SalesDataPoint[];
  oeeData: OeeDataPoint[];
  efficiencyData: EfficiencyDataPoint[];
  orderPipelineData: OrderPipelinePoint[];
  avgOEE: number;
  avgDefect: string;
}) {
  return (
    <>
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
                formatter={(value?: number | string, name?: string) => [
                  `₹${Number(value ?? 0).toLocaleString()}`,
                  name ?? "",
                ]}
                contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costs" name="Costs" fill="#f87171" radius={[4, 4, 0, 0]} />
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
            <BenchmarkCard
              label="Your Avg OEE"
              value={`${avgOEE}%`}
              color={avgOEE >= 80 ? "text-blue-600" : "text-red-600"}
              bg={avgOEE >= 80 ? "bg-blue-50" : "bg-red-50"}
            />
            <BenchmarkCard
              label="Avg Defect Rate"
              value={`${avgDefect}%`}
              color={Number(avgDefect) < 3 ? "text-green-600" : "text-yellow-600"}
              bg={Number(avgDefect) < 3 ? "bg-green-50" : "bg-yellow-50"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Machine Efficiency Bar Chart — live from Supabase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Machine Efficiency (Live)
          </CardTitle>
          <CardDescription>
            Current efficiency percentage for each machine fetched from the database.
            Running machines target ≥85% efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {efficiencyData.length === 0 ? (
            <EmptyState message="No machine data available yet." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={efficiencyData}
                margin={{ top: 5, right: 20, left: 10, bottom: 64 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value?: number | string) => [`${value}%`, "Efficiency"]}
                  contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                />
                <Bar dataKey="efficiency" name="Efficiency (%)" radius={[4, 4, 0, 0]}>
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`eff-${index}`} fill={efficiencyFill(entry)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {efficiencyData.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block" /> ≥85% (Target)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-blue-500 inline-block" /> 70–84%</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-yellow-500 inline-block" /> &lt;70%</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-gray-400 inline-block" /> Idle</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-red-500 inline-block" /> Maintenance</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Pipeline Pie Chart — live from Supabase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Order Pipeline (Live)
          </CardTitle>
          <CardDescription>
            Number of orders in each production stage fetched from the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orderPipelineData.length === 0 ? (
            <EmptyState message="No order data available yet." />
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={orderPipelineData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {orderPipelineData.map((entry, index) => (
                      <Cell
                        key={`pipe-${index}`}
                        fill={PIE_COLORS[entry.status] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value?: number | string) => [value ?? 0, "Orders"]}
                    contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Stat list alongside the pie */}
              <div className="flex flex-col gap-3 min-w-[180px]">
                {orderPipelineData.map((entry, index) => (
                  <div key={entry.status} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            PIE_COLORS[entry.status] ??
                            FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                        }}
                      />
                      <span className="text-sm text-gray-700">{entry.status}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
