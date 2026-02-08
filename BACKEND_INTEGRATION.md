# Backend Integration Guide

## Overview
The Alfredo Chat application is currently designed with a "Service Layer" pattern (`src/services/chatService.ts`) that mocks AI and backend responses. This guide details how to replace these mocks with real API endpoints.

## 1. Authentication & API Security
> [!WARNING]
> **NEVER** store API keys (Gemini, OpenAI, Backend Secrets) in the frontend code.
> All calls to external AI services should be proxied through your backend.

## 2. API Endpoints Contract

### A. Initial Analysis (AI)
**Current:** `mockAiAnalysis(profile)` in `chatService.ts`
**Proposed Endpoint:** `POST /api/chat/analyze`

**Request Body:**
```json
{
  "goal": "imovel",
  "urgency": "media",
  "usage": "morar",
  "value": 200000,
  "lance_type": "dinheiro",
  "lance_value": 50000
}
```

**Response:**
```json
{
  "message": "⚡ Análise: Para imóvel com urgência média, o mercado está favorável..."
}
```

### B. Strategy Routes (The 3 Cards)
**Current:** Hardcoded `routes` array in `StrategyModal.tsx`
**Proposed Endpoint:** `POST /api/strategy/routes`

**Request Body:** Same as Analysis.

**Response:**
```json
{
  "routes": [
    {
      "id": "longevidade",
      "icon": "📅",
      "badge": "📉 Menor Parcela",
      "title": "Parcela Menor",
      "desc": "Foco no longo prazo.",
      "term": 200,
      "rate": 14,
      "entry": 0
    },
    // ...
  ]
}
```

### C. Proposal & Checkout
**Current:** Client-side calculation in `StrategyModal.tsx` and `ProposalCard.tsx`.
**Proposed Endpoint:** `POST /api/checkout/proposal`

**Request Body:**
```json
{
  "selected_route_id": "longevidade",
  "base_value": 200000,
  "lance_livre": 20000,
  "lance_embutido_pct": 0,
  "user_contact": { "name": "Vlad", "phone": "..." }
}
```

**Response:**
```json
{
  "proposal_id": "prop_123",
  "final_values": {
    "monthly": 1200.50,
    "credit": 180000,
    // ...
  },
  "pix_code": "000201...",
  "qr_image_url": "..."
}
```

## 3. Implementation Steps

1.  **Create API Client**:
    Create `src/services/api.ts` using `fetch` or `axios`.
    ```typescript
    export const api = {
      analyze: (data) => fetch('/api/chat/analyze', { method: 'POST', body: JSON.stringify(data) ... }),
      // ...
    };
    ```

2.  **Update `chatService.ts`**:
    Replace `mockAiAnalysis` with `await api.analyze(userData)`.

3.  **Update `StrategyModal.tsx`**:
    Fetch routes via `api.getRoutes(userData)` inside the `useEffect`.

4.  **Update `ProposalCard.tsx` / `PixPaymentCard.tsx`**:
    Fetch proposal details and real Pix code instead of generating client-side.
