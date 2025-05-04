
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Predefined productivity-themed avatars
const predefinedAvatars = [
  "/lovable-uploads/6bf766fd-bbfc-4672-a544-c599f8ea80fb.png", // Productivity icon 1
  "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png", // Productivity icon 2
  "/lovable-uploads/a004fbed-90d6-44c1-bbf8-96e82ee8c546.png", // Productivity icon 3
  "/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png", // Productivity icon 4
  "https://ui.shadcn.com/avatars/01.png", // Extra avatar 5
];

const AvatarSelector = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem("userAvatar");
    return saved || predefinedAvatars[0];
  });
  const [inputUrl, setInputUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("preset");
  
  const saveAvatar = (url: string) => {
    setAvatarUrl(url);
    localStorage.setItem("userAvatar", url);
    toast({
      title: "Avatar Updated",
      description: "Your profile avatar has been updated successfully."
    });
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      saveAvatar(inputUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          saveAvatar(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPredefined = (url: string) => {
    saveAvatar(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Avatar</CardTitle>
        <CardDescription>Customize your profile picture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt="Profile Avatar" />
              <AvatarFallback>
                {localStorage.getItem("userName")?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Current Avatar</span>
          </div>

          <div className="flex-1 w-full md:max-w-md">
            <Tabs defaultValue="preset" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="preset">Presets</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preset" className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {predefinedAvatars.map((avatar, index) => (
                    <Avatar 
                      key={index} 
                      className={`cursor-pointer h-12 w-12 ${avatarUrl === avatar ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => selectPredefined(avatar)}
                    >
                      <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click on an avatar to select it
                </p>
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="space-y-4">
                  <div>
                    <Input 
                      id="avatar-upload" 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Image File
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="url">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar-url">Image URL</Label>
                    <Input 
                      id="avatar-url" 
                      placeholder="https://example.com/your-avatar.png" 
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={!inputUrl.trim()}>
                    Set Avatar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarSelector;
