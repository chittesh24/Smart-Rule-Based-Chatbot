"""
API Endpoints for Chatbot
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.rule_engine import RuleEngine
from app.core.config import settings
from app.services.conversation_service import ConversationService
from app.api.schemas import (
    ChatRequest, ChatResponse, SessionResponse, SessionCreate,
    ConversationHistoryResponse, AnalyticsResponse, IntentsResponse,
    HealthResponse
)
import time
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize rule engine (singleton)
rule_engine = RuleEngine(settings.RULES_FILE)
start_time = time.time()


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Main chat endpoint - processes user messages and returns bot responses
    
    Args:
        request: ChatRequest with message and optional session_id
        db: Database session
        
    Returns:
        ChatResponse with bot reply and metadata
    """
    try:
        start = time.time()
        
        # Create or validate session
        session_id = request.session_id
        if not session_id:
            session_id = await ConversationService.create_session(db)
        
        # Save user message
        await ConversationService.save_message(
            db=db,
            session_id=session_id,
            message=request.message,
            is_user=True
        )
        
        # Process message through rule engine
        result = rule_engine.process_message(request.message)
        
        # Save bot response
        await ConversationService.save_message(
            db=db,
            session_id=session_id,
            message=result['response'],
            is_user=False,
            intent=result['intent'],
            sentiment=result['sentiment']
        )
        
        # Save analytics
        response_time_ms = int((time.time() - start) * 1000)
        await ConversationService.save_analytics(
            db=db,
            session_id=session_id,
            intent=result['intent'],
            matched_pattern=result['matched_pattern'],
            response_time_ms=response_time_ms
        )
        
        return ChatResponse(
            response=result['response'],
            session_id=session_id,
            intent=result['intent'],
            sentiment=result['sentiment'],
            confidence=result['confidence']
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your message"
        )


@router.post("/session", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(db: AsyncSession = Depends(get_db)):
    """
    Create a new conversation session
    
    Args:
        db: Database session
        
    Returns:
        SessionResponse with new session_id
    """
    try:
        session_id = await ConversationService.create_session(db)
        return SessionResponse(session_id=session_id)
    except Exception as e:
        logger.error(f"Error creating session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create session"
        )


@router.get("/history/{session_id}", response_model=ConversationHistoryResponse)
async def get_history(
    session_id: str,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """
    Get conversation history for a session
    
    Args:
        session_id: Conversation session ID
        limit: Maximum number of messages to retrieve
        db: Database session
        
    Returns:
        ConversationHistoryResponse with message history
    """
    try:
        messages = await ConversationService.get_conversation_history(db, session_id, limit)
        return ConversationHistoryResponse(
            session_id=session_id,
            messages=messages,
            total_messages=len(messages)
        )
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversation history"
        )


@router.delete("/history/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def clear_history(
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Clear conversation history for a session
    
    Args:
        session_id: Conversation session ID
        db: Database session
    """
    try:
        await ConversationService.clear_session(db, session_id)
    except Exception as e:
        logger.error(f"Error clearing history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear conversation history"
        )


@router.get("/analytics/{session_id}", response_model=AnalyticsResponse)
async def get_analytics(
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get analytics for a session
    
    Args:
        session_id: Conversation session ID
        db: Database session
        
    Returns:
        AnalyticsResponse with session analytics
    """
    try:
        analytics = await ConversationService.get_session_analytics(db, session_id)
        return AnalyticsResponse(
            session_id=session_id,
            **analytics
        )
    except Exception as e:
        logger.error(f"Error fetching analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics"
        )


@router.get("/intents", response_model=IntentsResponse)
async def get_intents():
    """
    Get list of available intents
    
    Returns:
        IntentsResponse with all available intents
    """
    try:
        intents = rule_engine.get_available_intents()
        return IntentsResponse(
            intents=intents,
            total=len(intents)
        )
    except Exception as e:
        logger.error(f"Error fetching intents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve intents"
        )


@router.post("/reload-rules", status_code=status.HTTP_200_OK)
async def reload_rules():
    """
    Reload chatbot rules from configuration file
    
    Returns:
        Success message
    """
    try:
        rule_engine.reload_rules()
        return {"message": "Rules reloaded successfully", "timestamp": datetime.utcnow()}
    except Exception as e:
        logger.error(f"Error reloading rules: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reload rules"
        )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns:
        HealthResponse with system status
    """
    uptime = time.time() - start_time
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        uptime=round(uptime, 2),
        database="connected",
        rules_loaded=len(rule_engine.intents)
    )
