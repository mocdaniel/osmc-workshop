import pytest
from app import app
@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_speakers(client):
    response = client.get("/api/speakers")
    assert response.status_code == 200
    data = response.get_json()
    # Should be a list of speakers without the "bio" field
    assert isinstance(data, list)
    for speaker in data:
        assert "id" in speaker
        assert "name" in speaker
        assert "company" in speaker
        assert "talks" in speaker
        assert "bio" not in speaker

def test_get_speaker_valid_id(client):
    # Assuming speaker with id 1 exists in the hardcoded data
    response = client.get("/api/speaker/1")
    assert response.status_code == 200
    speaker = response.get_json()
    assert speaker["id"] == 1
    assert "bio" in speaker

def test_get_speaker_invalid_id(client):
    response = client.get("/api/speaker/9999")
    assert response.status_code == 404
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "Speaker not found"
