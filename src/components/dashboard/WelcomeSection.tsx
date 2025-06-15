import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";
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
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setProfileData(profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfileData();
    const handleProfileUpdate = (e: any) => {
      setProfileData(e.detail);
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);
  const getUserName = () => {
    if (profileData?.name) {
      return profileData.name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split('@')[0] || "User";
  };
  const userName = getUserName();
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
  const handleStartDay = () => {
    navigate('/journal');
    toast({
      description: "Starting your day with journal entry"
    });
  };
  const handleViewPlan = () => {
    navigate('/timedesign');
    toast({
      description: "Viewing today's plan in time design"
    });
  };
  return <section className="mb-6 space-y-4">
      <Card className="overflow-hidden bg-slate-950 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-2 my-[10px] py-[5px]">
              <h1 className="text-3xl font-bold text-white">
                <span className="text-primary">{getGreeting()}</span>, {userName}
              </h1>
              <p className="text-slate-300 py-[10px]">
                Ready to make today extraordinary? Your life operating system is primed for action.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="default" className="gap-2" onClick={handleStartDay}>
                  <span>Start Your Day</span>
                </Button>
                <Button variant="outline" onClick={handleViewPlan} className="border-slate-600 hover:bg-slate-800 text-orange-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Today's Plan
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-900 border border-slate-700 my-[10px] py-[20px] rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-2xl font-semibold text-white">{formattedTime}</span>
              </div>
              <span className="text-sm text-slate-400">{formattedDate}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg border border-slate-700 bg-slate-900">
            <blockquote className="italic text-lg text-slate-200">"{quote.text}"</blockquote>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-slate-400">— {quote.author}</span>
              <Button variant="ghost" size="sm" onClick={handleNewQuote} className="text-orange-600">
                New Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>;
};
export default WelcomeSection;