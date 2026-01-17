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
    <section className="mb-6 sm:mb-8">
      <Card className="overflow-hidden glass-futuristic shadow-2xl relative group">
        {/* Ambient glow effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
        </div>
        
        <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start lg:items-center">
            <div className="flex-1 space-y-4 sm:space-y-6 min-w-0 w-full">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent text-glow">
                    {getGreeting()}
                  </span>
                  <span className="block sm:inline">, {userName}</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  Ready to make today extraordinary? Your life operating system is primed for action.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                <UnifiedActionButton 
                  onClick={handleStartDay}
                  icon={Sparkles}
                  variant="primary"
                  className="text-sm sm:text-base flex-1 sm:flex-none min-w-[140px] press-effect"
                >
                  Start Your Day
                </UnifiedActionButton>
                <UnifiedActionButton
                  onClick={handleViewPlan}
                  icon={Calendar}
                  variant="secondary"
                  className="text-sm sm:text-base flex-1 sm:flex-none min-w-[140px] press-effect"
                >
                  View Today's Plan
                </UnifiedActionButton>
              </div>
            </div>
            
            <div className="flex flex-row lg:flex-col gap-3 sm:gap-4 w-full lg:w-auto">
              {/* XP Progress */}
              <div className="flex-1 lg:flex-none">
                <XPIndicator
                  currentXP={currentXP}
                  levelXP={levelXP}
                  nextLevelXP={nextLevelXP}
                  level={level}
                  variant="compact"
                />
              </div>
              
              {/* Time Display */}
              <div className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 card-glass-depth rounded-xl flex-1 lg:flex-none border-glow">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse-glow" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">{formattedTime}</span>
                </div>
                <span className="text-slate-400 text-xs sm:text-sm text-center">{formattedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-slate-700/30 bg-gradient-to-r from-slate-900/40 to-slate-800/20 backdrop-blur-md glow-ambient">
            <blockquote className="text-base sm:text-lg md:text-xl font-medium text-slate-200 italic leading-relaxed">
              "{quote.text}"
            </blockquote>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-slate-400 font-medium text-sm sm:text-base">— {quote.author}</span>
              <UnifiedActionButton
                onClick={handleNewQuote}
                icon={RotateCcw}
                variant="secondary"
                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto press-effect"
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
