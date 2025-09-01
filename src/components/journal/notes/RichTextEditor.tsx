import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  onFormatChange?: (formats: Set<string>) => void;
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
  onFormatChange
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      
      // Update active formats
      if (onFormatChange) {
        const formats = new Set<string>();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let node = range.commonAncestorContainer;
          
          // Walk up the DOM tree to find formatting
          while (node && node !== editorRef.current) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const tagName = element.tagName.toLowerCase();
              
              if (tagName === 'b' || tagName === 'strong') formats.add('bold');
              if (tagName === 'i' || tagName === 'em') formats.add('italic');
              if (tagName === 'u') formats.add('underline');
              if (tagName === 'h1') formats.add('h1');
              if (tagName === 'h2') formats.add('h2');
              if (tagName === 'h3') formats.add('h3');
              if (tagName === 'blockquote') formats.add('blockquote');
              if (tagName === 'ul') formats.add('insertUnorderedList');
              if (tagName === 'ol') formats.add('insertOrderedList');
            }
            node = node.parentNode;
          }
        }
        onFormatChange(formats);
      }
    }
  }, [onChange, onFormatChange]);

  // Format text
  const executeCommand = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    try {
      if (command === 'insertCheckList') {
        // Custom checklist implementation
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'mr-2 accent-primary';
          checkbox.addEventListener('change', handleInput);
          
          const wrapper = document.createElement('div');
          wrapper.className = 'flex items-center mb-1';
          wrapper.appendChild(checkbox);
          
          const textSpan = document.createElement('span');
          textSpan.contentEditable = 'true';
          textSpan.textContent = 'New item';
          wrapper.appendChild(textSpan);
          
          range.insertNode(wrapper);
          range.collapse(false);
        }
      } else {
        document.execCommand(command, false, value);
      }
      
      handleInput();
    } catch (error) {
      console.warn('Command execution failed:', command, error);
    }
  }, [handleInput]);

  // Handle paste to clean up formatting
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  }, [handleInput]);

  // Handle key shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          executeCommand(e.shiftKey ? 'redo' : 'undo');
          break;
        case 'k':
          e.preventDefault();
          const url = prompt('Enter URL:');
          if (url) {
            executeCommand('createLink', url);
          }
          break;
      }
    }
    
    // Handle Enter key for lists
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.commonAncestorContainer;
        
        // Check if we're in a list
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'LI' && element.textContent?.trim() === '') {
              e.preventDefault();
              executeCommand('outdent');
              break;
            }
          }
          node = node.parentNode;
        }
      }
    }
  }, [executeCommand]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "min-h-[400px] p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
          "prose prose-slate dark:prose-invert max-w-none",
          "transition-all duration-200",
          isFocused && "bg-card/80"
        )}
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}
        data-placeholder={content ? undefined : placeholder}
      />
      
      {!content && !isFocused && (
        <div className="absolute inset-4 pointer-events-none text-muted-foreground italic">
          {placeholder}
        </div>
      )}
      
      <style>{`
        .prose h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0; color: hsl(var(--foreground)); }
        .prose h2 { font-size: 1.5rem; font-weight: 600; margin: 0.8rem 0; color: hsl(var(--foreground)); }
        .prose h3 { font-size: 1.25rem; font-weight: 600; margin: 0.6rem 0; color: hsl(var(--foreground)); }
        .prose p { margin: 0.5rem 0; color: hsl(var(--foreground)); }
        .prose ul, .prose ol { margin: 0.5rem 0; padding-left: 1.5rem; }
        .prose li { margin: 0.25rem 0; color: hsl(var(--foreground)); }
        .prose blockquote { 
          border-left: 4px solid hsl(var(--primary)); 
          padding-left: 1rem; 
          margin: 1rem 0; 
          font-style: italic; 
          color: hsl(var(--muted-foreground));
        }
        .prose a { color: hsl(var(--primary)); text-decoration: underline; }
        .prose strong, .prose b { font-weight: 700; color: hsl(var(--foreground)); }
        .prose em, .prose i { font-style: italic; }
        .prose u { text-decoration: underline; }
        .prose table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 1rem 0; 
          border: 1px solid hsl(var(--border));
        }
        .prose th, .prose td { 
          padding: 0.5rem; 
          border: 1px solid hsl(var(--border)); 
          text-align: left; 
        }
        .prose th { 
          background-color: hsl(var(--muted)); 
          font-weight: 600; 
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;