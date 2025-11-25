import fs from 'fs';
import path from 'path';

const ACADEMIC_SAMPLE_PATH = path.join(process.cwd(), 'server/data/academic_sample.txt');
const PERSONAL_SAMPLE_PATH = path.join(process.cwd(), 'server/data/personal_sample.txt');

let academicSentences: string[] = [];
let personalSentences: string[] = [];

function splitIntoSentences(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  return sentences;
}

function loadSamples() {
  if (academicSentences.length === 0) {
    try {
      const academicText = fs.readFileSync(ACADEMIC_SAMPLE_PATH, 'utf-8');
      academicSentences = splitIntoSentences(academicText);
      console.log(`Loaded ${academicSentences.length} academic sentences`);
    } catch (error) {
      console.error('Error loading academic sample:', error);
    }
  }
  
  if (personalSentences.length === 0) {
    try {
      const personalText = fs.readFileSync(PERSONAL_SAMPLE_PATH, 'utf-8');
      personalSentences = splitIntoSentences(personalText);
      console.log(`Loaded ${personalSentences.length} personal sentences`);
    } catch (error) {
      console.error('Error loading personal sample:', error);
    }
  }
}

function findSimilarLengthSentence(targetLength: number, sentences: string[], usedIndices: Set<number>): { sentence: string; index: number } {
  let bestMatch = { sentence: sentences[0], index: 0, diff: Math.abs(sentences[0].length - targetLength) };
  
  for (let i = 0; i < sentences.length; i++) {
    if (usedIndices.has(i)) continue;
    
    const diff = Math.abs(sentences[i].length - targetLength);
    if (diff < bestMatch.diff) {
      bestMatch = { sentence: sentences[i], index: i, diff };
    }
    if (diff === 0) break;
  }
  
  return { sentence: bestMatch.sentence, index: bestMatch.index };
}

export function matchSentences(inputText: string, styleType: 'academic' | 'personal' | 'custom', customStyleText?: string): string {
  loadSamples();
  
  let styleSentences: string[];
  
  if (styleType === 'custom' && customStyleText) {
    styleSentences = splitIntoSentences(customStyleText);
    
    const inputSentences = splitIntoSentences(inputText);
    const inputTotalLength = inputText.length;
    const styleTotalLength = customStyleText.length;
    
    if (styleTotalLength < inputTotalLength) {
      const repeatCount = Math.ceil(inputTotalLength / styleTotalLength);
      const repeatedText = Array(repeatCount).fill(customStyleText).join(' ');
      styleSentences = splitIntoSentences(repeatedText);
    }
  } else if (styleType === 'academic') {
    styleSentences = academicSentences;
  } else {
    styleSentences = personalSentences;
  }
  
  if (styleSentences.length === 0) {
    console.error('No style sentences available');
    return customStyleText || '';
  }
  
  const inputSentences = splitIntoSentences(inputText);
  const usedIndices = new Set<number>();
  const matchedSentences: string[] = [];
  
  for (const inputSentence of inputSentences) {
    const targetLength = inputSentence.length;
    const { sentence, index } = findSimilarLengthSentence(targetLength, styleSentences, usedIndices);
    matchedSentences.push(sentence);
    usedIndices.add(index);
    
    if (usedIndices.size >= styleSentences.length) {
      usedIndices.clear();
    }
  }
  
  return matchedSentences.join(' ');
}

export function getStyleSamplePreview(styleType: 'academic' | 'personal'): string {
  loadSamples();
  
  const sentences = styleType === 'academic' ? academicSentences : personalSentences;
  const preview = sentences.slice(0, 5).join(' ');
  return preview.substring(0, 500) + '...';
}
