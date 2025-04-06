
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Monitor, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const accentColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
];

export default function AppearanceTab() {
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('blue');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [reducedTransparency, setReducedTransparency] = useState(false);
  
  const resetAppearance = () => {
    setTheme('dark');
    setAccentColor('blue');
    setReducedMotion(false);
    setReducedTransparency(false);
    
    toast({
      title: 'Appearance reset',
      description: 'Your appearance settings have been reset to default.',
    });
  };
  
  const handleThemeChange = (value: string) => {
    setTheme(value);
    // In a real app, this would trigger a theme change in the application
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(value);
    
    toast({
      title: 'Theme updated',
      description: `Theme switched to ${value} mode.`,
    });
  };
  
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    
    toast({
      title: 'Accent color updated',
      description: `Accent color changed to ${color}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose your preferred color theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={theme} 
            onValueChange={handleThemeChange}
            className="flex justify-start space-x-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light" className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                Light
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="flex items-center gap-2 cursor-pointer">
                <Moon className="h-4 w-4" />
                Dark
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system" className="flex items-center gap-2 cursor-pointer">
                <Monitor className="h-4 w-4" />
                System
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>
            Choose your preferred accent color
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentColorChange(color.value)}
                className={`h-12 rounded-md flex items-center justify-center ${color.class} hover:opacity-90 transition-opacity ${
                  accentColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-black' : ''
                }`}
                title={color.name}
              >
                {accentColor === color.value && (
                  <span className="text-white font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Configure accessibility options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduced-motion" className="text-base">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch 
              id="reduced-motion" 
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduced-transparency" className="text-base">Reduced Transparency</Label>
              <p className="text-sm text-muted-foreground">
                Reduce transparency effects
              </p>
            </div>
            <Switch 
              id="reduced-transparency" 
              checked={reducedTransparency}
              onCheckedChange={setReducedTransparency}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={resetAppearance}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
