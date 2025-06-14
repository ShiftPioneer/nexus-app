
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown } from "lucide-react";

interface MoodSelectorProps {
  mood: string;
  onMoodChange: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ mood, onMoodChange }) => {
  return (
    <div>
      <Label>How are you feeling?</Label>
      <RadioGroup
        value={mood}
        onValueChange={onMoodChange}
        className="flex gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="positive" id="positive" />
          <Label htmlFor="positive" className="flex items-center gap-1 cursor-pointer">
            <Smile className="h-5 w-5 text-success" />
            Positive
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="neutral" id="neutral" />
          <Label htmlFor="neutral" className="flex items-center gap-1 cursor-pointer">
            <Meh className="h-5 w-5 text-secondary" />
            Neutral
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="negative" id="negative" />
          <Label htmlFor="negative" className="flex items-center gap-1 cursor-pointer">
            <Frown className="h-5 w-5 text-destructive" />
            Negative
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mixed" id="mixed" />
          <Label htmlFor="mixed" className="cursor-pointer">Mixed</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default MoodSelector;
