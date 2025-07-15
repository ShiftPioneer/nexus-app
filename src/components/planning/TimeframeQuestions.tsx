
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Target, Zap, Trophy, Crown, Star } from "lucide-react";

interface TimeframeQuestionsProps {
  timeframe: 'week' | 'month' | 'quarter' | 'year' | 'decade' | 'lifetime';
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
}

const TimeframeQuestions: React.FC<TimeframeQuestionsProps> = ({
  timeframe,
  answers,
  onAnswersChange
}) => {
  const handleAnswerChange = (questionKey: string, value: string) => {
    onAnswersChange({
      ...answers,
      [questionKey]: value
    });
  };

  const getTimeframeConfig = () => {
    switch (timeframe) {
      case 'week':
        return {
          title: "WEEKLY GOALS: Action & Accountability",
          icon: Calendar,
          gradient: "from-blue-500 via-indigo-500 to-purple-500",
          questions: [
            { key: 'oneThingAchieve', label: "What's the ONE thing I must achieve this week?" },
            { key: 'keyActions', label: "What 3 key actions will move me closer to my monthly goal?" },
            { key: 'executionBlockers', label: "What's stopping me from executing, and how will I overcome it?" },
            { key: 'dailyMomentum', label: "What will I do daily to keep momentum?" }
          ]
        };
      case 'month':
        return {
          title: "MONTHLY GOAL: Micro Wins, Big Results",
          icon: Target,
          gradient: "from-emerald-500 via-teal-500 to-cyan-500",
          questions: [
            { key: 'numberOneResult', label: "What's the #1 result I need this month?" },
            { key: 'weeklyFocus', label: "What must I focus on weekly to make sure I hit this goal?" },
            { key: 'dailyActions', label: "What specific actions should I repeat daily for momentum?" },
            { key: 'potentialDistraction', label: "What's my biggest potential distraction, and how do I eliminate it?" }
          ]
        };
      case 'quarter':
        return {
          title: "QUARTERLY GOAL: Sprint Mode",
          icon: Zap,
          gradient: "from-orange-500 via-red-500 to-pink-500",
          questions: [
            { key: 'mostImportant90Days', label: "What's the single most important thing to achieve in the next 90 days?" },
            { key: 'biggestPriorities', label: "What are the 3 biggest priorities to make it happen?" },
            { key: 'roadblocks', label: "What's holding me back from achieving this, and how do I remove the roadblocks?" },
            { key: 'measureSuccess', label: "How will I measure success at the end of this quarter?" }
          ]
        };
      case 'year':
        return {
          title: "1-YEAR GOAL: Focus & Execution",
          icon: Trophy,
          gradient: "from-yellow-500 via-orange-500 to-red-500",
          questions: [
            { key: 'mostImportantGoal', label: "What is the most important goal I must achieve this year?" },
            { key: 'onlyOneThingSatisfied', label: "If I ONLY achieved this one thing, would I be satisfied?" },
            { key: 'masterForTenYear', label: "What must I master this year to reach my 10-year goal?" },
            { key: 'biggestObstacle', label: "What's the biggest obstacle I will face, and how will I handle it?" },
            { key: 'criticalMilestones', label: "What are the 3 critical milestones I must hit?" }
          ]
        };
      case 'decade':
        return {
          title: "10-YEAR GOAL: The Game Plan",
          icon: Crown,
          gradient: "from-purple-500 via-pink-500 to-rose-500",
          questions: [
            { key: 'achieveInTenYears', label: "What must I achieve in 10 years to be on track for my lifetime vision?" },
            { key: 'successIndicators', label: "What level of success will make me say, 'I'm on the right path'?" },
            { key: 'biggestChallenge', label: "What's the biggest challenge I will face, and how will I overcome it?" },
            { key: 'biggestMilestones', label: "What are the 3 biggest milestones I must hit to reach this goal?" },
            { key: 'learnFromShortcut', label: "Who can I learn from to shortcut the journey?" }
          ]
        };
      case 'lifetime':
        return {
          title: "LIFETIME GOAL: Defining Your Legacy",
          icon: Star,
          gradient: "from-indigo-500 via-purple-500 to-pink-500",
          questions: [
            { key: 'trulyWantAchieve', label: "What do I truly want to achieve in my lifetime?" },
            { key: 'whyMatters', label: "Why does this matter to me?" },
            { key: 'whoToBecome', label: "Who do I need to become to make this happen?" },
            { key: 'lifeToLive', label: "What kind of life do I want to live daily?" },
            { key: 'regretNotDoing', label: "If I died today, what would I regret not doing?" },
            { key: 'sacrificeOrEndure', label: "What am I willing to sacrifice or endure to achieve this?" }
          ]
        };
      default:
        return null;
    }
  };

  const config = getTimeframeConfig();
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-white">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg flex items-center justify-center`}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          {config.title}
        </CardTitle>
        <p className="text-slate-400 text-sm mt-2">
          Answer these questions to clarify your goal and increase your chances of success.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {config.questions.map((question, index) => (
          <div key={question.key} className="space-y-3">
            <Label className="text-white font-medium text-base">
              {question.label}
            </Label>
            <Textarea
              value={answers[question.key] || ''}
              onChange={(e) => handleAnswerChange(question.key, e.target.value)}
              placeholder={`Enter your response...`}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20 min-h-[100px] resize-none"
              rows={3}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TimeframeQuestions;
