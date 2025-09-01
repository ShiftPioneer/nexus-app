import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Image, 
  Video, 
  FileText, 
  Music, 
  Upload, 
  X, 
  Eye, 
  Download,
  Scan,
  Camera,
  Mic,
  File
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
  uploadProgress?: number;
}

interface MediaUploaderProps {
  onFilesChange: (files: MediaFile[]) => void;
  files: MediaFile[];
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

const MediaUploader = ({
  onFilesChange,
  files,
  maxFiles = 10,
  maxFileSize = 50,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*'],
  className
}: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles: MediaFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Max size: ${maxFileSize}MB`);
        continue;
      }
      
      // Check file type
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });
      
      if (!isAccepted) {
        toast.error(`File type ${file.type} is not supported`);
        continue;
      }
      
      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      const mediaFile: MediaFile = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        preview,
        uploadProgress: 0
      };
      
      newFiles.push(mediaFile);
    }
    
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        file.uploadProgress = (file.uploadProgress || 0) + 10;
        if (file.uploadProgress >= 100) {
          clearInterval(interval);
          delete file.uploadProgress;
        }
        onFilesChange([...files, ...newFiles]);
      }, 100);
    });
    
    onFilesChange([...files, ...newFiles]);
    toast.success(`${newFiles.length} file(s) uploaded successfully`);
  }, [files, maxFiles, maxFileSize, acceptedTypes, onFilesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
    toast.success("File removed");
  }, [files, onFilesChange]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // Implementation for audio recording would go here
      toast.success("Recording started");
    } catch (error) {
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording implementation would go here
    toast.success("Recording stopped");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          "border-border/50 hover:border-primary/50",
          "bg-card/30 backdrop-blur-sm",
          dragActive && "border-primary bg-primary/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="text-center space-y-4">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <p className="text-foreground font-medium">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">
              Support for images, videos, audio, PDFs and documents
            </p>
            <p className="text-xs text-muted-foreground">
              Max file size: {maxFileSize}MB • Max files: {maxFiles}
            </p>
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              size="sm"
              className="glass hover:bg-primary/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant="secondary"
              size="sm"
              className={cn(
                "glass hover:bg-primary/10",
                isRecording && "bg-destructive/20 text-destructive animate-pulse"
              )}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isRecording ? 'Stop Recording' : 'Record Audio'}
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              className="glass hover:bg-primary/10"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan Document
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              className="glass hover:bg-primary/10"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Attached Files ({files.length})</h4>
          <div className="grid gap-2">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <Card key={file.id} className="p-3 glass">
                  <div className="flex items-center gap-3">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {file.type.split('/')[0]}
                        </Badge>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                      
                      {file.uploadProgress !== undefined && (
                        <Progress value={file.uploadProgress} className="mt-2 h-1" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;