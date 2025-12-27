"use client";

import { Video } from "@/types";
import { ImageWithFallback } from "./ImageWithFallback";
import { Button } from "./Button";
import {
  Play,
  Eye,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/app/layout/ThemeProvider";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  index?: number;
}

export function VideoCard({ video, onClick, index = 0 }: VideoCardProps) {
  const { theme } = useTheme();

  // Video thumbnail images
  const videoThumbnails = [
    "https://images.unsplash.com/photo-1639342405971-a428b16b0f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1584091376810-0f79ff748352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1758522488162-e346cb6eb411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1522845015757-50bce044e5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1654288891700-95f67982cbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1636226570637-3fbda7ca09dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  ];

  const thumbnailUrl = videoThumbnails[index % videoThumbnails.length];

  const getStatusBadge = (status: Video["status"]) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </div>
        );
      case "abuseReported":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Review</span>
          </div>
        );
      case "blocked":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            <span>Blocked</span>
          </div>
        );
    }
  };

  return (
    <div
      className="group cursor-pointer animate-fade-in backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 shadow-xl hover:shadow-2xl hover:border-white/40 transition-all duration-300 rounded-2xl overflow-hidden"
      style={{
        animationDelay: `${index * 0.05}s`,
        boxShadow:
          "0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden shadow-lg backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 group-hover:border-white/40 group-hover:shadow-2xl transition-all duration-300">
        <ImageWithFallback
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-gradient-to-br from-gray-900/90 to-gray-800/90 px-2 py-1 rounded text-xs text-white border border-gray-700/50">
          {Math.floor(Math.random() * 30 + 5)}:
          {Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, "0")}
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {getStatusBadge(video.status)}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-white/95 to-white/85 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-white/50 backdrop-blur-xl hover:bg-gradient-to-br hover:from-white/100 hover:to-white/95">
            <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 space-y-3 bg-gradient-to-br from-white/15 to-white/8 border-t border-white/30">
        <div className="flex items-start gap-3">
          {/* Channel Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 text-white shadow-lg border border-red-400/50">
            {video.channelName[0]}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="mb-1 line-clamp-2 text-sm font-medium group-hover:text-red-600 transition-colors"
              style={{ color: "var(--app-text)" }}
            >
              {video.title}
            </h3>
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--app-text-muted)" }}
            >
              <span className="bg-gradient-to-br from-white/20 to-white/10 px-2 py-1 rounded-full font-bold border border-white/40 shadow-sm">
                {video.channelName}
              </span>
              {video.playlistName && (
                <span className="bg-gradient-to-br from-white/20 to-white/10 px-2 py-1 rounded-full border border-white/40 shadow-sm">
                  {video.playlistName}
                </span>
              )}
            </div>
          </div>

          {/* More Options */}
          <Button
            variant="glass"
            className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-red-500"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div
          className="flex items-center justify-between text-xs"
          style={{ color: "var(--app-text-muted)" }}
        >
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.views.toLocaleString()} views
            </span>
            <span>•</span>
            <span>{video.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
