import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { chatWithGemini } from "./api";

interface Message {
  id: string;
  content: string;
  isUserMessage: boolean;
  sender: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  scenarioId: string;
  patientName: string;
  onMessagesUpdate?: (messages: Message[]) => void;
}

const ChatInterface = ({ scenarioId, patientName, onMessagesUpdate }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Notify parent component of message updates
  useEffect(() => {
    onMessagesUpdate?.(messages);
  }, [messages, onMessagesUpdate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUserMessage: true,
      sender: "You",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsResponding(true);

    try {
      console.log("Sending message to Gemini:", input);
      const geminiResponse = await chatWithGemini(input, {
        scenarioId,
        patientName,
      });
      
      console.log("Gemini response received:", geminiResponse);

      if (!geminiResponse.reply || geminiResponse.reply.trim() === "") {
        throw new Error("Empty response from Gemini");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: geminiResponse.reply,
          isUserMessage: false,
          sender: patientName,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
          isUserMessage: false,
          sender: patientName,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="bg-white p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with {patientName}</h2>
        <p className="text-sm text-muted-foreground">
          Practice your therapeutic conversation skills
        </p>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUserMessage={message.isUserMessage}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}
        {isResponding && (
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="bg-gray-200 rounded-full p-2 mr-2 animate-pulse"></div>
            {patientName} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your response..."
            className="min-h-[60px] resize-none flex-grow"
            disabled={isResponding}
          />
          <Button
            onClick={handleSendMessage}
            disabled={input.trim() === "" || isResponding}
            className="bg-psycho-500 hover:bg-psycho-600 self-end"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
