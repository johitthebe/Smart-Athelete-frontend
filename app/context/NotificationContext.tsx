"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "@/lib/config";

interface NotificationContextType {
  unreadFeedbackCount: number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadFeedbackCount, setUnreadFeedbackCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance/feedback/unread/`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadFeedbackCount(data.count || 0);
      }
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  return (
    <NotificationContext.Provider value={{ unreadFeedbackCount, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
