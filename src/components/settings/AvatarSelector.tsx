
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
  
  // Sample avatar options with absolute URLs
  const avatarOptions = [
    'https://ui-avatars.com/api/?name=Avatar+1&background=0D8ABC&color=fff',
    'https://ui-avatars.com/api/?name=Avatar+2&background=FFB900&color=fff',
    'https://ui-avatars.com/api/?name=Avatar+3&background=00B4FF&color=fff',
    'https://ui-avatars.com/api/?name=Avatar+4&background=107C10&color=fff',
    'https://ui-avatars.com/api/?name=Avatar+5&background=EB144C&color=fff',
    'https://ui-avatars.com/api/?name=Avatar+6&background=7552CC&color=fff',
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
          <AvatarFallback>AV</AvatarFallback>
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
