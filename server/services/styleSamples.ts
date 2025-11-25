import * as fs from 'fs';
import * as path from 'path';

const ACADEMIC_SAMPLE_PATH = path.join(process.cwd(), 'server/data/academic-sample.txt');
const PERSONAL_SAMPLE_PATH = path.join(process.cwd(), 'server/data/personal-sample.txt');

let academicSampleCache: string | null = null;
let personalSampleCache: string | null = null;

function loadSample(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to load sample from ${filePath}:`, error);
    return '';
  }
}

export function getAcademicSample(): string {
  if (!academicSampleCache) {
    academicSampleCache = loadSample(ACADEMIC_SAMPLE_PATH);
  }
  return academicSampleCache;
}

export function getPersonalSample(): string {
  if (!personalSampleCache) {
    personalSampleCache = loadSample(PERSONAL_SAMPLE_PATH);
  }
  return personalSampleCache;
}

export function getSampleById(id: string): string {
  switch (id) {
    case 'academic':
      return getAcademicSample();
    case 'personal':
      return getPersonalSample();
    default:
      return '';
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function adjustStyleToInputLength(styleText: string, inputText: string): string {
  const inputWordCount = countWords(inputText);
  const styleWordCount = countWords(styleText);
  
  if (styleWordCount === 0 || inputWordCount === 0) {
    return styleText;
  }
  
  if (styleWordCount >= inputWordCount) {
    const words = styleText.split(/\s+/);
    return words.slice(0, inputWordCount).join(' ');
  } else {
    const repetitionsNeeded = Math.ceil(inputWordCount / styleWordCount);
    let expandedStyle = '';
    for (let i = 0; i < repetitionsNeeded; i++) {
      expandedStyle += (i > 0 ? '\n\n' : '') + styleText;
    }
    const words = expandedStyle.split(/\s+/);
    return words.slice(0, inputWordCount).join(' ');
  }
}
