import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuickCaptureForm from "./capture/QuickCaptureForm";
import { GTDTask } from "@/types/planning";
import { useToast } from "@/hooks/use-toast";
const CaptureView: React.FC = () => {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState("quick-capture");

  // Handler for adding tasks
  const handleAddTask = (task: Partial<GTDTask>) => {
    // In a real app, this would save to a database
    console.log('Task added:', task);
    toast({
      title: "Task captured",
      description: "Your task has been added to your inbox",
      duration: 3000
    });
  };
  return <Card>
      <CardHeader>
        <CardTitle>Capture</CardTitle>
        <CardDescription>Collect what has your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="quick-capture">Quick Capture</TabsTrigger>
            
            
          </TabsList>
          
          <TabsContent value="quick-capture">
            <QuickCaptureForm onAddTask={handleAddTask} />
          </TabsContent>
          
          <TabsContent value="email-capture">
            <div className="text-center p-6">
              <p className="text-muted-foreground">Configure an email address where you can forward emails to be captured in your GTD system.</p>
              {/* Email integration components would go here */}
            </div>
          </TabsContent>
          
          <TabsContent value="voice-capture">
            <div className="text-center p-6">
              <p className="text-muted-foreground">Use voice commands to capture tasks and ideas on the go.</p>
              {/* Voice capture components would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};
export default CaptureView;