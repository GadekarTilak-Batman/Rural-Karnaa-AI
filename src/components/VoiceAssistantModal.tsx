import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, Edit3, Volume2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage';
import { parseVoiceInput, ParsedVoiceIntent, speakText, getSpeechLocale } from '../services/speech';
import { useLanguage } from '../context/LanguageContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAi?: (query: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAi,
}) => {
  const { lang, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedIntent, setParsedIntent] = useState<ParsedVoiceIntent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState<string>('');
  const [editedType, setEditedType] = useState<'income' | 'expense'>('income');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [browserSupport, setBrowserSupport] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
      } else {
        setBrowserSupport(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setParsedIntent(null);
      setIsEditing(false);
      setStatusMessage('');
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatusMessage('Voice recognition is simulated or not supported in this browser. You can type below.');
      return;
    }

    try {
      recognitionRef.current.lang = getSpeechLocale(lang);
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatusMessage(t('listening', lang));
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          handleVoiceResult(resultTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setStatusMessage('Could not hear clearly. Please tap mic and try again or use sample phrases.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (err) {
      console.warn('Speech start error:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handleVoiceResult = (text: string) => {
    const intent = parseVoiceInput(text);
    setParsedIntent(intent);
    if (intent.amount) {
      setEditedAmount(intent.amount.toString());
    }
    if (intent.type === 'income' || intent.type === 'expense') {
      setEditedType(intent.type);
    }
  };

  const handleConfirmAdd = () => {
    if (!parsedIntent) return;
    const finalAmount = Number(editedAmount || parsedIntent.amount || 0);

    if (finalAmount <= 0) {
      setStatusMessage('Please specify a valid amount in Rupees.');
      return;
    }

    if (editedType === 'income') {
      StorageService.addIncome({
        userId: StorageService.getUser()?.id || 'guest',
        amount: finalAmount,
        category: (parsedIntent.category as any) || 'farming',
        date: new Date().toISOString().slice(0, 10),
        source: parsedIntent.rawText || 'Voice entry',
        notes: 'Added via Voice Input',
      });
      speakText(`Successfully added income of ${finalAmount} rupees`, lang);
    } else {
      StorageService.addExpense({
        userId: StorageService.getUser()?.id || 'guest',
        amount: finalAmount,
        category: (parsedIntent.category as any) || 'farming',
        date: new Date().toISOString().slice(0, 10),
        notes: parsedIntent.rawText || 'Voice expense entry',
      });
      speakText(`Successfully recorded expense of ${finalAmount} rupees`, lang);
    }

    setStatusMessage(`Saved ₹${finalAmount.toLocaleString('en-IN')} ${editedType}!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleAskAi = () => {
    if (onNavigateToAi && transcript) {
      onNavigateToAi(transcript);
      onClose();
    }
  };

  const handlePresetSample = (sample: string) => {
    setTranscript(sample);
    handleVoiceResult(sample);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/60 rounded-xl">
              <Mic className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Voice Assistant / आवाज सहायक</h2>
              <p className="text-xs text-emerald-100">
                Speak in your local language (Hindi, Telugu, Tamil, Kannada, Marathi, English)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-2 rounded-lg hover:bg-emerald-600/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Microphone status visualizer */}
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative p-6 rounded-full transition-all duration-300 shadow-lg ${
                isListening
                  ? 'bg-rose-500 text-white ring-8 ring-rose-100 animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
              }`}
            >
              {isListening ? <Mic className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            <span className="mt-3 text-sm font-semibold text-stone-700">
              {isListening ? 'Listening to your voice... (बोलिए)' : 'Tap mic to start speaking'}
            </span>
            <p className="text-xs text-stone-500 mt-0.5">
              Example: "I earned thirty thousand rupees this month" or "Spent 1200 on fertilizers"
            </p>
          </div>

          {/* Real-time transcript display */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 min-h-[70px]">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Spoken Words (आवाज)
            </span>
            <p className="text-stone-900 font-medium text-base">
              {transcript || (
                <span className="text-stone-400 italic">
                  Your spoken words will appear here...
                </span>
              )}
            </p>
          </div>

          {/* Confirmation Box (Matching Section 18 Specification) */}
          {parsedIntent && parsedIntent.amount ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                  AI Intent Extraction
                </span>
                <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-semibold">
                  Detected
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-200">
                <p className="text-base font-bold text-stone-900">
                  Did you mean:{' '}
                  <span className="text-emerald-700">
                    {editedType === 'income' ? 'Income' : 'Expense'} — ₹
                    {Number(editedAmount || parsedIntent.amount).toLocaleString('en-IN')}
                  </span>
                  ?
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Category: {parsedIntent.category} • Period: {parsedIntent.period || 'Current month'}
                </p>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-stone-600">Type</label>
                    <select
                      value={editedType}
                      onChange={e => setEditedType(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white"
                    >
                      <option value="income">Income (आमदनी)</option>
                      <option value="expense">Expense (खर्च)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600">Amount (₹)</label>
                    <input
                      type="number"
                      value={editedAmount}
                      onChange={e => setEditedAmount(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white"
                    />
                  </div>
                </div>
              ) : null}

              {/* Action Buttons: Confirm, Edit, Cancel */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleConfirmAdd}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition"
                >
                  <Check className="w-4 h-4" />
                  Confirm (पुष्टि करें)
                </button>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-3.5 rounded-xl border border-stone-300 transition text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Done' : 'Edit'}
                </button>

                <button
                  onClick={() => {
                    setParsedIntent(null);
                    setTranscript('');
                  }}
                  className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-600 py-2.5 px-3 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : parsedIntent && parsedIntent.type === 'question' && transcript ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-amber-900">
                Looks like a question for the AI Assistant:
              </p>
              <p className="text-sm text-stone-800 italic">"{transcript}"</p>
              <button
                onClick={handleAskAi}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-xl transition text-sm shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI Assistant Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Quick Click Samples for Hackathon Demo testing */}
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Try Quick Voice Samples (डेमो नमूने)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePresetSample('I earned thirty thousand rupees this month from milk sale')}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 transition text-left"
              >
                "I earned ₹30,000 this month"
              </button>
              <button
                onClick={() => handlePresetSample('I spent four thousand rupees on fertilizer seeds')}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 transition text-left"
              >
                "Spent ₹4,000 on fertilizer"
              </button>
              <button
                onClick={() => handlePresetSample('Can I afford to buy a twenty thousand rupees smartphone?')}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 transition text-left"
              >
                "Can I afford a ₹20,000 phone?"
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="text-center text-xs font-semibold text-stone-600 bg-stone-100 p-2 rounded-lg">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
