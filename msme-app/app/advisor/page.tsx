import { Bot, Sparkles } from "lucide-react";
import AIAdvisorChat from "@/components/AIAdvisorChat";

export default function AdvisorPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-blue-100 p-3">
          <Bot className="h-7 w-7 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            AI Business Advisor
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Sparkles className="h-3 w-3" />
              Ask the Expert
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Get instant, professional guidance on supply chain, profitability, compliance, and factory
            operations — tailored for MSME owners.
          </p>
        </div>
      </div>

      {/* Suggested topics */}
      <div className="flex flex-wrap gap-2">
        {[
          "How do I improve my profit margin?",
          "Tips to reduce production bottlenecks",
          "How to manage inventory better?",
          "GST compliance for MSMEs",
          "How to get a business loan?",
        ].map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Chat Interface */}
      <AIAdvisorChat />
    </div>
  );
}
