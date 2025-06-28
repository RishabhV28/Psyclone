
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUserMessage: boolean;
  sender: string;
  timestamp: Date;
}

const ChatMessage = ({ content, isUserMessage, sender, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUserMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] md:max-w-[70%]",
          isUserMessage ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className={cn(
          "h-8 w-8 border-2",
          isUserMessage ? "ml-2 border-psycho-200" : "mr-2 border-psycho-300"
        )}>
          <div className="bg-muted rounded-full h-full w-full flex items-center justify-center text-xs font-semibold">
            {isUserMessage ? "You" : sender.charAt(0).toUpperCase()}
          </div>
        </Avatar>
        <div className="flex flex-col">
          <div
            className={cn(
              "rounded-lg px-4 py-2 mb-1",
              isUserMessage
                ? "bg-psycho-500 text-white rounded-tr-none"
                : "bg-secondary text-secondary-foreground rounded-tl-none"
            )}
          >
            {content}
          </div>
          <div
            className={cn(
              "text-xs text-muted-foreground",
              isUserMessage ? "text-right" : "text-left"
            )}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
