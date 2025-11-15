'use client';

import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse(data.data.response || JSON.stringify(data.data));
      } else {
        setResponse('Error: ' + data.error);
      }
    } catch (error) {
      setResponse('Error: Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Demo Reel
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Powered by n8n + LLM + Next.js
          </p>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              AI Chat Assistant
            </h2>

            {/* Response Area */}
            {response && (
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <p className="text-sm text-purple-600 font-semibold mb-2">Response:</p>
                <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none transition-all text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-normal bg-white"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                This demo connects to n8n workflow → LLM API
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Powered</h3>
              <p className="text-gray-900 text-sm">
                Using state-of-the-art LLM models for intelligent responses
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast & Efficient</h3>
              <p className="text-gray-900 text-sm">
                Optimized workflow orchestration with n8n automation
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
              <p className="text-gray-900 text-sm">
                Enterprise-grade infrastructure with data protection
              </p>
            </div>
          </div>
	¨{/* Demo Links Section - ADD THIS */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-3 text-gray-800">
                🎯 Try Our AI Demos
              </h3>
              <p className="text-gray-600">
                Experience the power of AI automation in action
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Demo 1 */}
              <Link 
                href="/email-classifier"
                className="group bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                    ✉️
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Email Classifier
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Automatically classify, analyze, and draft professional email responses
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Auto-classify
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Smart replies
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Priority detection
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                    Try Demo →
                  </div>
                </div>
              </Link>

              {/* Demo 2 */}
              <Link 
                href="/data-extractor"
                className="group bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Data Extractor
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Extract structured data from unstructured text like invoices and business cards
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Auto-extract
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        JSON output
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Multi-format
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold group-hover:from-purple-700 group-hover:to-blue-700 transition-all">
                    Try Demo →
                  </div>
                </div>
              </Link>
	      {/* Demo 3 - NEW */}	
             <Link 
    href="/document-qa"
    className="group bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-all shadow-lg hover:shadow-xl"
  >
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
        📚
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">
          Document Q&A
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          Ask questions and get answers from company documents using RAG technology
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            RAG System
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            Smart Search
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Instant Answers
          </span>
        </div>
      </div>
      <div className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold group-hover:from-indigo-700 group-hover:to-purple-700 transition-all">
        Try Demo →
      </div>
    </div>
  </Link>
            </div>
          </div>	
        </div>
      </div>
    </main>
  );
}
