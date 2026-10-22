'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/api';
import { IconBot, IconClose, IconSend, IconTrash } from '@/components/Icons';

const WELCOME_MESSAGE = {
  role: 'bot',
  content: 'Hello. I am **MedBot**, the clinical assistant for DoctorTracker.\n\nI can assist you with:\n• Physician and patient roster management\n• Clinical terminologies and conditions\n• System navigation and records workflow\n\nHow can I help you today?'
};

const QUICK_ACTIONS = [
  'How do I add a physician record?',
  'What clinical specialties are supported?',
  'How do I filter patient records by diagnosis?'
];

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/•/g, '•')
    .replace(/\n/g, '<br/>');
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== 'bot' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === 'bot' ? 'model' : 'user', content: m.content }));

      const { data } = await sendChatMessage({ message: msg, history });
      setMessages(m => [...m, { role: 'bot', content: data.reply }]);
    } catch (err) {
      const errorMsg = err.response?.status === 500 && !err.response?.data?.message?.includes('Gemini')
        ? 'Encountered a server error processing request.'
        : err.response?.data?.message || 'AI service temporarily unavailable.';
      setMessages(m => [...m, { role: 'bot', content: `Notice: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* FAB Button */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen(o => !o)}
        title="MedBot Clinical Assistant"
        aria-label="Open clinical AI assistant"
      >
        {open ? <IconClose size={20} /> : <IconBot size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-avatar">
              <IconBot size={17} />
            </div>
            <div className="chat-header-info">
              <h4>MedBot Assistant</h4>
              <p>Operational • Powered by Gemini AI</p>
            </div>
            <button
              onClick={() => setMessages([WELCOME_MESSAGE])}
              style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 4, padding: '4px 6px', color: 'white', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              title="Clear conversation"
            >
              <IconTrash size={13} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                <div className="chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length === 1 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(action)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '7px 10px',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder="Ask MedBot clinical assistant..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              maxLength={500}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send query"
            >
              <IconSend size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
