"""
Database Models for Conversation History
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Conversation(Base):
    """Conversation session model"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class Message(Base):
    """Message model for chat history"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), index=True, nullable=False)
    message = Column(Text, nullable=False)
    is_user = Column(Boolean, nullable=False)
    intent = Column(String(100), nullable=True)
    sentiment = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class Analytics(Base):
    """Analytics model for tracking chatbot usage"""
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), index=True)
    intent = Column(String(100), nullable=True)
    matched_pattern = Column(Text, nullable=True)
    response_time_ms = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
