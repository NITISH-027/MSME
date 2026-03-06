"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface ITITrainee {
  id: number;
  name: string;
  assignedMachine: string;
  trainingMonth: number;
  totalMonths: number;
  stipendStatus: string;
}

const itiTrainees: ITITrainee[] = [
  { id: 1, name: "Ravi Kumar",    assignedMachine: "CNC Lathe",       trainingMonth: 4, totalMonths: 6, stipendStatus: "Paid"    },
  { id: 2, name: "Priya Sharma",  assignedMachine: "Welding Station", trainingMonth: 6, totalMonths: 6, stipendStatus: "Paid"    },
  { id: 3, name: "Amit Yadav",    assignedMachine: "Drill Press",     trainingMonth: 2, totalMonths: 6, stipendStatus: "Pending" },
  { id: 4, name: "Sunita Patel",  assignedMachine: "Milling Machine", trainingMonth: 6, totalMonths: 6, stipendStatus: "Paid"    },
  { id: 5, name: "Deepak Singh",  assignedMachine: "Grinding Machine", trainingMonth: 3, totalMonths: 6, stipendStatus: "Paid"    },
  { id: 6, name: "Kavita Verma",  assignedMachine: "Lathe Machine",   trainingMonth: 5, totalMonths: 6, stipendStatus: "Pending" },
];

export default function WorkforceRoster() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Workforce &amp; ITI Stipend Tracker
        </CardTitle>
        <p className="text-sm text-gray-500">
          Manage the factory skill gap and track ITI trainee stipend reimbursements.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-center">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Total Workforce</p>
            <p className="mt-1 text-3xl font-bold text-indigo-700">45</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Skilled Operators</p>
            <p className="mt-1 text-3xl font-bold text-green-700">30</p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-center">
            <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">ITI Trainees</p>
            <p className="mt-1 text-3xl font-bold text-yellow-700">15</p>
          </div>
        </div>

        {/* ITI Trainees Table */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-700">ITI Trainees</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Trainee Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Assigned Machine</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Training Month</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Stipend Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {itiTrainees.map((trainee) => {
                  const isEligible = trainee.trainingMonth === trainee.totalMonths;
                  return (
                    <tr key={trainee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{trainee.name}</td>
                      <td className="px-4 py-3 text-gray-600">{trainee.assignedMachine}</td>
                      <td className="px-4 py-3 text-gray-600">
                        Month {trainee.trainingMonth} of {trainee.totalMonths}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={trainee.stipendStatus === "Paid" ? "success" : "warning"}
                          >
                            {trainee.stipendStatus}
                          </Badge>
                          {isEligible && (
                            <Badge variant="success">
                              Eligible for Govt Reimbursement
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
