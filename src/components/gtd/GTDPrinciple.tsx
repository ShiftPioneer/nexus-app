import React from "react";
import { useGTD } from "./GTDContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
const GTDPrinciple: React.FC = () => {
  const {
    activeView
  } = useGTD();
  const principles = {
    capture: {
      title: "1. Capture",
      description: "Collect everything that has your attention in a trusted system outside your mind."
    },
    clarify: {
      title: "2. Clarify",
      description: "Process what it means. Is it actionable? What's the next action?"
    },
    organize: {
      title: "3. Organize",
      description: "Put it where it belongs. Categorize and prioritize."
    },
    reflect: {
      title: "4. Reflect",
      description: "Review regularly. Keep your system updated and trustworthy."
    },
    engage: {
      title: "5. Engage",
      description: "Simply do. Choose the right action at the right time."
    }
  };
  return <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle>GTD Principles</CardTitle>
        <CardDescription className="text-slate-400">Effective task management workflow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(principles).map(([key, {
        title,
        description
      }]) => <div key={key} className="px-[10px] bg-secondary-light my-[30px] py-[20px] rounded-xl">
            <h4 className="font-semibold mb-1 text-slate-50">{title}</h4>
            <p className="text-gray-300">
              {description}
            </p>
          </div>)}
      </CardContent>
    </Card>;
};
export default GTDPrinciple;