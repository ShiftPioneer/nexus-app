
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";

interface EmptyGoalsViewProps {
  onCreateGoal: () => void;
}

const EmptyGoalsView: React.FC<EmptyGoalsViewProps> = ({ onCreateGoal }) => {
  return (
    <Card className="border-slate-700/50 bg-slate-900/40 backdrop-blur-sm">
      <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 mb-6">
          <Target className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-4">No goals yet</h3>
        <p className="text-slate-400 text-center max-w-md mb-8 text-lg">
          Start your journey by creating your first goal. Set clear objectives and track your progress toward success.
        </p>
        <UnifiedActionButton
          onClick={onCreateGoal}
          icon={Target}
          variant="primary"
        >
          Create Your First Goal
        </UnifiedActionButton>
      </CardContent>
    </Card>
  );
};

export default EmptyGoalsView;
