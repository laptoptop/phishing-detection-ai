'use client';

import { useState } from 'react';
import { FileText, Sparkles, Loader2, AlertCircle, CheckCircle2, Database, Copy, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

interface ExtractionResult {
  original: string;
  type: string;
  typeLabel: string;
  confidence: string;
  confidenceColor: string;
  extracted: Record<string, any>;
  rawFields: Record<string, any>;
  statistics: {
    fieldsExtracted: number;
    totalFieldsFound: number;
    textLength: number;
    extractionRate: number;
  };
  metadata: {
    timestamp: string;
    processingTime: string;
    model: string;
  };
}

export default function DataExtractor() {
  const [textContent, setTextContent] = useState('');
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!textContent.trim()) {
      setError('Please enter text content to extract');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/data-extractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'business_card': return '👤';
      case 'invoice': return '📄';
      case 'email_signature': return '✉️';
      case 'address': return '📍';
      case 'receipt': return '🧾';
      case 'contact_info': return '📞';
      default: return '📋';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.extracted, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFieldName = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
            <Database className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Data Extractor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Extract structured data from unstructured text automatically
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Input Text
            </h2>

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste any text content here: business cards, invoices, receipts, email signatures, addresses, contact info..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none transition-all text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              rows={14}
              disabled={loading}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleExtract}
              disabled={loading || !textContent.trim()}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Extract Data
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Type & Confidence */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Detection Results</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(result.type)}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{result.typeLabel}</p>
                        <p className="text-sm text-gray-500">Data Type Detected</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Confidence:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(result.confidenceColor)}`}>
                        {result.confidence.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-purple-600">{result.statistics.fieldsExtracted}</p>
                      <p className="text-sm text-gray-600">Fields Extracted</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-blue-600">{result.statistics.extractionRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>
                </div>

                {/* Extracted Data */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      Extracted Data
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(result.extracted, null, 2))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy JSON"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={downloadJSON}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Download JSON"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {Object.keys(result.extracted).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(result.extracted).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700">{formatFieldName(key)}</p>
                            <p className="text-gray-900 font-medium break-words">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No fields extracted</p>
                  )}
                </div>

                {/* JSON Preview */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">JSON Output</h3>
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono">
                      {JSON.stringify(result.extracted, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Processing: {result.metadata.processingTime}</span>
                    <span>Model: {result.metadata.model}</span>
                  </div>
                </div>
              </>
            )}

            {!result && !loading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter text content and click "Extract Data" to see results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sample Examples */}
        <div className="max-w-6xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Sample Examples:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Business Card',
                icon: '👤',
                text: 'John Doe\nCEO & Founder\nABC Corporation\njohn.doe@abccorp.com\n+1 (555) 123-4567\n123 Business St, San Francisco, CA 94102\nwww.abccorp.com',
              },
              {
                title: 'Invoice',
                icon: '📄',
                text: 'INVOICE #INV-2024-001\nDate: January 15, 2024\nDue Date: February 15, 2024\n\nBill To: Acme Corp\n\nItems:\n- Web Development Service: $5,000\n- Design Consultation: $2,000\n- Hosting (Annual): $500\n\nTotal: $7,500',
              },
              {
                title: 'Contact Info',
                icon: '📞',
                text: 'Sarah Johnson\nMarketing Director at TechStart Inc.\nEmail: s.johnson@techstart.io\nPhone: (555) 987-6543\nLinkedIn: linkedin.com/in/sarahjohnson',
              },
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setTextContent(example.text)}
                className="text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{example.icon}</span>
                  <p className="font-semibold text-purple-900">{example.title}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{example.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
