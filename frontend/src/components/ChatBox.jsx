import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, Sparkles, User } from 'lucide-react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all hover:bg-white/10"
      style={{ color: copied ? '#4ade80' : 'var(--t3)' }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ language, children }) {
  const code = String(children).replace(/\n$/, '')
  return (
    <div className="my-3 rounded-xl overflow-hidden" style={{ border: '1px solid var(--s4)', background: 'var(--s0)' }}>
      <div className="code-header">
        <span className="font-mono text-[11px]" style={{ color: 'var(--a1)' }}>
          {language || 'code'}
        </span>
        <CopyButton text={code} />
      </div>
      <div className="code-body">
        <pre className="m-0" style={{ color: '#e2e8f0', fontFamily: "'Space Mono', monospace", fontSize: '0.82rem', lineHeight: 1.6 }}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    if (!inline && match) {
      return <CodeBlock language={match[1]}>{children}</CodeBlock>
    }
    return (
      <code
        className="rounded px-1.5 py-0.5 text-[0.82em] font-mono"
        style={{ background: 'var(--s3)', color: 'var(--a1)', border: '1px solid var(--s5)' }}
        {...props}
      >
        {children}
      </code>
    )
  },
  // Inline code without language
  pre({ children }) { return <>{children}</> },
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-start gap-3 mb-5"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'var(--ag)', boxShadow: '0 0 16px var(--ag-glow)' }}
      >
        <Sparkles size={14} className="text-white" />
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: 'var(--s2)', border: '1px solid var(--glass-border)' }}
      >
        <div className="dot1" />
        <div className="dot2" />
        <div className="dot3" />
      </div>
    </motion.div>
  )
}

function Message({ msg, isLatest }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 mb-5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser ? 'var(--s3)' : 'var(--ag)',
          boxShadow: isUser ? 'none' : '0 0 16px var(--ag-glow)',
          border: isUser ? '1px solid var(--s5)' : 'none',
        }}
      >
        {isUser
          ? <User size={14} style={{ color: 'var(--t2)' }} />
          : <Sparkles size={14} className="text-white" />
        }
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] group relative ${isUser ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
          style={isUser
            ? { background: 'var(--ag)', color: 'white' }
            : { background: 'var(--s2)', border: '1px solid var(--glass-border)' }
          }
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'white' }}>
              {msg.content}
            </p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy whole message */}
        {!isUser && (
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={msg.content} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function ChatBox({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5"
            style={{ boxShadow: 'var(--shadow-glow)' }}
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--t1)' }}>
            Ready to explore
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--t3)' }}>
            Ask anything — Chemini remembers your full conversation context
            to give you smarter, more relevant answers.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-6 text-left">
            {[
              'Explain quantum entanglement simply',
              'Write a Python async web scraper',
              'Compare microservices vs monolith',
              'Help me debug this React hook',
            ].map(s => (
              <div
                key={s}
                className="px-3 py-2.5 rounded-xl text-xs cursor-default leading-snug"
                style={{
                  background: 'var(--s2)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--t2)',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-6 pb-2" style={{ scrollBehavior: 'smooth' }}>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <Message
              key={msg._id || i}
              msg={msg}
              isLatest={i === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <TypingIndicator key="typing" />}
        </AnimatePresence>

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  )
}
