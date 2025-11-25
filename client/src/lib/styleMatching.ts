import { DatabaseSentence, ACADEMIC_DATABASE, PERSONAL_DATABASE, StyleMode } from './sentenceDatabases';

export interface MatchedSentence {
  targetIndex: number;
  targetText: string;
  targetWordCount: number;
  matchedSentence: DatabaseSentence;
  wordCountDiff: number;
}

export interface StyleMatchResult {
  styleSample: string;
  matches: MatchedSentence[];
  targetSentenceCount: number;
  styleSentenceCount: number;
}

function splitIntoSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  const sentences: string[] = [];
  let current = '';
  let inQuote = false;
  let inParen = 0;
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const nextChar = normalized[i + 1] || '';
    
    current += char;
    
    if (char === '"' || char === '"' || char === '"') {
      inQuote = !inQuote;
    }
    if (char === '(') inParen++;
    if (char === ')') inParen--;
    
    const isSentenceEnd = (char === '.' || char === '!' || char === '?') && 
                          !inQuote && 
                          inParen === 0;
    
    if (isSentenceEnd) {
      const lookAhead = normalized.slice(i + 1, i + 10);
      const isAbbreviation = /^[a-z]/.test(lookAhead) || 
                             /\b(Mr|Mrs|Ms|Dr|Prof|Inc|Ltd|Jr|Sr|vs|etc|i\.e|e\.g)\.$/.test(current.trim());
      
      if (!isAbbreviation || nextChar === ' ' && /^[A-Z]/.test(normalized[i + 2] || '')) {
        const sentence = current.trim();
        if (sentence.length > 0) {
          sentences.push(sentence);
        }
        current = '';
      }
    }
  }
  
  if (current.trim().length > 0) {
    sentences.push(current.trim());
  }
  
  return sentences.filter(s => s.length > 0);
}

function countWords(text: string): number {
  const cleaned = text
    .replace(/["""'']/g, '')
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length === 0) return 0;
  
  return cleaned.split(/\s+/).filter(word => word.length > 0).length;
}

function findClosestMatch(targetWordCount: number, database: DatabaseSentence[]): DatabaseSentence {
  let closest = database[0];
  let minDiff = Math.abs(database[0].wordCount - targetWordCount);
  
  for (const sentence of database) {
    const diff = Math.abs(sentence.wordCount - targetWordCount);
    if (diff < minDiff) {
      minDiff = diff;
      closest = sentence;
    }
    if (diff === 0) break;
  }
  
  return closest;
}

function findMultipleMatchesForLongSentence(
  targetWordCount: number, 
  database: DatabaseSentence[]
): DatabaseSentence[] {
  const sortedByLength = [...database].sort((a, b) => b.wordCount - a.wordCount);
  
  const matches: DatabaseSentence[] = [];
  let remainingWords = targetWordCount;
  
  while (remainingWords > 0 && matches.length < 5) {
    const closest = findClosestMatch(remainingWords, sortedByLength);
    matches.push(closest);
    remainingWords -= closest.wordCount;
    
    if (remainingWords <= 0 || closest.wordCount <= 5) break;
  }
  
  return matches;
}

export function constructStyleSample(
  targetText: string,
  mode: StyleMode,
  customDatabase?: DatabaseSentence[]
): StyleMatchResult {
  const database = mode === 'custom' && customDatabase 
    ? customDatabase 
    : mode === 'academic' 
      ? ACADEMIC_DATABASE 
      : PERSONAL_DATABASE;
  
  if (database.length === 0) {
    return {
      styleSample: '',
      matches: [],
      targetSentenceCount: 0,
      styleSentenceCount: 0,
    };
  }
  
  const targetSentences = splitIntoSentences(targetText);
  const matches: MatchedSentence[] = [];
  const styleParts: string[] = [];
  
  for (let i = 0; i < targetSentences.length; i++) {
    const targetSentence = targetSentences[i];
    const targetWordCount = countWords(targetSentence);
    
    if (targetWordCount > 70) {
      const multiMatches = findMultipleMatchesForLongSentence(targetWordCount, database);
      const combinedText = multiMatches.map(m => m.text.replace(/^"|"$/g, '')).join(' and ');
      
      styleParts.push(combinedText);
      
      matches.push({
        targetIndex: i,
        targetText: targetSentence,
        targetWordCount,
        matchedSentence: multiMatches[0],
        wordCountDiff: Math.abs(targetWordCount - multiMatches.reduce((sum, m) => sum + m.wordCount, 0)),
      });
    } else {
      const closestMatch = findClosestMatch(targetWordCount, database);
      const matchText = closestMatch.text.replace(/^"|"$/g, '');
      
      styleParts.push(matchText);
      
      matches.push({
        targetIndex: i,
        targetText: targetSentence,
        targetWordCount,
        matchedSentence: closestMatch,
        wordCountDiff: Math.abs(targetWordCount - closestMatch.wordCount),
      });
    }
  }
  
  const styleSample = styleParts.join(' ');
  
  return {
    styleSample,
    matches,
    targetSentenceCount: targetSentences.length,
    styleSentenceCount: styleParts.length,
  };
}

export function bleachText(text: string): DatabaseSentence[] {
  const sentences = splitIntoSentences(text);
  const bleachedSentences: DatabaseSentence[] = [];
  
  const contentWordPattern = /\b(?!(?:the|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|shall|can|need|dare|ought|used|to|of|in|for|on|with|at|by|from|as|into|through|during|before|after|above|below|between|under|over|out|up|down|off|about|against|among|around|behind|beside|beyond|inside|outside|within|without|along|across|toward|upon|until|since|but|and|or|nor|so|yet|both|either|neither|not|only|also|than|that|this|these|those|which|who|whom|whose|what|when|where|why|how|if|then|because|although|though|while|unless|whether|however|therefore|thus|hence|moreover|furthermore|nevertheless|nonetheless|meanwhile|otherwise|instead|rather|I|you|he|she|it|we|they|me|him|her|us|them|my|your|his|its|our|their|mine|yours|hers|ours|theirs|myself|yourself|himself|herself|itself|ourselves|themselves)\b)([A-Za-z][a-z]*(?:'[a-z]+)?)/gi;
  
  let placeholderIndex = 0;
  const placeholders = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const wordCount = countWords(sentence);
    
    let bleached = sentence;
    const usedPlaceholders = new Map<string, string>();
    
    bleached = bleached.replace(contentWordPattern, (match) => {
      if (usedPlaceholders.has(match.toLowerCase())) {
        return usedPlaceholders.get(match.toLowerCase())!;
      }
      const placeholder = placeholders[placeholderIndex % placeholders.length];
      placeholderIndex++;
      usedPlaceholders.set(match.toLowerCase(), placeholder);
      return placeholder;
    });
    
    bleachedSentences.push({
      id: i + 1,
      text: bleached,
      wordCount,
    });
  }
  
  return bleachedSentences;
}

export { splitIntoSentences, countWords };
