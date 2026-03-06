"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface License {
  id: number;
  name: string;
  expiryDate: Date;
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
}

const licenses: License[] = [
  { id: 1, name: "Green Category Pollution Certificate", expiryDate: addMonths(8) },
  { id: 2, name: "Fire Safety NOC",                     expiryDate: addMonths(3) },
  { id: 3, name: "FSSAI License",                       expiryDate: addDays(10)  },
  { id: 4, name: "Factory Act Registration",            expiryDate: addDays(5)   },
];

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ComplianceTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          Compliance &amp; Renewal Alerts
        </CardTitle>
        <p className="text-sm text-gray-500">
          Track factory license expiry dates. Licenses expiring within 30 days require immediate renewal.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {licenses.map((license) => {
          const days = daysUntil(license.expiryDate);
          const isUrgent = days < 30;
          return (
            <div
              key={license.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                isUrgent
                  ? "animate-pulse border-red-300 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {isUrgent ? (
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                ) : (
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-600" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${isUrgent ? "text-red-900" : "text-green-900"}`}>
                    {license.name}
                  </p>
                  <p className={`text-xs ${isUrgent ? "text-red-600" : "text-green-600"}`}>
                    Expires: {formatDate(license.expiryDate)} &bull;{" "}
                    {days < 0 ? `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} ago` : `${days} day${days !== 1 ? "s" : ""} remaining`}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isUrgent ? (
                  <Button variant="destructive" size="sm" className="whitespace-nowrap text-xs font-bold">
                    Renew Immediately
                  </Button>
                ) : (
                  <Badge variant="success" className="whitespace-nowrap text-xs">
                    ✓ Valid
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
