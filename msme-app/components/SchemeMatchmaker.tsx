"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Star } from "lucide-react";

interface Scheme {
  id: number;
  name: string;
  description: string;
  maxGrant: string;
  tag: string;
}

const schemes: Scheme[] = [
  {
    id: 1,
    name: "SIDBI Collateral-Free Loan",
    description:
      "Loans up to ₹2 crore for micro and small enterprises without the need for collateral or third-party guarantee, backed by the Credit Guarantee Fund Trust (CGTMSE).",
    maxGrant: "₹2,00,00,000",
    tag: "Credit & Finance",
  },
  {
    id: 2,
    name: "PLI Scheme for Manufacturing",
    description:
      "Production Linked Incentive scheme offering financial incentives to boost domestic manufacturing and attract investments in key sectors, enhancing India's competitiveness.",
    maxGrant: "₹50,00,00,000",
    tag: "Manufacturing",
  },
  {
    id: 3,
    name: "MSME Mudra Yojana",
    description:
      "Pradhan Mantri MUDRA Yojana provides micro-loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises through Shishu, Kishor, and Tarun categories.",
    maxGrant: "₹10,00,000",
    tag: "Micro Finance",
  },
  {
    id: 4,
    name: "Zero Defect Zero Effect (ZED) Certification",
    description:
      "Government subsidy for MSME units to achieve ZED certification, promoting quality manufacturing with zero defects while ensuring zero adverse environmental effects.",
    maxGrant: "₹5,00,000",
    tag: "Quality & Sustainability",
  },
];

export default function SchemeMatchmaker() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Government Scheme Matchmaker
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Discover Indian government financial support schemes tailored for MSMEs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {scheme.tag}
                </Badge>
              </div>
              <CardTitle className="text-base leading-snug">{scheme.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-sm text-gray-600 leading-relaxed">
                {scheme.description}
              </CardDescription>
              <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <IndianRupee className="h-4 w-4 text-green-700 flex-shrink-0" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Maximum Grant</p>
                  <p className="text-sm font-bold text-green-800">{scheme.maxGrant}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="sm">
                Check Eligibility
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
