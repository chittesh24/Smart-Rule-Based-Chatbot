"""
Rule-Based Chatbot Engine
Implements pattern matching, intent classification, and response generation
"""
import re
import yaml
import random
import logging
from typing import Dict, List, Optional, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)


class RuleEngine:
    """
    Core rule-based engine for chatbot responses
    Uses regex pattern matching and intent classification
    """
    
    def __init__(self, rules_file: str):
        """
        Initialize the rule engine with a YAML rules file
        
        Args:
            rules_file: Path to the YAML rules configuration file
        """
        self.rules_file = rules_file
        self.intents: List[Dict] = []
        self.fallback_responses: List[str] = []
        self.sentiment_modifiers: Dict[str, str] = {}
        self.load_rules()
    
    def load_rules(self):
        """Load rules from YAML configuration file"""
        try:
            rules_path = Path(self.rules_file)
            if not rules_path.exists():
                logger.error(f"Rules file not found: {self.rules_file}")
                self._load_default_rules()
                return
            
            with open(rules_path, 'r', encoding='utf-8') as file:
                rules = yaml.safe_load(file)
                
            self.intents = rules.get('intents', [])
            self.fallback_responses = rules.get('fallback_responses', [])
            self.sentiment_modifiers = rules.get('sentiment_modifiers', {})
            
            logger.info(f"Loaded {len(self.intents)} intents from rules file")
            
        except Exception as e:
            logger.error(f"Error loading rules: {e}")
            self._load_default_rules()
    
    def _load_default_rules(self):
        """Load minimal default rules if file loading fails"""
        self.intents = [
            {
                'intent': 'greeting',
                'patterns': [r'\b(hi|hello|hey)\b'],
                'responses': ['Hello! How can I help you?'],
                'sentiment': 'positive'
            }
        ]
        self.fallback_responses = ["I'm not sure I understand. Can you rephrase that?"]
        self.sentiment_modifiers = {'positive': '😊', 'neutral': '👍'}
    
    def preprocess_message(self, message: str) -> str:
        """
        Preprocess user message for pattern matching
        
        Args:
            message: Raw user input
            
        Returns:
            Processed message (lowercase, stripped)
        """
        if not message:
            return ""
        return message.strip().lower()
    
    def match_intent(self, message: str) -> Tuple[Optional[Dict], Optional[str]]:
        """
        Match user message against defined intent patterns
        
        Args:
            message: Preprocessed user message
            
        Returns:
            Tuple of (matched_intent, matched_pattern) or (None, None)
        """
        for intent in self.intents:
            patterns = intent.get('patterns', [])
            for pattern in patterns:
                try:
                    if re.search(pattern, message, re.IGNORECASE):
                        logger.debug(f"Matched intent: {intent.get('intent')} with pattern: {pattern}")
                        return intent, pattern
                except re.error as e:
                    logger.error(f"Invalid regex pattern '{pattern}': {e}")
                    continue
        
        return None, None
    
    def get_response(self, intent: Dict) -> str:
        """
        Get a random response from the matched intent
        
        Args:
            intent: Matched intent dictionary
            
        Returns:
            Random response from intent's responses
        """
        responses = intent.get('responses', [])
        if not responses:
            return random.choice(self.fallback_responses)
        
        return random.choice(responses)
    
    def get_fallback_response(self) -> str:
        """
        Get a fallback response for unmatched queries
        
        Returns:
            Random fallback response
        """
        if not self.fallback_responses:
            return "I'm not sure how to respond to that."
        return random.choice(self.fallback_responses)
    
    def analyze_sentiment(self, message: str) -> str:
        """
        Basic sentiment analysis based on keywords
        
        Args:
            message: User message
            
        Returns:
            Sentiment category ('positive', 'negative', 'neutral')
        """
        positive_keywords = ['good', 'great', 'excellent', 'happy', 'love', 'awesome', 'wonderful', 'fantastic']
        negative_keywords = ['bad', 'terrible', 'hate', 'awful', 'poor', 'sad', 'angry', 'frustrated']
        
        message_lower = message.lower()
        
        positive_count = sum(1 for word in positive_keywords if word in message_lower)
        negative_count = sum(1 for word in negative_keywords if word in message_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def process_message(self, message: str) -> Dict:
        """
        Main processing pipeline for user messages
        
        Args:
            message: Raw user message
            
        Returns:
            Dictionary containing response, intent, sentiment, etc.
        """
        # Preprocess message
        processed_msg = self.preprocess_message(message)
        
        if not processed_msg:
            return {
                'response': 'Please say something! 😊',
                'intent': None,
                'sentiment': 'neutral',
                'matched_pattern': None,
                'confidence': 0.0
            }
        
        # Match intent
        matched_intent, matched_pattern = self.match_intent(processed_msg)
        
        # Generate response
        if matched_intent:
            response = self.get_response(matched_intent)
            intent_name = matched_intent.get('intent', 'unknown')
            sentiment = matched_intent.get('sentiment', 'neutral')
            confidence = 0.95  # High confidence for direct pattern match
        else:
            response = self.get_fallback_response()
            intent_name = 'fallback'
            sentiment = self.analyze_sentiment(processed_msg)
            confidence = 0.3  # Low confidence for fallback
        
        return {
            'response': response,
            'intent': intent_name,
            'sentiment': sentiment,
            'matched_pattern': matched_pattern,
            'confidence': confidence
        }
    
    def get_available_intents(self) -> List[str]:
        """
        Get list of all available intent names
        
        Returns:
            List of intent names
        """
        return [intent.get('intent', 'unknown') for intent in self.intents]
    
    def reload_rules(self):
        """Reload rules from file (useful for dynamic updates)"""
        logger.info("Reloading rules...")
        self.load_rules()
