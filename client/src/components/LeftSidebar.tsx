import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, User, Upload, Check, FileText, X } from "lucide-react";
import { StyleMode } from "@/lib/sentenceDatabases";
import { useToast } from "@/hooks/use-toast";

interface LeftSidebarProps {
  styleMode: StyleMode;
  onStyleModeChange: (mode: StyleMode) => void;
  onCustomUpload: (text: string) => void;
  customDatabaseLoaded: boolean;
}

export default function LeftSidebar({ 
  styleMode,
  onStyleModeChange,
  onCustomUpload,
  customDatabaseLoaded,
}: LeftSidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      let text = '';
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/pdf/extract', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to extract PDF text');
        }
        
        const data = await response.json();
        text = data.text;
      } else {
        const fileText = await file.text();
        text = fileText;
      }
      
      if (text.trim()) {
        onCustomUpload(text);
        onStyleModeChange('custom');
        toast({
          title: "Custom Database Loaded",
          description: `Uploaded "${file.name}" - text will be semantically bleached and used as your style database.`,
        });
      } else {
        throw new Error('No text content found in file');
      }
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to process uploaded file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCustomClick = () => {
    if (customDatabaseLoaded) {
      onStyleModeChange('custom');
    } else {
      fileInputRef.current?.click();
    }
  };

  const modeButtons = [
    {
      mode: 'academic' as StyleMode,
      label: 'ACADEMIC',
      sublabel: '200 sentences',
      icon: GraduationCap,
      description: 'Formal academic writing style with philosophical and analytical patterns',
    },
    {
      mode: 'personal' as StyleMode,
      label: 'PERSONAL',
      sublabel: '66 sentences',
      icon: User,
      description: 'Conversational personal writing style with informal patterns',
    },
  ];

  return (
    <aside className="w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col" data-testid="left-sidebar">
      <ScrollArea className="flex-1">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Style Mode</h2>
          <p className="text-sm text-gray-500 mb-6">
            Select a style database for dynamic sentence matching
          </p>
          
          <div className="space-y-3">
            {modeButtons.map(({ mode, label, sublabel, icon: Icon, description }) => (
              <button
                key={mode}
                onClick={() => onStyleModeChange(mode)}
                data-testid={`style-mode-${mode}`}
                className={`
                  w-full h-16 px-4 rounded-lg border-2 transition-all duration-200
                  flex items-center gap-4 text-left
                  ${styleMode === mode 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${styleMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${styleMode === mode ? 'text-blue-700' : 'text-gray-900'}`}>
                      {label}
                    </span>
                    {styleMode === mode && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{sublabel}</span>
                </div>
              </button>
            ))}

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                w-full min-h-16 px-4 py-3 rounded-lg border-2 transition-all duration-200
                flex items-center gap-4 text-left cursor-pointer
                ${isDragging 
                  ? 'border-green-500 bg-green-50 border-dashed' 
                  : styleMode === 'custom' && customDatabaseLoaded
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 border-dashed'}
              `}
              onClick={handleCustomClick}
              data-testid="style-mode-custom"
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${styleMode === 'custom' && customDatabaseLoaded 
                  ? 'bg-green-500 text-white' 
                  : isDragging 
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-100 text-gray-600'}
              `}>
                {customDatabaseLoaded ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    styleMode === 'custom' && customDatabaseLoaded 
                      ? 'text-green-700' 
                      : 'text-gray-900'
                  }`}>
                    CUSTOM
                  </span>
                  {styleMode === 'custom' && customDatabaseLoaded && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {customDatabaseLoaded 
                    ? 'Custom database loaded' 
                    : isDragging 
                      ? 'Drop file here...'
                      : 'Upload your own text'}
                </span>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileInputChange}
            className="hidden"
            data-testid="custom-file-input"
          />

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-900 mb-2">How it works</h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">1.</span>
                <span>Your input text is split into sentences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">2.</span>
                <span>Each sentence is matched by word count to database sentences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">3.</span>
                <span>A custom style sample is dynamically assembled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">4.</span>
                <span>Output length matches input length exactly</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
