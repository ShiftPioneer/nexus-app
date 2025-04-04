
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/ui/tag-input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AvatarSelector from "@/components/settings/AvatarSelector";
import { User } from "@/contexts/AuthContext";

interface ProfileTabProps {
  user: User | null;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  const { updateUserProfile } = useAuth();
  const { toast } = useToast();

  // Use safe access to user properties
  const userDisplayName = user?.displayName || "User";
  const userEmail = user?.email || "";
  const userPhotoURL = user?.photoURL || undefined;

  const [userName, setUserName] = useState(userDisplayName);
  const [email, setEmail] = useState(userEmail);
  const [interests, setInterests] = useState<string[]>(["productivity", "self-improvement"]);
  const [bio, setBio] = useState("Hi there! I'm using Nexus to improve my productivity and reach my goals.");
  const [selectedAvatar, setSelectedAvatar] = useState(userPhotoURL || "");

  // Use effect to update form values when user changes
  useEffect(() => {
    setUserName(user?.displayName || "User");
    setEmail(user?.email || "");
    setSelectedAvatar(user?.photoURL || "");
  }, [user]);

  const handleSaveProfile = () => {
    // In a real app, this would save to a database and update auth profile
    updateUserProfile({ 
      displayName: userName,
      photoURL: selectedAvatar
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
      duration: 3000,
    });
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
              />
            </div>
            <div className="md:w-2/3">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio" 
              className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="interests" className="mb-1 block">Interests</Label>
            <TagInput
              id="interests"
              placeholder="Add interests..."
              value={interests}
              onChange={setInterests}
            />
            <p className="text-xs text-muted-foreground mt-1">
              These will help personalize your experience
            </p>
          </div>
          
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarSelector 
            currentAvatar={selectedAvatar} 
            onAvatarChange={handleAvatarChange} 
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileTab;
