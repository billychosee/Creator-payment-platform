"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { useTheme } from "@/app/layout/ThemeProvider";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
}

export function CommentForm({ onSubmit, isLoading = false }: CommentFormProps) {
  const [content, setContent] = useState("");
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="p-4 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl"
        style={{
          backgroundColor: "var(--app-card-bg)",
          border: "1px solid var(--app-card-border)",
        }}
      >
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border-0 bg-transparent focus:ring-0 text-sm"
          style={{ color: "var(--app-text)" }}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading || !content.trim()}
          className="px-6 py-2"
        >
          {isLoading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}