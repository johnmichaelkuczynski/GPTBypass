import fs from 'fs';
import path from 'path';

const STYLE_SAMPLES_DIR = path.join(process.cwd(), 'server', 'data', 'styleSamples');

let academicSample: string | null = null;
let personalSample: string | null = null;

function loadSamples(): void {
  try {
    academicSample = fs.readFileSync(path.join(STYLE_SAMPLES_DIR, 'academic.txt'), 'utf-8');
    personalSample = fs.readFileSync(path.join(STYLE_SAMPLES_DIR, 'personal.txt'), 'utf-8');
    console.log(`✅ Style samples loaded: Academic (${countWords(academicSample)} words), Personal (${countWords(personalSample)} words)`);
  } catch (error) {
    console.error('❌ Failed to load style samples:', error);
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function getSentenceWordCount(sentence: string): number {
  return sentence.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function findBestMatchingSentence(targetWordCount: number, styleSentences: string[]): string {
  if (styleSentences.length === 0) return '';
  
  let bestMatch = styleSentences[0];
  let bestDiff = Math.abs(getSentenceWordCount(bestMatch) - targetWordCount);
  
  for (const sentence of styleSentences) {
    const diff = Math.abs(getSentenceWordCount(sentence) - targetWordCount);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestMatch = sentence;
    }
    if (diff === 0) break;
  }
  
  return bestMatch;
}

export function getStyleSample(sampleType: 'academic' | 'personal'): string {
  if (!academicSample || !personalSample) {
    loadSamples();
  }
  return sampleType === 'academic' ? (academicSample || '') : (personalSample || '');
}

export function matchSentenceLengths(styleText: string, inputText: string): string {
  const inputSentences = splitIntoSentences(inputText);
  const styleSentences = splitIntoSentences(styleText);
  
  if (inputSentences.length === 0 || styleSentences.length === 0) {
    return styleText;
  }
  
  const matchedSentences: string[] = [];
  
  for (const inputSentence of inputSentences) {
    const targetWordCount = getSentenceWordCount(inputSentence);
    const matchingSentence = findBestMatchingSentence(targetWordCount, styleSentences);
    matchedSentences.push(matchingSentence);
  }
  
  return matchedSentences.join(' ');
}

export function prepareStyleSample(
  sampleType: 'academic' | 'personal' | 'custom',
  customText: string | undefined,
  inputText: string
): string {
  let styleText: string;
  
  if (sampleType === 'custom' && customText && customText.trim()) {
    styleText = customText;
  } else if (sampleType === 'academic' || sampleType === 'personal') {
    styleText = getStyleSample(sampleType);
  } else {
    styleText = getStyleSample('academic');
  }
  
  return matchSentenceLengths(styleText, inputText);
}

loadSamples();
