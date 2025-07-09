
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeframeQuestion {
  id: string;
  question: string;
  placeholder: string;
}

interface TimeframeQuestionsProps {
  timeframe: string;
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
}

const timeframeQuestions: Record<string, TimeframeQuestion[]> = {
  week: [
    {
      id: "weekly-focus",
      question: "What's the ONE thing I must achieve this week?",
      placeholder: "Focus on impact"
    },
    {
      id: "weekly-actions", 
      question: "What 3 key actions will move me closer to my monthly goal?",
      placeholder: "Prioritize"
    },
    {
      id: "weekly-blockers",
      question: "What's stopping me from executing, and how will I overcome it?",
      placeholder: "Execution blockers"
    },
    {
      id: "weekly-momentum",
      question: "What will I do daily to keep momentum?",
      placeholder: "Small, repeatable tasks"
    }
  ],
  month: [
    {
      id: "monthly-result",
      question: "What's the #1 result I need this month?",
      placeholder: "Most impactful outcome"
    },
    {
      id: "monthly-focus",
      question: "What must I focus on weekly to make sure I hit this goal?",
      placeholder: "Mini milestones"
    },
    {
      id: "monthly-actions",
      question: "What specific actions should I repeat daily for momentum?",
      placeholder: "Daily habits"
    },
    {
      id: "monthly-distraction",
      question: "What's my biggest potential distraction, and how do I eliminate it?",
      placeholder: "Obstacles to overcome"
    }
  ],
  quarter: [
    {
      id: "quarterly-achievement",
      question: "What's the single most important thing to achieve in the next 90 days?",
      placeholder: "Biggest driver"
    },
    {
      id: "quarterly-priorities",
      question: "What are the 3 biggest priorities to make it happen?",
      placeholder: "Actionable & measurable"
    },
    {
      id: "quarterly-roadblocks",
      question: "What's holding me back from achieving this, and how do I remove the roadblocks?",
      placeholder: "Identify constraints"
    },
    {
      id: "quarterly-success",
      question: "How will I measure success at the end of this quarter?",
      placeholder: "Key metrics"
    }
  ],
  year: [
    {
      id: "yearly-goal",
      question: "What is the most important goal I must achieve this year?",
      placeholder: "Single biggest priority"
    },
    {
      id: "yearly-satisfaction",
      question: "If I ONLY achieved this one thing, would I be satisfied?",
      placeholder: "Make it count"
    },
    {
      id: "yearly-mastery",
      question: "What must I master this year to reach my 10-year goal?",
      placeholder: "Skills, habits, systems"
    },
    {
      id: "yearly-obstacle",
      question: "What's the biggest obstacle I will face, and how will I handle it?",
      placeholder: "Key challenges"
    },
    {
      id: "yearly-milestones",
      question: "What are the 3 critical milestones I must hit?",
      placeholder: "Quarterly targets"
    }
  ],
  decade: [
    {
      id: "decade-achievement",
      question: "What must I achieve in 10 years to be on track for my lifetime vision?",
      placeholder: "Be specific"
    },
    {
      id: "decade-success",
      question: "What level of success will make me say, 'I'm on the right path'?",
      placeholder: "Key indicators of progress"
    },
    {
      id: "decade-challenge",
      question: "What's the biggest challenge I will face, and how will I overcome it?",
      placeholder: "Obstacles and solutions"
    },
    {
      id: "decade-milestones",
      question: "What are the 3 biggest milestones I must hit to reach this goal?",
      placeholder: "Break it down"
    },
    {
      id: "decade-learning",
      question: "Who can I learn from to shortcut the journey?",
      placeholder: "Mentors, books, courses?"
    }
  ],
  lifetime: [
    {
      id: "lifetime-achievement",
      question: "What do I truly want to achieve in my lifetime?",
      placeholder: "Think beyond money—impact, fulfillment, lifestyle"
    },
    {
      id: "lifetime-matter",
      question: "Why does this matter to me?",
      placeholder: "Deep reason, beyond surface motivation"
    },
    {
      id: "lifetime-become",
      question: "Who do I need to become to make this happen?",
      placeholder: "Skills, mindset, discipline?"
    },
    {
      id: "lifetime-daily",
      question: "What kind of life do I want to live daily?",
      placeholder: "Not just at the peak—every single day"
    },
    {
      id: "lifetime-regret",
      question: "If I died today, what would I regret not doing?",
      placeholder: "Force clarity"
    },
    {
      id: "lifetime-sacrifice",
      question: "What am I willing to sacrifice or endure to achieve this?",
      placeholder: "Nothing great comes easy"
    }
  ]
};

const TimeframeQuestions: React.FC<TimeframeQuestionsProps> = ({ 
  timeframe, 
  answers, 
  onAnswersChange 
}) => {
  const questions = timeframeQuestions[timeframe] || [];
  
  if (questions.length === 0) return null;

  const handleAnswerChange = (questionId: string, answer: string) => {
    const updatedAnswers = { ...answers, [questionId]: answer };
    onAnswersChange(updatedAnswers);
  };

  const getTimeframeTitle = (timeframe: string) => {
    switch (timeframe) {
      case 'week': return 'WEEKLY GOALS: Action & Accountability';
      case 'month': return 'MONTHLY GOAL: Micro Wins, Big Results';
      case 'quarter': return 'QUARTERLY GOAL: Sprint Mode';
      case 'year': return '1-YEAR GOAL: Focus & Execution';
      case 'decade': return '10-YEAR GOAL: The Game Plan';
      case 'lifetime': return 'LIFETIME GOAL: Defining Your Legacy';
      default: return 'Goal Questions';
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'week': return '📅';
      case 'month': return '🗓️';
      case 'quarter': return '⚡';
      case 'year': return '🎯';
      case 'decade': return '🏆';
      case 'lifetime': return '👑';
      default: return '📋';
    }
  };

  const getTimeframeGradient = (timeframe: string) => {
    switch (timeframe) {
      case 'week': return 'from-red-500/10 to-orange-500/10';
      case 'month': return 'from-orange-500/10 to-yellow-500/10';
      case 'quarter': return 'from-blue-500/10 to-cyan-500/10';
      case 'year': return 'from-purple-500/10 to-pink-500/10';
      case 'decade': return 'from-indigo-500/10 to-purple-500/10';
      case 'lifetime': return 'from-pink-500/10 to-rose-500/10';
      default: return 'from-slate-500/10 to-slate-600/10';
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getTimeframeGradient(timeframe)} border-slate-700/50 backdrop-blur-sm`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-3">
          <span className="text-2xl">{getTimeframeIcon(timeframe)}</span>
          {getTimeframeTitle(timeframe)}
        </CardTitle>
        <p className="text-slate-400 text-sm mt-2">
          Answer these questions to clarify your goal and increase your chances of success.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {questions.map((question) => {
          const currentAnswer = answers[question.id] || '';
          
          return (
            <div key={question.id} className="space-y-3">
              <Label className="text-white font-medium text-base leading-relaxed block">
                {question.question}
              </Label>
              <Textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                className="min-h-[100px] bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 resize-none focus:border-primary/50 transition-colors"
                rows={3}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TimeframeQuestions;
