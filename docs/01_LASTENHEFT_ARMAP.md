# LASTENHEFT
## ARMAP - Assurance & Resilience Mapping Assistant

**Projekt:** ARMAP Intelligent Assistant  
**Version:** 1.0  
**Datum:** 27.01.2026  
**Auftraggeber:** Natashick  
**Projekttyp:** KI-gestützter Conversational Assistant für Risiko- und Resilienzanalyse  

---

## 1. AUSGANGSSITUATION UND ZIELSETZUNG

### 1.1 Projektbeschreibung
ARMAP (Assurance & Resilience Mapping) ist ein intelligenter Konversations-Assistent, der auf Basis von OpenAI's GPT-Technologie entwickelt wurde. Das System ermöglicht Benutzern eine interaktive Kommunikation zur Analyse, Bewertung und Kartierung von Sicherheits- und Resilienzaspekten in verschiedenen Geschäftsbereichen.

### 1.2 Geschäftsziele
- **Automatisierung** von Risiko- und Resilienzanalysen
- **Benutzerfreundliche Interaktion** durch natürlichsprachige Konversation
- **Skalierbare Lösung** für Enterprise-Anwendungen
- **Echtzeit-Kommunikation** mit persistenten Konversationsverläufen
- **Professionelle Darstellung** von Analyseergebnissen

### 1.3 Zielgruppe
- Risk Management Professionals
- Compliance Officers
- Business Continuity Manager
- IT Security Specialists
- Executive Management
- Audit und Assurance Teams

---

## 2. FUNKTIONALE ANFORDERUNGEN

### 2.1 Kernfunktionalität

#### FA-001: Konversationsführung
**Priorität:** MUSS  
**Beschreibung:** Das System muss in der Lage sein, natürlichsprachige Konversationen mit Benutzern zu führen.

**Akzeptanzkriterien:**
- Textbasierte Ein- und Ausgabe
- Kontextverständnis über mehrere Nachrichten hinweg
- Thread-basierte Konversationsverwaltung
- Echtzeit-Antwortgenerierung

#### FA-002: OpenAI Assistant Integration
**Priorität:** MUSS  
**Beschreibung:** Integration mit OpenAI Assistant API v2 für KI-gestützte Antworten.

**Akzeptanzkriterien:**
- Verbindung zu OpenAI API
- Verwendung von Assistant ID für spezialisierte Antworten
- Thread-Management für Konversationspersistenz
- Streaming von Antworten für verbesserte UX

#### FA-003: Chat-Interface
**Priorität:** MUSS  
**Beschreibung:** Modernes, responsives Web-Interface für die Interaktion.

**Akzeptanzkriterien:**
- Klare Unterscheidung zwischen User- und Bot-Nachrichten
- Avatar-basierte Visualisierung
- Echtzeit-Typing-Indikator
- Auto-Scroll zu neuen Nachrichten
- Responsive Design für Desktop und Mobile

#### FA-004: Nachrichtenverlauf
**Priorität:** MUSS  
**Beschreibung:** Persistente Speicherung und Anzeige des Konversationsverlaufs.

**Akzeptanzkriterien:**
- Thread-basierte Speicherung
- Chronologische Anzeige aller Nachrichten
- Session-übergreifende Persistenz
- Eindeutige Message IDs

#### FA-005: Markdown-Unterstützung
**Priorität:** SOLLTE  
**Beschreibung:** Formatierte Darstellung von Bot-Antworten mit Markdown.

**Akzeptanzkriterien:**
- Unterstützung von GitHub Flavored Markdown (GFM)
- Tabellendarstellung
- Code-Blöcke
- Listen und Formatierungen

#### FA-006: Fehlerbehandlung
**Priorität:** MUSS  
**Beschreibung:** Robuste Fehlerbehandlung und Benutzerbenachrichtigung.

**Akzeptanzkriterien:**
- Visuelle Fehlermeldungen
- Graceful degradation bei API-Fehlern
- Timeout-Handling
- Benutzerfreundliche Fehlertexte

### 2.2 Benutzererfahrung

#### FA-007: Eingabefunktionalität
**Priorität:** MUSS  
**Beschreibung:** Intuitive Texteingabe mit Tastaturunterstützung.

**Akzeptanzkriterien:**
- Textarea mit Auto-Resize
- Enter zum Senden
- Shift+Enter für Zeilenumbruch
- Senden-Button mit visueller Rückmeldung
- Disabled-State während Verarbeitung

#### FA-008: Ladeindikator
**Priorität:** SOLLTE  
**Beschreibung:** Visuelles Feedback während der Antwortgenerierung.

**Akzeptanzkriterien:**
- Animierter Spinner
- "Typing"-Animation mit Text
- Statusanzeige

#### FA-009: Branding
**Priorität:** SOLLTE  
**Beschreibung:** Konsistente Markendarstellung.

**Akzeptanzkriterien:**
- ARMAP Logo/Avatar
- Brand Colors
- Corporate Typography
- Professionelles UI-Design

---

## 3. NICHT-FUNKTIONALE ANFORDERUNGEN

### 3.1 Performance

#### NFA-001: Antwortzeit
**Priorität:** SOLLTE  
**Anforderung:** Erste Antwort innerhalb von 3 Sekunden nach Nachrichtenversand (abhängig von OpenAI API).

#### NFA-002: Streaming Performance
**Priorität:** SOLLTE  
**Anforderung:** Streaming-Chunking mit < 500ms Polling-Intervall.

