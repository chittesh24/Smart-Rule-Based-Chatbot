"""
Unit tests for Rule Engine
"""
import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.core.rule_engine import RuleEngine


@pytest.fixture
def rule_engine():
    """Create a rule engine instance with test rules"""
    rules_file = os.path.join(os.path.dirname(__file__), '../rules/chatbot_rules.yaml')
    return RuleEngine(rules_file)


def test_greeting_intent(rule_engine):
    """Test greeting intent matching"""
    messages = ["hello", "hi", "hey there", "good morning"]
    
    for msg in messages:
        result = rule_engine.process_message(msg)
        assert result['intent'] == 'greeting'
        assert result['response'] is not None
        assert result['confidence'] > 0.8


def test_farewell_intent(rule_engine):
    """Test farewell intent matching"""
    messages = ["bye", "goodbye", "see you later", "exit"]
    
    for msg in messages:
        result = rule_engine.process_message(msg)
        assert result['intent'] == 'farewell'
        assert result['response'] is not None


def test_help_intent(rule_engine):
    """Test help intent matching"""
    messages = ["help", "what can you do", "show me features"]
    
    for msg in messages:
        result = rule_engine.process_message(msg)
        assert result['intent'] == 'help'
        assert result['response'] is not None


def test_fallback_response(rule_engine):
    """Test fallback for unknown queries"""
    messages = ["asdfghjkl", "random gibberish", "xyz123"]
    
    for msg in messages:
        result = rule_engine.process_message(msg)
        assert result['intent'] == 'fallback'
        assert result['confidence'] < 0.5


def test_sentiment_analysis(rule_engine):
    """Test basic sentiment analysis"""
    positive_msg = "I love this chatbot it's great"
    negative_msg = "this is terrible and awful"
    neutral_msg = "what time is it"
    
    assert rule_engine.analyze_sentiment(positive_msg) == 'positive'
    assert rule_engine.analyze_sentiment(negative_msg) == 'negative'
    assert rule_engine.analyze_sentiment(neutral_msg) == 'neutral'


def test_preprocess_message(rule_engine):
    """Test message preprocessing"""
    assert rule_engine.preprocess_message("  HELLO  ") == "hello"
    assert rule_engine.preprocess_message("HeLLo WoRLd") == "hello world"
    assert rule_engine.preprocess_message("") == ""


def test_get_available_intents(rule_engine):
    """Test getting available intents"""
    intents = rule_engine.get_available_intents()
    assert isinstance(intents, list)
    assert len(intents) > 0
    assert 'greeting' in intents
    assert 'help' in intents


def test_confidence_scores(rule_engine):
    """Test confidence scoring"""
    # Direct match should have high confidence
    result = rule_engine.process_message("hello")
    assert result['confidence'] > 0.8
    
    # Fallback should have low confidence
    result = rule_engine.process_message("asdfghjkl")
    assert result['confidence'] < 0.5


def test_empty_message(rule_engine):
    """Test handling of empty messages"""
    result = rule_engine.process_message("")
    assert result['response'] is not None
    assert 'say something' in result['response'].lower()


def test_gratitude_intent(rule_engine):
    """Test gratitude/thanks intent"""
    messages = ["thank you", "thanks", "appreciate it"]
    
    for msg in messages:
        result = rule_engine.process_message(msg)
        assert result['intent'] == 'gratitude'


def test_pattern_matching_case_insensitive(rule_engine):
    """Test that pattern matching is case-insensitive"""
    result1 = rule_engine.process_message("HELLO")
    result2 = rule_engine.process_message("hello")
    result3 = rule_engine.process_message("HeLLo")
    
    assert result1['intent'] == result2['intent'] == result3['intent']
