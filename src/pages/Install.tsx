import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, CheckCircle2, Share, Plus, ArrowRight, Monitor, Apple, Chrome } from "lucide-react";
import { motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
    };
    
    checkStandalone();

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  };

  const features = [
    { icon: Smartphone, title: "Works Offline", description: "Access your data even without internet" },
    { icon: CheckCircle2, title: "Fast & Native-like", description: "Smooth performance like a native app" },
    { icon: Download, title: "Auto Updates", description: "Always get the latest features automatically" },
  ];

  if (isStandalone || isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Already Installed!</h1>
          <p className="text-muted-foreground">
            NEXUS is already installed on your device. Enjoy your productivity journey!
          </p>
          <Button onClick={() => window.location.href = '/'} className="mt-4">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <img 
            src="/lovable-uploads/nexus-logo-orange.png" 
            alt="NEXUS Logo" 
            className="h-20 w-20 mx-auto rounded-2xl shadow-xl shadow-primary/20"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Install NEXUS
          </h1>
          <p className="text-slate-400 text-lg">
            Add NEXUS to your home screen for the best experience
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-3"
        >
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Install Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
                {isIOS ? <Apple className="h-5 w-5" /> : <Chrome className="h-5 w-5" />}
                {isIOS ? "Install on iOS" : "Install on Your Device"}
              </CardTitle>
              <CardDescription>
                {isIOS 
                  ? "Follow these steps to add NEXUS to your home screen"
                  : "Click the button below to install NEXUS"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isIOS ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium">Tap the Share button</p>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                        <Share className="h-4 w-4" /> at the bottom of Safari
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium">Scroll and tap "Add to Home Screen"</p>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                        <Plus className="h-4 w-4" /> with the plus icon
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium">Tap "Add" to confirm</p>
                      <p className="text-sm text-slate-400 mt-1">
                        NEXUS will appear on your home screen
                      </p>
                    </div>
                  </div>
                </div>
              ) : deferredPrompt ? (
                <Button 
                  onClick={handleInstallClick} 
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/20"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Install NEXUS
                </Button>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Monitor className="h-5 w-5" />
                    <span>Installation not available</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Open this page in Chrome, Edge, or Safari to install. Or use the browser menu to add to home screen.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="text-slate-400 hover:text-slate-200"
          >
            Continue in browser
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Install;
