"use client";

import { VideoLike } from "@/types";
import { ImageWithFallback } from "./ImageWithFallback";
import { useTheme } from "@/app/layout/ThemeProvider";

interface LikesListProps {
  likes: VideoLike[];
}

export function LikesList({ likes }: LikesListProps) {
  const { theme } = useTheme();

  if (!likes || likes.length === 0) {
    return null;
  }

  return (
    <div
      className="p-4 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl"
      style={{
        backgroundColor: "var(--app-card-bg)",
        border: "1px solid var(--app-card-border)",
      }}
    >
      <h3
        className="text-sm font-medium mb-3"
        style={{ color: "var(--app-text)" }}
      >
        {likes.length} {likes.length === 1 ? "person" : "people"} liked this
      </h3>

      <div className="space-y-2">
        {likes.map((like) => (
          <div key={like.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <ImageWithFallback
                src="/placeholder-avatar.png"
                alt={`User ${like.userId}`}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm" style={{ color: "var(--app-text)" }}>
              User {like.userId.substring(0, 8)}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--app-text-muted)" }}
            >
              {like.createdAt.toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
