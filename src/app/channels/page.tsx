"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Play,
  List,
  TrendingUp,
  BarChart3,
  Eye,
  Plus,
} from "lucide-react";
import { useTheme } from "@/app/layout/ThemeProvider";
import {
  CreatePlaylistForm,
  PlaylistFormData,
} from "@/components/forms/CreatePlaylistForm";
import {
  CreateChannelForm,
  ChannelFormData,
} from "@/components/forms/CreateChannelForm";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/Button";

interface Channel {
  id: string;
  name: string;
  description?: string;
  profileImage?: string;
  subscribers: number;
  videoCount: number;
  playlistCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  channelId: string;
  channelName: string;
  videoCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const MOCK_CHANNELS: Channel[] = [
  {
    id: "1",
    name: "Tech Tutorials",
    description:
      "Learn technology and programming skills with in-depth tutorials",
    profileImage: "/placeholder-avatar.png",
    subscribers: 50000,
    videoCount: 150,
    playlistCount: 12,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Code Academy",
    description: "Comprehensive programming education for all levels",
    profileImage: "/placeholder-avatar.png",
    subscribers: 75000,
    videoCount: 200,
    playlistCount: 18,
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Dev Masters",
    description: "Professional development and advanced coding techniques",
    profileImage: "/placeholder-avatar.png",
    subscribers: 120000,
    videoCount: 300,
    playlistCount: 25,
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    name: "Creative Studio",
    description: "Creative content creation and design tutorials",
    profileImage: "/placeholder-avatar.png",
    subscribers: 35000,
    videoCount: 80,
    playlistCount: 8,
    createdAt: new Date("2023-12-20"),
    updatedAt: new Date("2024-01-01"),
  },
];

const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "p1",
    name: "React Basics",
    description: "Learn React fundamentals",
    channelId: "1",
    channelName: "Tech Tutorials",
    videoCount: 20,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "p2",
    name: "Advanced JavaScript",
    description: "Master JavaScript concepts",
    channelId: "1",
    channelName: "Tech Tutorials",
    videoCount: 15,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "p3",
    name: "Python Programming",
    description: "Complete Python course",
    channelId: "2",
    channelName: "Code Academy",
    videoCount: 25,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "p4",
    name: "Data Structures",
    description: "Learn essential data structures",
    channelId: "2",
    channelName: "Code Academy",
    videoCount: 18,
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "p5",
    name: "Web Development",
    description: "Full stack web development",
    channelId: "3",
    channelName: "Dev Masters",
    videoCount: 30,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "p6",
    name: "UI/UX Design",
    description: "Modern design principles",
    channelId: "4",
    channelName: "Creative Studio",
    videoCount: 12,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
];

