# Design Document

## Overview

The base infrastructure for the Trailblazer Welfare Navigator establishes a monorepo containing a FastAPI backend with LangGraph agent orchestration and a Next.js 15 frontend with Shadcn UI. The architecture follows a client-server pattern where the React frontend communicates with the FastAPI backend via REST API, and the backend processes messages through a LangGraph workflow using Google's Gemini model.

The design prioritizes simplicity for the initial "ping-pong" connection while establishing patterns that can scale to more complex agent workflows. The monorepo structure keeps related code together while maintaining clear separation between frontend and backend concerns.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Monorepo                            │
│                                                             │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │   Frontend (3000)    │      │   Backend (8000)     │   │
│  │                      │      │                      │   │
│  │  Next.js 15 App      │─────▶│  FastAPI Server      │   │
│  │  + Shadcn UI         │ HTTP │  + CORS              │   │
│  │  + TypeScript        │◀─────│                      │   │
│  │                      │      │  ┌────────────────┐  │   │
│  │  TestAgent Page      │      │  │  LangGraph     │  │   │
│  │  - Input field       │      │  │  Agent         │  │   │
│  │  - Display area      │      │  │                │  │   │
│  │                      │      │  │  Base Node     │  │   │
│  └──────────────────────┘      │  │  + Gemini      │  │   │
│                                │  └────────────────┘  │   │
│                                └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- FastAPI: Modern Python web framework with automatic OpenAPI documentation
- LangGraph: State machine framework for building agent workflows
- LangChain Google GenAI: Integration with Google's Gemini models
- Uvicorn: ASGI server for running FastAPI
- Python-dotenv: Environment variable management

**Frontend:**
- Next.js 15: React framework with App Router for file-based routing
- TypeScript: Type safety and better developer experience
- Tailwind CSS: Utility-first CSS framework
- Shadcn UI: Accessible component library built on Radix UI
- Lucide React: Icon library

## Components and Interfaces

### Backend Components

#### 1. FastAPI Application (main.py)

The main FastAPI application serves as the HTTP server and request handler.

**Responsibilities:**
- Initialize FastAPI app with CORS middleware
- Define /chat POST endpoint
- Handle request/response serialization
- Invoke LangGraph agent
- Error handling and logging

**Interface:**
```python
# POST /chat
Request Body: {
    "message": str  # User's input message
}

Response Body: {
    "response": str  # Agent's response
}

Error Response: {
    "detail": str  # Error message
}
```

#### 2. LangGraph Agent (graph.py)

The agent workflow processes user messages through a state machine.

**State Definition:**
```python
class State(TypedDict):
    user_msg: str           # Input from user
    agent_response: str     # Output from agent
```

**Base Node:**
- Receives State with user_msg populated
- Prepends "[Agent]: " to the message
- Updates agent_response in State
- Returns modified State

**Graph Structure:**
```
START → Base Node → END
```

### Frontend Components

#### 1. TestAgent Page Component

A React component that provides the chat interface for testing the backend connection.

**Responsibilities:**
- Render input field for user messages
- Display conversation history
- Send messages to backend API
- Handle loading and error states
- Display agent responses

**State Management:**
```typescript
interface Message {
    role: 'user' | 'agent';
    content: string;
}

const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### 2. API Communication Hook

A custom hook or utility function for backend communication.

**Interface:**
```typescript
async function sendMessage(message: string): Promise<string> {
    const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
        throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data.response;
}
```

## Data Models

### Backend State Model

```python
from typing import TypedDict

class State(TypedDict):
    """
    State object passed through the LangGraph workflow.
    
    Attributes:
        user_msg: The message received from the user
        agent_response: The response generated by the agent
    """
    user_msg: str
    agent_response: str
```

### Frontend Message Model

```typescript
/**
 * Represents a single message in the chat interface
 */
interface Message {
    /** The role of the message sender */
    role: 'user' | 'agent';
    /** The text content of the message */
    content: string;
    /** Optional timestamp for the message */
    timestamp?: Date;
}
```

### API Request/Response Models

```typescript
// Request to /chat endpoint
interface ChatRequest {
    message: string;
}

// Response from /chat endpoint
interface ChatResponse {
    response: string;
}

