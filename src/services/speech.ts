import { IncomeCategory, ExpenseCategory, LanguageCode } from '../types';

export interface ParsedVoiceIntent {
  rawText: string;
  type: 'income' | 'expense' | 'question';
  amount?: number;
  category?: IncomeCategory | ExpenseCategory;
  period?: string;
  notes?: string;
}

// Map app language code to BCP-47 speech recognition locale
export function getSpeechLocale(lang: LanguageCode): string {
  switch (lang) {
    case 'hi':
      return 'hi-IN';
    case 'te':
      return 'te-IN';
    case 'ta':
      return 'ta-IN';
    case 'kn':
      return 'kn-IN';
    case 'mr':
      return 'mr-IN';
    case 'en':
    default:
      return 'en-IN';
  }
}

// Convert numbers in words or strings like "thirty thousand" or "30000" or "20k"
export function extractAmount(text: string): number | undefined {
  // Direct digits
  const digitMatch = text.match(/(?:₹|rs\.?|rupees|inr)?\s*([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)(?:\s*(?:k|thousand|hazar|hazaam|lakh|lac))?/i);
  
  // Word patterns
  const lower = text.toLowerCase();
  if (lower.includes('thirty thousand') || lower.includes('30,000') || lower.includes('30000') || lower.includes('tees hazar')) return 30000;
  if (lower.includes('twenty thousand') || lower.includes('20,000') || lower.includes('20000') || lower.includes('bees hazar')) return 20000;
  if (lower.includes('ten thousand') || lower.includes('10,000') || lower.includes('10000') || lower.includes('das hazar')) return 10000;
  if (lower.includes('fifty thousand') || lower.includes('50,000') || lower.includes('50000') || lower.includes('pachaas hazar')) return 50000;
  if (lower.includes('five thousand') || lower.includes('5,000') || lower.includes('5000') || lower.includes('paanch hazar')) return 5000;

  if (digitMatch && digitMatch[1]) {
    const rawNum = parseInt(digitMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawNum)) {
      if (lower.includes('lakh') || lower.includes('lac')) {
        return rawNum * 100000;
      }
      if (lower.includes('thousand') || lower.includes('hazar') || lower.includes('k')) {
        return rawNum < 1000 ? rawNum * 1000 : rawNum;
      }
      return rawNum;
    }
  }
  return undefined;
}

export function parseVoiceInput(text: string): ParsedVoiceIntent {
  const lower = text.toLowerCase();
  const amount = extractAmount(lower);

  const isIncome =
    lower.includes('earned') ||
    lower.includes('received') ||
    lower.includes('got') ||
    lower.includes('income') ||
    lower.includes('kamaye') ||
    lower.includes('kamaya') ||
    lower.includes('aamdani') ||
    lower.includes('aadaayam') ||
    lower.includes('varumaanam');

  const isExpense =
    lower.includes('spent') ||
    lower.includes('paid') ||
    lower.includes('bought') ||
    lower.includes('cost') ||
    lower.includes('expense') ||
    lower.includes('kharch') ||
    lower.includes('diye') ||
    lower.includes('kharcha') ||
    lower.includes('selavu') ||
    lower.includes('kharchu');

  let type: 'income' | 'expense' | 'question' = 'question';
  if (isIncome && !isExpense) type = 'income';
  else if (isExpense) type = 'expense';
  else if (amount) type = 'expense'; // default transaction assumption if amount specified

  let category: any = type === 'income' ? 'farming' : 'farming';
  if (lower.includes('milk') || lower.includes('dairy') || lower.includes('doodh') || lower.includes('cow') || lower.includes('buffalo')) {
    category = 'livestock';
  } else if (lower.includes('fertilizer') || lower.includes('seed') || lower.includes('crop') || lower.includes('tractor') || lower.includes('diesel')) {
    category = 'farming';
  } else if (lower.includes('grocery') || lower.includes('food') || lower.includes('ration') || lower.includes('vegetable') || lower.includes('rice')) {
    category = 'food';
  } else if (lower.includes('medicine') || lower.includes('doctor') || lower.includes('hospital') || lower.includes('clinic')) {
    category = 'healthcare';
  } else if (lower.includes('school') || lower.includes('fee') || lower.includes('books')) {
    category = 'education';
  } else if (lower.includes('emi') || lower.includes('loan') || lower.includes('kist') || lower.includes('interest')) {
    category = 'loan_emi';
  }

  return {
    rawText: text,
    type,
    amount,
    category,
    period: lower.includes('today') ? 'Today' : lower.includes('week') ? 'This Week' : 'This Month',
    notes: text,
  };
}

// Browser TTS Speech Synthesis
export function speakText(text: string, lang: LanguageCode = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel(); // Stop prior playback
    // Clean markdown bold / asterisks from speech
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getSpeechLocale(lang);
    utterance.rate = 0.95; // slightly relaxed pace for clarity
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
