"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Plus } from "lucide-react";
import { Playlist, Channel } from "@/types";
import { Playlists } from "@/components/ui/Playlists";

export default function PlaylistsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState("");

  useEffect(() => {
    loadPlaylists();
    loadChannels();

    // Check for channel filter in URL params
    const channelParam = searchParams.get("channel");
    if (channelParam) {
      setFilterChannel(channelParam);
    }
  }, [searchParams]);

  const loadPlaylists = async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      const mockPlaylists: Playlist[] = [
        {
          id: "1",
          name: "React Basics",
          description: "Learn React fundamentals and basic concepts",
          channelId: "1",
          channelName: "Tech Tutorials",
          videoCount: 12,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-16"),
        },
        {
          id: "2",
          name: "JavaScript Advanced",
          description: "Advanced JavaScript concepts and patterns",
          channelId: "1",
          channelName: "Tech Tutorials",
          videoCount: 8,
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-11"),
        },
        {
          id: "3",
          name: "Python Complete Course",
          description: "Complete Python programming course from scratch",
          channelId: "2",
          channelName: "Code Academy",
          videoCount: 25,
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-06"),
        },
        {
          id: "4",
          name: "Web Development Bootcamp",
          description: "Full stack web development bootcamp",
          channelId: "3",
          channelName: "Dev Masters",
          videoCount: 40,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-02"),
        },
      ];
      setPlaylists(mockPlaylists);
    } catch (error) {
      console.error("Failed to load playlists:", error);
    } finally {
      setIsLoading(false);
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
        {
          id: "3",
          name: "Dev Masters",
          description: "Professional development",
          subscribers: 120000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setChannels(mockChannels);
    } catch (error) {
      console.error("Failed to load channels:", error);
    }
  };

  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch =
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel =
      !filterChannel || playlist.channelId === filterChannel;

    return matchesSearch && matchesChannel;
  });

  const getPlaylistVideosCount = (playlistId: string) => {
    // Mock function to get video count for a playlist
    const counts = { "1": 12, "2": 8, "3": 25, "4": 40 };
    return counts[playlistId] || 0;
  };

  return (
    <DashboardLayout>
      <Playlists
        playlists={playlists}
        channels={channels}
        filterChannelId={filterChannel}
      />
    </DashboardLayout>
  );
}
