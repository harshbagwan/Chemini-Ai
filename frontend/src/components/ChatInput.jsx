import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Square, Paperclip, Mic } from 'lucide-react'

export default function ChatInput({ onSend, loading, disabled }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px'
    }
  }, [value])

  const send = () => {
    const msg = value.trim()
    if (!msg || loading || disabled) return
    onSend(msg)
    setValue('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="p-4 pt-3">
      <div className="max-w-3xl mx-auto">
        {/* Input wrapper */}
        <div
          className="relative rounded-2xl transition-all duration-200"
          style={{
            background: 'var(--s2)',
            border: '1px solid var(--glass-border)',
            boxShadow: canSend ? '0 0 0 1px rgba(245,158,11,0.3), 0 0 24px rgba(245,158,11,0.1)' : 'var(--shadow-sm)',
          }}
        >
          <textarea
            ref={ref}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Message Chemini… (Shift+Enter for newline)"
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm leading-relaxed focus:outline-none disabled:opacity-50"
            style={{
              color: 'var(--t1)',
              maxHeight: 200,
              scrollbarWidth: 'thin',
            }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-3 pb-2.5 gap-2">
            <div className="flex items-center gap-1">
              {/* Hint buttons — decorative */}
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ color: 'var(--t3)' }}
                title="Attach file (coming soon)"
              >
                <Paperclip size={14} />
              </button>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ color: 'var(--t3)' }}
                title="Voice input (coming soon)"
              >
                <Mic size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Char count */}
              {value.length > 200 && (
                <span className="text-[10px]" style={{ color: value.length > 3000 ? '#f87171' : 'var(--t3)' }}>
                  {value.length}/4000
                </span>
              )}

              {/* Keyboard hint */}
              <span className="text-[10px] hidden sm:block" style={{ color: 'var(--t3)' }}>
                ↵ send · ⇧↵ newline
              </span>

              {/* Send / Stop button */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.button
                    key="stop"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--s4)', color: 'var(--t2)' }}
                    title="Cancel"
                  >
                    <Square size={13} />
                  </motion.button>
                ) : (
                  <motion.button
                    key="send"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    whileHover={canSend ? { scale: 1.05 } : {}}
                    whileTap={canSend ? { scale: 0.94 } : {}}
                    onClick={send}
                    disabled={!canSend}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: canSend ? 'var(--ag)' : 'var(--s4)',
                      color: canSend ? 'white' : 'var(--t3)',
                      boxShadow: canSend ? '0 0 16px var(--ag-glow)' : 'none',
                    }}
                  >
                    <Send size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] mt-2" style={{ color: 'var(--t3)' }}>
          Chemini may make mistakes. Powered by Gemini 2.5 Flash.
        </p>
      </div>
    </div>
  )
}
