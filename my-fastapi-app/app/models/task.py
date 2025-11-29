from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    issue_number = Column(Integer, nullable=False, index=True)
    owner = Column(String(100), nullable=False, index=True)
    repo = Column(String(200), nullable=False, index=True)

    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    detailed_description = Column(Text, nullable=True)  # Extended description for Medium/Hard tasks
    labels = Column(Text, nullable=True)  # comma-separated labels for simplicity
    
    difficulty = Column(String(20), nullable=True)  # Easy, Medium, Hard
    category = Column(String(50), nullable=True)  # Bug Fix, Feature, etc.
    time_estimate = Column(String(20), nullable=True)  # 15 min, 30 min, etc.
    hints = Column(Text, nullable=True)  # JSON array of hints
    technologies = Column(Text, nullable=True)  # comma-separated: React, Django, etc.

    html_url = Column(String(500), nullable=True)
    created_at = Column(String(100), nullable=True)
    closed_at = Column(String(100), nullable=True)

    created_on = Column(DateTime, default=datetime.utcnow)

    code_files = relationship("TaskCodeFile", back_populates="task", cascade="all, delete-orphan")


class TaskCodeFile(Base):
    __tablename__ = "task_code_files"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)

    path = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    language = Column(String(50), nullable=True)
    before_missing = Column(Boolean, default=False)
    patch = Column(Text, nullable=True)
    truncated = Column(Boolean, default=False)

    created_on = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="code_files")