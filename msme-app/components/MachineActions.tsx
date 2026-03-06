"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import type { Machine } from "@/lib/data";

type MachineStatus = Machine["status"];

const STATUS_OPTIONS: MachineStatus[] = ["Running", "Idle", "Under Maintenance"];

export function MachineActions({ machine }: { machine: Machine }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: machine.name,
    status: machine.status as MachineStatus,
    efficiency_percent: String(machine.efficiency_percent),
    max_capacity: String(machine.max_capacity),
    limitations: machine.limitations,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Database is not configured. Please set your Supabase environment variables.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("machines")
      .update({
        name: form.name.trim(),
        status: form.status,
        efficiency_percent: Number(form.efficiency_percent),
        max_capacity: Number(form.max_capacity),
        limitations: form.limitations.trim(),
      })
      .eq("id", machine.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEditOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Database is not configured. Please set your Supabase environment variables.");
      setLoading(false);
      return;
    }

    const { error: deleteError } = await supabase
      .from("machines")
      .delete()
      .eq("id", machine.id);

    setLoading(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => { setEditOpen(true); setError(null); }}
        title="Edit machine"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => { setDeleteOpen(true); setError(null); }}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Delete machine"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete</span>
      </Button>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Machine</DialogTitle>
            <DialogDescription>Update the machine details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="m-name">
                Name
              </label>
              <input
                id="m-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="m-status">
                Status
              </label>
              <select
                id="m-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="m-efficiency">
                Efficiency (%)
              </label>
              <input
                id="m-efficiency"
                name="efficiency_percent"
                type="number"
                required
                min={0}
                max={100}
                value={form.efficiency_percent}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="m-capacity">
                Max Capacity (units/day)
              </label>
              <input
                id="m-capacity"
                name="max_capacity"
                type="number"
                required
                min={1}
                value={form.max_capacity}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="m-limitations">
                Limitations
              </label>
              <input
                id="m-limitations"
                name="limitations"
                type="text"
                value={form.limitations}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Machine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{machine.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
