import React, { useState, useEffect, useRef } from 'react'
import { Send, RotateCcw, Trash2, Download, User, Bot as BotIcon } from 'lucide-react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { sendMessage, createSession, clearHistory, getHistory } from '../services/api'

const ChatInterface = ({ sessionId, setSessionId, darkMode }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    initializeSession()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    // Listen for suggested question clicks
    const handleSuggestedQuestion = (event) => {
      setInputMessage(event.detail)
      // Auto-focus input
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    window.addEventListener('suggestedQuestion', handleSuggestedQuestion)
    return () => window.removeEventListener('suggestedQuestion', handleSuggestedQuestion)
  }, [])

  const initializeSession = async () => {
    try {
      const data = await createSession()
      setSessionId(data.session_id)
      
      // Add welcome message
      setMessages([{
        id: Date.now(),
        message: "Hello! 👋 I'm your AI assistant. How can I help you today?",
        is_user: false,
        timestamp: new Date().toISOString(),
        intent: 'greeting',
        sentiment: 'positive'
      }])
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Add user message to UI
    const userMsg = {
      id: Date.now(),
      message: userMessage,
      is_user: true,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMsg])

    // Show typing indicator
    setIsTyping(true)

    try {
      // Send to API
      const response = await sendMessage(userMessage, sessionId)
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Add bot response
      const botMsg = {
        id: Date.now() + 1,
        message: response.response,
        is_user: false,
        timestamp: response.timestamp,
        intent: response.intent,
        sentiment: response.sentiment,
        confidence: response.confidence
      }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Add error message
      const errorMsg = {
        id: Date.now() + 1,
        message: "Sorry, I'm having trouble connecting. Please try again.",
        is_user: false,
        timestamp: new Date().toISOString(),
        intent: 'error',
        sentiment: 'negative'
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      try {
        if (sessionId) {
          await clearHistory(sessionId)
        }
        setMessages([{
          id: Date.now(),
          message: "Chat cleared! How can I help you?",
          is_user: false,
          timestamp: new Date().toISOString(),
          intent: 'system',
          sentiment: 'neutral'
        }])
      } catch (error) {
        console.error('Failed to clear chat:', error)
      }
    }
  }

  const handleResetSession = async () => {
    if (window.confirm('Start a new conversation? This will create a new session.')) {
      await initializeSession()
    }
  }

  const handleDownloadChat = () => {
    const chatText = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.is_user ? 'You' : 'Bot'}: ${msg.message}`
    ).join('\n\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const suggestedQueries = [
    "What can you help me with?",
    "Tell me about your products",
    "What are your business hours?",
    "I need technical support"
  ]

  const handleSuggestedQuery = (query) => {
    setInputMessage(query)
    inputRef.current?.focus()
  }

  return (
    <div className="glass rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse-slow">
              <BotIcon size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Assistant</h2>
              <p className="text-xs opacity-90">Online • Typically replies instantly</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Download chat history"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={handleResetSession}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="New conversation"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-white/50 dark:bg-gray-900/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 animate-bounce-slow">
              <BotIcon className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              I'm here to help! Ask me anything or try one of the suggestions below.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} darkMode={darkMode} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries (shown when chat is empty) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try asking:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(query)}
                className="text-left p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all outline-none"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {inputMessage.length}/1000
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <Send size={20} />
          </button>
        </form>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send • Powered by rule-based AI
        </p>
      </div>
    </div>
  )
}

export default ChatInterface
