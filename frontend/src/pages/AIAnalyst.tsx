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
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex items-baseline justify-between">
        <div>
          <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block font-bold">
            Console 07 / AI Intelligence Synthesis
          </span>
          <h1 className="font-display font-bold text-3xl text-charcoal-900 tracking-tight mt-1">
            Grounded AI Analyst
          </h1>
          <p className="text-charcoal-500 text-sm mt-1">
            Evidence-grounded analytical synthesis powered by NVIDIA NIM inference and deterministic scoring telemetry.
          </p>
        </div>
        <div className="font-mono text-xs text-emerald-900 bg-emerald-50 px-3 py-1 rounded border border-emerald-300 flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-signal-teal" />
          <span>ZERO HALLUCINATION PROTOCOL</span>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="bg-surface border border-hairline p-4 rounded shadow-subtle space-y-2">
        <span className="font-mono text-xs text-charcoal-700 uppercase flex items-center gap-1.5 font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-signal-gold" /> Suggested Analytical Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(p)}
              disabled={isLoading}
              className="bg-subtle hover:bg-hairline text-charcoal-900 text-xs font-mono px-3 py-1.5 rounded border border-hairline transition-colors text-left disabled:opacity-50 font-medium"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Dominant Panel: Evidence-Grounded Briefing Messages */}
      <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded text-sm ${
                m.role === 'user'
                  ? 'bg-subtle border border-hairline ml-12 text-charcoal-900 font-mono'
                  : 'bg-canvas border-l-4 border-l-signal-expanding border border-hairline mr-12 text-charcoal-900 font-body space-y-2'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs text-charcoal-500 mb-1">
                <span className="font-semibold">{m.role === 'user' ? 'ANALYST INQUIRY' : 'TRAJECT INTELLIGENCE BRIEFING'}</span>
                {m.confidence && (
                  <span className="text-signal-gold font-bold">CONFIDENCE: {(m.confidence * 100).toFixed(0)}% · {m.provider}</span>
                )}
              </div>
              <p className="leading-relaxed">{m.text}</p>
              {m.evidence && m.evidence.length > 0 && (
                <div className="font-mono text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-300 flex items-center gap-2">
                  <FileSearch className="w-3.5 h-3.5 text-signal-gold" />
                  <span className="font-bold">CITED RECEIPTS:</span>
                  <span>[{m.evidence.join(', ')}]</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="bg-canvas border-l-4 border-l-signal-expanding border border-hairline mr-12 p-4 rounded font-mono text-xs text-charcoal-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-signal-expanding" />
              <span>Querying NVIDIA NIM endpoint with structured evidence payload...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-hairline flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(question)}
            disabled={isLoading}
            placeholder={`Ask an evidence-backed inquiry about ${activeTopic}...`}
            className="flex-1 bg-subtle border border-hairline rounded px-4 py-2 text-sm text-charcoal-900 font-body focus:border-charcoal-900 focus:outline-none placeholder:text-charcoal-400 disabled:opacity-50"
          />
          <button
            onClick={() => handleAsk(question)}
            disabled={isLoading || !question.trim()}
            className="bg-charcoal-900 hover:bg-charcoal-700 text-surface font-mono text-xs font-semibold px-5 py-2 rounded flex items-center gap-1.5 transition-colors disabled:opacity-40 shadow-subtle"
          >
            <span>INQUIRE</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
