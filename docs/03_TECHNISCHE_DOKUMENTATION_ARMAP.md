# TECHNISCHE DOKUMENTATION
## ARMAP - Assurance & Resilience Mapping Assistant

**Projekt:** ARMAP Intelligent Assistant  
**Version:** 1.0  
**Datum:** 27.01.2026  
**Zielgruppe:** Entwickler, DevOps, Technische Architekten  

---

## 1. EINFÜHRUNG

### 1.1 Zweck dieses Dokuments
Diese technische Dokumentation richtet sich an Entwickler und technische Stakeholder, die das ARMAP-System verstehen, warten, erweitern oder neu aufsetzen möchten.

### 1.2 Systemübersicht
ARMAP ist eine moderne Web-Applikation basierend auf dem Next.js 14 Framework mit React 18, die einen conversational AI-Assistenten bereitstellt. Das System nutzt OpenAI's Assistant API v2 für intelligente Konversationen im Bereich Assurance & Resilience Mapping.

**Technologie-Stack:**
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js 14 API Routes (Edge Runtime)
- **AI/ML:** OpenAI Assistant API v2
- **Styling:** Tailwind CSS, Framer Motion
- **Validation:** Zod, zod-form-data
- **Environment:** @t3-oss/env-nextjs

---

## 2. ARCHITEKTUR

### 2.1 High-Level Architektur

```
Browser Client
    ↓ HTTPS
Next.js App Router
    ↓
Page Component (app/page.tsx) + API Route (/api/assistant)
    ↓ OpenAI SDK
OpenAI Assistant API
    ↓ Stream Response
Client State Management → UI Rendering
```

### 2.2 Component Architektur

**Root Layout (app/layout.tsx)**
- Metadata Configuration
- Global CSS Imports
- Inter Font Loading

**Main Chat Component (app/page.tsx)**
- State Management (messages, threadId, status, error)
- Event Handlers (handleFormSubmit, handleTextareaKeyDown)
- UI Rendering (Header, Messages, Input Area)

---

## 3. CODE-STRUKTUR

### 3.1 Frontend: app/page.tsx

#### State Management
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [message, setMessage] = useState<string>(");
const [threadId, setThreadId] = useState<string>(");
const [error, setError] = useState<string | null>(null);
const [status, setStatus] = useState<AssistantStatus>("awaiting_message");
```

#### Event Handler: handleFormSubmit
1. Validation & Setup
2. Optimistic UI Update
3. API Request to /api/assistant
4. Stream Processing (assistant_message, assistant_control_data, error)
5. Error Handling & Cleanup

### 3.2 Backend: app/api/assistant/route.ts

#### Request Flow
1. Parse FormData with Zod schema validation
2. Get or create OpenAI Thread
3. Create message in thread
4. Run Assistant with polling (500ms interval)
5. Retrieve and stream response messages

#### OpenAI Integration
```typescript
const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    defaultHeaders: { "OpenAI-Beta": "assistants=v2" }
});
```

---

## 4. DATENMODELLE

### Message Type
```typescript
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}
```

### AssistantStatus Type
```typescript
type AssistantStatus = "awaiting_message" | "in_progress" | "error";
```

---

## 5. DEPLOYMENT

### Environment Variables
```
SITE_URL=
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
```

### Build Commands
```bash
npm install
npm run build
npm start
```

### Vercel Deployment
1. Connect GitHub Repository
2. Set Environment Variables
3. Enable Edge Functions
4. Deploy

---

## 6. SICHERHEIT

✅ Environment variable validation (t3-env)
✅ Server-only API key access
✅ Edge runtime isolation
✅ Zod input validation

---

## 7. PERFORMANCE

✅ Edge Runtime für reduzierte Latenz
✅ Streaming für progressive Antwortdarstellung
✅ React optimizations (Functional Components, Memo)

---

## 8. WARTUNG

### Monitoring
- API Response Times
- Error Rates
- OpenAI API Usage
- Active Thread Count

### Updates
- Dependency Updates (npm audit)
- Next.js Version Updates
- OpenAI SDK Updates
- Security Patches

---

**Dokument erstellt:** 27.01.2026  
**Status:** Final  
**Version:** 1.0