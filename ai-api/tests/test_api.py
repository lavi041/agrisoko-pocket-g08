import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.engine import Engine, load_members
from app.main import create_app

DATA = Path(__file__).resolve().parent.parent / "data" / "members.json"
MEMBERS = load_members(DATA)


@pytest.fixture(scope="module")
def client():
    return TestClient(create_app(DATA))


def ask(client, q):
    return client.post("/ask", json={"query": q})


def test_health(client):
    r = client.get("/health").json()
    assert r["status"] == "ok" and "version" in r and "group_code" in r


def test_members_safe_fields(client):
    rows = client.get("/members").json()
    assert len(rows) == len(MEMBERS)
    for row in rows:
        assert set(row) == {"id", "fullName", "aliases", "role", "feature"}


def test_member_detail_and_404(client):
    m = MEMBERS[0]
    assert client.get(f"/members/{m['id']}").json()["fullName"] == m["fullName"]
    r = client.get("/members/does-not-exist")
    assert r.status_code == 404 and r.json()["detail"]


def test_exact_name_query(client):
    for m in MEMBERS:
        r = ask(client, f"Tell me about {m['fullName']}").json()
        assert r["matched"] and r["member"]["id"] == m["id"]


def test_alias_query(client):
    for m in MEMBERS:
        r = ask(client, f"Who is {m['aliases'][0]}?").json()
        assert r["matched"] and r["member"]["id"] == m["id"]


def test_role_query(client):
    for m in MEMBERS:
        r = ask(client, f"Who is the {m['role']}?").json()
        assert r["matched"] and r["member"]["id"] == m["id"]


def test_feature_query(client):
    for m in MEMBERS:
        r = ask(client, f"Who built {m['feature']}?").json()
        assert r["matched"] and r["member"]["id"] == m["id"]


@pytest.mark.parametrize("q", ["What is the capital of France?", "Best pizza recipe", "asdfgh qwerty", "hello",
                               "Who will win the football match tomorrow?"])
def test_no_match(client, q):
    r = ask(client, q).json()
    assert r["matched"] is False and r["member"] is None and r["introduction"] is None
    assert r["suggestions"] and "No confident match" in r["reason"]


def test_ambiguous_single_word_is_rejected(client):
    assert ask(client, "engineer").json()["matched"] is False


def test_missing_question(client):
    assert client.post("/ask", json={}).status_code == 422


def test_empty_and_too_long_question(client):
    assert ask(client, "   ").status_code == 422
    assert ask(client, "x" * 201).status_code == 422


def test_response_schema(client):
    r = ask(client, f"Tell me about {MEMBERS[0]['fullName']}").json()
    assert set(r) == {"query", "matched", "confidence", "threshold", "reason", "matched_terms", "member",
                      "introduction", "evidence_links", "suggestions", "model_version", "group_code"}
    assert 0.0 <= r["confidence"] <= 1.0


def test_no_invented_links_or_metrics(client):
    for m in MEMBERS:
        r = ask(client, f"Tell me about {m['fullName']}").json()
        assert r["evidence_links"] == m["evidenceLinks"]
        if not m["outcomeMetric"].strip():
            assert "Verified outcome" not in r["introduction"]


def test_model_info(client):
    r = client.get("/model-info").json()
    assert len(r["dataset_fingerprint_sha256"]) == 64
    assert r["threshold"] == 0.45 and r["limitations"] and "build_commit" in r


def test_empty_dataset_engine_raises():
    with pytest.raises(ValueError):
        Engine([])


def test_empty_dataset_api_is_safe(tmp_path):
    p = tmp_path / "members.json"
    p.write_text("[]")
    c = TestClient(create_app(p))
    assert c.get("/health").json()["status"] == "degraded"
    assert c.post("/ask", json={"query": "Alice"}).status_code == 503


def test_missing_required_key_rejected(tmp_path):
    bad = dict(MEMBERS[0]); bad.pop("skills")
    p = tmp_path / "m.json"; p.write_text(json.dumps([bad]))
    with pytest.raises(ValueError):
        load_members(p)


def test_empty_optional_field_keeps_member(tmp_path):
    m = dict(MEMBERS[0]); m["outcomeMetric"] = ""; m["testerFeedback"] = []
    p = tmp_path / "m.json"; p.write_text(json.dumps([m]))
    assert len(load_members(p)) == 1
