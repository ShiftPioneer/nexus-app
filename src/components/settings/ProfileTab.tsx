
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const userDisplayName = user?.displayName || "";
  const userEmail = user?.email || "";
  const userPhotoURL = user?.photoURL || "";

  const [userName, setUserName] = useState(userDisplayName);
  const [email, setEmail] = useState(userEmail);
  const [interests, setInterests] = useState<string[]>(["productivity", "self-improvement"]);
  const [bio, setBio] = useState("Hi there! I'm using Nexus to improve my productivity and reach my goals.");
  const [selectedAvatar, setSelectedAvatar] = useState(userPhotoURL || "");
  const [isAvatarApplied, setIsAvatarApplied] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use effect to update form values when user changes
  useEffect(() => {
    if (user) {
      setUserName(user.displayName || "");
      setEmail(user.email || "");
      setSelectedAvatar(user.photoURL || "");
      setIsAvatarApplied(false);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      // In a real app, this would save to a database and update auth profile
      await updateUserProfile({ 
        displayName: userName,
        photoURL: selectedAvatar
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setIsAvatarApplied(false); // Reset when a new avatar is selected
  };

  const handleApplyAvatar = () => {
    // In a real implementation, you might want to save this to the user profile
    setIsAvatarApplied(true);
    toast({
      title: "Avatar Applied",
      description: "Your avatar has been updated",
      duration: 3000,
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your new password and confirmation match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to update the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
              className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarSelector 
            currentAvatar={selectedAvatar} 
            onAvatarChange={handleAvatarChange} 
            onApply={handleApplyAvatar}
            isApplied={isAvatarApplied}
          />
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to maintain account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileTab;
