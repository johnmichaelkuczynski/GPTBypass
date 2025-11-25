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

export function getStyleSample(sampleType: 'academic' | 'personal'): string {
  if (!academicSample || !personalSample) {
    loadSamples();
  }
  return sampleType === 'academic' ? (academicSample || '') : (personalSample || '');
}

export function matchStyleToInputLength(styleText: string, inputText: string): string {
  const inputWordCount = countWords(inputText);
  const styleWordCount = countWords(styleText);
  
  if (inputWordCount === 0 || styleWordCount === 0) {
    return styleText;
  }
  
  const styleWords = styleText.trim().split(/\s+/);
  
  if (styleWordCount >= inputWordCount) {
    return styleWords.slice(0, inputWordCount).join(' ');
  }
  
  const repetitionsNeeded = Math.ceil(inputWordCount / styleWordCount);
  const repeatedWords: string[] = [];
  
  for (let i = 0; i < repetitionsNeeded; i++) {
    repeatedWords.push(...styleWords);
  }
  
  return repeatedWords.slice(0, inputWordCount).join(' ');
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
  
  return matchStyleToInputLength(styleText, inputText);
}

loadSamples();
