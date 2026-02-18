import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Analytics from './components/Analytics'
import SuggestedQuestions from './components/SuggestedQuestions'
import { Moon, Sun } from 'lucide-react'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  
  const [showSidebar, setShowSidebar] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        
        {/* Header */}
        <Header 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onMenuClick={() => setShowSidebar(!showSidebar)}
          onAnalyticsClick={() => setShowAnalytics(!showAnalytics)}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar */}
            <div className={`lg:col-span-3 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
              <Sidebar 
                sessionId={sessionId}
                darkMode={darkMode}
              />
            </div>

            {/* Chat Interface */}
            <div className={`${showAnalytics ? 'lg:col-span-9' : 'lg:col-span-6'}`}>
              <ChatInterface 
                sessionId={sessionId}
                setSessionId={setSessionId}
                darkMode={darkMode}
              />
            </div>

            {/* Suggested Questions Panel */}
            {!showAnalytics && (
              <div className="lg:col-span-3 hidden lg:block">
                <SuggestedQuestions darkMode={darkMode} />
              </div>
            )}
          </div>

          {/* Analytics Modal */}
          {showAnalytics && sessionId && (
            <Analytics 
              sessionId={sessionId}
              onClose={() => setShowAnalytics(false)}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Dark Mode Toggle Floating Button (Mobile) */}
        <button
          onClick={toggleDarkMode}
          className="fixed bottom-6 right-6 lg:hidden p-4 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </div>
  )
}

export default App
