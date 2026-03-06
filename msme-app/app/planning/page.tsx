import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inventory, orders as mockOrders, scheduleJobs } from "@/lib/data";
import type { Order } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import CreateOrderModal from "@/components/CreateOrderModal";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  CalendarClock,
  Package,
  Cpu,
} from "lucide-react";

function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<string, { variant: "default" | "success" | "warning" | "secondary"; label: string }> = {
    Pending:          { variant: "secondary", label: "Pending" },
    "In Production":  { variant: "default",   label: "In Production" },
    "Ready to Ship":  { variant: "warning",   label: "Ready to Ship" },
    Delivered:        { variant: "success",   label: "Delivered" },
  };
  const { variant, label } = map[status] ?? { variant: "secondary", label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

// 8-hour work day starting at 7:00
const DAY_START = 7;
const DAY_HOURS = 11; // 7:00 to 18:00

async function fetchOrders(): Promise<Order[]> {
  if (!supabase) return mockOrders;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("delivery_date", { ascending: true });
  if (error) {
    console.error("Failed to fetch orders from Supabase:", error.message);
    return mockOrders;
  }
  return (data as Order[] | null) ?? mockOrders;
}

export default async function PlanningPage() {
  const orders = await fetchOrders();
  const lowStockItems = inventory.filter((i) => i.current_stock < i.min_required);
  const activeOrders = orders.filter((o) => o.status !== "Delivered");

  // Group schedule by machine
  const machineNames = [...new Set(scheduleJobs.map((j) => j.machine))];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Production Planning</h2>
          <p className="text-sm text-gray-500 mt-1">
            Demand forecasting, material requirements, and machine scheduling.
          </p>
        </div>
        <CreateOrderModal />
      </div>

      {/* 1. Demand Forecasting Alert */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <TrendingUp className="h-5 w-5" />
            Demand Forecast Alert
          </CardTitle>
          <CardDescription className="text-orange-700">
            AI-predicted order spikes for the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <ForecastCard
              label="Stuffed Penguins"
              spike="+42%"
              reason="Viral social media trend (+400% search spike)"
              severity="high"
            />
            <ForecastCard
              label="Gift Sets (Festive)"
              spike="+28%"
              reason="Approaching Holi & summer vacation season"
              severity="medium"
            />
            <ForecastCard
              label="Custom Embroidered Toys"
              spike="+19%"
              reason="Growing B2B corporate gifting demand"
              severity="low"
            />
          </div>
          <p className="text-xs text-orange-600 mt-2">
            ⚠ Ensure sufficient stock of <strong>Black Dye</strong>, <strong>Cardboard Packaging</strong>, and <strong>Thread (Black)</strong> before committing to new orders.
          </p>
        </CardContent>
      </Card>

      {/* 2. Material Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Material Requirements vs. Active Orders
          </CardTitle>
          <CardDescription>
            Inventory status checked against {activeOrders.length} active orders. Items in red are critically low.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Material</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Current Stock</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Min Required</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item) => {
                  const isLow = item.current_stock < item.min_required;
                  const pct = Math.min(100, Math.round((item.current_stock / item.min_required) * 100));
                  return (
                    <tr
                      key={item.id}
                      className={isLow ? "bg-red-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                        {isLow && <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />}
                        {item.item_name}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${isLow ? "text-red-700" : "text-gray-700"}`}>
                        {item.current_stock}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">{item.min_required}</td>
                      <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isLow ? "bg-red-500" : "bg-green-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${isLow ? "text-red-600" : "text-green-600"}`}>
                            {isLow ? "Low Stock" : "OK"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {lowStockItems.length > 0 && (
            <div className="m-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">
                <strong>{lowStockItems.length} materials</strong> are below minimum levels. Reorder immediately to avoid production delays.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Order Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-purple-600" />
            Active Order Queue
          </CardTitle>
          <CardDescription>Current orders sorted by delivery date</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Client</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Delivery</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">#{order.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{order.client}</td>
                    <td className="px-4 py-3 text-gray-600">{order.product}</td>
                    <td className="px-4 py-3 text-right text-gray-700 font-medium">{order.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{order.delivery_date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Gantt-style Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-600" />
            Today&apos;s Production Schedule
          </CardTitle>
          <CardDescription>
            Gantt chart — 07:00 to 18:00. Each block represents a job assigned to a machine.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {/* Time header */}
          <div className="min-w-[700px]">
            <div className="flex items-center">
              <div className="w-44 shrink-0" />
              <div className="flex flex-1 border-b border-gray-200 pb-1">
                {Array.from({ length: DAY_HOURS + 1 }).map((_, i) => (
                  <div key={i} className="flex-1 text-xs text-gray-400 text-center">
                    {String(DAY_START + i).padStart(2, "0")}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Machine rows */}
            {machineNames.map((machine) => {
              const jobs = scheduleJobs.filter((j) => j.machine === machine);
              return (
                <div key={machine} className="flex items-center mt-2">
                  <div className="w-44 shrink-0 pr-3">
                    <p className="text-xs font-semibold text-gray-700 truncate">{machine}</p>
                  </div>
                  <div className="relative flex-1 h-9 rounded bg-gray-100">
                    {jobs.map((job) => {
                      const left = ((job.start - DAY_START) / DAY_HOURS) * 100;
                      const width = (job.duration / DAY_HOURS) * 100;
                      return (
                        <div
                          key={job.id}
                          title={job.job}
                          className={`absolute top-0.5 h-8 rounded text-white text-xs flex items-center px-2 overflow-hidden whitespace-nowrap ${job.color}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          {job.job}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {scheduleJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-1.5">
                <span className={`h-3 w-3 rounded-sm ${job.color}`} />
                <span className="text-xs text-gray-500">{job.job}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ForecastCard({
  label,
  spike,
  reason,
  severity,
}: {
  label: string;
  spike: string;
  reason: string;
  severity: "high" | "medium" | "low";
}) {
  const colors = {
    high:   { border: "border-red-200 bg-red-50",    text: "text-red-700",    badge: "bg-red-100 text-red-700" },
    medium: { border: "border-yellow-200 bg-yellow-50", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-700" },
    low:    { border: "border-blue-200 bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700" },
  };
  const c = colors[severity];
  return (
    <div className={`rounded-lg border p-4 ${c.border}`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c.badge}`}>{spike}</span>
      </div>
      <p className="text-xs text-gray-600">{reason}</p>
      <div className="mt-2 flex items-center gap-1">
        {severity === "high" ? (
          <AlertTriangle className={`h-3 w-3 ${c.text}`} />
        ) : (
          <CheckCircle2 className={`h-3 w-3 ${c.text}`} />
        )}
        <span className={`text-xs font-medium ${c.text}`}>
          {severity === "high" ? "Urgent" : severity === "medium" ? "Plan ahead" : "Monitor"}
        </span>
      </div>
    </div>
  );
}
