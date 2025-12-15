import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import { Clock, Calendar, Sparkles, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { XPIndicator } from "@/components/ui/xp-indicator";
import { useGamification } from "@/hooks/use-gamification";
import { toastHelpers } from "@/utils/toast-helpers";

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
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();
  const { currentXP, level, levelXP, nextLevelXP, streakDays } = useGamification();

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
    return user?.email?.split('@')[0] || "Champion";
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
    toastHelpers.info("New quote generated!");
  };

  const handleStartDay = () => {
    navigate('/journal');
    toastHelpers.success("Starting your day with journal entry");
  };

  const handleViewPlan = () => {
    navigate('/time-design');
    toastHelpers.info("Viewing today's plan");
  };

  return (
    <section className="mb-8">
      <Card className="overflow-hidden bg-slate-950/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
                    {getGreeting()}
                  </span>
                  , {userName}
                </h1>
                <p className="text-slate-300 text-lg lg:text-xl leading-relaxed">
                  Ready to make today extraordinary? Your life operating system is primed for action.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <UnifiedActionButton 
                  onClick={handleStartDay}
                  icon={Sparkles}
                  variant="primary"
                >
                  Start Your Day
                </UnifiedActionButton>
                <UnifiedActionButton
                  onClick={handleViewPlan}
                  icon={Calendar}
                  variant="secondary"
                >
                  View Today's Plan
                </UnifiedActionButton>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* XP Progress */}
              <XPIndicator
                currentXP={currentXP}
                levelXP={levelXP}
                nextLevelXP={nextLevelXP}
                level={level}
                variant="compact"
              />
              
              {/* Time Display */}
              <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-white">{formattedTime}</span>
                </div>
                <span className="text-slate-400 text-sm">{formattedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900/30 to-slate-800/30 backdrop-blur-sm">
            <blockquote className="text-xl font-medium text-slate-200 italic leading-relaxed">
              "{quote.text}"
            </blockquote>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-slate-400 font-medium">— {quote.author}</span>
              <UnifiedActionButton
                onClick={handleNewQuote}
                icon={RotateCcw}
                variant="secondary"
                className="text-sm px-4 py-2"
              >
                New Quote
              </UnifiedActionButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WelcomeSection;
