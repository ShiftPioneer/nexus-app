
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Plus, X, Lightbulb, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const KeyBeliefsSection = () => {
  const [beliefs, setBeliefs] = useState([
    "I am capable of learning and growing from any challenge",
    "Every failure is a stepping stone to success",
    "I deserve happiness and fulfillment in my life",
    "My contributions make a meaningful difference",
    "I have the power to create positive change"
  ]);
  
  const [newBelief, setNewBelief] = useState("");
  const { toast } = useToast();

  const addBelief = () => {
    if (newBelief.trim() && !beliefs.includes(newBelief.trim())) {
      setBeliefs([...beliefs, newBelief.trim()]);
      setNewBelief("");
      toast({
        title: "Belief Added",
        description: "New empowering belief has been added to your collection!"
      });
    }
  };

  const removeBelief = (index: number) => {
    setBeliefs(beliefs.filter((_, i) => i !== index));
    toast({
      title: "Belief Removed",
      description: "Belief has been removed from your collection."
    });
  };

  const beliefCategories = [
    {
      title: "Growth Mindset",
      icon: TrendingUp,
      beliefs: beliefs.filter(belief => 
        belief.toLowerCase().includes('learn') || 
        belief.toLowerCase().includes('grow') || 
        belief.toLowerCase().includes('challenge')
      ),
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Self-Worth",
      icon: Brain,
      beliefs: beliefs.filter(belief => 
        belief.toLowerCase().includes('deserve') || 
        belief.toLowerCase().includes('capable') || 
        belief.toLowerCase().includes('power')
      ),
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Purpose & Impact",
      icon: Lightbulb,
      beliefs: beliefs.filter(belief => 
        belief.toLowerCase().includes('difference') || 
        belief.toLowerCase().includes('contribution') || 
        belief.toLowerCase().includes('change')
      ),
      color: "from-purple-500 to-pink-500"
    }
  ];

  const suggestionPrompts = [
    "What do you believe about your potential?",
    "How do you view challenges and setbacks?",
    "What beliefs drive your daily actions?",
    "What do you believe about your worth?",
    "How do you view your role in the world?"
  ];

  return (
    <div className="space-y-6">
      {/* Belief Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {beliefCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">{category.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {category.beliefs.length > 0 ? (
                    category.beliefs.map((belief, beliefIndex) => (
                      <motion.div
                        key={beliefIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg"
                      >
                        <p className="text-sm text-slate-300">{belief}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No beliefs in this category yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All Beliefs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-brain-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">My Key Beliefs</CardTitle>
                <p className="text-slate-400">Empowering thoughts that shape your reality</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add New Belief */}
            <div className="flex gap-3">
              <Input
                value={newBelief}
                onChange={(e) => setNewBelief(e.target.value)}
                placeholder="Add a new empowering belief..."
                className="flex-1 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20"
                onKeyPress={(e) => e.key === 'Enter' && addBelief()}
              />
              <Button 
                onClick={addBelief}
                disabled={!newBelief.trim()}
                className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Beliefs Grid */}
            <div className="grid gap-3">
              <AnimatePresence>
                {beliefs.map((belief, index) => (
                  <motion.div
                    key={belief}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-700/50 rounded-xl hover:bg-slate-700/30 transition-all duration-200"
                  >
                    <p className="text-slate-200 font-medium flex-1">{belief}</p>
                    
                    <Button
                      onClick={() => removeBelief(index)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Reflection Prompts */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-950/20 to-pink-950/20 border border-purple-500/20 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-400" />
                Belief Reflection Prompts
              </h4>
              
              <div className="grid gap-3">
                {suggestionPrompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 bg-slate-800/20 border border-slate-700/30 rounded-lg"
                  >
                    <p className="text-sm text-purple-200">{prompt}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default KeyBeliefsSection;
