"""
Demo Script for Rule-Based Chatbot
This script demonstrates the basic functionality of the chatbot
"""

import requests
import json
from time import sleep

# Configuration
API_BASE_URL = "http://localhost:8000/api/v1"

def print_separator():
    print("\n" + "="*60 + "\n")

def demo_chat():
    """Demonstrate chatbot conversation flow"""
    print("🤖 Rule-Based Chatbot Demo")
    print_separator()
    
    # Create a session
    print("Creating new session...")
    response = requests.post(f"{API_BASE_URL}/session")
    session_data = response.json()
    session_id = session_data['session_id']
    print(f"✓ Session created: {session_id}")
    print_separator()
    
    # Test messages
    test_messages = [
        "Hello!",
        "What are your products?",
        "Tell me about your pricing",
        "What are your business hours?",
        "Thank you!",
        "Goodbye"
    ]
    
    # Send messages
    for message in test_messages:
        print(f"👤 User: {message}")
        
        response = requests.post(
            f"{API_BASE_URL}/chat",
            json={"message": message, "session_id": session_id}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"🤖 Bot: {data['response']}")
            print(f"   Intent: {data['intent']} | Sentiment: {data['sentiment']} | Confidence: {data['confidence']:.2f}")
        else:
            print(f"❌ Error: {response.status_code}")
        
        print_separator()
        sleep(1)
    
    # Get analytics
    print("📊 Session Analytics:")
    response = requests.get(f"{API_BASE_URL}/analytics/{session_id}")
    if response.status_code == 200:
        analytics = response.json()
        print(f"Total Interactions: {analytics['total_interactions']}")
        print(f"Avg Response Time: {analytics['avg_response_time_ms']:.2f}ms")
        print(f"Intent Distribution: {analytics['intent_distribution']}")
    
    print_separator()
    print("✓ Demo completed!")

def demo_health_check():
    """Check API health"""
    print("🔍 Health Check")
    response = requests.get(f"{API_BASE_URL}/health")
    if response.status_code == 200:
        health = response.json()
        print(f"Status: {health['status']}")
        print(f"Version: {health['version']}")
        print(f"Uptime: {health['uptime']:.2f}s")
        print(f"Rules Loaded: {health['rules_loaded']}")
    else:
        print(f"❌ Health check failed: {response.status_code}")

if __name__ == "__main__":
    try:
        # Run health check first
        demo_health_check()
        print_separator()
        
        # Run demo
        demo_chat()
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to API. Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")
