"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Video, Channel, Playlist } from "@/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useTheme } from "@/app/layout/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { VideoCard } from "@/components/ui/VideoCard";
import {
  ArrowLeft,
  Play,
  Eye,
  MoreVertical,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { UploadVideoForm } from "@/components/forms/UploadVideoForm";
import { Comment } from "@/components/ui/Comment";
import { CommentForm } from "@/components/ui/CommentForm";
import { LikesList } from "@/components/ui/LikesList";

interface VideosProps {
  videos: Video[];
  channels: Channel[];
  playlists: Playlist[];
}

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterPlaylist, setFilterPlaylist] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<
    "active" | "abuseReported" | "blocked"
  >("active");
  const { theme } = useTheme();
  const [showUpload, setShowUpload] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [videoLikes, setVideoLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadVideos();
    loadChannels();
    loadPlaylists();

    // Read playlist filter from URL on client mount
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const playlistParam = sp.get("playlist");
      if (playlistParam) setFilterPlaylist(playlistParam);
    }
  }, []);

  const loadVideos = async () => {
    try {
      // Mock data for now
      const mockVideos: Video[] = [
        {
          id: "1",
          title: "How to Code in React",
          description: "Learn the basics of React development",
          thumbnail: "/placeholder-avatar.png",
          duration: "15:30",
          views: 12500,
          uniqueViews: 8900,
          newUniqueViews: 1200,
          watchTime: "120:45:00",
          channelId: "1",
          channelName: "Tech Tutorials",
          status: "active",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-16"),
          comments: [
            {
              id: "c1",
              videoId: "1",
              userId: "user1",
              username: "CodeMaster",
              profileImage: "/placeholder-avatar.png",
              content:
                "Great tutorial! Really helped me understand React hooks better.",
              likes: 15,
              createdAt: new Date("2024-01-16"),
              updatedAt: new Date("2024-01-16"),
            },
            {
              id: "c2",
              videoId: "1",
              userId: "user2",
              username: "WebDevPro",
              profileImage: "/placeholder-avatar.png",
              content:
                "The examples were very clear. Can you do a follow-up on state management?",
              likes: 8,
              createdAt: new Date("2024-01-17"),
              updatedAt: new Date("2024-01-17"),
            },
          ],
          likes: [
            {
              id: "l1",
              videoId: "1",
              userId: "user1",
              createdAt: new Date("2024-01-16"),
            },
            {
              id: "l2",
              videoId: "1",
              userId: "user2",
              createdAt: new Date("2024-01-17"),
            },
            {
              id: "l3",
              videoId: "1",
              userId: "user3",
              createdAt: new Date("2024-01-18"),
            },
          ],
        },
        {
          id: "2",
          title: "Advanced JavaScript Concepts",
          description: "Deep dive into JavaScript advanced features",
          thumbnail: "/placeholder-avatar.png",
          duration: "25:15",
          views: 8900,
          uniqueViews: 6200,
          newUniqueViews: 850,
          watchTime: "85:20:00",
          channelId: "1",
          channelName: "Tech Tutorials",
          status: "active",
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-11"),
          comments: [
            {
              id: "c3",
              videoId: "2",
              userId: "user4",
              username: "JSNinja",
              profileImage: "/placeholder-avatar.png",
              content: "Closure explanation was spot on!",
              likes: 22,
              createdAt: new Date("2024-01-12"),
              updatedAt: new Date("2024-01-12"),
            },
          ],
          likes: [
            {
              id: "l4",
              videoId: "2",
              userId: "user4",
              createdAt: new Date("2024-01-12"),
            },
            {
              id: "l5",
              videoId: "2",
              userId: "user5",
              createdAt: new Date("2024-01-13"),
            },
          ],
        },
        {
          id: "3",
          title: "Python for Beginners",
          description: "Complete Python tutorial for beginners",
          thumbnail: "/placeholder-avatar.png",
          duration: "45:00",
          views: 15600,
          uniqueViews: 11200,
          newUniqueViews: 1500,
          watchTime: "200:15:00",
          channelId: "2",
          channelName: "Code Academy",
          status: "abuseReported",
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-06"),
          comments: [],
          likes: [],
        },
      ];
      setVideos(mockVideos);
    } catch (error) {
      console.error("Failed to load videos:", error);
    }
  };

  const loadChannels = async () => {
    try {
      const mockChannels: Channel[] = [
        {
          id: "1",
          name: "Tech Tutorials",
          description: "Technology tutorials",
          subscribers: 50000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Code Academy",
          description: "Programming education",
          subscribers: 75000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setChannels(mockChannels);
    } catch (error) {
      console.error("Failed to load channels:", error);
    }
  };

  const loadPlaylists = async () => {
    try {
      const mockPlaylists: Playlist[] = [
        {
          id: "1",
          name: "React Basics",
          description: "Learn React fundamentals",
          channelId: "1",
          channelName: "Tech Tutorials",
          createdAt: new Date(),
          updatedAt: new Date(),
          videoCount: 0,
        },
        {
          id: "2",
          name: "JavaScript Advanced",
          description: "Advanced JavaScript concepts",
          channelId: "1",
          channelName: "Tech Tutorials",
          createdAt: new Date(),
          updatedAt: new Date(),
          videoCount: 0,
        },
      ];
      setPlaylists(mockPlaylists);
    } catch (error) {
      console.error("Failed to load playlists:", error);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const channelMatch =
      filterChannel === "all" || video.channelId === filterChannel;
    const playlistMatch =
      filterPlaylist === "all" || video.playlistId === filterPlaylist;
    const statusMatch = video.status === activeTab;
    return channelMatch && playlistMatch && statusMatch;
  });

  if (selectedVideo) {
    const videoIndex = videos.findIndex((v) => v.id === selectedVideo.id);
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
    const thumbnailUrl = videoThumbnails[videoIndex % videoThumbnails.length];
    
    // Channel cover images
    const channelCoverImages = [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1559526324-593bc073d938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ];
    
    const channelIndex = channels.findIndex(c => c.id === selectedVideo.channelId);
    const channelCoverUrl = channelCoverImages[channelIndex % channelCoverImages.length];

    // Handlers for comments and likes
    const handleCommentSubmit = (content: string) => {
      const newComment = {
        id: `c${Date.now()}`,
        videoId: selectedVideo.id,
        userId: `user${Math.floor(Math.random() * 1000)}`,
        username: `User${Math.floor(Math.random() * 1000)}`,
        profileImage: "/placeholder-avatar.png",
        content,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === selectedVideo.id
            ? { ...video, comments: [...(video.comments || []), newComment] }
            : video
        )
      );
    };

    const handleReplySubmit = (commentId: string, content: string) => {
      const newReply = {
        id: `r${Date.now()}`,
        videoId: selectedVideo.id,
        userId: `user${Math.floor(Math.random() * 1000)}`,
        username: `User${Math.floor(Math.random() * 1000)}`,
        profileImage: "/placeholder-avatar.png",
        content,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === selectedVideo.id
            ? {
                ...video,
                comments: video.comments?.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), newReply],
                      }
                    : comment
                ) || [],
              }
            : video
        )
      );
    };

    const handleCommentLike = (commentId: string) => {
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));

      // Update comment likes count
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === selectedVideo.id
            ? {
                ...video,
                comments:
                  video.comments?.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          likes:
                            comment.likes + (commentLikes[commentId] ? -1 : 1),
                        }
                      : comment
                  ) || [],
              }
            : video
        )
      );
    };

    const handleVideoLike = () => {
      const isLiked = videoLikes[selectedVideo.id];
      const newLike = {
        id: `l${Date.now()}`,
        videoId: selectedVideo.id,
        userId: `user${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date(),
      };

      setVideoLikes((prev) => ({
        ...prev,
        [selectedVideo.id]: !isLiked,
      }));

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === selectedVideo.id
            ? {
                ...video,
                likes: isLiked
                  ? video.likes?.filter(
                      (like) => like.userId !== newLike.userId
                    ) || []
                  : [...(video.likes || []), newLike],
              }
            : video
        )
      );
    };

    return (
      <DashboardLayout>
        <div
          className="min-h-screen transition-colors duration-300"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(to bottom right, #0a0a0a, #0f0f0f, #0a0a0a)"
                : "linear-gradient(to bottom right, #f8fafc, #ffffff, #f1f5f9)",
            color: "var(--app-text)",
          }}
        >
          <div className="p-8">
          <Button
            onClick={() => setSelectedVideo(null)}
            variant="gradient"
            className="flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Videos</span>
          </Button>

          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player Area */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 group shadow-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                  <ImageWithFallback
                    src={thumbnailUrl}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-white/95 to-white/80 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-white/50 backdrop-blur-xl hover:bg-gradient-to-br hover:from-white/100 hover:to-white/95">
                      <Play className="w-10 h-10 text-gray-900 fill-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-gradient-to-br from-gray-900/90 to-gray-800/90 px-3 py-1 rounded-lg text-sm text-white border border-gray-700/50">
                    {Math.floor(Math.random() * 30 + 5)}:
                    {Math.floor(Math.random() * 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>

                <h1
                  className="text-3xl mb-4"
                  style={{ color: "var(--app-text)" }}
                >
                  {selectedVideo.title}
                </h1>

                <div
                  className="flex items-center gap-4 mb-6"
                  style={{ color: "var(--app-text-muted)" }}
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {selectedVideo.views.toLocaleString()} views
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {selectedVideo.createdAt.toLocaleDateString()}
                  </span>
                  <span>•</span>
                  {(() => {
                    switch (selectedVideo.status) {
                      case "active":
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs backdrop-blur-sm">
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                        );
                      case "abuseReported":
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-full text-xs backdrop-blur-sm">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Under Review</span>
                          </div>
                        );
                      case "blocked":
                        return (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-xs backdrop-blur-sm">
                            <XCircle className="w-3 h-3" />
                            <span>Blocked</span>
                          </div>
                        );
                    }
                  })()}
                </div>

                {/* Channel Backdrop - YouTube Style */}
                <div
                  className="relative rounded-xl overflow-hidden mb-6 shadow-2xl"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                  }}
                >
                  {/* Channel Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={channelCoverUrl}
                      alt={`${selectedVideo.channelName} cover`}
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

                  {/* Channel Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end gap-6">
                      {/* Channel Avatar */}
                      <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/30 border-4 border-white/20">
                        <span className="text-2xl font-bold text-white">
                          {selectedVideo.channelName[0]}
                        </span>
                      </div>

                      {/* Channel Details */}
                      <div className="flex-1 pb-2">
                        <h3
                          className="text-2xl mb-1 font-bold"
                          style={{ color: "var(--app-text)" }}
                        >
                          {selectedVideo.channelName}
                        </h3>
                        <p
                          className="text-sm mb-2"
                          style={{ color: "var(--app-text-muted)" }}
                        >
                          {channels.find(c => c.id === selectedVideo.channelId)?.description || "Technology tutorials"}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span style={{ color: "var(--app-text)" }}>
                            {channels.find(c => c.id === selectedVideo.channelId)?.subscribers.toLocaleString() || "50,000"} subscribers
                          </span>
                          <span style={{ color: "var(--app-text-muted)" }}>•</span>
                          <span style={{ color: "var(--app-text)" }}>
                            Playlist: {selectedVideo.playlistName || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div
                  className="rounded-xl p-6 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 shadow-xl"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    className="text-lg mb-4"
                    style={{ color: "var(--app-text)" }}
                  >
                    Comments ({selectedVideo.comments?.length || 0})
                  </h3>

                  {/* Comment Form */}
                  <CommentForm onSubmit={handleCommentSubmit} />

                  {/* Comments List */}
                  <div className="mt-6 space-y-4">
                    {selectedVideo.comments &&
                    selectedVideo.comments.length > 0 ? (
                      selectedVideo.comments.map((comment) => (
                        <Comment
                          key={comment.id}
                          comment={comment}
                          onLike={handleCommentLike}
                          isLiked={commentLikes[comment.id] || false}
                          onReply={handleReplySubmit}
                        />
                      ))
                    ) : (
                      <div
                        className="text-center py-8"
                        style={{ color: "var(--app-text-muted)" }}
                      >
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>

                {/* Likes Section */}
                <div
                  className="rounded-xl p-6 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 shadow-xl"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-lg"
                      style={{ color: "var(--app-text)" }}
                    >
                      Likes ({selectedVideo.likes?.length || 0})
                    </h3>
                    <button
                      onClick={handleVideoLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        videoLikes[selectedVideo.id]
                          ? "bg-red-500/20 text-red-400 border border-red-500/50"
                          : "bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/40 hover:bg-white/20"
                      }`}
                    >
                      <span className="w-4 h-4">
                        {videoLikes[selectedVideo.id] ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        )}
                      </span>
                      <span>
                        {videoLikes[selectedVideo.id] ? "Liked" : "Like"}
                      </span>
                    </button>
                  </div>

                  <LikesList likes={selectedVideo.likes || []} />
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <div
                  className="rounded-xl p-6 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 shadow-xl"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    className="text-lg mb-4"
                    style={{ color: "var(--app-text)" }}
                  >
                    Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Total Views
                      </span>
                      <span style={{ color: "var(--app-text)" }}>
                        {selectedVideo.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Unique Views
                      </span>
                      <span style={{ color: "var(--app-text)" }}>
                        {selectedVideo.uniqueViews.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Engagement
                      </span>
                      <span className="text-green-400">+24.5%</span>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 shadow-xl"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    className="text-lg mb-4"
                    style={{ color: "var(--app-text)" }}
                  >
                    Earnings
                  </h3>
                  <p className="text-3xl text-green-400 mb-2">
                    ${(selectedVideo.views * 0.0024).toFixed(2)}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    From this video
                  </p>
                </div>

                <div
                  className="rounded-xl p-6 backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/8 border border-white/30 shadow-xl"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    className="text-lg mb-4"
                    style={{ color: "var(--app-text)" }}
                  >
                    Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Upload Date
                      </span>
                      <span style={{ color: "var(--app-text)" }}>
                        {selectedVideo.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Channel
                      </span>
                      <span style={{ color: "var(--app-text)" }}>
                        {selectedVideo.channelName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--app-text-muted)" }}>
                        Playlist
                      </span>
                      <span style={{ color: "var(--app-text)" }}>
                        {selectedVideo.playlistName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
        <div className="mb-8">
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{ color: "var(--app-text)" }}
          >
            Your Videos
          </h1>
          <div className="flex items-center justify-between">
            <p style={{ color: "var(--app-text-muted)" }}>
              Manage and track your content performance
            </p>
            <div>
              <Button onClick={() => setShowUpload(true)} variant="gradient">
                Upload Video
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <Button
            onClick={() => setActiveTab("active")}
            variant={activeTab === "active" ? "gradient" : "outline"}
            className="px-6 py-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                {videos.filter((v) => v.status === "active").length}
              </span>
            </div>
          </Button>
          <Button
            onClick={() => setActiveTab("abuseReported")}
            variant={activeTab === "abuseReported" ? "gradient" : "outline"}
            className="px-6 py-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Under Review</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                {videos.filter((v) => v.status === "abuseReported").length}
              </span>
            </div>
          </Button>
          <Button
            onClick={() => setActiveTab("blocked")}
            variant={activeTab === "blocked" ? "gradient" : "outline"}
            className="px-6 py-3"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Blocked</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                {videos.filter((v) => v.status === "blocked").length}
              </span>
            </div>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative group">
            <button
              className="relative bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-sm border border-red-600/50 rounded-xl px-4 py-3 text-white font-medium transition-all duration-300 hover:from-red-700/60 hover:to-red-800/60 hover:border-red-500/70 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 active:scale-95"
              style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            >
              <span className="relative z-10">
                {filterChannel === "all"
                  ? "All Channels"
                  : channels.find((c) => c.id === filterChannel)?.name ||
                    "All Channels"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </button>

            {/* Channel Dropdown Menu */}
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

          <div className="relative group">
            <button
              className="relative bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-sm border border-red-600/50 rounded-xl px-4 py-3 text-white font-medium transition-all duration-300 hover:from-red-700/60 hover:to-red-800/60 hover:border-red-500/70 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 active:scale-95"
              style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            >
              <span className="relative z-10">
                {filterPlaylist === "all"
                  ? "All Playlists"
                  : playlists.find((p) => p.id === filterPlaylist)?.name ||
                    "All Playlists"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </button>

            {/* Playlist Dropdown Menu */}
            {playlists.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-2xl shadow-gray-900/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Button
                  onClick={() => setFilterPlaylist("all")}
                  variant="ghost"
                  className={`w-full text-left px-4 py-3 text-sm ${
                    filterPlaylist === "all"
                      ? "bg-gray-700/50 text-white font-medium"
                      : "text-gray-300"
                  }`}
                >
                  All Playlists
                </Button>
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    onClick={() => setFilterPlaylist(playlist.id)}
                    variant="ghost"
                    className={`w-full text-left px-4 py-3 text-sm ${
                      filterPlaylist === playlist.id
                        ? "bg-gray-700/50 text-white font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    {playlist.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Grid - YouTube/Netflix Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => setSelectedVideo(video)}
              index={index}
            />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <Play
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "var(--app-text-muted)" }}
            />
            <p
              className="text-lg mb-2"
              style={{ color: "var(--app-text-muted)" }}
            >
              No videos found
            </p>
            <p className="text-sm" style={{ color: "var(--app-text-muted)" }}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
      {showUpload && (
        <UploadVideoForm
          onClose={() => setShowUpload(false)}
          onCreate={(data) => {
            // Create a minimal Video object from form data and add to list
            const selectedChannelId = data.channelId || channels[0]?.id || "1";
            const selectedChannel = channels.find(
              (c) => c.id === selectedChannelId
            );
            const channelName =
              selectedChannel?.name || channels[0]?.name || "Channel";

            const newVideo = {
              id: `v${Date.now()}`,
              title: data.videoName,
              description: data.videoDescription,
              thumbnail: "/placeholder-avatar.png",
              duration: "0:00",
              views: 0,
              watchTime: "0:00:00",
              channelId: selectedChannelId,
              channelName: channelName,
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            } as any;
            setVideos((prev) => [newVideo, ...prev]);
            setShowUpload(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
