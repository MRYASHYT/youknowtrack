import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { WeekData, Task } from "@/data/weeklyData";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  weekData: WeekData;
  onAddTask: (category: string, task: Task) => void;
  onRemoveTask: (category: string, taskId: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/schedule-assistant`;

export const Chatbot = ({ weekData, onAddTask, onRemoveTask }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your MEXT journey assistant. I can help you add, remove, or adjust tasks based on their importance. How can I help you today? 🇯🇵" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseActions = (response: string) => {
    const lines = response.split('\n');
    const actions: { type: string; data: string[] }[] = [];
    const cleanLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('ADD_TASK|')) {
        const parts = line.split('|');
        if (parts.length >= 3) {
          actions.push({ type: 'ADD_TASK', data: parts.slice(1) });
        }
      } else if (line.startsWith('REMOVE_TASK|')) {
        const parts = line.split('|');
        if (parts.length >= 2) {
          actions.push({ type: 'REMOVE_TASK', data: parts.slice(1) });
        }
      } else {
        cleanLines.push(line);
      }
    }

    return { actions, cleanMessage: cleanLines.join('\n').trim() };
  };

  const executeActions = (actions: { type: string; data: string[] }[]) => {
    for (const action of actions) {
      if (action.type === 'ADD_TASK') {
        const [category, taskText, schedule, priority] = action.data;
        const taskId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newTask: Task = {
          id: taskId,
          text: taskText,
          schedule: schedule || undefined,
        };
        onAddTask(category.toLowerCase(), newTask);
        toast.success(`Added task to ${category}: ${taskText}`);
      } else if (action.type === 'REMOVE_TASK') {
        const [taskIdentifier] = action.data;
        // Find and remove task containing the identifier
        const categories = ['japanese', 'aiml', 'college', 'goals'] as const;
        for (const cat of categories) {
          const tasks = weekData[cat];
          const taskToRemove = tasks.find(t => 
            t.id.toLowerCase().includes(taskIdentifier.toLowerCase()) ||
            t.text.toLowerCase().includes(taskIdentifier.toLowerCase())
          );
          if (taskToRemove) {
            onRemoveTask(cat, taskToRemove.id);
            toast.success(`Removed task: ${taskToRemove.text}`);
            break;
          }
        }
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          currentWeekData: weekData,
        }),
      });

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast.error("AI credits exhausted. Please add credits to continue.");
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to assistant");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add placeholder for assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: "assistant", content: assistantContent };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Parse and execute any actions
      const { actions, cleanMessage } = parseActions(assistantContent);
      if (actions.length > 0) {
        executeActions(actions);
        // Update message to clean version
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: "assistant", content: cleanMessage };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-primary-foreground ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">MEXT Assistant</h3>
                <p className="text-xs text-muted-foreground">Schedule & Study Helper</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-accent/20' 
                      : 'bg-gradient-to-br from-primary to-accent'
                  }`}>
                    {msg.role === 'user' 
                      ? <User className="w-4 h-4 text-accent" />
                      : <Bot className="w-4 h-4 text-primary-foreground" />
                    }
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-accent text-accent-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Try: "Add more kanji practice" or "Prioritize JLPT prep"
            </p>
          </div>
        </div>
      )}
    </>
  );
};
