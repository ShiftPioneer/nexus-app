
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, ArrowRight } from "lucide-react";

interface WelcomeSectionProps {
  onStartDay: () => void;
  onViewTodaysPlan: () => void;
}

const WelcomeSection = ({ onStartDay, onViewTodaysPlan }: WelcomeSectionProps) => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set user name
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    } else if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name);
    } else if (user?.email) {
      setName(user.email.split('@')[0]);
    } else {
      setName("there");
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    // Set current date
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));
  }, [user]);

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">{greeting}, {name}</h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="group" 
            onClick={onViewTodaysPlan}
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Today's Plan
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button 
            className="group" 
            onClick={onStartDay}
          >
            Start Your Day
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
