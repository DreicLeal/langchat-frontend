"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome! Please select your English level: A1, A2, B1, or B2.",
      options: ["A1", "A2", "B1", "B2"],
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (chosenOption?: string) => {
    if (!userMessage.trim() && !chosenOption) return;

    const filteredMessages = messages.filter(
      (msg) =>
        msg.content !== "I couldn't understand your input. Please try again."
    );

    const newMessages: Message[] = [
      ...filteredMessages,
      chosenOption
        ? { role: "user", content: chosenOption }
        : { role: "user", content: userMessage },
    ];

    setMessages(newMessages);
    setUserMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from server.");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, options: data.options },
      ]);
    } catch (err) {
      console.error("Error:", err);

      setMessages((prev) => [
        ...prev.filter(
          (msg) =>
            msg.content !==
            "I couldn't understand your input. Please try again."
        ),
        {
          role: "assistant",
          content: "I couldn't understand your input. Please try again.",
          options: ["Retry"],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {msg.content}
              {msg.options && (
                <ul className="mt-2 space-y-1">
                  {msg.options.map((option, i) => (
                    <li
                      key={i}
                      onClick={() => sendMessage(option)}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-white flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !userMessage.trim()}
          className={`px-4 py-2 rounded-lg transition ${
            isLoading || !userMessage.trim()
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
