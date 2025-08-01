from pydantic import BaseModel
from datetime import datetime

class PowRequest(BaseModel):
    base: float
    exponent: float

class FibonacciRequest(BaseModel):
    n: int

class FactorialRequest(BaseModel):
    n: int

class OperationResponse(BaseModel):
    result: float


class OperationLogOut(BaseModel):
    id: int
    operation: str
    inputs: dict
    result: float
    timestamp: datetime
    execution_time: int
    status: str

    class Config:
        from_attributes = True

class SystemMetrics(BaseModel):
    total_requests: int
    average_response_time: float
    success_rate: float
    operation_counts: dict