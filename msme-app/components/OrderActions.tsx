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
import type { Order } from "@/lib/data";

type OrderStatus = Order["status"];

const STATUS_OPTIONS: OrderStatus[] = ["Pending", "In Production", "Ready to Ship", "Delivered"];

export function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    client: order.client,
    product: order.product,
    quantity: String(order.quantity),
    status: order.status as OrderStatus,
    delivery_date: order.delivery_date,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      .from("orders")
      .update({
        client: form.client.trim(),
        product: form.product.trim(),
        quantity: Number(form.quantity),
        status: form.status,
        delivery_date: form.delivery_date,
      })
      .eq("id", order.id);

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
      .from("orders")
      .delete()
      .eq("id", order.id);

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
        title="Edit order"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => { setDeleteOpen(true); setError(null); }}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Delete order"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete</span>
      </Button>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update the order details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="o-client">
                Client Name
              </label>
              <input
                id="o-client"
                name="client"
                type="text"
                required
                value={form.client}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="o-product">
                Product Name
              </label>
              <input
                id="o-product"
                name="product"
                type="text"
                required
                value={form.product}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="o-quantity">
                Quantity
              </label>
              <input
                id="o-quantity"
                name="quantity"
                type="number"
                required
                min={1}
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="o-status">
                Status
              </label>
              <select
                id="o-status"
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
              <label className="text-sm font-medium text-gray-700" htmlFor="o-delivery">
                Delivery Date
              </label>
              <input
                id="o-delivery"
                name="delivery_date"
                type="date"
                required
                value={form.delivery_date}
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
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order <strong>#{order.id}</strong> for{" "}
              <strong>{order.client}</strong>? This action cannot be undone.
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
