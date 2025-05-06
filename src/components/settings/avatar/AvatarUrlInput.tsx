
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface AvatarUrlInputProps {
  avatarUrlInput: string;
  setAvatarUrlInput: (url: string) => void;
  handleAvatarUrlSubmit: () => void;
}

const AvatarUrlInput: React.FC<AvatarUrlInputProps> = ({
  avatarUrlInput,
  setAvatarUrlInput,
  handleAvatarUrlSubmit,
}) => {
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        placeholder="Enter image URL"
        className="flex-1 px-3 py-1 border rounded-md text-sm"
        value={avatarUrlInput}
        onChange={(e) => setAvatarUrlInput(e.target.value)}
      />
      <Button type="button" size="sm" onClick={handleAvatarUrlSubmit}>
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AvatarUrlInput;
