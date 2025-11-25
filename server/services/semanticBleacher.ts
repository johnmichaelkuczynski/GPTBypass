import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "default_key",
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "default_key",
});

const grok = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY || "default_key",
});

const BLEACH_PROMPT = `You are a semantic bleaching tool. Your task is to transform the input text by replacing all content words (nouns, verbs, adjectives, adverbs, proper names) with single-letter placeholders (X, Y, Z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W) while PRESERVING:
- All function words (the, a, an, is, are, was, were, be, been, have, has, had, do, does, did, will, would, could, should, may, might, can, must, this, that, these, those, it, they, them, he, she, we, you, I, my, your, our, their, his, her, its, who, which, what, where, when, how, why, if, then, so, because, although, while, since, before, after, until, unless, than, as, or, and, but, nor, for, yet, not, no, some, any, all, each, every, both, either, neither, few, many, much, more, most, other, another, same, such, only, very, just, even, still, also, already, too, enough)
- All punctuation marks (periods, commas, semicolons, colons, dashes, parentheses, quotation marks, question marks, exclamation marks, apostrophes)
- Sentence structure and word order
- Line breaks and paragraph structure

RULES:
1. Use the SAME placeholder consistently for the same word throughout the text (e.g., if "bus" becomes "X", all instances of "bus" become "X")
2. Different content words get different placeholders
3. Keep contractions with their function word portion intact (e.g., "isn't" stays as "isn't", "don't" stays as "don't")
4. Preserve capitalization patterns for the placeholders (start of sentence = capital letter)
5. Output ONLY the bleached text, nothing else

Example:
Input: "The bus driver is smiling. His job is so boring."
Output: "The X Y is Z. His W is so A."

Now bleach this text:`;

export async function bleachText(text: string, provider: string = "grok"): Promise<string> {
  const prompt = `${BLEACH_PROMPT}\n\n"${text}"`;
  
  try {
    if (provider === "anthropic") {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.3,
      });
      return cleanBleachedOutput(response.content[0].type === 'text' ? response.content[0].text : "");
    } else if (provider === "openai") {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      });
      return cleanBleachedOutput(response.choices[0].message.content || "");
    } else {
      const response = await grok.chat.completions.create({
        model: "grok-2-1212",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      });
      return cleanBleachedOutput(response.choices[0].message.content || "");
    }
  } catch (error: any) {
    console.error("Semantic bleaching error:", error);
    throw new Error(`Failed to bleach text: ${error.message}`);
  }
}

function cleanBleachedOutput(text: string): string {
  return text
    .replace(/^["']|["']$/g, '')
    .replace(/^Output:\s*/i, '')
    .trim();
}

export function adjustStyleLength(bleachedStyle: string, targetWordCount: number): string {
  const words = bleachedStyle.trim().split(/\s+/).filter(w => w.length > 0);
  const styleWordCount = words.length;
  
  if (styleWordCount === 0) {
    return bleachedStyle;
  }
  
  if (styleWordCount >= targetWordCount) {
    return words.slice(0, targetWordCount).join(' ');
  }
  
  const repetitionsNeeded = Math.ceil(targetWordCount / styleWordCount);
  const repeatedWords: string[] = [];
  
  for (let i = 0; i < repetitionsNeeded; i++) {
    repeatedWords.push(...words);
  }
  
  return repeatedWords.slice(0, targetWordCount).join(' ');
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export async function processCustomStyleSample(
  customStyleText: string,
  inputText: string,
  provider: string = "grok"
): Promise<string> {
  console.log("📝 Processing custom style sample...");
  console.log(`   Custom style word count: ${countWords(customStyleText)}`);
  console.log(`   Input text word count: ${countWords(inputText)}`);
  
  const bleachedStyle = await bleachText(customStyleText, provider);
  console.log(`   Bleached style word count: ${countWords(bleachedStyle)}`);
  
  const targetWordCount = countWords(inputText);
  const adjustedStyle = adjustStyleLength(bleachedStyle, targetWordCount);
  console.log(`   Adjusted style word count: ${countWords(adjustedStyle)}`);
  
  return adjustedStyle;
}
