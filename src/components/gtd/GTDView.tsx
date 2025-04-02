
import React from "react";
import { useGTD } from "./GTDContext";
import CaptureView from "./views/CaptureView";
import ClarifyView from "./views/ClarifyView";
import OrganizeView from "./views/OrganizeView";
import ReflectView from "./views/ReflectView";
import EngageView from "./views/EngageView";
import { AnimatePresence, motion } from "framer-motion";

const GTDView: React.FC = () => {
  const { activeView } = useGTD();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div 
        key={activeView}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {activeView === "capture" && <CaptureView />}
        {activeView === "clarify" && <ClarifyView />}
        {activeView === "organize" && <OrganizeView />}
        {activeView === "reflect" && <ReflectView />}
        {activeView === "engage" && <EngageView />}
      </motion.div>
    </AnimatePresence>
  );
};

export default GTDView;
