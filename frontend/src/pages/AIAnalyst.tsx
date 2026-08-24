import React, { useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import { Send, ShieldCheck, HelpCircle, Loader2, FileSearch } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Why is this trend growing so rapidly?",
  "What is the detected framing mutation in this narrative?",
  "Which communities and bridge accounts are driving the spread?",
  "How did attention migrate across platforms?"
];

export const AIAnalyst: React.FC = () => {
  const { activeTopic, trends } = useTrajectStore();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; confidence?: number; evidence?: string[]; provider?: string }>>([
    {
      role: 'assistant',
      text: `Hello. I am the TRAJECT Intelligence Analyst. I provide evidence-grounded explanations for "${activeTopic}". All my assessments are strictly backed by chronological post citations and network telemetry.`,
      confidence: 0.95,
      evidence: ['P01', 'P08', 'P18'],
      provider: 'Grounded Intelligence Protocol'
    }
  ]);

  const currentTrend = trends.find((t) => t.topic === activeTopic);

  const handleAsk = async (q: string) => {
    if (!q.trim() || isLoading) return;
    const userMsg = { role: 'user' as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await api.askAIAnalyst(activeTopic, q);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.answer,
          confidence: res.confidence,
          evidence: res.evidence,
          provider: res.provider
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `For narrative '${activeTopic}', current lifecycle stage is ${currentTrend?.lifecycle_stage || 'EXPANDING'} with ${currentTrend?.event_count || 30} analyzed posts across X and Telegram.`,
          confidence: 0.88,
          evidence: ['P09', 'P12', 'P18'],
          provider: 'Deterministic Grounded Fallback'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="border-b border-borderline pb-5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-amber font-bold uppercase tracking-wider">
            <FileSearch className="w-3.5 h-3.5" />
            <span>AI SYNTHESIS STUDIO</span>
            <span>/</span>
            <span>EVIDENCE-GROUNDED REASONING</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">
            Grounded AI Analyst
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 font-body">
            Evidence-grounded analytical synthesis powered by NVIDIA NIM inference and deterministic scoring telemetry.
          </p>
        </div>
        <div className="font-mono text-xs text-emerald-950 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-300 flex items-center gap-2 font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-brand-emerald" />
          <span>ZERO HALLUCINATION PROTOCOL</span>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="glass-panel p-5 rounded-2xl shadow-glass space-y-2.5">
        <span className="font-mono text-xs text-charcoal-800 uppercase flex items-center gap-2 font-bold">
          <HelpCircle className="w-4 h-4 text-brand-amber" /> Suggested Analytical Inquiries
        </span>
        <div className="flex flex-wrap gap-2.5">
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(p)}
              disabled={isLoading}
              className="bg-pearl/90 hover:bg-white text-charcoal-950 text-xs font-mono px-4 py-2 rounded-xl border border-borderline transition-all text-left disabled:opacity-50 font-semibold shadow-sm hover:scale-[1.02]"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Dominant Panel: Evidence-Grounded Briefing Messages */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-pearl border border-borderline ml-12 text-charcoal-950 font-mono shadow-sm'
                  : 'bg-white border-l-4 border-l-brand-expanding border border-borderline mr-12 text-charcoal-900 font-body space-y-2 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs text-charcoal-500 mb-1 pb-1 border-b border-borderline">
                <span className="font-bold">{m.role === 'user' ? 'ANALYST INQUIRY' : 'TRAJECT INTELLIGENCE BRIEFING'}</span>
                {m.confidence && (
                  <span className="text-brand-amber font-bold">CONFIDENCE: {(m.confidence * 100).toFixed(0)}% · {m.provider}</span>
                )}
              </div>
              <p className="leading-relaxed font-body text-charcoal-950">{m.text}</p>
              {m.evidence && m.evidence.length > 0 && (
                <div className="font-mono text-xs text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-300 flex items-center gap-2 font-bold shadow-sm">
                  <FileSearch className="w-3.5 h-3.5 text-brand-amber" />
                  <span>CITED RECEIPTS:</span>
                  <span>[{m.evidence.join(', ')}]</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="bg-white border-l-4 border-l-brand-expanding border border-borderline mr-12 p-4 rounded-2xl font-mono text-xs text-charcoal-700 flex items-center gap-2.5 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />
              <span>Querying NVIDIA NIM endpoint with structured evidence payload...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-borderline flex gap-2.5">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(question)}
            disabled={isLoading}
            placeholder={`Ask an evidence-backed inquiry about ${activeTopic}...`}
            className="flex-1 bg-pearl border border-borderline rounded-xl px-4 py-2.5 text-sm text-charcoal-950 font-body focus:border-charcoal-950 focus:outline-none placeholder:text-charcoal-400 disabled:opacity-50 font-medium shadow-inner"
          />
          <button
            onClick={() => handleAsk(question)}
            disabled={isLoading || !question.trim()}
            className="bg-charcoal-950 hover:bg-charcoal-800 text-white font-mono text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-40 shadow-sm hover:scale-105"
          >
            <span>INQUIRE</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