// Error response
interface ErrorResponse {
    detail: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: CORS allows frontend requests

*For any* HTTP request sent from http://localhost:3000 to the backend, the backend should accept the request without CORS errors and return a valid response.

**Validates: Requirements 2.3**

### Property 2: Base node prepends agent prefix

*For any* user message string, when processed by the Base Node, the agent_response should equal "[Agent]: " concatenated with the user_msg.

**Validates: Requirements 3.3**

### Property 3: Chat endpoint processes messages end-to-end

*For any* valid message string sent to the /chat endpoint, the backend should invoke the LangGraph agent with that message and return a JSON response containing the agent's processed response.

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 4: Error conditions return appropriate status codes

*For any* error condition (invalid request, processing failure, etc.), the backend should return an HTTP status code in the 4xx or 5xx range with an error detail message.

**Validates: Requirements 4.5**

### Property 5: Frontend sends POST requests on message submission

*For any* message submitted through the TestAgent interface, the frontend should send a POST request to http://localhost:8000/chat with the message in the request body.

**Validates: Requirements 7.3**

### Property 6: Frontend handles errors gracefully

*For any* error response from the backend (network error or error status code), the frontend should display an error message to the user while preserving the user's input in the interface.

**Validates: Requirements 8.1, 8.3, 8.4**

## Error Handling

### Backend Error Handling

**Request Validation Errors:**
- Invalid JSON in request body → 422 Unprocessable Entity
- Missing required fields → 422 Unprocessable Entity
- Invalid data types → 422 Unprocessable Entity

**Processing Errors:**
- LangGraph execution failure → 500 Internal Server Error
- Model API errors → 502 Bad Gateway
- Timeout errors → 504 Gateway Timeout

**Error Response Format:**
```python
{
    "detail": "Human-readable error message"
}
```

**Logging:**
- All errors should be logged with appropriate severity levels
- Include request context (endpoint, method, timestamp)
- Log stack traces for 500-level errors

### Frontend Error Handling

**Network Errors:**
- Connection refused → Display "Unable to connect to server"
- Timeout → Display "Request timed out, please try again"
- Network unavailable → Display "No network connection"

**HTTP Error Responses:**
- 4xx errors → Display error detail from response
- 5xx errors → Display "Server error, please try again later"

**Error Display:**
- Show error messages in a non-intrusive way (toast or inline message)
- Maintain user input so they can retry
- Clear error messages when new request succeeds

**Error Recovery:**
- Allow users to retry failed requests
- Don't clear input field on error
- Provide clear feedback about what went wrong

## Testing Strategy

### Backend Testing

**Unit Tests:**
- Test Base Node message prepending with specific examples
- Test /chat endpoint with valid and invalid payloads
- Test CORS middleware configuration
- Test error handling for various failure scenarios

**Property-Based Tests:**

We will use **Hypothesis** for Python property-based testing.

- **Property 2: Base node prepends agent prefix** - Generate random strings as user messages, verify "[Agent]: " is prepended
  - Tag: `# Feature: base-infrastructure, Property 2: Base node prepends agent prefix`
  - Minimum 100 iterations

- **Property 3: Chat endpoint processes messages end-to-end** - Generate random valid messages, verify JSON response structure and content
  - Tag: `# Feature: base-infrastructure, Property 3: Chat endpoint processes messages end-to-end`
  - Minimum 100 iterations

- **Property 4: Error conditions return appropriate status codes** - Generate various error conditions, verify status codes are in correct ranges
  - Tag: `# Feature: base-infrastructure, Property 4: Error conditions return appropriate status codes`
  - Minimum 100 iterations

**Integration Tests:**
- Test full request/response cycle through FastAPI
- Test LangGraph agent invocation from endpoint
- Test CORS with actual cross-origin requests

### Frontend Testing

**Unit Tests:**
- Test message state management
- Test API call function with mocked fetch
- Test error message display logic
- Test input field clearing behavior

**Property-Based Tests:**

We will use **fast-check** for TypeScript property-based testing.

- **Property 5: Frontend sends POST requests on message submission** - Generate random message strings, verify POST requests are made with correct payload
  - Tag: `// Feature: base-infrastructure, Property 5: Frontend sends POST requests on message submission`
  - Minimum 100 iterations

- **Property 6: Frontend handles errors gracefully** - Generate various error responses, verify error display and input preservation
  - Tag: `// Feature: base-infrastructure, Property 6: Frontend handles errors gracefully`
  - Minimum 100 iterations

**Integration Tests:**
- Test full user interaction flow with TestAgent component
- Test actual API communication with running backend
- Test error scenarios with backend unavailable

### End-to-End Testing

**Manual Testing:**
- Start both backend and frontend servers
- Send a message through the UI
- Verify message appears in UI
- Verify backend processes message
- Verify agent response appears in UI
- Test error scenarios (backend down, invalid input)

**Property-Based E2E Test:**
- **Property 1: CORS allows frontend requests** - Send various requests from frontend origin, verify no CORS errors
  - Tag: `# Feature: base-infrastructure, Property 1: CORS allows frontend requests`
  - Minimum 100 iterations

## Implementation Notes

### Backend Setup

1. **Environment Variables:**
   - Create `.env` file in backend directory
   - Add `GOOGLE_API_KEY` for Gemini access
   - Load with python-dotenv

2. **Virtual Environment:**
   - Use Python 3.10+ for compatibility
   - Create venv: `python -m venv venv`
   - Install dependencies: `pip install -r requirements.txt`

3. **Running the Server:**
   - Command: `uvicorn main:app --reload --port 8000`
   - Reload flag enables hot reloading during development

### Frontend Setup

1. **Project Initialization:**
   - Use `npx create-next-app@latest frontend` with TypeScript, Tailwind, App Router
   - Install Shadcn: `npx shadcn-ui@latest init`
   - Add components: `npx shadcn-ui@latest add button input card`

2. **Environment Variables:**
   - Create `.env.local` for local development
   - Add `NEXT_PUBLIC_API_URL=http://localhost:8000` if needed

3. **Running the Dev Server:**
   - Command: `npm run dev`
   - Runs on port 3000 by default

### Development Workflow

1. Start backend server first
2. Start frontend dev server
3. Navigate to TestAgent page
4. Test ping-pong connection
5. Verify message flow in both browser and backend logs

### Future Extensibility

This base infrastructure is designed to support future enhancements:

- **Multi-node workflows:** The LangGraph structure can be extended with additional nodes
- **Streaming responses:** FastAPI supports SSE for streaming agent responses
- **Authentication:** CORS and endpoint structure support adding auth middleware
- **State persistence:** State TypedDict can be extended with additional fields
- **Complex UI:** Shadcn components provide foundation for richer interfaces
