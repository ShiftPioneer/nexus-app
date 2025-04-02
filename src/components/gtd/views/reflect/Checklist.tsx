
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface ChecklistItems {
  [key: string]: boolean;
}

interface ChecklistProps {
  title: string;
  icon: ReactNode;
  items: ChecklistItems;
  setItems: (items: ChecklistItems) => void;
  itemLabels: Record<string, string>;
  description?: string;
  showActions?: boolean;
}

const Checklist: React.FC<ChecklistProps> = ({
  title,
  icon,
  items,
  setItems,
  itemLabels,
  description,
  showActions = false,
}) => {
  const handleCheckChange = (key: string) => {
    setItems({ [key]: !items[key] });
  };

  const handleMarkAllComplete = () => {
    const updatedItems: ChecklistItems = {};
    Object.keys(items).forEach(key => {
      updatedItems[key] = true;
    });
    setItems(updatedItems);
  };

  const handleResetAll = () => {
    const updatedItems: ChecklistItems = {};
    Object.keys(items).forEach(key => {
      updatedItems[key] = false;
    });
    setItems(updatedItems);
  };

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200 flex items-center">
          {icon}
          {title}
        </CardTitle>
        {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {Object.entries(items).map(([key, checked]) => (
              <div
                key={key}
                className="flex items-center space-x-2 hover:bg-slate-800 p-2 rounded-md cursor-pointer"
                onClick={() => handleCheckChange(key)}
              >
                <Checkbox id={key} checked={checked} />
                <label
                  htmlFor={key}
                  className="flex-grow cursor-pointer text-sm font-medium text-slate-300"
                >
                  {itemLabels[key]}
                </label>
              </div>
            ))}
          </div>

          {showActions && (
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetAll} 
                className="text-slate-400"
              >
                Reset
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleMarkAllComplete}
                className="bg-[#0FA0CE] hover:bg-[#0D8CB4] text-white"
              >
                Mark All Complete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Checklist;
