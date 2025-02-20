'use client';

import { createContext, useEffect, useState } from 'react';
import {
  saveChatHistory,
  getChatHistory,
  detectLanguage,
  addMessageToStorage,
  addAiResponseToMessage,
  AIResponseType
} from './ChatStorage';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sourceLanguage: string;
  confidence: number;
  timestamp: string;
  aiResponses?: AIResponseType[];
}

interface ChatContextType {
  chatHistory: ChatMessage[];
  addMessage: (role: 'user' | 'ai', content: string) => Promise<void>;
  addAIMessage: (
    messageId: string,
    aiResponse: AIResponseType
  ) => Promise<void>;
  translateMessage: (
    messageId: string,
    content: string,
    sourceLang: string,
    targetLang: string,
    confidence: number
  ) => Promise<void>;
  summarizeText: (
    messageId: string,
    content: string,
    sourceLanguage: string,
    confidence: number
  ) => Promise<void>;
  sourceLanguage: string;
  setSourceLanguage: (sourceLanguage: string) => void;
  targetLanguage: string;
  setTargetLanguage: (targetLanguage: string) => void;
  // translatedText: string;
  loadingState: {
    summarizer: string | null; // Stores message ID being summarized
    languageDetector: string | null; // Stores message ID being detected
    translator: string | null; // Stores message ID being translated
  };
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatHistory, setChatHistory] = useState(getChatHistory());
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [loadingState, setLoadingState] = useState<{
    summarizer: string | null; // Holds message ID or null
    languageDetector: string | null;
    translator: string | null;
  }>({
    summarizer: null,
    languageDetector: null,
    translator: null
  });

  useEffect(() => {
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  const addMessage = async (role: string, content: string) => {
    // Add message first
    await addMessageToStorage(role, content);
    const chatHistory = getChatHistory();
    const newMessage = chatHistory[chatHistory.length - 1]; // Get last message

    if (!newMessage || !newMessage.id) return;

    // Automatically detect language
    setLoadingState((prev) => ({ ...prev, languageDetector: newMessage.id }));

    try {
      const detectedResults = await detectLanguage(content);
      const detectedLanguage =
        detectedResults.length > 0
          ? detectedResults[0].detectedLanguage
          : 'unknown';
      const confidence =
        detectedResults.length > 0
          ? Math.floor(detectedResults[0].confidence * 100)
          : 0;

      // Update message with detected language & confidence
      const updatedMessage = {
        ...newMessage,
        sourceLanguage: detectedLanguage,
        confidence
      };

      chatHistory[chatHistory.length - 1] = updatedMessage;
      saveChatHistory(chatHistory);
      setChatHistory(chatHistory);
    } finally {
      setLoadingState((prev) => ({ ...prev, languageDetector: null }));
    }
  };

  const addAIMessage = async (
    messageId: string,
    aiResponse: AIResponseType
  ) => {
    await addAiResponseToMessage(messageId, aiResponse);
    setChatHistory(getChatHistory());
  };

  const translateMessage = async (
    messageId: string,
    content: string,
    sourceLang: string,
    targetLang: string,
    confidence: number
  ) => {
    setLoadingState((prev) => ({ ...prev, translator: messageId }));

    try {
      const timestamp = new Date().toISOString(); // Generate a timestamp

      await addAIMessage(messageId, {
        type: 'translation',
        content,
        id: messageId,
        role: 'ai',
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        detectedLanguage: sourceLang,
        confidence,
        timestamp
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, translator: null }));
    }
  };

  const summarizeText = async (
    messageId: string,
    content: string,
    sourceLanguage: string,
    confidence: number
  ) => {
    setLoadingState((prev) => ({ ...prev, summarizer: messageId }));

    try {
      const timestamp = new Date().toISOString(); // Generate a timestamp

      await addAIMessage(messageId, {
        type: 'summary',
        content,
        id: messageId,
        role: 'ai',
        sourceLanguage,
        detectedLanguage: sourceLanguage,
        confidence,
        timestamp
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, summarizer: null }));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        addMessage,
        addAIMessage,
        translateMessage,
        summarizeText,
        sourceLanguage,
        setSourceLanguage,
        targetLanguage,
        setTargetLanguage,
        loadingState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
