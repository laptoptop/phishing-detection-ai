'use client';

import { useState } from 'react';
import { FileText, Send, Loader2, AlertCircle, BookOpen, MessageCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    document: string;
    category: string;
    excerpt: string;
  }>;
  documentsUsed?: string[];
  timestamp: string;
}

export default function DocumentQA() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableDocuments = [
    { name: 'Company Refund Policy', category: 'Policy', icon: '📋', color: 'blue' },
    { name: 'Employee Handbook', category: 'HR', icon: '👥', color: 'green' },
    { name: 'Technical Documentation', category: 'Tech', icon: '⚙️', color: 'purple' },
    { name: 'Sales Process Guide', category: 'Sales', icon: '💼', color: 'orange' },
  ];

  const sampleQuestions = [
    "What is the refund policy for defective products?",
    "How many vacation days do employees get?",
    "What are the API rate limits?",
    "What is the sales process for qualified leads?",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/document-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.data.answer,
          sources: data.data.sources,
          documentsUsed: data.data.documentsUsed,
          timestamp: data.data.metadata.timestamp,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(data.error || 'Failed to get answer');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Document Q&A
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Ask questions about company documents and get instant answers
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Document Library */}
          <div className="lg:col-span-1 space-y-6">
            {/* Available Documents */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Document Library
              </h3>
              <div className="space-y-3">
                {availableDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 border-${doc.color}-200 bg-${doc.color}-50`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{doc.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Try Asking
              </h3>
              <div className="space-y-2">
                {sampleQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleQuestion(question)}
                    className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm text-gray-700 transition-colors border border-indigo-200"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[700px]">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Chat with Documents</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Ask any question about the documents in the library
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No messages yet. Ask a question about the documents!
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {/* Sources */}
                      {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <p className="text-xs font-semibold mb-2 text-gray-600">
                            📚 Sources ({message.documentsUsed?.length || 0} documents):
                          </p>
                          <div className="space-y-2">
                            {message.sources.map((source, idx) => (
                              <div key={idx} className="text-xs bg-white rounded-lg p-2 border border-gray-200">
                                <p className="font-semibold text-indigo-600">{source.document}</p>
                                <p className="text-gray-600 mt-1">{source.excerpt}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs mt-2 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                        <p className="text-gray-600">Searching documents...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-100">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the documents..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
