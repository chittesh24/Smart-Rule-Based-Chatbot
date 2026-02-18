import React, { useState, useEffect } from 'react'
import { X, TrendingUp, MessageSquare, Clock, Target, BarChart3 } from 'lucide-react'
import { getAnalytics } from '../services/api'

const Analytics = ({ sessionId, onClose, darkMode }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [sessionId])

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics(sessionId)
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="glass rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const intentData = Object.entries(analytics.intent_distribution || {})
    .map(([intent, count]) => ({ intent, count }))
    .sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...intentData.map(d => d.count), 1)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Session Analytics</h2>
              <p className="text-sm text-white/80">Conversation insights and metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare size={24} />
                <div className="text-3xl font-bold">{analytics.total_interactions}</div>
              </div>
              <p className="text-sm opacity-90">Total Interactions</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Clock size={24} />
                <div className="text-3xl font-bold">{analytics.avg_response_time_ms.toFixed(0)}</div>
              </div>
              <p className="text-sm opacity-90">Avg Response Time (ms)</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Target size={24} />
                <div className="text-3xl font-bold">{intentData.length}</div>
              </div>
              <p className="text-sm opacity-90">Unique Intents</p>
            </div>
          </div>

          {/* Intent Distribution */}
          {intentData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="text-primary-500" size={20} />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Intent Distribution</h3>
              </div>
              
              <div className="space-y-3">
                {intentData.map(({ intent, count }) => {
                  const percentage = (count / analytics.total_interactions) * 100
                  const barWidth = (count / maxCount) * 100
                  
                  return (
                    <div key={intent}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {intent}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Session Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Session Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Session ID</p>
                <p className="text-sm font-mono text-gray-800 dark:text-white break-all">
                  {sessionId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-primary-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">💡 Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">•</span>
                <span>
                  Most common intent: <strong className="text-gray-900 dark:text-white capitalize">{intentData[0]?.intent || 'N/A'}</strong>
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">•</span>
                <span>
                  Average response time is {analytics.avg_response_time_ms < 100 ? 'excellent' : analytics.avg_response_time_ms < 500 ? 'good' : 'acceptable'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">•</span>
                <span>
                  Total of {analytics.total_interactions} messages exchanged in this session
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
