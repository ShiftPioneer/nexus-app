
import React, { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/ProfileTab";
import AccountTab from "@/components/settings/AccountTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import CalendarTab from "@/components/settings/CalendarTab";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // If user is not authenticated and not loading, redirect to auth page
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6500]"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6 container max-w-4xl mx-auto py-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <ProfileTab user={user} />
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4 mt-4">
            <AccountTab user={user} />
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <NotificationsTab />
          </TabsContent>
          
          {/* Integrations Settings */}
          <TabsContent value="integrations" className="space-y-4 mt-4">
            <CalendarTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
