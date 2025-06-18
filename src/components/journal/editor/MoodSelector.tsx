import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown } from "lucide-react";
interface MoodSelectorProps {
  mood: string;
  onMoodChange: (mood: string) => void;
}
const MoodSelector: React.FC<MoodSelectorProps> = ({
  mood,
  onMoodChange
}) => {
  return <div>
      <Label className="bg-background-DEFAULT text-orange-600">How are you feeling?</Label>
      <RadioGroup value={mood} onValueChange={onMoodChange} className="flex gap-4 mt-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="positive" id="positive" />
          <Label htmlFor="positive" className="flex items-center gap-1 cursor-pointer  text-green-600">
            <Smile className="h-5 w-5 text-success text-green-600" />
            Positive
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="neutral" id="neutral" />
          <Label htmlFor="neutral" className="flex items-center gap-1 cursor-pointer  text-blue-600">
            <Meh className="h-5 w-5 text-secondary text-blue-600" />
            Neutral
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="negative" id="negative" />
          <Label htmlFor="negative" className="flex items-center gap-1 cursor-pointer text-indigo-600">
            <Frown className="h-5 w-5 text-destructive text-indigo-600" />
            Negative
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mixed" id="mixed" />
          <Label htmlFor="mixed" className="cursor-pointer  text-orange-600">Mixed</Label>
        </div>
      </RadioGroup>
    </div>;
};
export default MoodSelector;