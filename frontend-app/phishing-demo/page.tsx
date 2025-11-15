'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AnalysisResult {
  verdict: {
    is_phishing: boolean;
    confidence: string;
    phishing_score_percent: string;
  };
  ml_analysis: {
    prediction_class: 'PHISHING' | 'SUSPICIOUS' | 'LEGITIMATE';
  };
  ai_explanation: string;
  recommendations: string[];
}

export default function PhishingDemo() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('https://n8n.ridox.dev/webhook/phishing-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email_content: email })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (predictionClass: string) => {
    switch(predictionClass) {
      case 'PHISHING':
        return {
          icon: '⚠️',
          text: 'THREAT DETECTED',
          color: 'red',
          bgGradient: 'from-red-900/40 to-red-800/20',
          borderColor: 'border-red-500',
          textColor: 'text-red-400'
        };
      case 'SUSPICIOUS':
        return {
          icon: '⚡',
          text: 'CAUTION ADVISED',
          color: 'yellow',
          bgGradient: 'from-yellow-900/40 to-orange-800/20',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-400'
        };
      default:
        return {
          icon: '✅',
          text: 'SAFE',
          color: 'green',
          bgGradient: 'from-green-900/40 to-green-800/20',
          borderColor: 'border-green-500',
          textColor: 'text-green-400'
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#0a1f1f] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-teal-800/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg">Blue Team</div>
              <div className="text-lime-400 text-xs">AI API Library</div>
            </div>
          </div>
          <Link href="/" className="text-teal-400 text-sm hover:text-teal-300">← Back</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-sm mb-6">
            Email Security Analysis
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
            Introducing<br/>
            <span className="text-lime-400">Phishing Detection</span><br/>
            API
          </h1>
          <p className="text-teal-300 text-lg">
            Hybrid ML + AI Agent • Local LLM • Zero API Costs
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 border border-teal-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-lime-500/20 flex items-center justify-center text-lime-400">
                🔍
              </span>
              Analyze Threat
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-teal-300 text-sm font-semibold mb-2">
                  URL or Link *
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') analyze();
                  }}
                  placeholder="http://suspicious-website.com"
                  className="w-full px-4 py-3 bg-teal-950/60 border border-teal-700 rounded-lg text-white placeholder-teal-500 focus:outline-none focus:border-lime-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-teal-300 text-sm font-semibold mb-2">
                  Email Content
                </label>
                <textarea
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Paste email content..."
                  rows={4}
                  className="w-full px-4 py-3 bg-teal-950/60 border border-teal-700 rounded-lg text-white placeholder-teal-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={analyze}
                disabled={loading || !url.trim()}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  loading || !url.trim()
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-lime-500 to-green-600 text-black hover:from-lime-400 hover:to-green-500 shadow-lg'
                }`}
              >
                {loading ? '⚡ Analyzing...' : '🔍 Analyze with AI'}
              </button>

              {/* Quick Tests */}
              <div className="pt-6 border-t border-teal-700/50">
                <div className="text-teal-400 text-sm font-semibold mb-3">Quick Test:</div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setUrl('http://paypa1-secure.xyz/login');
                      setEmail('URGENT: Account suspended!');
                    }}
                    className="w-full text-left px-4 py-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 hover:bg-red-900/30 transition-colors text-sm"
                  >
                    ⚠️ Phishing: paypa1-secure.xyz
                  </button>
                  <button
                    onClick={() => {
                      setUrl('https://www.paypal.com/signin');
                      setEmail('Thank you for your purchase');
                    }}
                    className="w-full text-left px-4 py-3 bg-green-900/20 border border-green-700/50 rounded-lg text-green-300 hover:bg-green-900/30 transition-colors text-sm"
                  >
                    ✅ Safe: paypal.com
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Verdict */}
                {(() => {
                  const status = getStatusDisplay(result.ml_analysis.prediction_class);
                  return (
                    <div className={`rounded-2xl p-8 border-2 bg-gradient-to-br ${status.bgGradient} ${status.borderColor}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">{status.icon}</div>
                        <div>
                          <div className={`text-3xl font-bold ${status.textColor}`}>
                            {status.text}
                          </div>
                          <div className="text-teal-300">Score: {result.verdict.phishing_score_percent}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/30 rounded-lg p-3 border border-teal-700/30">
                          <div className="text-xs text-teal-400">Status</div>
                          <div className="text-sm font-semibold text-white">{result.ml_analysis.prediction_class}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3 border border-teal-700/30">
                          <div className="text-xs text-teal-400">Score</div>
                          <div className="text-sm font-semibold text-white">{result.verdict.phishing_score_percent}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3 border border-teal-700/30">
                          <div className="text-xs text-teal-400">Level</div>
                          <div className="text-sm font-semibold text-white">{result.verdict.confidence}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* AI Analysis */}
                <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 border border-teal-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">🤖</span> AI Analysis
                  </h3>
                  <pre className="text-sm text-teal-100 whitespace-pre-wrap font-sans leading-relaxed">
                    {result.ai_explanation}
                  </pre>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 border border-teal-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4">📋 Actions</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-teal-200 bg-teal-950/40 p-3 rounded-lg border border-teal-800/50">
                        <span className="text-lime-400">▸</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex items-center justify-center bg-gradient-to-br from-teal-900/20 to-teal-800/10 border border-teal-700/30 rounded-2xl p-12">
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-50">🔍</div>
                  <div className="text-teal-400">Enter a URL to begin analysis</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-teal-800/30 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-teal-500 text-sm">
          🔒 100% Local Processing • Zero External API Calls • Privacy-First Architecture
        </div>
      </div>
    </main>
  );
}
