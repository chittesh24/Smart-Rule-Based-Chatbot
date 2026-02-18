import React from 'react'
import { User, Bot, CheckCircle2, AlertCircle, Meh } from 'lucide-react'

const MessageBubble = ({ message, darkMode }) => {
  const { is_user, message: text, timestamp, intent, sentiment, confidence } = message

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle2 size={14} className="text-green-500" />
      case 'negative':
        return <AlertCircle size={14} className="text-red-500" />
      default:
        return <Meh size={14} className="text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence) => {
    if (!confidence) return ''
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400'
    if (confidence >= 0.5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className={`flex ${is_user ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`message-bubble flex ${is_user ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          is_user 
            ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
            : 'bg-gradient-to-br from-green-500 to-teal-500'
        } shadow-md`}>
          {is_user ? (
            <User className="text-white" size={16} />
          ) : (
            <Bot className="text-white" size={16} />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${is_user ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-md ${
            is_user
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-br-sm'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-sm border border-gray-200 dark:border-gray-700'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {text}
            </p>
          </div>

          {/* Metadata */}
          <div className={`flex items-center space-x-2 mt-1 px-2 ${
            is_user ? 'flex-row-reverse space-x-reverse' : 'flex-row'
          }`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(timestamp)}
            </span>
            
            {!is_user && intent && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {intent}
                </span>
              </>
            )}
            
            {!is_user && sentiment && (
              <>
                <span className="text-xs text-gray-400">•</span>
                {getSentimentIcon(sentiment)}
              </>
            )}
            
            {!is_user && confidence !== undefined && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
                  {Math.round(confidence * 100)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
