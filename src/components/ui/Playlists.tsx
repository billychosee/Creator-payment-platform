"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  List as ListIcon,
  Play,
  TrendingUp,
  Plus,
  Calendar,
  Lock,
  Globe,
} from "lucide-react";
import { Playlist, Channel } from "@/types";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "./ImageWithFallback";
import { useTheme } from "@/app/layout/ThemeProvider";
import { Button } from "./Button";

interface PlaylistsProps {
  playlists: Playlist[];
  channels: Channel[];
  filterChannelId?: string;
}

export function Playlists({
  playlists,
  channels,
  filterChannelId,
}: PlaylistsProps) {
  const router = useRouter();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [filterChannel, setFilterChannel] = useState<string>(
    filterChannelId || "all"
  );
  const { theme } = useTheme();

  // Playlist cover images
  const playlistCoverImages = [
    "https://images.unsplash.com/photo-1618175349544-71ca933f4979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1592859684269-d531a2df5acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1646303297330-17073f7823c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1551515300-2d3b7bb80920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    "https://images.unsplash.com/photo-1656741349193-4d040898a822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  ];

  const filteredPlaylists =
    filterChannel === "all"
      ? playlists
      : playlists.filter((p) => p.channelId === filterChannel);

  if (selectedPlaylist) {
    const playlistIndex = playlists.findIndex(
      (p) => p.id === selectedPlaylist.id
    );
    const coverImage =
      playlistCoverImages[playlistIndex % playlistCoverImages.length];

    // Mock data for playlist metadata
    const playlistMetadata = {
      visibility: "Public",
      accessType: "free",
      price: 0,
      currency: "USD",
      createdAt: "Today at 9:06 AM",
    };

    return (
      <div
        className="min-h-screen p-8 transition-colors duration-300"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(to bottom right, #0a0a0a, #0f0f0f, #0a0a0a)"
              : "linear-gradient(to bottom right, #f5f5f7, #ffffff, #f5f5f7)",
          color: "var(--app-text)",
        }}
      >
        <Button
          onClick={() => setSelectedPlaylist(null)}
          variant="ghost"
          className="flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Playlists</span>
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Playlist Hero with Cover Image */}
          <div
            className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            {/* Cover Image Background */}
            <div className="relative h-80 overflow-hidden">
              <ImageWithFallback
                src={coverImage}
                alt={selectedPlaylist.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%)"
                      : "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 100%)",
                }}
              />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <div className="flex items-end gap-8">
                <div
                  className="w-40 h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-600/30 flex-shrink-0"
                  style={{
                    transform: "scale(1)",
                    transition: "transform .45s cubic-bezier(.2,.8,.2,1)",
                  }}
                >
                  <ListIcon className="w-20 h-20 text-white" />
                </div>

                <div className="flex-1 pb-2">
                  {/* <p
                    className="text-sm mb-2"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    Playlist
                  </p> */}
                  <h1
                    className="text-5xl mb-4"
                    style={{ color: "var(--app-text)" }}
                  >
                    {selectedPlaylist.name}
                  </h1>
                  <p
                    className="text-lg mb-4"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    {selectedPlaylist.description}
                  </p>

                  {/* Playlist Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      {playlistMetadata.visibility === "Public" ? (
                        <Globe className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-yellow-400" />
                      )}
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Visibility:{" "}
                        <span style={{ color: "var(--app-text)" }}>
                          {playlistMetadata.visibility}
                        </span>
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      Access:{" "}
                      <span style={{ color: "var(--app-text)" }}>
                        {playlistMetadata.accessType} (
                        {playlistMetadata.currency}{" "}
                        {playlistMetadata.price.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: "var(--app-text-muted)" }}
                      />
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Created:{" "}
                        <span style={{ color: "var(--app-text)" }}>
                          {playlistMetadata.createdAt}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className="px-4 py-2 rounded-full backdrop-blur-sm"
                      style={{
                        backgroundColor: "var(--app-card-bg)",
                        border: "1px solid var(--app-card-border)",
                        color: "var(--app-text)",
                      }}
                    >
                      {selectedPlaylist.channelName}
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <Play className="w-4 h-4" />
                      {selectedPlaylist.videoCount} videos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid with Add Video Button */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--app-card-bg)",
                border: "1px solid var(--app-card-border)",
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "var(--app-text-muted)" }}
              >
                Total Videos
              </p>
              <p className="text-3xl" style={{ color: "var(--app-text)" }}>
                {selectedPlaylist.videoCount}
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--app-card-bg)",
                border: "1px solid var(--app-card-border)",
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "var(--app-text-muted)" }}
              >
                Total Views
              </p>
              <p className="text-3xl" style={{ color: "var(--app-text)" }}>
                {(selectedPlaylist.videoCount * 12450).toLocaleString()}
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--app-card-bg)",
                border: "1px solid var(--app-card-border)",
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "var(--app-text-muted)" }}
              >
                Watch Time
              </p>
              <p className="text-3xl" style={{ color: "var(--app-text)" }}>
                {(selectedPlaylist.videoCount * 8.5).toFixed(1)}h
              </p>
            </div>
            <Button
              variant="gradient"
              className="rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-white shadow-lg shadow-purple-600/30"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm">Add Video</span>
            </Button>
          </div>

          {/* Videos in this Playlist Section */}
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <h2 className="text-2xl mb-6" style={{ color: "var(--app-text)" }}>
              Videos in this Playlist
            </h2>
            <div
              className="text-center py-12"
              style={{ color: "var(--app-text-muted)" }}
            >
              <ListIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No videos added yet</p>
              <p className="text-sm mt-2">
                Click "Add Video" to start building your playlist
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-300"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(to bottom right, #0a0a0a, #0f0f0f, #0a0a0a)"
            : "linear-gradient(to bottom right, #f5f5f7, #ffffff, #f5f5f7)",
        color: "var(--app-text)",
      }}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl mb-2" style={{ color: "var(--app-text)" }}>
            Playlists
          </h1>
          <p style={{ color: "var(--app-text-muted)" }}>
            Organize your content into collections
          </p>
        </div>
        <div className="relative group flex items-center gap-3">
          <Button onClick={() => router.push("/videos")} variant="gradient">
            Upload Video
          </Button>

          <div className="relative group">
            <Button
              variant="glass"
              className="relative px-6 py-3 text-white font-medium"
            >
              <span className="relative z-10">
                {filterChannel === "all"
                  ? "All Channels"
                  : channels.find((c) => c.id === filterChannel)?.name ||
                    "All Channels"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </Button>

            {/* Dropdown Menu */}
            {channels.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl shadow-gray-900/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Button
                  onClick={() => setFilterChannel("all")}
                  variant="ghost"
                  className={`w-full text-left px-4 py-3 text-sm ${
                    filterChannel === "all"
                      ? "bg-gray-700/50 text-white font-medium"
                      : "text-gray-300"
                  }`}
                >
                  All Channels
                </Button>
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    onClick={() => setFilterChannel(channel.id)}
                    variant="ghost"
                    className={`w-full text-left px-4 py-3 text-sm ${
                      filterChannel === channel.id
                        ? "bg-gray-700/50 text-white font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    {channel.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlists Grid - Prime Video Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaylists.map((playlist, index) => {
          const coverImage =
            playlistCoverImages[index % playlistCoverImages.length];

          return (
            <div
              key={playlist.id}
              className="group cursor-pointer"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              <div
                className="relative overflow-hidden rounded-2xl hover:border-purple-500/50 transition-all duration-300 shadow-lg"
                style={{
                  backgroundColor: "var(--app-card-bg)",
                  border: "1px solid var(--app-card-border)",
                }}
              >
                {/* Thumbnail Area with Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={coverImage}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-purple-600/80 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-purple-600 transition-colors shadow-xl">
                      <ListIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Video Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                    <Play className="w-3 h-3 text-white" />
                    <span className="text-sm text-white">
                      {playlist.videoCount}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3
                    className="text-xl mb-2 group-hover:text-purple-400 transition-colors line-clamp-1"
                    style={{ color: "var(--app-text)" }}
                  >
                    {playlist.name}
                  </h3>
                  <p
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    {playlist.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--app-text-muted)" }}>
                      {playlist.channelName}
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12.5%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Upload modal handled on Videos page */}
    </div>
  );
}