### 3.2 Skalierbarkeit

#### NFA-003: Concurrent Users
**Priorität:** SOLLTE  
**Anforderung:** Unterstützung von mindestens 100 gleichzeitigen Benutzern.

#### NFA-004: Thread-Verwaltung
**Priorität:** MUSS  
**Anforderung:** Effiziente Verwaltung von 10.000+ aktiven Konversationsthreads.

### 3.3 Sicherheit

#### NFA-005: API Key Management
**Priorität:** MUSS  
**Anforderung:** Sichere Verwaltung von API-Schlüsseln über Umgebungsvariablen.

#### NFA-006: Input Validation
**Priorität:** MUSS  
**Anforderung:** Validierung aller Benutzereingaben mit Zod-Schema.

#### NFA-007: Edge Runtime Security
**Priorität:** SOLLTE  
**Anforderung:** Nutzung von Edge Runtime für verbesserte Security.

### 3.4 Verfügbarkeit

#### NFA-008: Uptime
**Priorität:** SOLLTE  
**Anforderung:** 99.5% Verfügbarkeit (abhängig von OpenAI Service).

#### NFA-009: Fehlertoleranz
**Priorität:** MUSS  
**Anforderung:** Graceful degradation bei API-Ausfällen mit Benutzerbenachrichtigung.

### 3.5 Benutzerfreundlichkeit

#### NFA-010: Responsive Design
**Priorität:** MUSS  
**Anforderung:** Vollständige Funktionalität auf Desktop, Tablet und Smartphone.

#### NFA-011: Accessibility
**Priorität:** SOLLTE  
**Anforderung:** WCAG 2.1 Level AA Konformität.

#### NFA-012: Browser-Kompatibilität
**Priorität:** MUSS  
**Anforderung:** Unterstützung aktueller Versionen von Chrome, Firefox, Safari, Edge.

### 3.6 Wartbarkeit

#### NFA-013: Code-Qualität
**Priorität:** SOLLTE  
**Anforderung:** TypeScript mit strikter Typisierung, ESLint-Konformität.

#### NFA-014: Dokumentation
**Priorität:** MUSS  
**Anforderung:** Vollständige Code-Dokumentation und Benutzerhandbücher.

---

## 4. TECHNISCHE RAHMENBEDINGUNGEN

### 4.1 Technologie-Stack (Anforderungen)
- **Frontend Framework:** Next.js 14+ mit React 18+
- **Styling:** Tailwind CSS
- **KI-Integration:** OpenAI Assistant API v2
- **Runtime:** Edge-kompatibel
- **Deployment:** Vercel oder ähnliche Plattform

### 4.2 Integrations-Anforderungen
- OpenAI API v2 (Assistants)
- Thread-basierte Konversationsverwaltung
- Streaming API-Responses

### 4.3 Umgebungsvariablen
``
SITE_URL=<Application URL>
OPENAI_API_KEY=<OpenAI API Key>
OPENAI_ASSISTANT_ID=<Specific Assistant ID>
``

---

## 5. ABNAHMEKRITIEREN

### 5.1 Funktionale Abnahme
- ✅ Alle MUSS-Anforderungen implementiert
- ✅ Erfolgreiche Konversationen mit korrekten Antworten
- ✅ Thread-Persistenz funktioniert
- ✅ Fehlerbehandlung greift bei allen bekannten Fehlerszenarien

### 5.2 Nicht-funktionale Abnahme
- ✅ Performance-Ziele erreicht
- ✅ Responsive Design auf allen Zielgeräten
- ✅ Sicherheitsanforderungen erfüllt
- ✅ Code-Qualität gemäß Standards

### 5.3 Dokumentations-Abnahme
- ✅ Vollständige technische Dokumentation
- ✅ Benutzerhandbuch verfügbar
- ✅ Deployment-Anleitung vorhanden

---

## 6. RISIKEN UND ABHÄNGIGKEITEN

### 6.1 Technische Risiken
| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| OpenAI API Downtime | Mittel | Hoch | Fehlerbehandlung, Status-Page |
| API Rate Limits | Mittel | Mittel | Queue-System, Rate-Limiting |
| Latenz bei Antworten | Hoch | Mittel | Streaming, Loading-States |

### 6.2 Abhängigkeiten
- OpenAI API Verfügbarkeit
- OpenAI Assistant Konfiguration
- Vercel/Hosting-Platform Stabilität

---

## 7. PROJEKTORGANISATION

### 7.1 Stakeholder
- **Auftraggeber:** Natashick
- **Entwickler:** Development Team
- **End-Users:** Risk Management Professionals

### 7.2 Meilensteine
1. **M1:** Requirements finalisiert ✅
2. **M2:** Architektur definiert
3. **M3:** MVP (Minimum Viable Product)
4. **M4:** Beta-Testing
5. **M5:** Production Release
6. **M6:** Post-Launch Support

---

## 8. ANHANG

### 8.1 Glossar
- **ARMAP:** Assurance & Resilience Mapping
- **Thread:** Persistente Konversationssession
- **Assistant:** OpenAI's spezialisiertes KI-Modell
- **Edge Runtime:** Serverless execution environment

### 8.2 Referenzen
- OpenAI Assistant API Documentation
- Next.js 14 Documentation
- Vercel AI SDK

---

**Dokument erstellt:** 27.01.2026  
**Status:** Final  
**Version:** 1.0