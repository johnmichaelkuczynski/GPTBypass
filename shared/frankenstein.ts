export function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
}

export function getWordCount(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

export function buildFrankensteinSample(inputText: string, styleText: string): string {
  const inputSentences = splitIntoSentences(inputText);
  const styleSentences = splitIntoSentences(styleText);
  
  if (styleSentences.length === 0) return styleText;
  if (inputSentences.length === 0) return styleText;
  
  const matchedSentences: string[] = [];
  
  // For each input sentence, find the style sentence with the closest word count
  // ALLOW REUSE - same style sentence can be matched multiple times
  for (const inputSentence of inputSentences) {
    const targetLength = getWordCount(inputSentence);
    let bestMatch = 0;
    let bestDiff = Infinity;
    
    for (let i = 0; i < styleSentences.length; i++) {
      const styleLength = getWordCount(styleSentences[i]);
      const diff = Math.abs(styleLength - targetLength);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = i;
      }
    }
    
    matchedSentences.push(styleSentences[bestMatch]);
  }
  
  return matchedSentences.join(" ");
}
