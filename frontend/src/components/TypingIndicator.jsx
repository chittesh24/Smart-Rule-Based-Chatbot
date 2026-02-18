import React from 'react'
import { Bot } from 'lucide-react'

const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex items-end space-x-2 max-w-xs">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot className="text-white" size={16} />
        </div>

        {/* Typing Bubble */}
        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="typing-indicator flex space-x-1">
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
