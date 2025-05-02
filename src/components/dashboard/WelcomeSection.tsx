
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const WelcomeSection = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png"
  });
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Load profile data from localStorage
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(prev => ({
          ...prev,
          name: parsedProfile.name || '',
          avatar: parsedProfile.avatar || prev.avatar
        }));
      } else if (user) {
        setProfileData(prev => ({
          ...prev,
          name: user.user_metadata?.name || user.email?.split('@')[0] || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }

    // Listen for profile data updates
    const handleProfileUpdate = (event: any) => {
      if (event.detail) {
        setProfileData(prev => ({
          ...prev,
          name: event.detail.name || prev.name,
          avatar: event.detail.avatar || prev.avatar
        }));
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);

  const userName = profileData.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  
  return (
    <Card className="col-span-2 md:col-span-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">
            {greeting}, {userName}!
          </CardTitle>
          <CardDescription className="text-base">
            <CalendarIcon className="inline mr-1 h-4 w-4" />
            Today is {format(new Date(), "EEEE, MMMM do")}
          </CardDescription>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src={profileData.avatar} />
          <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p>You have <strong>5 tasks</strong> planned for today, and <strong>3 focus sessions</strong> scheduled.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
