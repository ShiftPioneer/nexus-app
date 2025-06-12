
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Flame, Zap, Brain, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarSettingsProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
}

const presetAvatars = [
  { icon: Check, color: "#10B981", label: "Achiever" },
  { icon: Flame, color: "#F97316", label: "Motivated" },
  { icon: Zap, color: "#8B5CF6", label: "Energetic" },
  { icon: Brain, color: "#3B82F6", label: "Strategic" },
];

const AvatarSettings: React.FC<AvatarSettingsProps> = ({
  currentAvatar,
  onAvatarChange,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("preset");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    
    // Create SVG for the selected preset
    const { icon: Icon, color } = presetAvatars[index];
    const iconString = `<svg width="100" height="100" viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${color}" />
      <foreignObject width="60" height="60" x="20" y="20">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" 
          stroke-linecap="round" stroke-linejoin="round" 
          xmlns="http://www.w3.org/2000/svg">
            ${getIconPath(index)}
          </svg>
        </div>
      </foreignObject>
    </svg>`;
    
    // Convert SVG to data URL
    const svgBlob = new Blob([iconString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    setPreviewUrl(svgUrl);
  };

  const getIconPath = (index: number) => {
    switch (index) {
      case 0: // Check
        return '<polyline points="20 6 9 17 4 12"></polyline>';
      case 1: // Fire
        return '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>';
      case 2: // Zap
        return '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>';
      case 3: // Brain
        return '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>';
      default:
        return '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
      toast({
        description: "URL image preview loaded",
      });
    }
  };

  const handleSaveAvatar = () => {
    if (previewUrl) {
      onAvatarChange(previewUrl);
      toast({
        description: "Avatar updated successfully",
      });
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>Personalize your profile with an avatar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={previewUrl || currentAvatar} />
            <AvatarFallback>
              {presetAvatars[0].label.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="preset">Preset Icons</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preset" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {presetAvatars.map((avatar, index) => {
                const { icon: Icon, color, label } = avatar;
                return (
                  <div
                    key={index}
                    className={`
                      cursor-pointer rounded-lg p-3 text-center
                      ${selectedPreset === index ? 'border-2 border-primary' : 'border border-muted'}
                    `}
                    onClick={() => handlePresetSelect(index)}
                  >
                    <div className="flex justify-center mb-2">
                      <div
                        className="rounded-full p-3"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <span className="text-sm">{label}</span>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Upload an image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to select a file
              </p>
              <Button 
                variant="outline" 
                onClick={handleSelectFile}
              >
                Select File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
                <Button 
                  variant="outline" 
                  onClick={handleUrlSubmit}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Load
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button 
          className="w-full" 
          onClick={handleSaveAvatar}
          disabled={!previewUrl}
        >
          Save Avatar
        </Button>
      </CardContent>
    </Card>
  );
};

export default AvatarSettings;
