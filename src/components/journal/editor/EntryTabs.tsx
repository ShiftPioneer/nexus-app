import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, PenTool, BookOpen } from "lucide-react";
import ReflectionFields from "./ReflectionFields";
import VoiceToText from "../VoiceToText";
import { motion } from "framer-motion";
interface EntryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  reflections: any;
  onReflectionChange: (field: string, value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
}
const EntryTabs: React.FC<EntryTabsProps> = ({
  activeTab,
  onTabChange,
  reflections,
  onReflectionChange,
  notes,
  onNotesChange
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.2
  }}>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 bg-slate-900/50 border border-slate-700 p-2 rounded-xl backdrop-blur-sm py-0">
          <TabsTrigger value="reflections" className="flex items-center gap-3 px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-purple-500/30 rounded-lg transition-all duration-300 hover:bg-slate-800/50 mx-[5px]">
            <Heart className="h-4 w-4" />
            <span className="font-medium">Structured Reflection</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-3 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-blue-500/30 rounded-lg transition-all duration-300 hover:bg-slate-800/50 px-[12px] mx-[5px]">
            <PenTool className="h-4 w-4" />
            <span className="font-medium">Free Writing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reflections" className="space-y-4 mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Daily Reflection Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReflectionFields reflections={reflections} onReflectionChange={onReflectionChange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-primary" />
                  Free Writing Space
                </div>
                <VoiceToText onTranscript={text => {
                const currentText = notes || "";
                const newText = currentText ? `${currentText}\n\n${text}` : text;
                onNotesChange(newText);
              }} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Let your thoughts flow freely here... Use the microphone button to add voice transcriptions." value={notes} onChange={e => onNotesChange(e.target.value)} className="min-h-[300px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none transition-all duration-200" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>;
};
export default EntryTabs;