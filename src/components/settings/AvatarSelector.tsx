
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (avatarUrl: string) => void;
  onApply: () => void;
  isApplied: boolean;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarChange,
  onApply,
  isApplied
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  // Positive and productivity-focused avatars
  const avatarOptions = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=brain&backgroundColor=8338ec',
    'https://api.dicebear.com/7.x/bottts/svg?seed=focus&backgroundColor=118ab2',
    'https://api.dicebear.com/7.x/bottts/svg?seed=energy&backgroundColor=fb5607',
    'https://api.dicebear.com/7.x/bottts/svg?seed=productivity&backgroundColor=ffb703',
    'https://api.dicebear.com/7.x/bottts/svg?seed=growth&backgroundColor=06d6a0',
    'https://api.dicebear.com/7.x/bottts/svg?seed=hope&backgroundColor=ef476f',
    'https://api.dicebear.com/7.x/bottts/svg?seed=intelligence&backgroundColor=43aa8b',
    'https://api.dicebear.com/7.x/identicon/svg?seed=success&backgroundColor=f94144',
    'https://api.dicebear.com/7.x/micah/svg?seed=motivation&backgroundColor=277da1',
    'https://api.dicebear.com/7.x/micah/svg?seed=success&backgroundColor=f8961e',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=productivity&backgroundColor=ffb703',
    'https://api.dicebear.com/7.x/notionists/svg?seed=creativity&backgroundColor=ff006e',
  ];

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    onAvatarChange(avatar);
  };

  const handleCustomAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAvatarUrl(e.target.value);
  };

  const handleCustomAvatarApply = () => {
    if (customAvatarUrl) {
      setSelectedAvatar(customAvatarUrl);
      onAvatarChange(customAvatarUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const avatarUrl = event.target.result.toString();
          setSelectedAvatar(avatarUrl);
          onAvatarChange(avatarUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={selectedAvatar} alt="Selected avatar" />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {avatarOptions.map((avatar, index) => (
          <div 
            key={index}
            className={`relative cursor-pointer border-2 rounded-full ${selectedAvatar === avatar ? 'border-primary' : 'border-transparent hover:border-primary/40'}`}
            onClick={() => handleAvatarSelect(avatar)}
          >
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
              <AvatarFallback>{index + 1}</AvatarFallback>
            </Avatar>
            {selectedAvatar === avatar && (
              <div className="absolute -right-1 -bottom-1 bg-primary text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <Label htmlFor="avatar-upload">Upload your own image</Label>
        <div className="flex gap-2 mt-2">
          <Input 
            id="avatar-upload" 
            type="file" 
            accept="image/*"
            onChange={handleFileUpload}
            className="flex-1"
          />
          <Button variant="outline" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
      </div>
      
      <div className="pt-2 text-center">
        <Button 
          onClick={onApply} 
          disabled={isApplied || !selectedAvatar}
          className={isApplied ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isApplied ? (
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Applied
            </div>
          ) : "Apply Avatar"}
        </Button>
      </div>
    </div>
  );
};

export default AvatarSelector;
