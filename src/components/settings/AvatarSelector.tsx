
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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
  
  // Sample avatar options
  const avatarOptions = [
    '/assets/avatars/avatar-1.png',
    '/assets/avatars/avatar-2.png',
    '/assets/avatars/avatar-3.png',
    '/assets/avatars/avatar-4.png',
    '/assets/avatars/avatar-5.png',
    '/assets/avatars/avatar-6.png',
  ];

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    onAvatarChange(avatar);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={selectedAvatar} alt="Selected avatar" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
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
