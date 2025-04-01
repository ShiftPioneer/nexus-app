
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ChecklistProps {
  title: string;
  icon: React.ReactNode;
  items: Record<string, boolean>;
  setItems: (items: Record<string, boolean>) => void;
  itemLabels: Record<string, string>;
  showActions?: boolean;
  description?: string;
}

const Checklist: React.FC<ChecklistProps> = ({
  title,
  icon,
  items,
  setItems,
  itemLabels,
  showActions = false,
  description,
}) => {
  const handleCheck = (item: string) => {
    setItems({
      ...items,
      [item]: !items[item]
    });
  };

  const handleCompleteAll = () => {
    const allChecked = Object.fromEntries(
      Object.keys(items).map(key => [key, true])
    );
    setItems(allChecked as Record<string, boolean>);
  };

  const handleReset = () => {
    const allUnchecked = Object.fromEntries(
      Object.keys(items).map(key => [key, false])
    );
    setItems(allUnchecked as Record<string, boolean>);
  };

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {icon}
          {title}
        </CardTitle>
        {description && (
          <p className="text-slate-400 mb-4">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(items).map(([key, checked]) => (
          <div key={key} className="flex items-start space-x-2">
            <Checkbox 
              id={key} 
              checked={checked} 
              onCheckedChange={() => handleCheck(key)}
              className="mt-1 border-orange-500 text-orange-500"
            />
            <label 
              htmlFor={key} 
              className={`text-sm ${checked ? "line-through text-slate-500" : "text-slate-300"}`}
            >
              {itemLabels[key]}
            </label>
          </div>
        ))}
        
        {showActions && (
          <div className="pt-4 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              onClick={handleCompleteAll}
              className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
              size="sm"
            >
              Complete All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Checklist;
