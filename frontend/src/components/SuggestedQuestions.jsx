import React from 'react';
import { MessageCircle, DollarSign, Info, Smile, Lightbulb } from 'lucide-react';

const SuggestedQuestions = ({ darkMode }) => {
  const questionCategories = [
    {
      title: '💬 Getting Started',
      icon: <MessageCircle className="w-4 h-4" />,
      questions: [
        'Hello! How are you?',
        'What can you do?',
        'Help me get started'
      ]
    },
    {
      title: '🛍️ Products',
      icon: <Lightbulb className="w-4 h-4" />,
      questions: [
        'What products do you sell?',
        'Show me all your products',
        'Tell me about smartphones',
        'Do you have laptops?'
      ]
    },
    {
      title: '💰 Pricing',
      icon: <DollarSign className="w-4 h-4" />,
      questions: [
        'How much is the smartphone?',
        'Show me all prices',
        "What's your cheapest product?",
        'Do you have bundle deals?'
      ]
    },
    {
      title: 'ℹ️ Information',
      icon: <Info className="w-4 h-4" />,
      questions: [
        'What are your business hours?',
        'How can I contact support?',
        'Who are you?'
      ]
    },
    {
      title: '🎉 Fun',
      icon: <Smile className="w-4 h-4" />,
      questions: [
        'Tell me a joke',
        "You're awesome!",
        'Thank you!'
      ]
    }
  ];

  const handleQuestionClick = (question) => {
    // Dispatch custom event that ChatInterface will listen for
    const event = new CustomEvent('suggestedQuestion', { detail: question });
    window.dispatchEvent(event);
  };

  return (
    <div className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-50 to-blue-50'} p-4 overflow-y-auto`}>
      <div className={`sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-50 to-blue-50'} pb-4 mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
          <MessageCircle className="w-5 h-5 text-purple-600" />
          Suggested Questions
        </h3>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Click any question to ask the chatbot
        </p>
      </div>

      <div className="space-y-6">
        {questionCategories.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <div className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {category.icon}
              <span>{category.title}</span>
            </div>
            
            <div className="space-y-2">
              {category.questions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleQuestionClick(question)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${darkMode 
                      ? 'bg-gray-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 text-gray-200 hover:text-white' 
                      : 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 text-gray-700 hover:text-white'
                    }
                    shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                  `}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-6 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-purple-200'}`}>
        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          💡 <strong>Tip:</strong> You can also type your own questions in the chat!
        </p>
      </div>
    </div>
  );
};

export default SuggestedQuestions;
