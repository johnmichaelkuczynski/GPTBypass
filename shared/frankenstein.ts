export function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
}

export function getWordCount(sentence: string): number {
  return sentence.split(/\s+/).filter(w => w.length > 0).length;
}

export function buildFrankensteinSample(inputText: string, styleText: string): string {
  const inputSentences = splitIntoSentences(inputText);
  const styleSentences = splitIntoSentences(styleText);
  
  if (styleSentences.length === 0) return styleText;
  if (inputSentences.length === 0) return styleText;
  
  const usedIndices = new Set<number>();
  const matchedSentences: string[] = [];
  
  for (const inputSentence of inputSentences) {
    const targetLength = getWordCount(inputSentence);
    let bestMatch = -1;
    let bestDiff = Infinity;
    
    for (let i = 0; i < styleSentences.length; i++) {
      if (usedIndices.has(i)) continue;
      const styleLength = getWordCount(styleSentences[i]);
      const diff = Math.abs(styleLength - targetLength);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = i;
      }
    }
    
    if (bestMatch !== -1) {
      matchedSentences.push(styleSentences[bestMatch]);
      usedIndices.add(bestMatch);
    } else {
      const randomIdx = Math.floor(Math.random() * styleSentences.length);
      matchedSentences.push(styleSentences[randomIdx]);
    }
  }
  
  return matchedSentences.join(" ");
}
