"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type MachineStatus = "Running" | "Idle" | "Under Maintenance";

const STATUS_OPTIONS: MachineStatus[] = ["Running", "Idle", "Under Maintenance"];

function selectStyle(status: MachineStatus) {
  if (status === "Running")
    return "bg-green-50 border-green-300 text-green-700 focus:ring-green-400";
  if (status === "Under Maintenance")
    return "bg-red-50 border-red-300 text-red-700 focus:ring-red-400";
  return "bg-yellow-50 border-yellow-300 text-yellow-700 focus:ring-yellow-400";
}

export function MachineStatusSelect({
  machineId,
  currentStatus,
}: {
  machineId: number;
  currentStatus: MachineStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<MachineStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: MachineStatus) {
    if (newStatus === status) return;
    const prevStatus = status;
    setStatus(newStatus);
    setLoading(true);
    if (supabase) {
      const { error } = await supabase
        .from("machines")
        .update({ status: newStatus })
        .eq("id", machineId);
      if (error) {
        console.error("Failed to update machine status:", error.message);
        setStatus(prevStatus);
      } else {
        router.refresh();
      }
    } else {
      console.warn("Supabase is not configured — status change was not persisted.");
      setStatus(prevStatus);
    }
    setLoading(false);
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value as MachineStatus)}
      className={`text-xs font-medium rounded-full px-2 py-0.5 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors ${selectStyle(status)} ${loading ? "opacity-60 cursor-wait" : ""}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
