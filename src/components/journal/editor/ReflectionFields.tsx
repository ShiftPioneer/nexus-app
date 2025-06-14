
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReflectionFieldsProps {
  reflections: {
    intentions: string;
    morningAffirmations: string;
    gratitude: string;
    makeTodayGreat: string;
    highlight: string;
    nightAffirmations: string;
    todayEvaluation: string;
    improvement: string;
    freeThoughts: string;
  };
  onReflectionChange: (field: string, value: string) => void;
}

const ReflectionFields: React.FC<ReflectionFieldsProps> = ({ reflections, onReflectionChange }) => {
  const fields = [
    { key: "intentions", label: "Today's intentions", placeholder: "What do you intend to focus on today?" },
    { key: "morningAffirmations", label: "3 Morning Affirmations", placeholder: "Write three positive affirmations for your morning" },
    { key: "gratitude", label: "3 Things I'm Grateful For", placeholder: "What are you grateful for today?" },
    { key: "makeTodayGreat", label: "What Would make Today Great", placeholder: "What actions or events would make today great?" },
    { key: "highlight", label: "Highlight of The Day", placeholder: "What was the best moment of your day?" },
    { key: "nightAffirmations", label: "3 Night Affirmations", placeholder: "Write three positive affirmations for your evening" },
    { key: "todayEvaluation", label: "What Made Today Great/Bad", placeholder: "Reflect on what went well and what didn't" },
    { key: "improvement", label: "What Can Be Improved/Fixed", placeholder: "What can you improve tomorrow?" },
    { key: "freeThoughts", label: "Feel Free", placeholder: "Express any additional thoughts or feelings", rows: 5 }
  ];

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Textarea
            id={field.key}
            placeholder={field.placeholder}
            value={reflections[field.key as keyof typeof reflections]}
            onChange={(e) => onReflectionChange(field.key, e.target.value)}
            className="mt-1 resize-none"
            rows={field.rows || 3}
          />
        </div>
      ))}
    </div>
  );
};

export default ReflectionFields;
