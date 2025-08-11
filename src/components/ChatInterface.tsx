import { useState } from "react";
import { Send, Menu, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInterfaceProps {
  onMenuClick: () => void;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const ChatInterface = ({ onMenuClick }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm ChatGPT, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I understand your message. This is a placeholder response from the AI assistant.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-chat">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-chat-header-bg/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-foreground hover:bg-accent"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Chat with GPT-4</h1>
            <p className="text-sm text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === "user"
                  ? "bg-chat-user-bg"
                  : "bg-chat-bot-bg border border-border"
              }`}
            >
              {message.type === "user" ? (
                <User className="w-4 h-4 text-chat-user-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-chat-bot-foreground" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg shadow-message ${
                message.type === "user"
                  ? "bg-chat-user-bg text-chat-user-foreground ml-auto"
                  : "bg-chat-bot-bg text-chat-bot-foreground border border-border"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-chat-header-bg/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="bg-chat-input-bg border-border text-foreground placeholder:text-muted-foreground pr-12"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="absolute right-1 top-1 bottom-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};