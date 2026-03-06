"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "ai",
  content:
    "Hello! I am your MSME Business Advisor. Ask me anything about supply chain, profitability, or factory operations in simple terms.",
};

export default function AIAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply ?? "Sorry, I could not get a response. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>AI Business Advisor</CardTitle>
            <CardDescription>Powered by business intelligence · Always available</CardDescription>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </span>
        </div>
      </CardHeader>

      {/* Message history */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn("flex items-start gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex-shrink-0 rounded-full p-2",
                msg.role === "ai" ? "bg-blue-100" : "bg-gray-100"
              )}
            >
              {msg.role === "ai" ? (
                <Bot className="h-4 w-4 text-blue-600" />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                msg.role === "ai"
                  ? "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                  : "bg-blue-600 text-white rounded-tr-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </CardContent>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
            placeholder="Ask about profit, supply chain, inventory, compliance…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
            className="rounded-xl h-10 w-10 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Press Enter to send · AI responses are for advisory purposes only
        </p>
      </div>
    </Card>
  );
}
