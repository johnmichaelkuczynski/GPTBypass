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
    preview: "Formal academic writing style with analytical structure and placeholder variables",
    category: "Style"
  },
  {
    id: "personal",
    name: "Personal",
    preview: "Conversational personal writing style with informal tone and placeholder variables",
    category: "Style"
  }
];
