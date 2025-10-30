# 🎃 Celoween API Documentation

## Authentication
- Admin wallet for contest creation: `0x9f42Caf52783EF12d8174d33c281a850b8eA58aD`
- Users are automatically created when they interact with the platform

---

## Contests API

### GET /api/contests
Get all contests with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (`DRAFT`, `ACTIVE`, `VOTING`, `ENDED`, `CANCELLED`)
- `limit` (optional): Limit number of results

**Response:**
```json
{
  "contests": [
    {
      "id": "string",
      "slug": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "prizeAmount": "string",
      "prizeToken": "cUSD",
      "startDate": "ISO 8601",
      "endDate": "ISO 8601",
      "votingEndDate": "ISO 8601",
      "status": "ACTIVE",
      "creator": {
        "walletAddress": "string",
        "displayName": "string"
      },
      "_count": {
        "submissions": 0
      }
    }
  ]
}
```

### POST /api/contests
Create a new contest (Admin only).

**Body:**
```json
{
  "walletAddress": "0x9f42Caf52783EF12d8174d33c281a850b8eA58aD",
  "title": "Spooky Costume Contest",
  "description": "Show off your best Halloween costume!",
  "category": "Halloween",
  "prizeAmount": "500",
  "prizeToken": "cUSD",
  "startDate": "2024-10-20T00:00:00Z",
  "endDate": "2024-10-30T23:59:59Z",
  "votingEndDate": "2024-11-05T23:59:59Z",
  "coverImageUrl": "https://...",
  "rules": "Markdown rules text",
  "maxSubmissions": 1
}
```

**Response:** `201 Created`
```json
{
  "contest": { /* Contest object */ }
}
```

**Errors:**
- `400` Missing required fields
- `403` Unauthorized (not admin wallet)

---

## Contest Detail API

### GET /api/contests/[id]
Get single contest with all submissions.

**Response:**
```json
{
  "contest": {
    "id": "string",
    "title": "string",
    "submissions": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "mediaUrl": "string",
        "voteCount": 0,
        "submitter": {
          "walletAddress": "string",
          "displayName": "string"
        }
      }
    ]
  }
}
```

### PATCH /api/contests/[id]
Update contest status or contract address.

**Body:**
```json
{
  "status": "ACTIVE",
  "contractAddress": "0x..."
}
```

---

## Submissions API

### POST /api/submissions
Create a new submission.

**Body:**
```json
{
  "contestId": "string",
  "walletAddress": "0x...",
  "title": "My Spooky Entry",
  "description": "Description of my entry",
  "mediaUrl": "https://ipfs.io/...",
  "mediaType": "image",
  "thumbnailUrl": "https://...",
  "metadata": "{\"custom\":\"data\"}"
}
```

**Response:** `201 Created`

**Errors:**
- `400` Missing fields / Contest not accepting submissions / Already submitted
- `404` Contest not found

### GET /api/submissions
Get submissions by contest or wallet.

**Query Parameters:**
- `contestId` (optional): Filter by contest
- `walletAddress` (optional): Filter by submitter

**Response:**
```json
{
  "submissions": [ /* Array of submissions */ ]
}
```

---

## Voting API

### POST /api/votes
Cast a vote (gasless via Biconomy).

**Body:**
```json
{
  "submissionId": "string",
  "walletAddress": "0x...",
  "transactionHash": "0x..." // Optional, from on-chain tx
}
```

**Response:** `201 Created`

**Errors:**
- `400` Already voted / Contest not in voting phase
- `404` Submission not found

### DELETE /api/votes
Remove a vote.

**Body:**
```json
{
  "submissionId": "string",
  "walletAddress": "0x..."
}
```

**Response:** `200 OK`

### GET /api/votes
Get votes by submission or wallet.

**Query Parameters:**
- `submissionId` (optional): Get all votes for a submission
- `walletAddress` (optional): Get all votes by a user

---

## Contest Status Flow

```
DRAFT → ACTIVE → VOTING → ENDED
  ↓
CANCELLED
```

- **DRAFT**: Contest created, not yet started
- **ACTIVE**: Accepting submissions
- **VOTING**: Submission period ended, accepting votes
- **ENDED**: Voting ended, winners can be calculated
- **CANCELLED**: Contest cancelled by admin

---

## Admin Restrictions

Only `0x9f42Caf52783EF12d8174d33c281a850b8eA58aD` can:
- Create contests (POST /api/contests)
- Update contest status (PATCH /api/contests/[id])

All users can:
- View contests
- Submit entries (during ACTIVE phase)
- Vote (during VOTING phase)

---

## Rate Limiting

Not implemented yet. Consider adding rate limits in production:
- 100 requests per 15 minutes per IP
- 10 votes per hour per wallet
