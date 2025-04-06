
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AccountTab({ user }: { user: any }) {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable Two-Factor</Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Sessions</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Manage your active sessions across devices
            </p>
            <Button variant="outline">Manage Sessions</Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Account Data</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Download or delete your account data
            </p>
            <div className="flex gap-2">
              <Button variant="outline">Download Data</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
