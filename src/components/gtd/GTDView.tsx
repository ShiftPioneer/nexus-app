
import React from "react";
import { useGTD } from "./GTDContext";
import CaptureView from "./views/CaptureView";
import ClarifyView from "./views/ClarifyView";
import OrganizeView from "./views/OrganizeView";
import ReflectView from "./views/ReflectView";
import EngageView from "./views/EngageView";

const GTDView: React.FC = () => {
  const { activeView } = useGTD();
  
  return (
    <div className="mt-6">
      {activeView === "capture" && <CaptureView />}
      {activeView === "clarify" && <ClarifyView />}
      {activeView === "organize" && <OrganizeView />}
      {activeView === "reflect" && <ReflectView />}
      {activeView === "engage" && <EngageView />}
    </div>
  );
};

export default GTDView;
