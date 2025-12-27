"use client";

import { Comment as CommentType } from "@/types";
import { ImageWithFallback } from "./ImageWithFallback";
import { Button } from "./Button";
import { Heart, MessageCircle, MoreVertical, Reply } from "lucide-react";
import { useTheme } from "@/app/layout/ThemeProvider";
import { useState } from "react";

interface CommentProps {
  comment: CommentType;
  onLike?: (commentId: string) => void;
  isLiked?: boolean;
  onReply?: (commentId: string, content: string) => void;
}

export function Comment({
  comment,
  onLike,
  isLiked = false,
  onReply,
}: CommentProps) {
  const { theme } = useTheme();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  return (
    <div
      className="p-4 rounded-xl mb-3 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl hover:border-white/40 transition-all duration-300"
      style={{
        backgroundColor: "var(--app-card-bg)",
        border: "1px solid var(--app-card-border)",
      }}
    >
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={comment.profileImage || "/placeholder-avatar.png"}
            alt={comment.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-medium text-sm"
              style={{ color: "var(--app-text)" }}
            >
              {comment.username}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--app-text-muted)" }}
            >
              {comment.createdAt.toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm mb-3" style={{ color: "var(--app-text)" }}>
            {comment.content}
          </p>

          {/* Comment Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="gradient"
              size="sm"
              onClick={() => onLike?.(comment.id)}
              className={`flex items-center gap-2 ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
              <span style={{ color: "var(--app-text-muted)" }}>
                {comment.likes}
              </span>
            </Button>

            <Button
              variant="gradient"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="w-4 h-4" />
              <span style={{ color: "var(--app-text-muted)" }}>Reply</span>
            </Button>

            <div className="relative ml-auto">
              <Button
                variant="gradient"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-[100]"
                  style={{
                    backgroundColor: "var(--app-card-bg)",
                    border: "1px solid var(--app-card-border)",
                    zIndex: 100,
                  }}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    style={{ color: "var(--app-text)" }}
                    onClick={() => {
                      setShowMenu(false);
                      setShowReplyForm(true);
                    }}
                  >
                    Reply
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    style={{ color: "var(--app-text)" }}
                    onClick={() => {
                      setShowMenu(false);
                      // Report functionality could go here
                    }}
                  >
                    Report
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    style={{ color: "var(--app-text)" }}
                    onClick={() => setShowMenu(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div
              className="mt-4 pt-4 border-t border-border"
              style={{ borderColor: "var(--app-card-border)" }}
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-yellow-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                  {comment.username?.[0] || "U"}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 text-sm placeholder:text-muted-foreground"
                    style={{ color: "var(--app-text)" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReplySubmit();
                      }
                    }}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
