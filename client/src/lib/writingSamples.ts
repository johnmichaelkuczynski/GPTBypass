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
    category: "Style"
  },
  {
    id: "personal",
    name: "Personal",
    preview: "Casual, conversational personal writing style...",
    category: "Style"
  }
];

export const defaultStyleSample = "academic";
