
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Paperclip, X, File, Image, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaskAttachment } from '@/types/gtd';

interface AttachmentInputProps {
  attachments: TaskAttachment[];
  onAttachmentsChange: (attachments: TaskAttachment[]) => void;
}

const AttachmentInput: React.FC<AttachmentInputProps> = ({ 
  attachments, 
  onAttachmentsChange 
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return;
      }

      const attachment: TaskAttachment = {
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        file: file
      };

      onAttachmentsChange([...attachments, attachment]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = new URL(linkUrl);
      const attachment: TaskAttachment = {
        name: url.hostname + url.pathname,
        type: 'link',
        url: linkUrl
      };

      onAttachmentsChange([...attachments, attachment]);
      setLinkUrl('');
      setShowLinkInput(false);
      
      toast({
        title: "Link added",
        description: "URL attachment has been added"
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(newAttachments);
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2"
        >
          <Paperclip className="h-4 w-4" />
          <span>Add File</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="flex items-center space-x-2"
        >
          <Link className="h-4 w-4" />
          <span>Add Link</span>
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.md"
        className="hidden"
      />

      {showLinkInput && (
        <div className="flex space-x-2">
          <Input
            placeholder="Enter URL (https://example.com)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={handleAddLink}>
            Add
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Attachments ({attachments.length})
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {getAttachmentIcon(attachment.type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {attachment.name}
                    </p>
                    {attachment.file && (
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.file.size)}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {attachment.type}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="ml-2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentInput;
