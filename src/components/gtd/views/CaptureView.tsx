
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Lightbulb, Zap } from "lucide-react";
import QuickCaptureForm from "./capture/QuickCaptureForm";
import { motion } from "framer-motion";

const CaptureView = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Inbox className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Capture Everything
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Get everything out of your head and into your trusted system. Capture thoughts, ideas, and tasks as they come to you.
        </p>
      </motion.div>

      {/* GTD Principles Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Inbox className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Quick Capture</h3>
            <p className="text-sm text-slate-400">
              Capture thoughts instantly without overthinking organization
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">No Judgment</h3>
            <p className="text-sm text-slate-400">
              Capture everything - big or small, important or trivial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Fast Processing</h3>
            <p className="text-sm text-slate-400">
              Process later - focus on capturing now
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Capture Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <QuickCaptureForm />
      </motion.div>

      {/* Tips Section */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-blue-300 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Capture Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-white">What to Capture:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Tasks and to-dos</li>
                  <li>• Ideas and inspirations</li>
                  <li>• Meeting notes</li>
                  <li>• Things you need to remember</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-white">Best Practices:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Use voice input for speed</li>
                  <li>• Don't edit while capturing</li>
                  <li>• Set appropriate priority levels</li>
                  <li>• Review and clarify regularly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CaptureView;
