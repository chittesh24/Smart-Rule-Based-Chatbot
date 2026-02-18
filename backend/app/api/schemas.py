"""
API Request and Response Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ChatRequest(BaseModel):
    """Request schema for chat endpoint"""
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    session_id: Optional[str] = Field(None, description="Session ID for conversation tracking")


class ChatResponse(BaseModel):
    """Response schema for chat endpoint"""
    response: str = Field(..., description="Bot response")
    session_id: str = Field(..., description="Session ID")
    intent: Optional[str] = Field(None, description="Detected intent")
    sentiment: Optional[str] = Field(None, description="Detected sentiment")
    confidence: float = Field(..., description="Response confidence score")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SessionCreate(BaseModel):
    """Schema for creating a new session"""
    pass


class SessionResponse(BaseModel):
    """Response schema for session creation"""
    session_id: str = Field(..., description="Unique session identifier")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MessageHistory(BaseModel):
    """Schema for a single message in history"""
    id: int
    message: str
    is_user: bool
    intent: Optional[str]
    sentiment: Optional[str]
    timestamp: str


class ConversationHistoryResponse(BaseModel):
    """Response schema for conversation history"""
    session_id: str
    messages: List[MessageHistory]
    total_messages: int


class AnalyticsResponse(BaseModel):
    """Response schema for analytics data"""
    session_id: str
    total_interactions: int
    avg_response_time_ms: float
    intent_distribution: Dict[str, int]


class IntentsResponse(BaseModel):
    """Response schema for available intents"""
    intents: List[str]
    total: int


class HealthResponse(BaseModel):
    """Response schema for health check"""
    status: str
    version: str
    uptime: float
    database: str
    rules_loaded: int
