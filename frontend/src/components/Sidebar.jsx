import React, { useState, useEffect } from 'react'
import { Bot, Zap, Shield, Clock, Sparkles, HelpCircle, Info } from 'lucide-react'
import { getIntents } from '../services/api'

const Sidebar = ({ sessionId, darkMode }) => {
  const [intents, setIntents] = useState([])

  useEffect(() => {
    loadIntents()
  }, [])

  const loadIntents = async () => {
    try {
      const data = await getIntents()
      setIntents(data.intents)
    } catch (error) {
      console.error('Failed to load intents:', error)
    }
  }

  const features = [
    { icon: Zap, title: 'Instant Responses', desc: 'Get answers in milliseconds' },
    { icon: Shield, title: 'Privacy First', desc: 'Your conversations are secure' },
    { icon: Clock, title: '24/7 Available', desc: 'Always here to help you' },
    { icon: Sparkles, title: 'Smart Matching', desc: 'Pattern-based understanding' },
  ]

  return (
    <div className="space-y-4">
      
      {/* Welcome Card */}
      <div className="glass rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Welcome!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">How can I help?</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          I'm an AI-powered chatbot using advanced pattern matching to understand and respond to your questions. Ask me anything!
        </p>
      </div>

      {/* Features */}
      <div className="glass rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Sparkles className="mr-2 text-primary-500" size={20} />
          Features
        </h3>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <feature.icon className="text-primary-600 dark:text-primary-400" size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{feature.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Help */}
      <div className="glass rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <HelpCircle className="mr-2 text-secondary-500" size={20} />
          Quick Tips
        </h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="text-primary-500 font-bold">•</span>
            <span>Type "help" to see what I can do</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-500 font-bold">•</span>
            <span>Ask about products, pricing, or support</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-500 font-bold">•</span>
            <span>I understand natural language</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary-500 font-bold">•</span>
            <span>Clear chat anytime with the reset button</span>
          </div>
        </div>
      </div>

      {/* Session Info */}
      {sessionId && (
        <div className="glass rounded-2xl p-4 shadow-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="text-gray-500 dark:text-gray-400" size={16} />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Session ID</h4>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
            {sessionId.substring(0, 8)}...
          </p>
        </div>
      )}
    </div>
  )
}

export default Sidebar
