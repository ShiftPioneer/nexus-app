
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TimeframeQuestionsProps {
  timeframe: string;
  form: UseFormReturn<any>;
}

const TimeframeQuestions: React.FC<TimeframeQuestionsProps> = ({ timeframe, form }) => {
  // Weekly goal questions
  const weeklyQuestions = [
    {
      field: "weeklyQuestion1",
      label: "What's the ONE thing I must achieve this week?",
      placeholder: "Focus on impact"
    },
    {
      field: "weeklyQuestion2",
      label: "What 3 key actions will move me closer to my monthly goal?",
      placeholder: "Prioritize"
    },
    {
      field: "weeklyQuestion3",
      label: "What's stopping me from executing, and how will I overcome it?",
      placeholder: "Execution blockers"
    },
    {
      field: "weeklyQuestion4",
      label: "What will I do daily to keep momentum?",
      placeholder: "Small, repeatable tasks"
    },
  ];

  // Monthly goal questions
  const monthlyQuestions = [
    {
      field: "monthlyQuestion1",
      label: "What's the #1 result I need this month?",
      placeholder: "Most impactful outcome"
    },
    {
      field: "monthlyQuestion2",
      label: "What must I focus on weekly to make sure I hit this goal?",
      placeholder: "Mini milestones"
    },
    {
      field: "monthlyQuestion3",
      label: "What specific actions should I repeat daily for momentum?",
      placeholder: "Daily habits"
    },
    {
      field: "monthlyQuestion4",
      label: "What's my biggest potential distraction, and how do I eliminate it?",
      placeholder: "Obstacles to overcome"
    },
  ];

  // Quarterly goal questions
  const quarterlyQuestions = [
    {
      field: "quarterlyQuestion1",
      label: "What's the single most important thing to achieve in the next 90 days?",
      placeholder: "Biggest driver"
    },
    {
      field: "quarterlyQuestion2",
      label: "What are the 3 biggest priorities to make it happen?",
      placeholder: "Actionable & measurable"
    },
    {
      field: "quarterlyQuestion3",
      label: "What's holding me back from achieving this, and how do I remove the roadblocks?",
      placeholder: "Identify constraints"
    },
    {
      field: "quarterlyQuestion4",
      label: "How will I measure success at the end of this quarter?",
      placeholder: "Key metrics"
    },
  ];

  // Yearly goal questions
  const yearlyQuestions = [
    {
      field: "yearlyQuestion1",
      label: "What is the most important goal I must achieve this year?",
      placeholder: "Single biggest priority"
    },
    {
      field: "yearlyQuestion2",
      label: "If I ONLY achieved this one thing, would I be satisfied?",
      placeholder: "Make it count"
    },
    {
      field: "yearlyQuestion3",
      label: "What must I master this year to reach my 10-year goal?",
      placeholder: "Skills, habits, systems"
    },
    {
      field: "yearlyQuestion4",
      label: "What's the biggest obstacle I will face, and how will I handle it?",
      placeholder: "Key challenges"
    },
    {
      field: "yearlyQuestion5",
      label: "What are the 3 critical milestones I must hit?",
      placeholder: "Quarterly targets"
    },
  ];

  // Decade goal questions
  const decadeQuestions = [
    {
      field: "decadeQuestion1",
      label: "What must I achieve in 10 years to be on track for my lifetime vision?",
      placeholder: "Be specific"
    },
    {
      field: "decadeQuestion2",
      label: "What level of success will make me say, 'I'm on the right path'?",
      placeholder: "Key indicators of progress"
    },
    {
      field: "decadeQuestion3",
      label: "What's the biggest challenge I will face, and how will I overcome it?",
      placeholder: "Obstacles and solutions"
    },
    {
      field: "decadeQuestion4",
      label: "What are the 3 biggest milestones I must hit to reach this goal?",
      placeholder: "Break it down"
    },
    {
      field: "decadeQuestion5",
      label: "Who can I learn from to shortcut the journey?",
      placeholder: "Mentors, books, courses?"
    },
  ];

  // Lifetime goal questions
  const lifetimeQuestions = [
    {
      field: "lifetimeQuestion1",
      label: "What do I truly want to achieve in my lifetime?",
      placeholder: "Think beyond money—impact, fulfillment, lifestyle"
    },
    {
      field: "lifetimeQuestion2",
      label: "Why does this matter to me?",
      placeholder: "Deep reason, beyond surface motivation"
    },
    {
      field: "lifetimeQuestion3",
      label: "Who do I need to become to make this happen?",
      placeholder: "Skills, mindset, discipline?"
    },
    {
      field: "lifetimeQuestion4",
      label: "What kind of life do I want to live daily?",
      placeholder: "Not just at the peak—every single day"
    },
    {
      field: "lifetimeQuestion5",
      label: "If I died today, what would I regret not doing?",
      placeholder: "Force clarity"
    },
    {
      field: "lifetimeQuestion6",
      label: "What am I willing to sacrifice or endure to achieve this?",
      placeholder: "Nothing great comes easy"
    },
  ];

  // Select questions based on timeframe
  let questions;
  switch (timeframe) {
    case "week":
      questions = weeklyQuestions;
      break;
    case "month":
      questions = monthlyQuestions;
      break;
    case "quarter":
      questions = quarterlyQuestions;
      break;
    case "year":
      questions = yearlyQuestions;
      break;
    case "decade":
      questions = decadeQuestions;
      break;
    case "lifetime":
      questions = lifetimeQuestions;
      break;
    default:
      questions = [];
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">
        {timeframe === "week" && "WEEKLY GOALS: Action & Accountability"}
        {timeframe === "month" && "MONTHLY GOAL: Micro Wins, Big Results"}
        {timeframe === "quarter" && "QUARTERLY GOAL: Sprint Mode"}
        {timeframe === "year" && "1-YEAR GOAL: Focus & Execution"}
        {timeframe === "decade" && "10-YEAR GOAL: The Game Plan"}
        {timeframe === "lifetime" && "LIFETIME GOAL: Defining Your Legacy"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Answer these questions to clarify your goal and increase your chances of success.
      </p>

      {questions.map((question) => (
        <FormField
          key={question.field}
          control={form.control}
          name={question.field}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question.label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={question.placeholder}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default TimeframeQuestions;
