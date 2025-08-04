export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-sm text-gray-600 mb-2">
          Built with 🧡 using{' '}
          <a 
            href="https://developers.cloudflare.com/agents" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Cloudflare Agents
          </a>
          {' && '}
          <a 
            href="https://platform.openai.com/docs/guides/conversation-state?api-mode=responses#manually-manage-conversation-state" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            OpenAI Responses API
          </a>
        </div>
        <div className="text-xs text-gray-500">
          👀{' '}
          <a 
            href="https://github.com/craigsdennis/agents-chat-history" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            the code
          </a>
        </div>
      </div>
    </footer>
  )
}