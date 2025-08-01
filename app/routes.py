# --- app/routes.py ---
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, services, models, database
from sqlalchemy import func
from .schemas import OperationLogOut, SystemMetrics
from time import perf_counter
import json
from fastapi.encoders import jsonable_encoder


router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/api/power", response_model=schemas.OperationResponse)
def power_op(req: schemas.PowRequest, db: Session = Depends(get_db)):
    start = perf_counter()
    try:
        result = services.calculate_power(req.base, req.exponent)
        status = "success"
    except Exception:
        result = 0
        status = "error"
    exec_time = int((perf_counter() - start) * 1000)

    log = models.OperationLog(
        operation="power",
        inputs=json.dumps(req.dict()),
        result=result,
        execution_time=exec_time,
        status=status,
    )
    db.add(log)
    db.commit()
    return {"result": result}

@router.post("/api/fibonacci", response_model=schemas.OperationResponse)
def fibonacci_op(req: schemas.FibonacciRequest, db: Session = Depends(get_db)):
    start = perf_counter()
    try:
        result = services.calculate_fibonacci(req.n)
        status = "success"
    except Exception:
        result = 0
        status = "error"
    exec_time = int((perf_counter() - start) * 1000)

    log = models.OperationLog(
        operation="fibonacci",
        inputs=json.dumps(req.dict()),
        result=result,
        execution_time=exec_time,
        status=status,
    )
    db.add(log)
    db.commit()
    return {"result": result}

@router.post("/api/factorial", response_model=schemas.OperationResponse)
def factorial_op(req: schemas.FactorialRequest, db: Session = Depends(get_db)):
    start = perf_counter()
    try:
        result = services.calculate_factorial(req.n)
        status = "success"
    except Exception:
        result = 0
        status = "error"
    exec_time = int((perf_counter() - start) * 1000)

    log = models.OperationLog(
        operation="factorial",
        inputs=json.dumps(req.dict()),
        result=result,
        execution_time=exec_time,
        status=status,
    )
    db.add(log)
    db.commit()
    return {"result": result}

@router.get("/api/history", response_model=List[OperationLogOut])
def get_history(db: Session = Depends(get_db)):
    records = db.query(models.OperationLog).order_by(models.OperationLog.timestamp.desc()).all()
    for record in records:
        record.inputs = json.loads(record.inputs)
    return records






@router.get("/api/metrics", response_model=schemas.SystemMetrics)
def get_metrics(db: Session = Depends(get_db)):
    total_requests = db.query(func.count(models.OperationLog.id)).scalar()
    total_time = db.query(func.sum(models.OperationLog.execution_time)).scalar() or 0
    successes = db.query(func.count()).filter(models.OperationLog.status == "success").scalar()

    counts_by_op = {
        row[0]: row[1] for row in
        db.query(models.OperationLog.operation, func.count()).group_by(models.OperationLog.operation).all()
    }

    average_time = total_time / total_requests if total_requests > 0 else 0
    success_rate = (successes / total_requests) * 100 if total_requests > 0 else 0

    return {
        "total_requests": total_requests,
        "average_response_time": average_time,
        "success_rate": success_rate,
        "operation_counts": counts_by_op
    }
