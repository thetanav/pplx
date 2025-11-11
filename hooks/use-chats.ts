import { useState, useEffect } from 'react';

export interface Chat {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    // Load chats from localStorage
    const storedChats = localStorage.getItem('chats');
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats);
        setChats(parsedChats);
      } catch (error) {
        console.error('Failed to parse stored chats:', error);
      }
    }

    // Load current chat ID
    const storedCurrentChatId = localStorage.getItem('currentChatId');
    if (storedCurrentChatId) {
      setCurrentChatId(storedCurrentChatId);
    }
  }, []);

  const saveChats = (newChats: Chat[]) => {
    setChats(newChats);
    localStorage.setItem('chats', JSON.stringify(newChats));
  };

  const deleteChat = (chatId: string) => {
    const newChats = chats.filter(chat => chat.id !== chatId);
    saveChats(newChats);

    // Remove messages for this chat
    localStorage.removeItem(`chat:messages:${chatId}`);

    // If deleting current chat, switch to another or null
    if (currentChatId === chatId) {
      const nextChat = newChats.length > 0 ? newChats[0] : null;
      setCurrentChatId(nextChat?.id || null);
      localStorage.setItem('currentChatId', nextChat?.id || '');
    }
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
    localStorage.setItem('currentChatId', chatId);
  };

  return {
    chats,
    deleteChat,
    currentChatId,
    switchChat,
  };
}