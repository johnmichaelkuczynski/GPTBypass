import fs from 'fs';
import path from 'path';

const ACADEMIC_FILE = path.join(process.cwd(), 'server/data/academic-style.txt');
const PERSONAL_FILE = path.join(process.cwd(), 'server/data/personal-style.txt');

let academicContent: string | null = null;
let personalContent: string | null = null;

function loadStyleFiles() {
  try {
    if (!academicContent) {
      academicContent = fs.readFileSync(ACADEMIC_FILE, 'utf-8');
      console.log(`📚 Loaded Academic style sample: ${academicContent.length} chars`);
    }
    if (!personalContent) {
      personalContent = fs.readFileSync(PERSONAL_FILE, 'utf-8');
      console.log(`📚 Loaded Personal style sample: ${personalContent.length} chars`);
    }
  } catch (error) {
    console.error('Failed to load style sample files:', error);
  }
}

loadStyleFiles();

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function extractMatchingLength(fullText: string, targetWordCount: number): string {
  const words = fullText.trim().split(/\s+/).filter(w => w.length > 0);
  
  if (words.length <= targetWordCount) {
    return fullText;
  }

  const targetWords = words.slice(0, targetWordCount);
  let result = targetWords.join(' ');
  
  const lastPeriodIndex = result.lastIndexOf('.');
  const lastQuestionIndex = result.lastIndexOf('?');
  const lastExclamationIndex = result.lastIndexOf('!');
  
  const lastSentenceEnd = Math.max(lastPeriodIndex, lastQuestionIndex, lastExclamationIndex);
  
  if (lastSentenceEnd > result.length * 0.7) {
    result = result.substring(0, lastSentenceEnd + 1);
  }
  
  return result;
}

export function getStyleSample(styleId: string, inputWordCount: number): string {
  loadStyleFiles();
  
  let fullContent: string;
  
  if (styleId === 'academic') {
    fullContent = academicContent || '';
  } else if (styleId === 'personal') {
    fullContent = personalContent || '';
  } else {
    return '';
  }
  
  if (!fullContent) {
    console.error(`Style sample not found for: ${styleId}`);
    return '';
  }
  
  const targetWordCount = Math.max(inputWordCount, 100);
  
  const extracted = extractMatchingLength(fullContent, Math.ceil(targetWordCount * 1.1));
  
  console.log(`📝 Extracted ${countWords(extracted)} words from ${styleId} style (input: ${inputWordCount} words)`);
  
  return extracted;
}

export function getFullStyleSample(styleId: string): string {
  loadStyleFiles();
  
  if (styleId === 'academic') {
    return academicContent || '';
  } else if (styleId === 'personal') {
    return personalContent || '';
  }
  
  return '';
}
