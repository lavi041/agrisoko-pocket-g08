from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class AskRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=200)

    @field_validator("query")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Question must not be empty")
        return v


class EvidenceLink(BaseModel):
    label: str
    url: str


class MemberSummary(BaseModel):
    id: str
    fullName: str
    aliases: list[str]
    role: str
    feature: str


class AskResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    query: str
    matched: bool
    confidence: float
    threshold: float
    reason: str
    matched_terms: list[str]
    member: Optional[MemberSummary] = None
    introduction: Optional[str] = None
    evidence_links: list[EvidenceLink] = []
    suggestions: list[str] = []
    model_version: str
    group_code: str
