from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class OperationLog(Base):
    __tablename__ = "operation_logs"
    id = Column(Integer, primary_key=True, index=True)
    operation = Column(String, index=True)
    inputs = Column(String)
    result = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    execution_time = Column(Integer, default=0)
    status = Column(String, default="success")
