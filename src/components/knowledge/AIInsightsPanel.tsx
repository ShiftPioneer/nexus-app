
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AIInsightsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p>AI-powered insights for your knowledge base will appear here.</p>
        <p className="text-muted-foreground mt-2">
          We're still working on this feature. Stay tuned for updates!
        </p>
      </CardContent>
    </Card>
  );
}

export default AIInsightsPanel;
