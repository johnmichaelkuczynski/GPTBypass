export interface WritingSample {
  id: string;
  name: string;
  preview: string;
  category: string;
}

export const writingSamples: WritingSample[] = [
  {
    id: "academic",
    name: "Academic",
    preview: "Formal, structured academic writing style with philosophical depth...",
    category: "Preset"
  },
  {
    id: "personal",
    name: "Personal",
    preview: "Casual, conversational personal writing style...",
    category: "Preset"
  },
  {
    id: "custom",
    name: "Custom",
    preview: "Paste your own style sample in Box B...",
    category: "Custom"
  }
];

export const defaultStyleSample = "academic";
