import React from 'react'
import { MessageCircle, Moon, Sun, Menu, BarChart3 } from 'lucide-react'

const Header = ({ darkMode, toggleDarkMode, onMenuClick, onAnalyticsClick }) => {
  return (
    <header className="glass border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-200" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Smart Chatbot
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">AI-Powered Assistant</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onAnalyticsClick}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-all duration-300"
              aria-label="View analytics"
            >
              <BarChart3 size={20} />
              <span className="font-medium">Analytics</span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="hidden lg:flex p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-gray-700" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
