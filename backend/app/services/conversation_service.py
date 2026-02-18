"""
Conversation Service
Handles conversation history, session management, and analytics
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.conversation import Conversation, Message, Analytics
from datetime import datetime
from typing import List, Optional, Dict
import uuid
import logging

logger = logging.getLogger(__name__)


class ConversationService:
    """Service for managing conversations and chat history"""
    
    @staticmethod
    async def create_session(db: AsyncSession) -> str:
        """
        Create a new conversation session
        
        Args:
            db: Database session
            
        Returns:
            session_id: Unique session identifier
        """
        session_id = str(uuid.uuid4())
        conversation = Conversation(session_id=session_id)
        db.add(conversation)
        await db.commit()
        logger.info(f"Created new session: {session_id}")
        return session_id
    
    @staticmethod
    async def save_message(
        db: AsyncSession,
        session_id: str,
        message: str,
        is_user: bool,
        intent: Optional[str] = None,
        sentiment: Optional[str] = None
    ):
        """
        Save a message to the database
        
        Args:
            db: Database session
            session_id: Conversation session ID
            message: Message content
            is_user: True if message is from user, False if from bot
            intent: Detected intent
            sentiment: Detected sentiment
        """
        msg = Message(
            session_id=session_id,
            message=message,
            is_user=is_user,
            intent=intent,
            sentiment=sentiment
        )
        db.add(msg)
        await db.commit()
    
    @staticmethod
    async def get_conversation_history(
        db: AsyncSession,
        session_id: str,
        limit: int = 50
    ) -> List[Dict]:
        """
        Retrieve conversation history for a session
        
        Args:
            db: Database session
            session_id: Conversation session ID
            limit: Maximum number of messages to retrieve
            
        Returns:
            List of message dictionaries
        """
        result = await db.execute(
            select(Message)
            .where(Message.session_id == session_id)
            .order_by(Message.timestamp.asc())
            .limit(limit)
        )
        messages = result.scalars().all()
        
        return [
            {
                'id': msg.id,
                'message': msg.message,
                'is_user': msg.is_user,
                'intent': msg.intent,
                'sentiment': msg.sentiment,
                'timestamp': msg.timestamp.isoformat()
            }
            for msg in messages
        ]
    
    @staticmethod
    async def save_analytics(
        db: AsyncSession,
        session_id: str,
        intent: Optional[str],
        matched_pattern: Optional[str],
        response_time_ms: int
    ):
        """
        Save analytics data
        
        Args:
            db: Database session
            session_id: Conversation session ID
            intent: Detected intent
            matched_pattern: Matched regex pattern
            response_time_ms: Response time in milliseconds
        """
        analytics = Analytics(
            session_id=session_id,
            intent=intent,
            matched_pattern=matched_pattern,
            response_time_ms=response_time_ms
        )
        db.add(analytics)
        await db.commit()
    
    @staticmethod
    async def get_session_analytics(db: AsyncSession, session_id: str) -> Dict:
        """
        Get analytics for a specific session
        
        Args:
            db: Database session
            session_id: Conversation session ID
            
        Returns:
            Analytics summary dictionary
        """
        result = await db.execute(
            select(Analytics)
            .where(Analytics.session_id == session_id)
        )
        analytics_records = result.scalars().all()
        
        if not analytics_records:
            return {
                'total_interactions': 0,
                'avg_response_time_ms': 0,
                'intent_distribution': {}
            }
        
        total = len(analytics_records)
        avg_response_time = sum(a.response_time_ms for a in analytics_records) / total
        
        intent_distribution = {}
        for record in analytics_records:
            intent = record.intent or 'unknown'
            intent_distribution[intent] = intent_distribution.get(intent, 0) + 1
        
        return {
            'total_interactions': total,
            'avg_response_time_ms': round(avg_response_time, 2),
            'intent_distribution': intent_distribution
        }
    
    @staticmethod
    async def clear_session(db: AsyncSession, session_id: str):
        """
        Clear conversation history for a session
        
        Args:
            db: Database session
            session_id: Conversation session ID
        """
        # Delete messages
        await db.execute(
            Message.__table__.delete().where(Message.session_id == session_id)
        )
        await db.commit()
        logger.info(f"Cleared session: {session_id}")
