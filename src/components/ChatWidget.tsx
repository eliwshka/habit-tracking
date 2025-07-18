'use client';

import React, { useState, useRef } from 'react';

// Set your n8n webhook URL here
const N8N_WEBHOOK_URL = 'https://eliwshka.app.n8n.cloud/webhook-test/6a464397-7f9b-40a2-9186-c2f26e980103';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const appendMessage = (sender: 'user' | 'ai', text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    appendMessage('user', userMsg);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      if (!res.ok) {
        const text = await res.text();
        appendMessage('ai', `Error: ${res.status} ${res.statusText}\n${text}`);
        return;
      }
      let data;
      try {
        data = await res.json();
        console.log('n8n response:', data); // <-- Add this
        console.log('Type of response:', typeof data.response, data.response);
      } catch (jsonErr) {
        appendMessage('ai', 'Error: Invalid JSON response from server.');
        return;
      }
      let reply = data.response;
      if (typeof reply === 'string' && reply.startsWith('{')) {
        try { reply = JSON.parse(reply).text; } catch {}
      }
      appendMessage('ai', reply || 'Sorry, no reply');
    } catch (err: any) {
      appendMessage('ai', `Network or CORS error: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button to open/close chat */}
      {!open && (
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      )}
      {open && (
        <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 dark:bg-indigo-800 text-white">
            <span className="font-semibold">AI Assistant</span>
            <button
              className="text-white hover:text-gray-200 text-xl focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto text-sm" style={{ maxHeight: 260 }}>
            {messages.length === 0 && (
              <div className="text-gray-400 text-center">Ask me anything about habits, productivity, or this app!</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] break-words shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <span>➤</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 