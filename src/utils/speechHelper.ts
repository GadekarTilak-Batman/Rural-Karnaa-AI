import { LanguageCode } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

const LANG_CODE_MAP: Record<LanguageCode, string> = {
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  mr: 'mr-IN',
  en: 'en-IN',
};

export function speakText(
  text: string,
  lang: LanguageCode = 'en',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODE_MAP[lang] || 'en-IN';
    utterance.rate = 0.92; // Slightly slower, clear tone for village elders & rural users
    utterance.pitch = 1.0;

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeakingNow(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
