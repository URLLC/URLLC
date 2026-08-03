"""Scenic Geo Auditor."""

from .core import Candidate, AuditResult, audit_candidates, haversine_km

__all__ = ["Candidate", "AuditResult", "audit_candidates", "haversine_km"]
__version__ = "0.1.0"

