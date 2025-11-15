export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About This Project</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Next.js 14 with App Router</li>
            <li>• Tailwind CSS for styling</li>
            <li>• n8n for workflow orchestration</li>
            <li>• LLM (DeepSeek R1) for AI responses</li>
            <li>• PostgreSQL for data storage</li>
            <li>• Cloudflare Tunnel for secure access</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
