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
    preview: "Formal academic writing style with structured argumentation and analytical tone...",
    category: "Style"
  },
  {
    id: "personal",
    name: "Personal",
    preview: "Casual personal writing style with conversational and informal tone...",
    category: "Style"
  }
];

export const defaultStyleSampleId = "academic";

export function getCategories(): string[] {
  const categories = new Set(writingSamples.map(s => s.category));
  return Array.from(categories);
}

export function getSamplesByCategory(category: string): WritingSample[] {
  return writingSamples.filter(s => s.category === category);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  writingSamples.forEach(s => {
    counts[s.category] = (counts[s.category] || 0) + 1;
  });
  return counts;
}
