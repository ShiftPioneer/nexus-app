import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, HelpCircle, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/ui/theme-provider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CardClose,
  CardDescriptionEdit,
  CardFooter,
  CardHeaderEdit,
  CardTitleEdit,
} from "@/components/ui/card-edit"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
} from "@/components/ui/resizable"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { InputJsonValue } from "react-hook-form-json-schema"
import {
  ResizableHandle as ResizableHandle2,
  ResizablePanel as ResizablePanel2,
  ResizablePanelGroup as ResizablePanelGroup2,
  ResizableSeparator as ResizableSeparator2,
} from "@/components/ui/resizable"
import {
  Accordion as Accordion2,
  AccordionContent as AccordionContent2,
  AccordionItem as AccordionItem2,
  AccordionTrigger as AccordionTrigger2,
} from "@/components/ui/accordion"
import {
  AlertDialog as AlertDialog2,
  AlertDialogAction as AlertDialogAction2,
  AlertDialogCancel as AlertDialogCancel2,
  AlertDialogContent as AlertDialogContent2,
  AlertDialogDescription as AlertDialogDescription2,
  AlertDialogFooter as AlertDialogFooter2,
  AlertDialogHeader as AlertDialogHeader2,
  AlertDialogTitle as AlertDialogTitle2,
  AlertDialogTrigger as AlertDialogTrigger2,
} from "@/components/ui/alert-dialog"
import {
  ContextMenu as ContextMenu2,
  ContextMenuContent as ContextMenuContent2,
  ContextMenuItem as ContextMenuItem2,
  ContextMenuSeparator as ContextMenuSeparator2,
  ContextMenuTrigger as ContextMenuTrigger2,
} from "@/components/ui/context-menu"
import {
  Dialog as Dialog2,
  DialogContent as DialogContent2,
  DialogDescription as DialogDescription2,
  DialogFooter as DialogFooter2,
  DialogHeader as DialogHeader2,
  DialogTitle as DialogTitle2,
  DialogTrigger as DialogTrigger2,
} from "@/components/ui/dialog"
import {
  Drawer as Drawer2,
  DrawerClose as DrawerClose2,
  DrawerContent as DrawerContent2,
  DrawerDescription as DrawerDescription2,
  DrawerFooter as DrawerFooter2,
  DrawerHeader as DrawerHeader2,
  DrawerTitle as DrawerTitle2,
  DrawerTrigger as DrawerTrigger2,
} from "@/components/ui/drawer"
import {
  HoverCard as HoverCard2,
  HoverCardContent as HoverCardContent2,
  HoverCardDescription as HoverCardDescription2,
  HoverCardHeader as HoverCardHeader2,
  HoverCardTrigger as HoverCardTrigger2,
} from "@/components/ui/hover-card"
import {
  Popover as Popover2,
  PopoverContent as PopoverContent2,
  PopoverTrigger as PopoverTrigger2,
} from "@/components/ui/popover"
import {
  Select as Select2,
  SelectContent as SelectContent2,
  SelectItem as SelectItem2,
  SelectTrigger as SelectTrigger2,
  SelectValue as SelectValue2,
} from "@/components/ui/select"
import {
  Tooltip as Tooltip2,
  TooltipContent as TooltipContent2,
  TooltipProvider as TooltipProvider2,
  TooltipTrigger as TooltipTrigger2,
} from "@/components/ui/tooltip"
import {
  DropdownMenu as DropdownMenu2,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItem2,
  DropdownMenuContent as DropdownMenuContent2,
  DropdownMenuGroup as DropdownMenuGroup2,
  DropdownMenuItem as DropdownMenuItem2,
  DropdownMenuLabel as DropdownMenuLabel2,
  DropdownMenuRadioGroup as DropdownMenuRadioGroup2,
  DropdownMenuRadioItem as DropdownMenuRadioItem2,
  DropdownMenuSeparator as DropdownMenuSeparator2,
  DropdownMenuShortcut as DropdownMenuShortcut2,
  DropdownMenuSub as DropdownMenuSub2,
  DropdownMenuSubContent as DropdownMenuSubContent2,
  DropdownMenuSubTrigger as DropdownMenuSubTrigger2,
  DropdownMenuTrigger as DropdownMenuTrigger2,
} from "@/components/ui/dropdown-menu"

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [disabled, setDisabled] = React.useState(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    try {
      // Load profile data from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
        setName(parsedProfile.name || '');
        setAvatar(parsedProfile.avatar || '');
      } else if (user?.user_metadata) {
        setName(user.user_metadata.name || user.user_metadata.full_name || '');
        setAvatar(user.user_metadata.avatar_url || '');
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user metadata with name and avatar
      const metadata = {
        name: name,
        avatar_url: avatar,
      };
      await updateUser(metadata);

      // Save profile data to localStorage
      const profile = {
        name: name,
        avatar: avatar,
      };
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setProfileData(profile);

      // Dispatch custom event for profile update
      const event = new CustomEvent('profileUpdated', { detail: profile });
      window.dispatchEvent(event);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getUserName = () => {
    if (profileData?.name) {
      return profileData.name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const getUserAvatar = () => {
    return profileData?.avatar || user?.user_metadata?.avatar_url || "";
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Profile</h3>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getUserAvatar()} alt="Profile" />
                  <AvatarFallback>{getUserName().substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="Avatar URL"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </section>

            {/* Appearance Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Appearance</h3>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select disabled={disabled} value={profileData?.theme} onValueChange={(value) => {
                  setTheme(value);
                  const profile = { ...profileData, theme: value };
                  localStorage.setItem('userProfile', JSON.stringify(profile));
                  setProfileData(profile);
                  const event = new CustomEvent('profileUpdated', { detail: profile });
                  window.dispatchEvent(event);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Account Actions Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Account Actions</h3>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
