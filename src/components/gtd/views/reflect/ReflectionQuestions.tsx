import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
interface ReflectionQuestionsProps {
  questions: string[];
}
const ReflectionQuestions: React.FC<ReflectionQuestionsProps> = ({
  questions
}) => {
  return <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="pb-2 rounded-lg bg-slate-950">
        <CardTitle className="flex items-center  text-orange-600">
          <HelpCircle className="mr-2 h-5 w-5" />
          Reflection Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="rounded-lg bg-slate-950">
        <ul className="space-y-4">
          {questions.map((question, index) => <li key={index} className="text-slate-300">
              {question}
            </li>)}
        </ul>
      </CardContent>
    </Card>;
};
export default ReflectionQuestions;