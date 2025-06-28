
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { chatWithOllama } from "./api";
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


}

const ChatInterface = ({ scenarioId, patientName }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with first message from patient
  useEffect(() => {
    const initialMessages = getInitialMessages(scenarioId, patientName);
    setMessages(initialMessages);
  }, [scenarioId, patientName]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message
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
    const ollamaResponse = await chatWithOllama(input, {
      scenarioId,
      patientName,
      // add more context if needed
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: ollamaResponse.reply || ollamaResponse.message || "No response.",
        isUserMessage: false,
        sender: patientName,
        timestamp: new Date(),
      },
    ]);
  } catch (err) {
    setMessages((prev) => [   ...prev,
      {
        id: Date.now().toString(),
        content: "Error contacting AI model.",
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

// Helper functions for generating responses based on scenario
function getInitialMessages(scenarioId: string, patientName: string): Message[] {
  const scenarios: Record<string, string> = {
    "anxiety-disorder": `Hi there. My name is ${patientName}. I've been experiencing really intense worry lately. It's affecting my sleep and I feel on edge all the time. Sometimes my heart races for no reason, and I'm starting to avoid social situations. I'm not sure what's happening to me.`,
    "depression": `Hello. I'm ${patientName}. I've been feeling really down for the past few months. I don't enjoy things I used to love, and I'm always tired. Some days I can barely get out of bed. Everything feels... hopeless.`,
    "grief-counseling": `Hi, I'm ${patientName}. I lost my mother three months ago, and I'm really struggling. Some days are okay, but others... I can't stop crying. I feel guilty that I'm not "over it" yet. Is this normal?`,
    "relationship-conflict": `Hi, my name is ${patientName}. My partner and I have been fighting constantly. We love each other, but we just can't seem to communicate without it turning into an argument. I'm afraid we might break up if things don't change.`,
    "substance-use": `Hey... I'm ${patientName}. I'm here because my family is concerned about my drinking. I don't think it's that bad - I can stop anytime. But lately I've been needing more drinks to feel the same effect. Is that a problem?`,
  };

  return [
    {
      id: "initial-1",
      content: scenarios[scenarioId] || `Hello, I'm ${patientName}. I'm here to talk about some issues I've been having.`,
      isUserMessage: false,
      sender: patientName,
      timestamp: new Date(),
    },
  ];
}

function generateResponse(userInput: string, scenarioId: string, patientName: string): string {
  // This is a simple response generation system
  // In a real application, this would be connected to a more sophisticated AI model

  const lowercaseInput = userInput.toLowerCase();
  
  // Generic responses based on scenario
  const responses: Record<string, string[]> = {
    "anxiety-disorder": [
      "Yes, I've been experiencing these panic attacks for about 2 months now. They seem to come out of nowhere.",
      "I've tried deep breathing, but it doesn't always help. Sometimes I feel like I'm going to die during these episodes.",
      "My work has definitely been affected. I'm constantly worried about having an attack during an important meeting.",
      "I've never experienced anything like this before. Do you think something is seriously wrong with me?",
    ],
    "depression": [
      "I've been sleeping too much, maybe 12 hours a day, but I still feel exhausted.",
      "I used to love painting and hiking, but now it all seems pointless.",
      "I haven't told many people. I don't want to be a burden.",
      "Sometimes I wonder if things will ever get better. Is this just how life is now?",
    ],
    "grief-counseling": [
      "We were very close. She was my best friend, not just my mother.",
      "I keep expecting to get a call from her. Sometimes I think I hear her voice.",
      "The holidays are coming up and I don't know how I'll handle them without her.",
      "Other people tell me I should be moving on by now. Is there something wrong with me?",
    ],
    "relationship-conflict": [
      "We've been together for three years. Things were great at first.",
      "It feels like we're having the same fight over and over again.",
      "I love them, but I'm not sure if love is enough anymore.",
      "How do I know if we should keep trying or if it's time to let go?",
    ],
    "substance-use": [
      "I don't drink every day. Just on weekends... and sometimes after work if it's been stressful.",
      "My family is overreacting. Everyone drinks sometimes.",
      "I can go days without drinking if I want to. I just don't want to.",
      "I've never had any legal problems because of it. Doesn't that mean it's not that serious?",
    ],
  };

  // Check for specific keywords to give more targeted responses
  if (lowercaseInput.includes("feel") || lowercaseInput.includes("feeling")) {
    if (scenarioId === "anxiety-disorder") {
      return "When these anxiety attacks happen, I feel like I'm not in control of my body. My chest gets tight, I start sweating, and I'm convinced something terrible is about to happen. Is this what anxiety feels like?";
    } else if (scenarioId === "depression") {
      return "Most of the time I feel... nothing. Just empty. And when I do feel something, it's usually sadness or irritation. It's like all the positive emotions have been drained out of me.";
    }
  }

  if (lowercaseInput.includes("help") || lowercaseInput.includes("treatment") || lowercaseInput.includes("better")) {
    return "I'm not sure what will help. I've tried a few things on my own without much success. What kind of treatments or approaches do you think might work for someone in my situation?";
  }

  if (lowercaseInput.includes("family") || lowercaseInput.includes("friend") || lowercaseInput.includes("support")) {
    return "My support system isn't very strong right now. My friends have their own lives, and my family doesn't really understand what I'm going through. I feel pretty alone in dealing with this.";
  }

  // Default to a random response for the scenario
  const scenarioResponses = responses[scenarioId] || [
    "Could you tell me more about that?",
    "I'm not sure I understand. Could you explain?",
    "That's an interesting perspective. I hadn't thought about it that way.",
    "How do you think I should approach this issue?",
  ];

  return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
}

export default ChatInterface;
