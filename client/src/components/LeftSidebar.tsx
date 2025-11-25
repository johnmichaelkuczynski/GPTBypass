import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { instructionPresets } from "@/lib/instructionPresets";

interface LeftSidebarProps {
  selectedPresets: string[];
  onPresetsChange: (presets: string[]) => void;
  selectedStyleType: 'academic' | 'personal' | 'custom';
  onStyleTypeChange: (styleType: 'academic' | 'personal' | 'custom') => void;
}

export default function LeftSidebar({ 
  selectedPresets, 
  onPresetsChange, 
  selectedStyleType,
  onStyleTypeChange
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
    <aside className="w-80 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
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

          {/* Style Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-book mr-2 text-primary"></i>
              Writing Style
            </h3>
            <div className="space-y-3">
              <RadioGroup 
                value={selectedStyleType} 
                onValueChange={(value) => onStyleTypeChange(value as 'academic' | 'personal' | 'custom')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="academic" id="academic" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="academic" className="font-medium cursor-pointer">Academic</Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Formal analytical writing style with academic tone
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="personal" id="personal" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="personal" className="font-medium cursor-pointer">Personal</Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Casual, conversational writing style
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="custom" id="custom" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="custom" className="font-medium cursor-pointer">Custom</Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Use your own style sample in Box B
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {selectedStyleType === 'custom' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <i className="fas fa-info-circle mr-2"></i>
                  Paste or upload your custom style sample in Box B (Style Sample)
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
