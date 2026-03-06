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
import type { InventoryItem } from "@/lib/data";

export function InventoryActions({ item }: { item: InventoryItem }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    item_name: item.item_name,
    current_stock: String(item.current_stock),
    min_required: String(item.min_required),
    unit: item.unit,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      .from("inventory")
      .update({
        item_name: form.item_name.trim(),
        current_stock: Number(form.current_stock),
        min_required: Number(form.min_required),
        unit: form.unit.trim(),
      })
      .eq("id", item.id);

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
      .from("inventory")
      .delete()
      .eq("id", item.id);

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
        title="Edit inventory item"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => { setDeleteOpen(true); setError(null); }}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Delete inventory item"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete</span>
      </Button>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Update the inventory item details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="inv-name">
                Item Name
              </label>
              <input
                id="inv-name"
                name="item_name"
                type="text"
                required
                value={form.item_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="inv-stock">
                Current Stock
              </label>
              <input
                id="inv-stock"
                name="current_stock"
                type="number"
                required
                min={0}
                value={form.current_stock}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="inv-min">
                Min Required
              </label>
              <input
                id="inv-min"
                name="min_required"
                type="number"
                required
                min={0}
                value={form.min_required}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="inv-unit">
                Unit
              </label>
              <input
                id="inv-unit"
                name="unit"
                type="text"
                required
                value={form.unit}
                onChange={handleChange}
                placeholder="e.g. kg, metres, pieces"
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
            <DialogTitle>Delete Inventory Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{item.item_name}</strong>? This action cannot be undone.
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
