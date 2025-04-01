
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FocusTechniqueProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonAction: () => void;
}

const FocusTechnique: React.FC<FocusTechniqueProps> = ({
  title,
  description,
  icon,
  buttonText,
  buttonAction
}) => (
  <Card className="bg-blue-600 text-white mb-2">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {icon}
      </div>
      <p className="text-sm text-blue-100 mb-4">{description}</p>
      <Button 
        variant="secondary" 
        size="sm"
        onClick={buttonAction}
        className="bg-white text-blue-600 hover:bg-blue-50"
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

export default FocusTechnique;
