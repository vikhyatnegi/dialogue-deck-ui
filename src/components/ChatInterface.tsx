import { useState, useRef, useEffect } from "react";
import { Send, Menu, Bot, User, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Update input value when speech recognition changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

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
    resetTranscript();

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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

  const handleSpeechToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
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
      <div className="p-4 border-t border-border bg-chat-header-bg/50 backdrop-blur-sm">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="bg-chat-input-bg border-border text-foreground placeholder:text-muted-foreground pr-20 resize-none min-h-[44px] max-h-32 overflow-y-auto"
              rows={1}
            />
            <div className="absolute right-1 top-1 bottom-1 flex items-center space-x-1">
              {browserSupportsSpeechRecognition && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSpeechToggle}
                  className={`h-8 w-8 p-0 transition-colors ${
                    listening 
                      ? "text-destructive hover:text-destructive/80" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={listening ? "Stop recording" : "Start voice input"}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="h-8 w-8 p-0 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {listening && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse mr-2"></div>
            Listening... Speak now
          </div>
        )}
        {!browserSupportsSpeechRecognition && (
          <div className="mt-2 text-xs text-muted-foreground">
            Speech recognition not supported in this browser
          </div>
        )}
      </div>
    </div>
  );
};