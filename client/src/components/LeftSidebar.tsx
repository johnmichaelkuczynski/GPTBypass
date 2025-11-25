import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { instructionPresets } from "@/lib/instructionPresets";
import { BookOpen, User, FileText } from "lucide-react";

interface LeftSidebarProps {
  selectedPresets: string[];
  onPresetsChange: (presets: string[]) => void;
  selectedStyleSample: string;
  onStyleSampleSelect: (sampleId: string) => void;
  onContentSampleSelect: (sampleId: string) => void;
}

export default function LeftSidebar({ 
  selectedPresets, 
  onPresetsChange, 
  selectedStyleSample,
  onStyleSampleSelect,
  onContentSampleSelect
}: LeftSidebarProps) {

  const handlePresetSelect = (presetId: string) => {
    if (!selectedPresets.includes(presetId)) {
      onPresetsChange([...selectedPresets, presetId]);
    }
  };

  const handlePresetRemove = (presetId: string) => {
    onPresetsChange(selectedPresets.filter(id => id !== presetId));
  };

  const groupedPresets = instructionPresets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <aside className="w-48 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <ScrollArea className="h-full">
        <div className="p-4">
          {/* Instruction Presets Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-sliders-h mr-2 text-primary"></i>
              Instruction Presets
            </h3>
            
            <div className="space-y-3">
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add instruction preset..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.entries(groupedPresets).map(([category, presets]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {category}
                      </div>
                      {presets.map((preset) => (
                        <SelectItem 
                          key={preset.id} 
                          value={preset.id}
                          disabled={selectedPresets.includes(preset.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{preset.name}</span>
                            <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {preset.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Selected Presets Display */}
              {selectedPresets.length > 0 && (
                <div className="bg-gray-50 border rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Selected Presets ({selectedPresets.length})
                  </div>
                  <div className="space-y-2">
                    {selectedPresets.map((presetId) => {
                      const preset = instructionPresets.find(p => p.id === presetId);
                      return preset ? (
                        <div key={presetId} className="flex items-center justify-between bg-white border rounded px-2 py-1">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{preset.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => handlePresetRemove(presetId)}
                          >
                            ×
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs h-6 px-2"
                    onClick={() => onPresetsChange([])}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Writing Style Buttons Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fas fa-book mr-2 text-primary"></i>
              Writing Style
            </h3>
            
            <div className="space-y-2">
              {/* Academic Button */}
              <Button
                variant="outline"
                className="w-full h-auto py-2 px-2 flex items-center justify-start gap-2 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => onStyleSampleSelect("academic")}
                data-testid="button-academic-style"
              >
                <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <span className="text-sm font-medium">Academic</span>
              </Button>

              {/* Personal Button */}
              <Button
                variant="outline"
                className="w-full h-auto py-2 px-2 flex items-center justify-start gap-2 hover:bg-green-50 hover:border-green-300"
                onClick={() => onStyleSampleSelect("personal")}
                data-testid="button-personal-style"
              >
                <User className="h-4 w-4 flex-shrink-0 text-green-600" />
                <span className="text-sm font-medium">Personal</span>
              </Button>

              {/* Custom Style Sample Button */}
              <Button
                variant="outline"
                className="w-full h-auto py-2 px-2 flex items-center justify-start gap-2 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => onContentSampleSelect("custom")}
                data-testid="button-custom-style"
              >
                <FileText className="h-4 w-4 flex-shrink-0 text-purple-600" />
                <span className="text-sm font-medium">Custom</span>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
