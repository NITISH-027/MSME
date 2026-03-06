import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Keyword-based mock LLM fallback
// ---------------------------------------------------------------------------
function mockAdvisorResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("profit") || lower.includes("revenue") || lower.includes("margin")) {
    return (
      "To improve profitability, start by analysing your gross margin on each product line and cutting the bottom 20% that drain resources. " +
      "Focus on your top-selling SKUs, negotiate better raw-material prices with bulk purchasing, and reduce wastage on the factory floor through lean manufacturing practices.\n\n" +
      "On the revenue side, consider value-added services or product variants that command a premium price. " +
      "Even a 5% price increase on high-demand items — combined with a 3% cut in production costs — can double your net profit margin. " +
      "Track your break-even point monthly so you always know exactly how many units you need to sell to cover costs."
    );
  }

  if (lower.includes("bottleneck") || lower.includes("production") || lower.includes("efficiency") || lower.includes("oee")) {
    return (
      "A production bottleneck is any stage that slows the entire line. Start by timing each workstation — the slowest one limits your total output. " +
      "Common fixes include adding a second operator, pre-staging materials, or investing in a faster machine at that single point.\n\n" +
      "Track your Overall Equipment Effectiveness (OEE) daily. An OEE below 65% signals serious opportunity. " +
      "Small improvements — reducing changeover time with SMED, running preventive maintenance on weekends — can push OEE above 80% and increase output by 20-30% without adding a single machine."
    );
  }

  if (lower.includes("inventory") || lower.includes("stock") || lower.includes("warehouse") || lower.includes("supply")) {
    return (
      "Excess inventory ties up cash and warehouse space, while too little inventory causes costly production stoppages. " +
      "Implement a simple ABC analysis: your top 20% of items (A-category) should be tightly controlled with weekly reorder reviews, while C-category slow movers can be ordered monthly.\n\n" +
      "Negotiate vendor-managed inventory (VMI) agreements with your top two suppliers so they maintain minimum stock levels at your premises. " +
      "Pair this with a just-in-time approach for A-category raw materials to free up working capital — many MSMEs unlock 15-25% of tied-up cash this way."
    );
  }

  if (lower.includes("tax") || lower.includes("gst") || lower.includes("compliance") || lower.includes("regulation")) {
    return (
      "Staying GST-compliant is essential to avoid penalties and ensure smooth input tax credit (ITC) flow. File GSTR-1 and GSTR-3B on time every month, and reconcile your purchase register with GSTR-2A to claim full ITC.\n\n" +
      "For taxes, explore Section 44AD presumptive taxation if your turnover is below ₹2 crore — it simplifies compliance significantly. " +
      "Register for Udyam to access MSME-specific tax benefits, priority sector lending, and government tender preferences. " +
      "A good CA familiar with manufacturing MSMEs can typically save 8-12% of your annual tax liability through legitimate planning."
    );
  }

  if (lower.includes("loan") || lower.includes("credit") || lower.includes("finance") || lower.includes("fund")) {
    return (
      "MSMEs have access to several government-backed financing options. The MUDRA scheme offers collateral-free loans up to ₹10 lakh (Shishu), ₹10-50 lakh (Kishore), and up to ₹1 crore (Tarun) for expansion.\n\n" +
      "For working capital, negotiate a cash-credit (CC) limit with your bank based on your debtor and stock position — this is cheaper than taking a term loan for short-term needs. " +
      "Also explore the Trade Receivables Discounting System (TReDS) to convert your outstanding invoices to immediate cash at competitive interest rates, improving your cash flow without taking on traditional debt."
    );
  }

  if (lower.includes("export") || lower.includes("international") || lower.includes("global")) {
    return (
      "Entering export markets can multiply your revenue, but start with one target country that already imports your product category. " +
      "Register on the DGFT portal to obtain an Importer-Exporter Code (IEC) — it is free and mandatory. Explore MSME clusters and Export Promotion Councils (EPCs) specific to your industry for buyer connections.\n\n" +
      "Pricing for export must account for packaging upgrades, freight, insurance, and customs duties. " +
      "The RoDTEP scheme refunds embedded taxes on exported goods — ensure you are claiming this to stay price-competitive. " +
      "Start with small trial orders to build trust before committing to large production runs."
    );
  }

  if (lower.includes("workforce") || lower.includes("employee") || lower.includes("worker") || lower.includes("labour") || lower.includes("labor")) {
    return (
      "Your workforce is your most valuable asset. Reduce attrition by offering skill-linked incentive pay rather than flat wages — workers who see a clear earnings growth path stay longer and perform better.\n\n" +
      "Invest in cross-training so at least 30% of your team can perform two or more roles. This dramatically reduces production disruption when someone is absent. " +
      "Partner with ITIs (Industrial Training Institutes) for a steady pipeline of trained apprentices under the National Apprenticeship Promotion Scheme (NAPS), which also gives you a wage subsidy of ₹1,500 per apprentice per month."
    );
  }

  if (lower.includes("machine") || lower.includes("equipment") || lower.includes("maintenance")) {
    return (
      "Unplanned machine downtime is one of the highest hidden costs for MSME manufacturers. Shift from reactive (fix when broken) to preventive maintenance (scheduled checks) to cut downtime by up to 40%.\n\n" +
      "Create a simple maintenance log for each machine: daily lubrication checks, weekly calibration, and monthly deep servicing. " +
      "If upgrading equipment, explore the MSME Technology Centre scheme and Priority Sector Lending for machinery loans at subsidised interest rates. " +
      "A well-maintained machine also produces fewer defects, reducing rework costs and improving your OEE."
    );
  }

  // Default generic response
  return (
    "That is a great question for any MSME owner. The foundation of a healthy business is a clear view of three numbers: your cash flow, your gross margin, and your on-time delivery rate. " +
    "If you track these three metrics weekly, you will always know where to focus your energy.\n\n" +
    "For more targeted advice, try asking me about specific topics such as improving profit margins, reducing production bottlenecks, managing inventory efficiently, GST compliance, accessing business loans, or workforce management. " +
    "I am here to give you clear, practical guidance tailored to MSME manufacturing operations."
  );
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let message = "";
  try {
    const body = await req.json();
    message = typeof body.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  // --- Try OpenAI ---
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert MSME business advisor for Indian small and medium manufacturing businesses. " +
                "Give clear, practical, and actionable advice in simple language. " +
                "Structure responses in 2 short paragraphs maximum.",
            },
            { role: "user", content: message },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });
      if (openaiRes.ok) {
        const data = await openaiRes.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return NextResponse.json({ reply });
      }
    } catch {
      // fall through to next provider
    }
  }

  // --- Try Gemini ---
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      "You are an expert MSME business advisor for Indian small and medium manufacturing businesses. " +
                      "Give clear, practical, and actionable advice in simple language in 2 short paragraphs. " +
                      "User question: " +
                      message,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (reply) return NextResponse.json({ reply });
      }
    } catch {
      // fall through to mock
    }
  }

  // --- Keyword-based fallback ---
  const reply = mockAdvisorResponse(message);
  return NextResponse.json({ reply });
}
