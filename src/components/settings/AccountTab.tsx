
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { User } from "@/contexts/AuthContext";

interface AccountTabProps {
  user: User | null;
}

const AccountTab: React.FC<AccountTabProps> = ({ user }) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [appearance, setAppearance] = useState("system");

  const handleChangePassword = () => {
    toast({
      title: "Password Reset Email Sent",
      description: "Check your inbox for instructions to reset your password",
      duration: 3000,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="flex">
              <Input 
                id="current-password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={appearance === "light" ? "default" : "outline"}
              onClick={() => setAppearance("light")}
            >
              Light
            </Button>
            <Button 
              variant={appearance === "dark" ? "default" : "outline"}
              onClick={() => setAppearance("dark")}
            >
              Dark
            </Button>
            <Button 
              variant={appearance === "system" ? "default" : "outline"}
              onClick={() => setAppearance("system")}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-2">Export your data or delete your account</p>
            <div className="flex gap-2">
              <Button variant="outline">Export Data</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountTab;
