
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, RefreshCw, Send } from "lucide-react";
import { motion } from "framer-motion";

interface PromptSectionProps {
  currentPrompt: string;
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  onGeneratePrompt: () => void;
  onUsePrompt: () => void;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  currentPrompt,
  currentCategory,
  onCategoryChange,
  onGeneratePrompt,
  onUsePrompt
}) => {
  const categories = [
    { key: 'mindfulness', label: 'Mindfulness', color: 'text-emerald-400' },
    { key: 'creativity', label: 'Creative', color: 'text-purple-400' },
    { key: 'growth', label: 'Growth', color: 'text-blue-400' },
    { key: 'vision', label: 'Vision', color: 'text-orange-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Creative Writing Prompts
              </CardTitle>
              <p className="text-sm text-slate-400">Spark deeper reflection and creativity</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={currentCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.key)}
                className={`transition-all duration-200 ${
                  currentCategory === category.key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6 rounded-xl border border-slate-600/30">
              <p className="text-slate-200 leading-relaxed italic font-medium text-lg">
                "{currentPrompt}"
              </p>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onGeneratePrompt} 
              className="flex items-center gap-2 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New
            </Button>
            <Button 
              onClick={onUsePrompt}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-lg"
            >
              <Send className="h-4 w-4" />
              Use This Prompt
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PromptSection;
