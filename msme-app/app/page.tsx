export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inventory as mockInventory, machines as mockMachines, orders as mockOrders, trends as mockTrends } from "@/lib/data";
import type { Order, InventoryItem, Machine, Trend } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Factory,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<string, { variant: "default" | "success" | "warning" | "secondary" | "destructive"; label: string }> = {
    "Pending":         { variant: "secondary", label: "Pending" },
    "In Production":   { variant: "default",   label: "In Production" },
    "Ready to Ship":   { variant: "warning",   label: "Ready to Ship" },
    "Delivered":       { variant: "success",   label: "Delivered" },
  };
  const { variant, label } = map[status] ?? { variant: "secondary", label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

async function fetchDashboardData() {
  if (!supabase) {
    return {
      orders: mockOrders,
      inventory: mockInventory,
      machines: mockMachines,
      trends: mockTrends,
    };
  }

  const [ordersRes, inventoryRes, machinesRes, trendsRes] = await Promise.all([
    supabase.from("orders").select("*").order("id", { ascending: true }),
    supabase.from("inventory").select("*").order("id", { ascending: true }),
    supabase.from("machines").select("*").order("id", { ascending: true }),
    supabase.from("trends").select("*").order("search_spike_percent", { ascending: false }),
  ]);

  return {
    orders: (ordersRes.data as Order[] | null) ?? mockOrders,
    inventory: (inventoryRes.data as InventoryItem[] | null) ?? mockInventory,
    machines: (machinesRes.data as Machine[] | null) ?? mockMachines,
    trends: (trendsRes.data as Trend[] | null) ?? mockTrends,
  };
}

export default async function DashboardPage() {
  const { orders, inventory, machines, trends } = await fetchDashboardData();

  const lowStockItems = inventory.filter((i) => i.current_stock < i.min_required);
  const activeOrders = orders.filter((o) => o.status !== "Delivered");
  const runningMachines = machines.filter((m) => m.status === "Running");
  const topTrend = trends.length > 0 ? trends[0] : null;

  const stats = [
    {
      label: "Active Orders",
      value: activeOrders.length,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "orders in pipeline",
    },
    {
      label: "Machines Running",
      value: `${runningMachines.length}/${machines.length}`,
      icon: Factory,
      color: "text-green-600",
      bg: "bg-green-50",
      description: "currently operational",
    },
    {
      label: "Low Stock Alerts",
      value: lowStockItems.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      description: "materials below minimum",
    },
    {
      label: "Top Trend Spike",
      value: topTrend ? `+${topTrend.search_spike_percent}%` : "—",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: topTrend?.keyword ?? "",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          Real-time factory and business intelligence for your MSME.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg, description }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
                  <p className="mt-1 text-xs text-gray-400">{description}</p>
                </div>
                <div className={`rounded-lg p-2 ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Client</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{order.client}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{order.product}</td>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">{item.item_name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-700">
                    {item.current_stock} / {item.min_required} {item.unit}
                  </p>
                  <p className="text-xs text-red-500">Below minimum</p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">All stock levels are healthy!</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-gray-600" />
            Machine Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {machines.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg border p-3 ${
                  m.status === "Running"
                    ? "border-green-200 bg-green-50"
                    : m.status === "Under Maintenance"
                    ? "border-red-200 bg-red-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <p className="text-xs font-semibold text-gray-700 truncate">{m.name}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      m.status === "Running"
                        ? "bg-green-500"
                        : m.status === "Under Maintenance"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs text-gray-600">{m.status}</span>
                </div>
                {m.status === "Running" && (
                  <p className="mt-1 text-xs text-gray-500">{m.efficiency_percent}% eff.</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
