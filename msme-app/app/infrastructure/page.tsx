import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { machines } from "@/lib/data";
import {
  Factory,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Gauge,
} from "lucide-react";

function statusColor(status: string) {
  if (status === "Running") return { bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500", text: "text-green-700" };
  if (status === "Under Maintenance") return { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", text: "text-red-700" };
  return { bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400", text: "text-yellow-700" };
}

function efficiencyColor(pct: number) {
  if (pct >= 90) return "bg-green-500";
  if (pct >= 70) return "bg-blue-500";
  if (pct >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

export default function InfrastructurePage() {
  const running = machines.filter((m) => m.status === "Running");
  const idle = machines.filter((m) => m.status === "Idle");
  const maintenance = machines.filter((m) => m.status === "Under Maintenance");
  const bottlenecks = machines.filter((m) => m.efficiency_percent >= 95 && m.status === "Running");
  const avgEfficiency = Math.round(running.reduce((s, m) => s + m.efficiency_percent, 0) / (running.length || 1));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Infrastructure Assessment</h2>
        <p className="text-sm text-gray-500 mt-1">
          Capability, capacity, and bottleneck analysis for all factory machines.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Running" value={running.length} icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
        <SummaryCard label="Idle"    value={idle.length}    icon={Clock}        color="text-yellow-600" bg="bg-yellow-50" />
        <SummaryCard label="Maintenance" value={maintenance.length} icon={Wrench} color="text-red-600" bg="bg-red-50" />
        <SummaryCard label="Avg Efficiency" value={`${avgEfficiency}%`} icon={Gauge} color="text-blue-600" bg="bg-blue-50" />
      </div>

      {/* Bottleneck Alert */}
      {bottlenecks.length > 0 && (
        <div className="rounded-xl border-l-4 border-l-red-500 bg-red-50 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Bottleneck Detected!</p>
            {bottlenecks.map((m) => (
              <p key={m.id} className="text-sm text-red-700 mt-0.5">
                <strong>{m.name}</strong> is at <strong>{m.efficiency_percent}%</strong> capacity — {m.limitations}. This is limiting overall factory output.
              </p>
            ))}
            <p className="mt-2 text-xs text-red-600">
              Recommendation: Consider adding a second packaging station or reducing upstream production rate to balance the line.
            </p>
          </div>
        </div>
      )}

      {/* Machine Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Machine Capability & Capacity</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {machines.map((machine) => {
            const c = statusColor(machine.status);
            const usagePct = machine.status === "Running" ? machine.efficiency_percent : 0;
            const capacityUsed = Math.round((usagePct / 100) * machine.max_capacity);
            const isBottleneck = machine.efficiency_percent >= 95 && machine.status === "Running";

            return (
              <Card key={machine.id} className={`border ${c.border} ${c.bg} relative`}>
                {isBottleneck && (
                  <div className="absolute -top-2 -right-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white">
                      <AlertTriangle className="h-3 w-3 text-white" />
                    </span>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-800">{machine.name}</CardTitle>
                    <Badge
                      variant={
                        machine.status === "Running"
                          ? "success"
                          : machine.status === "Under Maintenance"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-xs"
                    >
                      {machine.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Efficiency Progress */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500">Daily Usage</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {capacityUsed} / {machine.max_capacity} units
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${efficiencyColor(usagePct)}`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                    <p className={`mt-1 text-xs font-bold ${c.text}`}>
                      {machine.status === "Running" ? `${machine.efficiency_percent}% efficiency` : machine.status}
                    </p>
                  </div>

                  {/* Max Capacity */}
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Max Capacity</span>
                    <span className="font-medium text-gray-700">{machine.max_capacity} units/day</span>
                  </div>

                  {/* Limitations */}
                  <div className="rounded-md bg-white/60 border border-gray-100 p-2">
                    <p className="text-xs text-gray-500 flex gap-1 items-start">
                      <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-yellow-500" />
                      {machine.limitations}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Capacity Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-gray-600" />
            Factory Capacity Summary
          </CardTitle>
          <CardDescription>
            Total daily production capacity across all operational machines.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Machine</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Efficiency</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Max Capacity</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Effective Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {machines.map((m) => {
                const effective = Math.round((m.efficiency_percent / 100) * m.max_capacity);
                return (
                  <tr key={m.id} className={`hover:bg-gray-50 ${m.efficiency_percent >= 95 && m.status === "Running" ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {m.name}
                      {m.efficiency_percent >= 95 && m.status === "Running" && (
                        <span className="ml-2 text-xs text-red-600 font-semibold">⚠ Bottleneck</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${statusColor(m.status).text}`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-semibold ${m.efficiency_percent >= 85 ? "text-green-600" : m.efficiency_percent > 0 ? "text-yellow-600" : "text-gray-400"}`}>
                        {m.status === "Running" ? `${m.efficiency_percent}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{m.max_capacity} u/day</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {m.status === "Running" ? `${effective} u/day` : "0 u/day"}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                <td className="px-4 py-3 text-gray-800">Total Factory</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right text-gray-600">—</td>
                <td className="px-4 py-3 text-right text-gray-800">
                  {machines.reduce((s, m) => s + m.max_capacity, 0)} u/day
                </td>
                <td className="px-4 py-3 text-right text-blue-700">
                  {machines
                    .filter((m) => m.status === "Running")
                    .reduce((s, m) => s + Math.round((m.efficiency_percent / 100) * m.max_capacity), 0)}{" "}
                  u/day
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`rounded-lg p-2 ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
