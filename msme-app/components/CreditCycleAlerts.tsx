"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface CreditOrder {
  id: number;
  clientName: string;
  invoiceAmount: number;
  daysSinceDelivery: number;
}

const creditOrders: CreditOrder[] = [
  { id: 1, clientName: "Sharma Textiles Pvt. Ltd.", invoiceAmount: 85000, daysSinceDelivery: 18 },
  { id: 2, clientName: "Gupta Steel Works", invoiceAmount: 120000, daysSinceDelivery: 32 },
  { id: 3, clientName: "Mehta Garments Co.", invoiceAmount: 67500, daysSinceDelivery: 60 },
  { id: 4, clientName: "Patel Engineering Ltd.", invoiceAmount: 95000, daysSinceDelivery: 85 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CreditCycleAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          45-Day Credit Cycle Monitor
        </CardTitle>
        <p className="text-sm text-gray-500">
          Tracking payment status for all delivered orders. Payments overdue after 45 days require immediate action.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {creditOrders.map((order) => {
          const isOverdue = order.daysSinceDelivery > 45;
          return (
            <div
              key={order.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                isOverdue
                  ? "border-red-300 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {isOverdue ? (
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${isOverdue ? "text-red-900" : "text-green-900"}`}>
                    {order.clientName}
                  </p>
                  <p className={`text-xs ${isOverdue ? "text-red-600" : "text-green-600"}`}>
                    {order.daysSinceDelivery} days since delivery &bull; Invoice: {formatCurrency(order.invoiceAmount)}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isOverdue ? (
                  <Badge variant="destructive" className="whitespace-nowrap text-xs font-bold">
                    ⚠ Payment Overdue — Action Required
                  </Badge>
                ) : (
                  <Badge variant="success" className="whitespace-nowrap text-xs">
                    On Track
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
