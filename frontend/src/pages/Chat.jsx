import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Sparkles, MoreHorizontal, ChevronLeft } from 'lucide-react'
import API from '../utils/api.js'
import Sidebar from '../components/Sidebar.jsx'
import ChatBox from '../components/ChatBox.jsx'
import ChatInput from '../components/ChatInput.jsx'

export default function Chat() {
  // ── State (mirrors original Chat.jsx exactly) ──
  const [chats, setChats] = useState([])
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const navigate = useNavigate()

  // ── Original logic preserved ──
  useEffect(() => { loadChats() }, [])

  const loadChats = async () => {
    try {
      const res = await API.get('/api/chat')
      setChats(res.data)
    } catch {
      navigate('/login')
    }
  }

  const newChat = async () => {
    const res = await API.post('/api/chat/new')
    setCurrent(res.data)
    loadChats()
    setMobileSidebar(false)
  }

  // ── sendMessage — same API call, with loading state ──
  const sendMessage = async (input) => {
    if (!input || !current) return
    setLoading(true)

    // Optimistically add user message to UI
    const optimistic = { role: 'user', content: input, _id: 'opt-' + Date.now() }
    setCurrent(prev => ({
      ...prev,
      messages: [...(prev.messages || []), optimistic]
    }))

    try {
      const res = await API.post('/api/chat', {
        chatId: current._id,
        message: input,
      })
      // Server returns updated chat with AI reply
      setCurrent(res.data.chat)
      // Refresh sidebar list
      setChats(prev =>
        prev.map(c => c._id === res.data.chat._id ? res.data.chat : c)
      )
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const chatTitle = current?.title || 'New conversation'
  const msgCount = current?.messages?.length || 0

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--s0)' }}>

      {/* ── Desktop sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'var(--sidebar-w)', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="hidden md:block flex-shrink-0 overflow-hidden"
            style={{ height: '100vh' }}
          >
            <Sidebar
              chats={chats}
              current={current}
              setCurrent={c => { setCurrent(c); setMobileSidebar(false) }}
              newChat={newChat}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              key="mob-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              key="mob-sidebar"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
              style={{ width: 'var(--sidebar-w)' }}
            >
              <Sidebar
                chats={chats}
                current={current}
                setCurrent={c => { setCurrent(c); setMobileSidebar(false) }}
                newChat={newChat}
                onClose={() => setMobileSidebar(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
          style={{
            background: 'var(--s1)',
            borderColor: 'var(--glass-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Sidebar toggle */}
          {!sidebarOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSidebarOpen(true)}
              className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center transition-all hover:bg-white/5"
              style={{ color: 'var(--t3)' }}
            >
              <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </motion.button>
          )}
          <button
            onClick={() => setMobileSidebar(true)}
            className="flex md:hidden w-8 h-8 rounded-lg items-center justify-center"
            style={{ color: 'var(--t3)' }}
          >
            <Menu size={17} />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            {current ? (
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold truncate" style={{ color: 'var(--t1)' }}>
                  {chatTitle}
                </h1>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: 'var(--s3)', color: 'var(--t3)' }}
                >
                  {msgCount} msg{msgCount !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center"
                  style={{ boxShadow: '0 0 10px var(--ag-glow)' }}
                >
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--t2)' }}>
                  Chemini AI
                </span>
              </div>
            )}
          </div>

          {/* Right actions */}
          {current && (
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
              style={{ color: 'var(--t3)' }}
            >
              <MoreHorizontal size={17} />
            </button>
          )}
        </div>

        {/* No chat selected */}
        {!current ? (
          <div className="flex-1 flex items-center justify-center page-enter">
            <div className="text-center max-w-md px-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6"
                style={{ boxShadow: 'var(--shadow-glow)' }}
              >
                <Sparkles size={34} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--t1)' }}>
                Welcome to <span className="gradient-text">Chemini AI</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--t3)' }}>
                Select a conversation from the sidebar or start a fresh one.
                Chemini maintains full context across your entire conversation.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={newChat}
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'var(--ag)', boxShadow: 'var(--shadow-glow)' }}
              >
                Start a new conversation
              </motion.button>
            </div>
          </div>
        ) : (
          /* Chat view */
          <div className="flex-1 flex flex-col min-h-0 page-enter">
            <ChatBox messages={current?.messages || []} loading={loading} />
            <ChatInput
              onSend={sendMessage}
              loading={loading}
              disabled={!current}
            />
          </div>
        )}
      </div>
    </div>
  )
}
