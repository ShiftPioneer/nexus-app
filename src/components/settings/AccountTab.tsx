
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { User } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface AccountTabProps {
  user: User | null;
}

const AccountTab: React.FC<AccountTabProps> = ({ user }) => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [appearance, setAppearance] = useState("system");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChangePassword = () => {
    toast({
      title: "Password Reset Email Sent",
      description: "Check your inbox for instructions to reset your password",
      duration: 3000,
    });
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    
    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been received",
      duration: 3000,
    });
    
    // In a real implementation, you would call the appropriate API here
    setTimeout(() => {
      signOut().catch(console.error);
    }, 2000);
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your data will be emailed to you shortly",
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
                title={showPassword ? "Hide password" : "Show password"}
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
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExportData}>Export Data</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountTab;
