"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Message = {
  id: number;
  sender: number;
  sender_name: string;
  sender_username: string;
  recipient: number;
  recipient_name: string;
  recipient_username: string;
  subject: string;
  body?: string;
  preview?: string;
  is_read: boolean;
  created_at: string;
  reply_count?: number;
};

type Athlete = {
  id: number;
  username: string;
  athlete_name: string;
  athlete_email: string;
};

export default function CoachMessagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "compose">("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    recipient: "",
    subject: "",
    body: "",
  });

  useEffect(() => {
    fetchMessages();
    fetchAthletes();
    fetchUnreadCount();
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "inbox" ? "/api/performance/messages/inbox/" : "/api/performance/messages/sent/";
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAthletes = async () => {
    try {
      const response = await fetch("/api/coach/athletes/", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAthletes(data);
      }
    } catch (error) {
      console.error("Error fetching athletes:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/performance/messages/unread_count/", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch("/api/performance/messages/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
        body: JSON.stringify(composeForm),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setComposeForm({ recipient: "", subject: "", body: "" });
        setActiveTab("sent");
      } else {
        const error = await response.json();
        alert(`Failed to send message: ${error.error || JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      let csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      
      if (!csrfToken) {
        await fetch("/api/csrf/", { credentials: "include" });
        csrfToken = document.cookie.split('csrftoken=')[1]?.split(';')[0];
      }

      const response = await fetch(`/api/performance/messages/${messageId}/mark_read/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
        },
      });

      if (response.ok) {
        fetchMessages();
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const viewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read && activeTab === "inbox") {
      await handleMarkAsRead(message.id);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Communicate with your athletes</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "inbox"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          📥 Inbox {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
        </button>
        <button
          onClick={() => { setActiveTab("sent"); setSelectedMessage(null); }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "sent"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          📤 Sent
        </button>
        <button
          onClick={() => { setActiveTab("compose"); setSelectedMessage(null); }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "compose"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          ✏️ Compose
        </button>
      </div>

      {/* Content */}
      {activeTab === "compose" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Message</h2>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To (Athlete) *
              </label>
              <select
                value={composeForm.recipient}
                onChange={(e) => setComposeForm({ ...composeForm, recipient: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select an athlete</option>
                {athletes.map((athlete) => (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.athlete_name} (@{athlete.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={composeForm.subject}
                onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                value={composeForm.body}
                onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Type your message..."
                rows={8}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={() => setComposeForm({ recipient: "", subject: "", body: "" })}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      ) : selectedMessage ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <button
            onClick={() => setSelectedMessage(null)}
            className="mb-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to {activeTab}
          </button>
          
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedMessage.subject}</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">From:</span> {selectedMessage.sender_name} (@{selectedMessage.sender_username})
              </div>
              <div>{new Date(selectedMessage.created_at).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium">To:</span> {selectedMessage.recipient_name} (@{selectedMessage.recipient_username})
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{selectedMessage.body}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === "inbox" ? "Inbox" : "Sent Messages"}
            </h2>
            <p className="text-sm text-gray-500">{messages.length} message{messages.length !== 1 ? "s" : ""}</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">No messages yet</p>
              <p className="text-sm text-gray-500">
                {activeTab === "inbox" ? "You haven't received any messages" : "You haven't sent any messages"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => viewMessage(message)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                    !message.is_read && activeTab === "inbox" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!message.is_read && activeTab === "inbox" && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {activeTab === "inbox" 
                          ? `From: ${message.sender_name} (@${message.sender_username})`
                          : `To: ${message.recipient_name} (@${message.recipient_username})`
                        }
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">{message.preview || message.body}</p>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
