# Requirements Document

## Introduction

The Trailblazer Welfare Navigator is a web application designed to help users navigate welfare services through an AI-powered agent interface. This requirements document defines the base foundation infrastructure, establishing a monorepo structure with a FastAPI backend using LangGraph for agent orchestration and a Next.js 15 frontend with Shadcn UI components. The primary goal is to create a working "ping-pong" connection where user input travels through a LangGraph node and returns an agent response.

## Glossary

- **Backend Service**: The FastAPI server that handles HTTP requests and orchestrates the LangGraph agent
- **Frontend Application**: The Next.js 15 web application that provides the user interface
- **LangGraph Agent**: The agent workflow system built on LangGraph that processes user messages
- **Base Node**: A simple LangGraph node that processes user messages and generates responses
- **Monorepo**: A single repository containing both backend and frontend codebases
- **Ping-Pong Connection**: A test interaction where a message sent from the frontend is processed by the backend and returned with a response

## Requirements

### Requirement 1

**User Story:** As a developer, I want a monorepo structure with separate backend and frontend directories, so that I can organize and maintain both services in a single repository.

#### Acceptance Criteria

1. THE Backend Service SHALL be located in a 'backend' directory at the repository root
2. THE Frontend Application SHALL be located in a 'frontend' directory at the repository root
3. THE Backend Service SHALL contain main.py, graph.py, and requirements.txt files
4. THE Frontend Application SHALL follow the Next.js 15 App Router structure with a components/ui directory for Shadcn components

### Requirement 2

**User Story:** As a developer, I want the backend to use FastAPI with CORS enabled, so that the frontend can communicate with the backend during development.

#### Acceptance Criteria

1. THE Backend Service SHALL run on port 8000
2. WHEN the Backend Service starts, THE Backend Service SHALL enable CORS for http://localhost:3000
3. THE Backend Service SHALL accept HTTP requests from the Frontend Application without CORS errors
4. THE Backend Service SHALL include fastapi and uvicorn in requirements.txt

### Requirement 3

**User Story:** As a developer, I want a LangGraph state definition and base node, so that I can process user messages through an agent workflow.

#### Acceptance Criteria

1. THE Backend Service SHALL define a State TypedDict with 'user_msg' and 'agent_response' string fields
2. THE Backend Service SHALL implement a Base Node that accepts user_msg from the state
3. WHEN the Base Node processes a user message, THE Backend Service SHALL prepend "[Agent]: " to the message
4. THE Backend Service SHALL use Gemini-1.5-Flash as the model for the Base Node
5. THE Backend Service SHALL include langgraph, langchain-google-genai, and python-dotenv in requirements.txt

### Requirement 4

**User Story:** As a developer, I want a /chat endpoint in the backend, so that the frontend can send user messages and receive agent responses.

#### Acceptance Criteria

1. THE Backend Service SHALL expose a POST endpoint at /chat
2. WHEN a POST request is received at /chat, THE Backend Service SHALL extract the user message from the request body
3. WHEN the user message is processed, THE Backend Service SHALL invoke the LangGraph Agent with the message
4. WHEN the LangGraph Agent completes processing, THE Backend Service SHALL return the agent response in JSON format
5. IF an error occurs during processing, THEN THE Backend Service SHALL return an appropriate HTTP error status code

### Requirement 5

**User Story:** As a developer, I want a Next.js 15 frontend with TypeScript and Tailwind CSS, so that I can build a modern, type-safe user interface.

#### Acceptance Criteria

1. THE Frontend Application SHALL use Next.js 15 with the App Router
2. THE Frontend Application SHALL use TypeScript for type safety
3. THE Frontend Application SHALL use Tailwind CSS for styling
4. THE Frontend Application SHALL run on port 3000
5. THE Frontend Application SHALL include lucide-react for icons

### Requirement 6

**User Story:** As a developer, I want Shadcn UI components installed in the frontend, so that I can build a consistent and accessible user interface.

#### Acceptance Criteria

1. THE Frontend Application SHALL have Shadcn UI configured
2. THE Frontend Application SHALL include Button, Input, and Card components from Shadcn UI
3. THE Frontend Application SHALL store Shadcn components in the components/ui directory

### Requirement 7

**User Story:** As a user, I want a test chat interface, so that I can verify the ping-pong connection between frontend and backend.

#### Acceptance Criteria

1. THE Frontend Application SHALL provide a TestAgent page component
2. WHEN a user types a message in the input field, THE Frontend Application SHALL display the message in the interface
3. WHEN a user submits a message, THE Frontend Application SHALL send a POST request to http://localhost:8000/chat
4. WHEN the backend responds, THE Frontend Application SHALL display the agent response in the interface
5. THE Frontend Application SHALL use the Button, Input, and Card components from Shadcn UI in the TestAgent page

### Requirement 8

**User Story:** As a developer, I want the frontend to handle API communication errors gracefully, so that users receive appropriate feedback when the backend is unavailable.

#### Acceptance Criteria

1. WHEN the Frontend Application sends a request to the backend, THE Frontend Application SHALL handle network errors
2. IF the backend is unavailable, THEN THE Frontend Application SHALL display an error message to the user
3. IF the backend returns an error status code, THEN THE Frontend Application SHALL display an appropriate error message
4. WHEN an error occurs, THE Frontend Application SHALL maintain the user's input in the interface
