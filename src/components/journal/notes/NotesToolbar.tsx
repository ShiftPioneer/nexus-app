import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List, 
  ListOrdered, 
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Image,
  Paperclip,
  Mic,
  Table,
  Palette,
  Link,
  Undo,
  Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesToolbarProps {
  onFormat: (command: string, value?: string) => void;
  activeFormats: Set<string>;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onInsertMedia?: () => void;
  onInsertTable?: () => void;
  onInsertLink?: () => void;
}

const NotesToolbar = ({
  onFormat,
  activeFormats,
  isRecording = false,
  onStartRecording,
  onStopRecording,
  onInsertMedia,
  onInsertTable,
  onInsertLink
}: NotesToolbarProps) => {
  const formatButtons = [
    { command: 'bold', icon: Bold, label: 'Bold' },
    { command: 'italic', icon: Italic, label: 'Italic' },
    { command: 'underline', icon: Underline, label: 'Underline' },
  ];

  const alignButtons = [
    { command: 'justifyLeft', icon: AlignLeft, label: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, label: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, label: 'Align Right' },
  ];

  const listButtons = [
    { command: 'insertUnorderedList', icon: List, label: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered List' },
    { command: 'insertCheckList', icon: CheckSquare, label: 'Checklist' },
  ];

  const headingButtons = [
    { command: 'formatBlock', value: 'h1', icon: Heading1, label: 'Heading 1' },
    { command: 'formatBlock', value: 'h2', icon: Heading2, label: 'Heading 2' },
    { command: 'formatBlock', value: 'h3', icon: Heading3, label: 'Heading 3' },
    { command: 'formatBlock', value: 'p', icon: Type, label: 'Paragraph' },
  ];

  return (
    <div className="glass rounded-lg p-2 mb-4 border border-border/50">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormat('undo')}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormat('redo')}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        {headingButtons.map((button) => (
          <Button
            key={button.command + button.value}
            variant="ghost"
            size="sm"
            onClick={() => onFormat(button.command, button.value)}
            className={cn(
              "hover:bg-primary/10 hover:text-primary",
              activeFormats.has(button.value || button.command) && "bg-primary/20 text-primary"
            )}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        {formatButtons.map((button) => (
          <Button
            key={button.command}
            variant="ghost"
            size="sm"
            onClick={() => onFormat(button.command)}
            className={cn(
              "hover:bg-primary/10 hover:text-primary",
              activeFormats.has(button.command) && "bg-primary/20 text-primary"
            )}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        {alignButtons.map((button) => (
          <Button
            key={button.command}
            variant="ghost"
            size="sm"
            onClick={() => onFormat(button.command)}
            className={cn(
              "hover:bg-primary/10 hover:text-primary",
              activeFormats.has(button.command) && "bg-primary/20 text-primary"
            )}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        {listButtons.map((button) => (
          <Button
            key={button.command}
            variant="ghost"
            size="sm"
            onClick={() => onFormat(button.command)}
            className={cn(
              "hover:bg-primary/10 hover:text-primary",
              activeFormats.has(button.command) && "bg-primary/20 text-primary"
            )}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Media & Insert */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onInsertMedia}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onInsertTable}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Table className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onInsertLink}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Voice Recording */}
        <Button
          variant="ghost"
          size="sm"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={cn(
            "hover:bg-primary/10 hover:text-primary",
            isRecording && "bg-destructive/20 text-destructive animate-pulse"
          )}
        >
          <Mic className="h-4 w-4" />
        </Button>

        {/* Quote */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormat('formatBlock', 'blockquote')}
          className={cn(
            "hover:bg-primary/10 hover:text-primary",
            activeFormats.has('blockquote') && "bg-primary/20 text-primary"
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotesToolbar;