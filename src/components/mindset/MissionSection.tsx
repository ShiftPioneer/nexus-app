
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, Edit3, Save, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const MissionSection = () => {
  const [mission, setMission] = useState("To live authentically, inspire others through meaningful work, and create lasting positive impact in my community while continuously growing and learning.");
  const [isEditing, setIsEditing] = useState(false);
  const [tempMission, setTempMission] = useState(mission);
  const { toast } = useToast();

  const handleSave = () => {
    setMission(tempMission);
    setIsEditing(false);
    toast({
      title: "Mission Updated",
      description: "Your life mission has been successfully updated!"
    });
  };

  const handleCancel = () => {
    setTempMission(mission);
    setIsEditing(false);
  };

  const missionPrompts = [
    "What legacy do you want to leave behind?",
    "What problems do you feel called to solve?",
    "What activities make you feel most alive and purposeful?",
    "How do you want to impact others' lives?",
    "What values will guide your major life decisions?"
  ];

  return (
    <div className="space-y-6">
      {/* Mission Statement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">My Life Mission</CardTitle>
                  <p className="text-slate-400">Your guiding purpose and direction</p>
                </div>
              </div>
              
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <Textarea
                  value={tempMission}
                  onChange={(e) => setTempMission(e.target.value)}
                  placeholder="Write your life mission statement..."
                  className="min-h-32 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none"
                />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Mission
                  </Button>
                  
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="border-slate-600/50 hover:bg-slate-700/30 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="p-6 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-blue-500/20 rounded-xl backdrop-blur-sm">
                  <p className="text-lg text-white leading-relaxed italic">
                    "{mission}"
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>This mission guides your major life decisions and priorities</span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Mission Development Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ArrowRight className="h-5 w-5 text-primary" />
              Mission Development
            </CardTitle>
            <p className="text-slate-400">Reflect on these questions to refine your mission</p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              {missionPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-colors duration-200"
                >
                  <p className="text-slate-300 font-medium">{prompt}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-950/20 to-pink-950/20 border border-purple-500/20 rounded-xl">
              <p className="text-sm text-purple-200">
                <strong>Tip:</strong> A powerful mission statement is personal, inspiring, and actionable. 
                It should resonate with your core values and provide clear direction for your life choices.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MissionSection;
