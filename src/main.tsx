
import { createRoot } from 'react-dom/client'
import { SettingsProvider } from "@/contexts/SettingsContext";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <App />
  </SettingsProvider>
);
