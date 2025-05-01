
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const quotes = [{
  text: "The future depends on what you do today.",
  author: "Mahatma Gandhi"
}, {
  text: "It's not about having time, it's about making time.",
  author: "Unknown"
}, {
  text: "The best way to predict the future is to create it.",
  author: "Peter Drucker"
}, {
  text: "Don't count the days, make the days count.",
  author: "Muhammad Ali"
}, {
  text: "You don't have to be great to start, but you have to start to be great.",
  author: "Zig Ziglar"
}];

const WelcomeSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get user's name from profile data or email
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const handleNewQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote.text === quote.text);
    setQuote(newQuote);
    toast({
      description: "New quote generated!"
    });
  };
  
  return (
    <section className="mb-6 space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-2 my-[10px] py-[5px]">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">{getGreeting()}</span>, {userName}
              </h1>
              <p className="text-muted-foreground py-[10px]">
                Ready to make today extraordinary? Your life operating system is primed for action.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="default" className="gap-2">
                  <span>Start Your Day</span>
                </Button>
                <Button variant="outline" className="text-orange-600 bg-deep-DEFAULT">View Today's Plan</Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 bg-card shadow-sm border my-[10px] py-[20px] rounded-xl border-width [5px]">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-2xl font-semibold">{formattedTime}</span>
              </div>
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg border border-accent/20 bg-accent-DEFAULT">
            <blockquote className="italic text-lg">"{quote.text}"</blockquote>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">— {quote.author}</span>
              <Button variant="ghost" size="sm" onClick={handleNewQuote} className="text-primary-dark">
                New Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WelcomeSection;
