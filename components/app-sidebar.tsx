"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Trash2Icon, MessageCircleIcon, DownloadIcon, MoreHorizontalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChats, type Chat } from "@/hooks/use-chats";

const convertMessagesToMarkdown = (messages: unknown[]) => {
  let md = "# Chat Export\n\n";
  messages.forEach((message: unknown) => {
    const msg = message as { role?: string; content?: string; parts?: unknown[] };
    const role = msg.role === "user" ? "User" : "Assistant";
    md += `## ${role}\n\n`;

    if (msg.content) {
      md += `${msg.content}\n\n`;
    } else if (msg.parts) {
      msg.parts.forEach((part: unknown) => {
        const p = part as { type?: string; text?: string; reasoning?: string; state?: string; output?: unknown[] };
        if (p.type === "text") {
          md += `${p.text}\n\n`;
        } else if (p.type === "reasoning") {
          md += `**Reasoning:**\n\n${p.reasoning}\n\n`;
        } else if (
          p.type?.startsWith("tool-") ||
          p.type === "dynamic-tool"
        ) {
          const toolType = p.type.replace("tool-", "");
          md += `**Tool: ${toolType}**\n\n`;
          const dyn = p as {
            state?: string;
            output?: { title?: string; link?: string }[];
          };
          if (dyn.state === "output-available" && Array.isArray(dyn.output)) {
            dyn.output.forEach((item) => {
              if (item.title && item.link) {
                md += `- [${item.title}](${item.link})\n`;
              }
            });
            md += "\n";
          }
        }
      });
    }
  });
  return md;
};

const downloadMarkdown = (content: string, chatTitle: string) => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function AppSidebar() {
  const { chats, deleteChat, currentChatId, switchChat } = useChats();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  const handleDeleteChat = (chat: Chat) => {
    setChatToDelete(chat);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete.id);
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  const handleDownloadChat = (chat: Chat) => {
    try {
      // Load messages for this chat from localStorage
      const messagesKey = `chat:messages:${chat.id}`;
      const storedMessages = localStorage.getItem(messagesKey);

      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        const markdown = convertMessagesToMarkdown(messages);
        downloadMarkdown(markdown, chat.title);
      } else {
        // Fallback: try the old format
        const oldMessages = localStorage.getItem("chat:messages");
        if (oldMessages) {
          const messages = JSON.parse(oldMessages);
          const markdown = convertMessagesToMarkdown(messages);
          downloadMarkdown(markdown, chat.title);
        }
      }
    } catch (error) {
      console.error("Failed to download chat:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between px-2">
            <span className="font-semibold text-sm">Chats</span>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150"></div>
                      <MessageCircleIcon className="relative w-12 h-12 mx-auto text-primary/70" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-2">No conversations yet</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      Start your first chat to begin exploring with AI. Your conversations will appear here.
                    </p>
                  </div>
                ) : (
                  chats.map((chat) => (
                     <SidebarMenuItem key={chat.id}>
                       <div className="flex items-center w-full">
                         <SidebarMenuButton
                           asChild
                           isActive={chat.id === currentChatId}
                           className="flex-1"
                         >
                            <button
                             className="flex items-center w-full text-left p-2 rounded-md hover:bg-accent/50 transition-colors"
                             onClick={() => switchChat(chat.id)}
                           >
                             <MessageCircleIcon className="w-4 h-4 mr-3 flex-shrink-0 text-primary/70" />
                             <div className="flex-1 min-w-0">
                               <div className="truncate text-sm font-medium text-foreground">
                                 {chat.title}
                               </div>
                               <div className="text-xs text-muted-foreground">
                                 {chat.messageCount} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                               </div>
                             </div>
                           </button>
                         </SidebarMenuButton>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-6 w-6">
                               <MoreHorizontalIcon className="w-3 h-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={() => handleDownloadChat(chat)}>
                               <DownloadIcon className="w-4 h-4 mr-2" />
                               Download
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleDeleteChat(chat)} className="text-destructive">
                               <Trash2Icon className="w-4 h-4 mr-2" />
                               Delete
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{chatToDelete?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
