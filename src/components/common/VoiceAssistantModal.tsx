import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Bot,
  RotateCcw,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { interpretVoiceTranscript, VoiceInterpretation } from '../../utils/voiceExtractor';

// Type definition for Web Speech API window objects
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPreFill?: (interpretation: VoiceInterpretation) => void;
  onAskGuardian?: (transcript: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onConfirmPreFill,
  onAskGuardian,
}) => {
  const { language, setActiveTab } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [interpretation, setInterpretation] = useState<VoiceInterpretation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  const recognitionRef = useRef<any>(null);

  const isTa = language === 'ta';

  // Check speech recognition browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
    }
  }, []);

  // Text to Speech Helper
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isTa ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS not available:', e);
    }
  };

  // Start Speech Recognition
  const startListening = () => {
    setErrorMsg(null);
    setInterpretation(null);
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setErrorMsg(
        isTa
          ? 'இந்த உலாவியில் பேச்சு கண்டறிதல் ஆதரிக்கப்படவில்லை. கீழே தட்டச்சு செய்யவும்.'
          : 'Speech Recognition is not supported in this browser. Please type your request below.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isTa ? 'ta-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMsg(
            isTa
              ? 'மைக்கிரோஃபோன் அனுமதி மறுக்கப்பட்டது. தயவுசெய்து அனுமதி வழங்கவும் அல்லது கீழே தட்டச்சு செய்யவும்.'
              : 'Microphone access denied. Please grant permission or type your query below.'
          );
        } else if (event.error === 'no-speech') {
          setErrorMsg(
            isTa
              ? 'குரல் எதுவும் கேட்கவில்லை. மீண்டும் பேசத் தட்டவும்.'
              : 'No speech was detected. Please tap to speak again.'
          );
        } else {
          setErrorMsg(
            isTa
              ? 'பேச்சு உணர்தல் பிழை ஏற்பட்டது. கீழே தட்டச்சு செய்யவும்.'
              : 'Speech recognition error. You can type your request below.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setErrorMsg(
        isTa
          ? 'மைக்கிரோஃபோனைத் தொடங்குவதில் பிழை ஏற்பட்டது.'
          : 'Failed to start microphone. Please type your request.'
      );
    }
  };

  // Stop Listening & Analyze
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Process text whenever transcript or manualInput is submitted
  const handleProcessText = (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const res = interpretVoiceTranscript(textToProcess, language);
      setInterpretation(res);
      setIsProcessing(false);

      // Speak feedback summary
      if (res.intent === 'POST_LABOUR_REQ' && res.labourDetails) {
        speakText(
          isTa
            ? `${res.labourDetails.workersNeeded} ஆட்கள் ${res.labourDetails.crop} வேலைக்கு தயார் செய்யப்பட்டுள்ளது.`
            : `Extracted requirement for ${res.labourDetails.workersNeeded} workers for ${res.labourDetails.crop}.`
        );
      } else if (res.intent === 'POST_MACHINERY_REQ' && res.machineryDetails) {
        speakText(
          isTa
            ? `${res.machineryDetails.machineType} இயந்திர தேவை தயார் செய்யப்பட்டுள்ளது.`
            : `Extracted requirement for ${res.machineryDetails.machineType}.`
        );
      } else {
        speakText(isTa ? 'உங்கள் குரல் கோரிக்கை ஆராயப்பட்டது.' : 'Voice request processed successfully.');
      }
    }, 400);
  };

  // Effect to process transcript when listening stops and transcript exists
  useEffect(() => {
    if (!isListening && transcript.trim() && !interpretation && !isProcessing) {
      handleProcessText(transcript);
    }
  }, [isListening, transcript]);

  // Handle Confirm & Pre-fill Action
  const handleConfirmAction = () => {
    if (!interpretation) return;

    if (onConfirmPreFill) {
      onConfirmPreFill(interpretation);
    }

    if (interpretation.intent === 'POST_LABOUR_REQ') {
      setActiveTab('services');
    } else if (interpretation.intent === 'POST_MACHINERY_REQ') {
      setActiveTab('myMachinery');
    } else if (interpretation.intent === 'LOOKUP_MARKET_PRICE') {
      setActiveTab('marketplace');
    } else if (interpretation.intent === 'LOOKUP_BUYER_REQ') {
      setActiveTab('requirements');
    } else if (interpretation.intent === 'NAVIGATE' && interpretation.targetTab) {
      setActiveTab(interpretation.targetTab);
    } else if (interpretation.intent === 'GUARDIAN_AI_QUERY' && onAskGuardian) {
      onAskGuardian(interpretation.transcript);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-emerald-700 flex items-center justify-center text-white font-bold shadow-xs">
              🎤
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isTa ? 'உழவன் குரல் உதவி' : 'Uzhavan Voice Assistant'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isTa
                  ? 'தமிழ், ஆங்கிலம் மற்றும் தங்லீஷ் குரல் கட்டளைகள்'
                  : 'Tamil, English & Thanglish Voice Interactions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
              title={isMuted ? 'Unmute Audio Response' : 'Mute Audio Response'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Big Mic Area */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3 bg-gradient-to-b from-amber-50/60 to-emerald-50/40 rounded-2xl border border-amber-200/60 p-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-md ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse'
                : isProcessing
                ? 'bg-amber-500 text-white animate-spin'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white hover:scale-105'
            }`}
          >
            {isListening ? (
              <Mic className="w-8 h-8 animate-bounce" />
            ) : isProcessing ? (
              <RotateCcw className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          <div className="text-center">
            <span className="text-xs font-bold text-slate-900 block">
              {isListening
                ? isTa ? 'கவனிக்கிறது... பேசுங்கள்' : 'Listening... Speak now'
                : isProcessing
                ? isTa ? 'ஆராய்கிறது...' : 'Processing voice input...'
                : isTa ? 'பேச தட்டவும்' : 'Tap to Speak'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {isTa
                ? 'உதாரணம்: "அக்டோபர் 5 ஆம் தேதி 6 தேங்காய் அறுவடை வேலைக்காரர்கள் வேண்டும்"'
                : 'Example: "I need 6 workers for coconut harvesting on October 5"'}
            </span>
          </div>
        </div>

        {/* Error / Fallback Alert */}
        {errorMsg && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Transcript Display */}
        {transcript && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isTa ? 'குரல் உரை (Transcript)' : 'Voice Transcript'}
            </span>
            <p className="font-semibold text-slate-800 italic">&ldquo;{transcript}&rdquo;</p>
          </div>
        )}

        {/* Manual Input Fallback */}
        {(!hasSpeechSupport || errorMsg || !isListening) && (
          <div className="space-y-1.5 text-xs">
            <label className="block font-semibold text-slate-700">
              {isTa ? 'அல்லது உங்கள் கோரிக்கையை தட்டச்சு செய்யவும்:' : 'Or type your request manually:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setTranscript(manualInput);
                    handleProcessText(manualInput);
                  }
                }}
                placeholder={
                  isTa
                    ? 'எ.கா: அக்டோபர் 5-க்கு 6 ஆட்கள் வேண்டும்'
                    : 'e.g. October 5 ku 6 coconut harvesting workers venum'
                }
                className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
              />
              <button
                onClick={() => {
                  setTranscript(manualInput);
                  handleProcessText(manualInput);
                }}
                className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Interpreted Details Screen */}
        {interpretation && (
          <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl space-y-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold text-emerald-950">
                  {isTa ? interpretation.intentLabelTa : interpretation.intentLabelEn}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                Interpreted
              </span>
            </div>

            {/* Render Labour Requirement Structured Details */}
            {interpretation.intent === 'POST_LABOUR_REQ' && interpretation.labourDetails && (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Crop / பயிர்:</span>
                  <span className="font-bold text-slate-900">{interpretation.labourDetails.crop}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Work Type / பணி:</span>
                  <span className="font-bold text-slate-900">{interpretation.labourDetails.workType}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Workers / ஆட்கள் எண்ணிக்கை:</span>
                  <span className="font-extrabold text-emerald-900 text-sm">
                    {interpretation.labourDetails.workersNeeded} Workers
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Date / தேதி:</span>
                  <span className="font-bold text-slate-900">{interpretation.labourDetails.date}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100 col-span-2">
                  <span className="text-slate-400 block text-[10px]">Location / இடம்:</span>
                  <span className="font-semibold text-slate-800">{interpretation.labourDetails.location}</span>
                </div>
              </div>
            )}

            {/* Render Machinery Requirement Structured Details */}
            {interpretation.intent === 'POST_MACHINERY_REQ' && interpretation.machineryDetails && (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Machine / இயந்திரம்:</span>
                  <span className="font-bold text-slate-900">{interpretation.machineryDetails.machineType}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Area / பரப்பு:</span>
                  <span className="font-bold text-slate-900">{interpretation.machineryDetails.area}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Crop / பயிர்:</span>
                  <span className="font-bold text-slate-900">{interpretation.machineryDetails.crop}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Date / தேதி:</span>
                  <span className="font-bold text-slate-900">{interpretation.machineryDetails.date}</span>
                </div>
              </div>
            )}

            {/* Render General Search / Navigation Info */}
            {(interpretation.intent === 'LOOKUP_MARKET_PRICE' ||
              interpretation.intent === 'LOOKUP_BUYER_REQ' ||
              interpretation.intent === 'NAVIGATE') && (
              <p className="text-slate-700 font-medium">
                {isTa ? 'கேட்ட விவரங்களை பார்க்க கிளிக் செய்யவும்.' : 'Click confirm to navigate directly to requested page.'}
              </p>
            )}

            {/* Render Guardian AI query info */}
            {interpretation.intent === 'GUARDIAN_AI_QUERY' && (
              <p className="text-slate-700 font-medium">
                {isTa
                  ? 'இந்த கேள்வியை கார்டியன் AI-யிடம் கேட்கவும்.'
                  : 'Pass transcript directly to Guardian AI for live response.'}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
              <button
                type="button"
                onClick={() => {
                  setInterpretation(null);
                  setTranscript('');
                }}
                className="px-3.5 py-2 border border-emerald-300 rounded-xl text-emerald-900 font-bold hover:bg-emerald-100 cursor-pointer"
              >
                {isTa ? 'மீண்டும் பேச' : 'Try Again'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <span>{isTa ? 'உறுதிசெய்து தொடரவும்' : 'Confirm & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Safety Footer Note */}
        <p className="text-[10px] text-slate-400 text-center leading-tight">
          🔒 <strong>Safety Guarantee:</strong> Voice assistant will never automatically submit payments, accept offers, or approve bookings. All transactions require manual screen confirmation.
        </p>
      </div>
    </div>
  );
};
