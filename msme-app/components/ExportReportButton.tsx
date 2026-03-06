"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { machines as mockMachines, orders as mockOrders } from "@/lib/data";
import type { Machine, Order } from "@/lib/data";

function escapeCSV(value: string | number): string {
  const str = String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function convertToCSV(machines: Machine[], orders: Order[]): string {
  const machineHeaders = ["ID", "Name", "Status", "Efficiency (%)", "Max Capacity", "Limitations"];
  const machineRows = machines.map((m) => [
    m.id,
    m.name,
    m.status,
    m.efficiency_percent,
    m.max_capacity,
    m.limitations,
  ].map(escapeCSV));

  const orderHeaders = ["ID", "Client", "Product", "Quantity", "Status", "Delivery Date"];
  const orderRows = orders.map((o) => [
    o.id,
    o.client,
    o.product,
    o.quantity,
    o.status,
    o.delivery_date,
  ].map(escapeCSV));

  const lines: string[] = [
    "MACHINES",
    machineHeaders.join(","),
    ...machineRows.map((r) => r.join(",")),
    "",
    "ORDERS",
    orderHeaders.join(","),
    ...orderRows.map((r) => r.join(",")),
  ];

  return lines.join("\n");
}

export default function ExportReportButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    try {
      let machines: Machine[] = mockMachines;
      let orders: Order[] = mockOrders;

      if (isSupabaseConfigured) {
        const supabase = createClient();
        const [machinesResult, ordersResult] = await Promise.all([
          supabase.from("machines").select("*").order("id", { ascending: true }),
          supabase.from("orders").select("*").order("id", { ascending: true }),
        ]);

        if (!machinesResult.error && machinesResult.data) {
          machines = machinesResult.data as Machine[];
        }
        if (!ordersResult.error && ordersResult.data) {
          orders = ordersResult.data as Order[];
        }
      }

      const csv = convertToCSV(machines, orders);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "factory_shift_report.csv";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={handleExport} disabled={loading} variant="outline">
        <Download className="h-4 w-4" />
        {loading ? "Exporting…" : "Export Shift Report"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