export default function ChannelsPage() {
  const router = useRouter();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
  const { theme, mounted } = useTheme();

  // Ensure light theme as fallback if theme is not properly detected
  const effectiveTheme = mounted && theme ? theme : "light";

  const handleCreatePlaylist = (playlistData: PlaylistFormData) => {
    // Create new playlist
    const newPlaylist: Playlist = {
      id: `p${Date.now()}`,
      name: playlistData.name,
      description: playlistData.description,
      channelId: playlistData.channelId,
      videoCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      channelName: "",
    };

    // Add to playlists state
    setPlaylists((prev) => [...prev, newPlaylist]);

    // Update channel's playlist count
    setSelectedChannel((prev) =>
      prev
        ? {
            ...prev,
            playlistCount: prev.playlistCount + 1,
            updatedAt: new Date(),
          }
        : null
    );

    // Show success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-right";
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Playlist "${playlistData.name}" created successfully!</span>
      </div>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);

    setShowCreatePlaylist(false);
  };

  const handleCreateChannel = (channelData: ChannelFormData) => {
    // Create new channel
    const newChannel: Channel = {
      id: `c${Date.now()}`,
      name: channelData.name,
      description: channelData.description,
      profileImage: channelData.coverImage || "/placeholder-avatar.png",
      subscribers: 0,
      videoCount: 0,
      playlistCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // For now, just show success notification
    // In a real implementation, you would add this to your channels state
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-right";
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Channel "${channelData.name}" created successfully!</span>
      </div>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);

    setShowCreateChannel(false);
  };

  if (selectedChannel) {
    const channelPlaylists = playlists.filter(
      (p) => p.channelId === selectedChannel.id
    );

    return (
      <DashboardLayout>
        <div
          className={`min-h-screen ${
            effectiveTheme === "dark"
              ? "bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white"
              : "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-gray-900"
          } p-8`}
        >
          <button
            onClick={() => setSelectedChannel(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Channels</span>
          </button>

          {/* Channel Hero */}
          <div className="relative overflow-hidden rounded-3xl mb-8">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                effectiveTheme === "dark"
                  ? "from-red-600/20 to-purple-600/20"
                  : "from-red-600/15 to-purple-600/15"
              }`}
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

            <div className="relative p-12">
              <div className="flex items-start gap-8">
                <div className="relative w-32 h-32 animate-scale-in">
                  <img
                    src={selectedChannel.profileImage}
                    alt={selectedChannel.name}
                    className="w-32 h-32 rounded-3xl object-cover shadow-2xl"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-red-600/30 to-pink-600/30 rounded-3xl ${
                      effectiveTheme === "dark"
                        ? "shadow-red-600/30"
                        : "shadow-red-600/20"
                    }`}
                  ></div>
                </div>

                <div className="flex-1">
                  <h1
                    className={`text-5xl mb-4 animate-fade-in ${
                      effectiveTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedChannel.name}
                  </h1>
                  <p
                    className={`text-lg mb-6 max-w-2xl animate-fade-in ${
                      effectiveTheme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {selectedChannel.description}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        router.push(`/playlists?channel=${selectedChannel.id}`)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95"
                    >
                      <List className="w-5 h-5" />
                      <span>View All Playlists</span>
                    </button>
                    <button
                      onClick={() => setShowCreatePlaylist(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-purple-600/30 hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Playlist</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              className={`bg-gradient-to-br ${
                effectiveTheme === "dark"
                  ? "from-purple-600/20 to-pink-600/20 border border-purple-500/20"
                  : "from-purple-600/15 to-pink-600/15 border border-purple-500/15"
              } rounded-2xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${
                    effectiveTheme === "dark"
                      ? "bg-purple-500/20"
                      : "bg-purple-500/15"
                  } rounded-xl flex items-center justify-center`}
                >
                  <Users
                    className={`w-6 h-6 ${
                      effectiveTheme === "dark"
                        ? "text-purple-400"
                        : "text-purple-600"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    effectiveTheme === "dark"
                      ? "text-purple-400"
                      : "text-purple-600"
                  } text-sm`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <p
                className={`text-sm mb-1 ${
                  effectiveTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Subscribers
              </p>
              <p
                className={`text-3xl ${
                  effectiveTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedChannel.subscribers.toLocaleString()}
              </p>
            </div>

            <div
              className={`bg-gradient-to-br ${
                effectiveTheme === "dark"
                  ? "from-blue-600/20 to-cyan-600/20 border border-blue-500/20"
                  : "from-blue-600/15 to-cyan-600/15 border border-blue-500/15"
              } rounded-2xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${
                    effectiveTheme === "dark"
                      ? "bg-blue-500/20"
                      : "bg-blue-500/15"
                  } rounded-xl flex items-center justify-center`}
                >
                  <Play
                    className={`w-6 h-6 ${
                      effectiveTheme === "dark"
                        ? "text-blue-400"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    effectiveTheme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                  } text-sm`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>+8.2%</span>
                </div>
              </div>
              <p
                className={`text-sm mb-1 ${
                  effectiveTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Videos
              </p>
              <p
                className={`text-3xl ${
                  effectiveTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedChannel.videoCount}
              </p>
            </div>

            <div
              className={`bg-gradient-to-br ${
                effectiveTheme === "dark"
                  ? "from-green-600/20 to-emerald-600/20 border border-green-500/20"
                  : "from-green-600/15 to-emerald-600/15 border border-green-500/15"
              } rounded-2xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${
                    effectiveTheme === "dark"
                      ? "bg-green-500/20"
                      : "bg-green-500/15"
                  } rounded-xl flex items-center justify-center`}
                >
                  <List
                    className={`w-6 h-6 ${
                      effectiveTheme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    effectiveTheme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                  } text-sm`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>+5.1%</span>
                </div>
              </div>
              <p
                className={`text-sm mb-1 ${
                  effectiveTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Playlists
              </p>
              <p
                className={`text-3xl ${
                  effectiveTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {selectedChannel.playlistCount}
              </p>
            </div>

            <div
              className={`bg-gradient-to-br ${
                effectiveTheme === "dark"
                  ? "from-orange-600/20 to-red-600/20 border border-orange-500/20"
                  : "from-orange-600/15 to-red-600/15 border border-orange-500/15"
              } rounded-2xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${
                    effectiveTheme === "dark"
                      ? "bg-orange-500/20"
                      : "bg-orange-500/15"
                  } rounded-xl flex items-center justify-center`}
                >
                  <Eye
                    className={`w-6 h-6 ${
                      effectiveTheme === "dark"
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    effectiveTheme === "dark"
                      ? "text-orange-400"
                      : "text-orange-600"
                  } text-sm`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>+24.8%</span>
                </div>
              </div>
              <p
                className={`text-sm mb-1 ${
                  effectiveTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Views
              </p>
              <p
                className={`text-3xl ${
                  effectiveTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {(selectedChannel.subscribers * 15).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Playlists Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Channel Playlists</h2>
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-purple-600/30 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Playlist</span>
              </button>
            </div>

            {channelPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {channelPlaylists.map((playlist, index) => (
                  <div
                    key={playlist.id}
                    className="group bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-gray-800 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-red-500/10"
                    onClick={() =>
                      router.push(`/playlists?playlist=${playlist.id}`)
                    }
                  >
                    {/* Playlist Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-600/30">
                        <List className="w-8 h-8 text-white" />
                        {/* Video count badge */}
                        <div className="absolute -bottom-2 -right-2 bg-black/90 px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {playlist.videoCount}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-white mb-1 group-hover:text-red-400 transition-colors font-medium">
                          {playlist.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            {playlist.videoCount} videos
                          </span>
                          <span className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                            {selectedChannel.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Playlist Description */}
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                      {playlist.description}
                    </p>

                    {/* Hover overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-gray-800 rounded-2xl">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-red-600/30">
                    <List className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl text-white mb-3 font-semibold">
                  No Playlists Yet
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                  Create your first playlist to organize your content and make
                  it easier for viewers to find related videos
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowCreatePlaylist(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg font-medium">
                      Create Your First Playlist
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/videos")}
                    className="border border-gray-600 hover:border-red-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl flex items-center gap-3 transition-all hover:bg-red-600/10"
                  >
                    <Play className="w-6 h-6" />
                    <span className="text-lg font-medium">Browse Videos</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Playlist Form */}
          {showCreatePlaylist && (
            <CreatePlaylistForm
              channelId={selectedChannel.id}
              channelName={selectedChannel.name}
              onClose={() => setShowCreatePlaylist(false)}
              onCreate={handleCreatePlaylist}
            />
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className={`min-h-screen ${
          effectiveTheme === "dark"
            ? "bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] text-white"
            : "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-gray-900"
        } p-8`}
      >
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1
              className={`text-4xl mb-2 ${
                effectiveTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Your Channels
            </h1>
            <p
              className={`${
                effectiveTheme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage your content across different channels
            </p>
          </div>
          <button
            onClick={() => setShowCreateChannel(true)}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-red-600/30 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Channel</span>
          </button>
        </div>

        {/* Create Channel Form */}
        {showCreateChannel && (
          <CreateChannelForm
            onClose={() => setShowCreateChannel(false)}
            onCreate={handleCreateChannel}
          />
        )}

        {/* Channel Cards - Netflix Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CHANNELS.map((channel, index) => (
            <div
              key={channel.id}
              className="group relative cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedChannel(channel)}
            >
              {/* Card Background */}
              <div
                className={`relative overflow-hidden ${
                  effectiveTheme === "dark"
                    ? "bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800"
                    : "bg-gradient-to-br from-[#ffffff] to-[#f8fafc] border border-gray-200"
                } rounded-3xl p-8 group-hover:border-red-500/50 transition-all duration-300`}
              >
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative">
                  {/* Channel Avatar */}
                  <div className="relative w-24 h-24 mb-6">
                    <img
                      src={channel.profileImage}
                      alt={channel.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Channel Name */}
                  <h2
                    className={`text-2xl mb-2 group-hover:text-red-500 transition-colors ${
                      effectiveTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {channel.name}
                  </h2>
                  <p
                    className={`text-sm mb-6 line-clamp-2 ${
                      effectiveTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {channel.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className={`flex items-center justify-center gap-1 mb-1 ${
                          effectiveTheme === "dark"
                            ? "text-purple-400"
                            : "text-purple-600"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                      <p
                        className={`text-xl ${
                          effectiveTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {(channel.subscribers / 1000).toFixed(1)}K
                      </p>
                      <p
                        className={`text-xs ${
                          effectiveTheme === "dark"
                            ? "text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        Subscribers
                      </p>
                    </div>
                    <div className="text-center">
                      <div
                        className={`flex items-center justify-center gap-1 mb-1 ${
                          effectiveTheme === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        <Play className="w-4 h-4" />
                      </div>
                      <p
                        className={`text-xl ${
                          effectiveTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {channel.videoCount}
                      </p>
                      <p
                        className={`text-xs ${
                          effectiveTheme === "dark"
                            ? "text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        Videos
                      </p>
                    </div>
                    <div className="text-center">
                      <div
                        className={`flex items-center justify-center gap-1 mb-1 ${
                          effectiveTheme === "dark"
                            ? "text-green-400"
                            : "text-green-600"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </div>
                      <p
                        className={`text-xl ${
                          effectiveTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {channel.playlistCount}
                      </p>
                      <p
                        className={`text-xs ${
                          effectiveTheme === "dark"
                            ? "text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        Playlists
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-8 right-8 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
