import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Trash2, MessageSquare, Sparkles,
  LogOut, Sun, Moon, X, ChevronLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api.js'
import { useTheme } from '../context/ThemeContext.jsx'

function timeAgo(ts) {
  const s = (Date.now() - new Date(ts).getTime()) / 1000
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

export default function Sidebar({ chats, current, setCurrent, newChat, onClose }) {
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const filtered = chats.filter(c =>
    (c.title || 'Untitled').toLowerCase().includes(query.toLowerCase())
  )

  const handleLogout = async () => {
    try { await API.post('/api/auth/logout') } catch {}
    navigate('/login')
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        width: 'var(--sidebar-w)',
        background: 'var(--s1)',
        borderRight: '1px solid var(--glass-border)',
      }}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 16px var(--ag-glow)' }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight" style={{ color: 'var(--t1)' }}>
              Chemini <span className="gradient-text">AI</span>
            </span>
          </div>
          <div className="flex gap-1">
            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 md:flex hidden"
                style={{ color: 'var(--t3)' }}
              >
                <ChevronLeft size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 md:hidden"
              style={{ color: 'var(--t3)' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* New Chat button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={newChat}
          className="w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'var(--ag)', boxShadow: '0 0 20px var(--ag-glow)' }}
        >
          <Plus size={16} />
          New conversation
        </motion.button>

        {/* Search */}
        <div className="relative mt-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--t3)' }}
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chats…"
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs transition-all"
            style={{
              background: 'var(--s2)',
              border: '1px solid var(--glass-border)',
              color: 'var(--t1)',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--a1)'}
            onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--t3)' }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: 'var(--t3)' }}>
          {query ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'Recent chats'}
        </p>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--t3)' }} />
            <p className="text-xs" style={{ color: 'var(--t3)' }}>
              {query ? 'No matches found' : 'No chats yet'}
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {filtered.map(chat => {
            const isActive = current?._id === chat._id
            const lastMsg = chat.messages?.[chat.messages.length - 1]
            return (
              <motion.div
                key={chat._id}
                layout
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrent(chat)}
                onMouseEnter={() => setDeletingId(null)}
                className="group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all"
                style={{
                  background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-bar"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                    style={{ background: 'var(--a1)' }}
                  />
                )}

                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: isActive ? 'rgba(245,158,11,0.15)' : 'var(--s3)' }}
                >
                  <MessageSquare
                    size={12}
                    style={{ color: isActive ? 'var(--a1)' : 'var(--t3)' }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: isActive ? 'var(--t1)' : 'var(--t2)' }}
                    >
                      {chat.title || 'Untitled Chat'}
                    </p>
                    <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--t3)' }}>
                      {chat.updatedAt ? timeAgo(chat.updatedAt) : ''}
                    </span>
                  </div>
                  {lastMsg && (
                    <p
                      className="text-[11px] truncate mt-0.5"
                      style={{ color: 'var(--t3)' }}
                    >
                      {lastMsg.role === 'user' ? 'You: ' : 'AI: '}
                      {lastMsg.content}
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    // Optimistic removal — you can add DELETE endpoint later
                    if (current?._id === chat._id) setCurrent(null)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md items-center justify-center transition-all hidden group-hover:flex hover:bg-red-500/10"
                  style={{ color: 'var(--t3)' }}
                >
                  <Trash2 size={11} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
            style={{ color: 'var(--t2)' }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all hover:bg-red-500/10"
            style={{ color: 'var(--t3)' }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
