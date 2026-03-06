"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
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

const defaultForm = {
  client: "",
  product: "",
  quantity: "",
  delivery_date: "",
};

export default function CreateOrderModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError("Database is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("orders").insert([
      {
        client: form.client.trim(),
        product: form.product.trim(),
        quantity: Number(form.quantity),
        delivery_date: form.delivery_date,
        status: "Pending",
      },
    ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setOpen(false);
    setForm(defaultForm);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Create New Order
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new order. Status will be set to{" "}
              <strong>Pending</strong> automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="client">
                Client Name
              </label>
              <input
                id="client"
                name="client"
                type="text"
                required
                value={form.client}
                onChange={handleChange}
                placeholder="e.g. Amazon India"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="product">
                Product Name
              </label>
              <input
                id="product"
                name="product"
                type="text"
                required
                value={form.product}
                onChange={handleChange}
                placeholder="e.g. Stuffed Penguin (Large)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="quantity">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                required
                min={1}
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="delivery_date">
                Delivery Date
              </label>
              <input
                id="delivery_date"
                name="delivery_date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
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
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
