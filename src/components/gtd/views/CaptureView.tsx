
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Lightbulb, Zap, Brain } from "lucide-react";
import QuickCaptureForm from "./capture/QuickCaptureForm";
import { motion } from "framer-motion";

const CaptureView = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-6">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl">
            <Inbox className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Capture Everything
          </h1>
        </div>
        <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
          Get everything out of your head and into your trusted system. Capture thoughts, ideas, and tasks as they come to you.
        </p>
      </motion.div>

      {/* GTD Principles Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-950/90 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Inbox className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Quick Capture</h3>
            <p className="text-slate-400 leading-relaxed">
              Capture thoughts instantly without overthinking organization
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/90 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="h-7 w-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No Judgment</h3>
            <p className="text-slate-400 leading-relaxed">
              Capture everything - big or small, important or trivial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950/90 backdrop-blur-sm border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-7 w-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fast Processing</h3>
            <p className="text-slate-400 leading-relaxed">
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
        className="mb-12"
      >
        <QuickCaptureForm />
      </motion.div>

      {/* Tips Section */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-950/30 via-indigo-950/30 to-purple-950/30 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-3">
              <Brain className="h-6 w-6" />
              Capture Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">What to Capture:</h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>Tasks and to-dos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <span>Ideas and inspirations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Meeting notes and commitments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                    <span>Things you need to remember</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Best Practices:</h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>Use voice input for speed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <span>Don't edit while capturing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>Set appropriate priority levels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                    <span>Review and clarify regularly</span>
                  </li>
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
