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
    preview: "Formal analytical writing with placeholder-based content for optimal AI detection bypass...",
    category: "Style"
  },
  {
    id: "personal",
    name: "Personal",
    preview: "Casual, conversational writing with placeholder-based content for optimal AI detection bypass...",
    category: "Style"
  }
];

export function getCategories(): string[] {
  return ["Style"];
}

export function getSamplesByCategory(category: string): WritingSample[] {
  return writingSamples.filter(s => s.category === category);
}

export function getCategoryCounts(): Record<string, number> {
  return { "Style": 2 };
}
