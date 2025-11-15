'use client';

import { useState } from 'react';
import { Mail, Send, Sparkles, Loader2, AlertCircle, CheckCircle2, Clock, FileText, Copy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Classification {
  category: string;
  categoryLabel: string;
  categoryColor: string;
  priority: string;
  priorityLabel: string;
  sentiment: string;
  sentimentLabel: string;
}

interface AnalysisResult {
  original: string;
  classification: Classification;
  summary: string;
  keyPoints: string[];
  draftReply: string;
  metadata: {
    timestamp: string;
    processingTime: string;
    model: string;
  };
}

export default function EmailClassifier() {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!emailText.trim()) {
      setError('Please enter email content');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/email-classifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'potential_customer':
        return <Sparkles className="w-5 h-5" />;
      case 'technical_support':
        return <AlertCircle className="w-5 h-5" />;
      case 'spam':
        return <AlertCircle className="w-5 h-5" />;
      case 'invoice':
        return <FileText className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'text-green-600',
      neutral: 'text-gray-600',
      negative: 'text-red-600',
    };
    return colors[sentiment as keyof typeof colors] || 'text-gray-600';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Email Classifier
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Automatically classify, analyze, and draft email responses
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <Send className="w-6 h-6 text-blue-600" />
              Enter Email/Message
            </h2>

            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email content or contact form message here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all text-gray-900 placeholder:text-gray-400"
              rows={12}
              disabled={loading}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !emailText.trim()}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Email
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Classification */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Classification</h3>
                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${getCategoryColor(result.classification.categoryColor)}`}>
                      {getCategoryIcon(result.classification.category)}
                      {result.classification.categoryLabel}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-5 h-5 ${getPriorityColor(result.classification.priority)}`} />
                      <span className="font-medium">Priority:</span>
                      <span className={`font-semibold ${getPriorityColor(result.classification.priority)}`}>
                        {result.classification.priorityLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 flex items-center justify-center font-bold ${getSentimentColor(result.classification.sentiment)}`}>
                        {result.classification.sentiment === 'positive' ? '😊' : result.classification.sentiment === 'negative' ? '😟' : '😐'}
                      </span>
                      <span className="font-medium">Sentiment:</span>
                      <span className={`font-semibold ${getSentimentColor(result.classification.sentiment)}`}>
                        {result.classification.sentimentLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                  
                  {result.keyPoints.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-gray-800 mb-2">Key Points:</p>
                      <ul className="space-y-2">
                        {result.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Draft Reply */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    Draft Reply
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                      {result.draftReply}
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.draftReply)}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </>
                    )}
                  </button>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Processing Time: {result.metadata.processingTime}</span>
                    <span>Model: {result.metadata.model}</span>
                  </div>
                </div>
              </>
            )}

            {!result && !loading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter an email and click "Analyze" to see results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Demo Examples */}
        <div className="max-w-6xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Sample Examples:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Potential Customer',
                text: 'Hello, I am interested in your marketing automation services. Could you please send me a pricing quote and schedule a demo? Thank you!',
              },
              {
                title: 'Technical Support',
                text: 'Hi team, I\'m having trouble logging into the system. The screen shows "Invalid credentials" even though I reset my password. Please help.',
              },
              {
                title: 'Invoice Inquiry',
                text: 'Dear billing department, I received invoice #12345 but noticed the amount seems incorrect. Can you please review and send a corrected version?',
              },
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setEmailText(example.text)}
                className="text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
              >
                <p className="font-semibold text-blue-900 mb-2">{example.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{example.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

