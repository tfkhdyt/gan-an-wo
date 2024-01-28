# GanAnWo API

## Quick start

### Podman

```sh
podman compose up -d
```

### Docker

```sh
docker compose up -d
```

## API Documentation

### Leaderboard

#### Endpoint

`wss://api.gananwo.click/scores/leaderboard`

#### Description

Retrieves a list of scores for different candidates.

#### Response

```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Anies - Muhaimin", "score": 0},
    {"id": 2, "name": "Prabowo - Gibran", "score": 0},
    {"id": 3, "name": "Ganjar - Mahfud", "score": 0}
  ]
}
```

### Submit Score

#### Endpoint

`wss://api.gananwo.click/scores/submit`

#### Description

Submit a score for a specific candidate pair.

#### Request

WebSocket Message: `1` | `2` | `3` (Candidate ID)

#### Response

```json
{
  "success": true,
  "message": "submit success"
}
```
