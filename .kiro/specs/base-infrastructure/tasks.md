# Implementation Plan

- [x] 1. Set up monorepo structure and backend foundation





  - Create backend directory with main.py, graph.py, and requirements.txt
  - Create frontend directory placeholder
  - Initialize git repository if not already present
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Implement backend dependencies and configuration
  - [ ] 2.1 Create requirements.txt with all backend dependencies
    - Add fastapi, uvicorn, langgraph, langchain-google-genai, python-dotenv
    - Specify compatible versions
    - _Requirements: 2.4, 3.5_

  - [ ] 2.2 Create .env.example file for environment variables
    - Document GOOGLE_API_KEY requirement
    - Add instructions for obtaining API key
    - _Requirements: 3.4_

  - [ ] 2.3 Set up FastAPI application with CORS
    - Initialize FastAPI app in main.py
    - Configure CORS middleware for http://localhost:3000
    - Set up basic health check endpoint
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 2.4 Write property test for CORS functionality
    - **Property 1: CORS allows frontend requests**
    - **Validates: Requirements 2.3**

- [ ] 3. Implement LangGraph agent structure
  - [ ] 3.1 Define State TypedDict in graph.py
    - Create State with user_msg and agent_response fields
    - Add type hints and documentation
    - _Requirements: 3.1_

  - [ ] 3.2 Implement Base Node function
    - Create node function that accepts State
    - Implement message prepending logic with "[Agent]: " prefix
    - Configure Gemini-1.5-Flash model integration
    - Return updated State with agent_response
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ] 3.3 Write property test for Base Node message prepending
    - **Property 2: Base node prepends agent prefix**
    - **Validates: Requirements 3.3**

  - [ ] 3.4 Create LangGraph workflow
    - Build StateGraph with Base Node
    - Define START → Base Node → END flow
    - Compile graph for execution
    - _Requirements: 3.2_

- [ ] 4. Implement /chat endpoint
  - [ ] 4.1 Create request/response models
    - Define Pydantic models for ChatRequest and ChatResponse
    - Add validation for message field
    - _Requirements: 4.1, 4.2_

  - [ ] 4.2 Implement POST /chat endpoint
    - Extract message from request body
    - Invoke LangGraph agent with user message
    - Return agent response in JSON format
    - Add error handling with appropriate status codes
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [ ] 4.3 Write property test for chat endpoint end-to-end processing
    - **Property 3: Chat endpoint processes messages end-to-end**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [ ] 4.4 Write property test for error status codes
    - **Property 4: Error conditions return appropriate status codes**
    - **Validates: Requirements 4.5**

  - [ ] 4.5 Write unit tests for /chat endpoint
    - Test valid message processing
    - Test invalid request handling
    - Test error scenarios
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5. Checkpoint - Verify backend functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Initialize Next.js frontend application
  - [ ] 6.1 Create Next.js 15 project with TypeScript and Tailwind
    - Run create-next-app with App Router, TypeScript, and Tailwind CSS options
    - Verify project structure follows Next.js 15 conventions
    - _Requirements: 1.4, 5.1, 5.2, 5.3_

  - [ ] 6.2 Configure Next.js to run on port 3000
    - Update package.json dev script if needed
    - Verify default port configuration
    - _Requirements: 5.4_

  - [ ] 6.3 Install lucide-react for icons
    - Add lucide-react dependency
    - _Requirements: 5.5_

- [ ] 7. Set up Shadcn UI components
  - [ ] 7.1 Initialize Shadcn UI
    - Run shadcn-ui init command
    - Configure components directory as components/ui
    - _Requirements: 6.1, 6.3_

  - [ ] 7.2 Add required Shadcn components
    - Add Button component
    - Add Input component
    - Add Card component
    - Verify components are in components/ui directory
    - _Requirements: 6.2, 6.3_

- [ ] 8. Implement TestAgent page component
  - [ ] 8.1 Create TestAgent page in app directory
    - Create page.tsx file for TestAgent route
    - Set up basic page structure with Card component
    - _Requirements: 7.1, 7.5_

  - [ ] 8.2 Implement message state management
    - Create state for messages array
    - Create state for current input
    - Create state for loading and error states
    - _Requirements: 7.2, 8.4_

  - [ ] 8.3 Build chat input UI
    - Add Input component for message entry
    - Add Button component for message submission
    - Display user input in real-time
    - _Requirements: 7.2, 7.5_

  - [ ] 8.4 Implement API communication function
    - Create async function to POST to http://localhost:8000/chat
    - Handle request serialization
    - Handle response parsing
    - Implement error handling for network errors and error status codes
    - _Requirements: 7.3, 8.1, 8.2, 8.3_

  - [ ] 8.5 Write property test for POST request on submission
    - **Property 5: Frontend sends POST requests on message submission**
    - **Validates: Requirements 7.3**

  - [ ] 8.6 Write property test for error handling
    - **Property 6: Frontend handles errors gracefully**
    - **Validates: Requirements 8.1, 8.3, 8.4**

  - [ ] 8.7 Implement message display area
    - Display conversation history with user and agent messages
    - Show loading indicator during API calls
    - Display error messages when errors occur
    - Clear input field after successful submission
    - Preserve input field on error
    - _Requirements: 7.2, 7.4, 8.2, 8.3, 8.4_

  - [ ] 8.8 Write unit tests for TestAgent component
    - Test message state updates
    - Test input handling
    - Test error display
    - Test loading states
    - _Requirements: 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Final checkpoint - Verify full system integration
  - Ensure all tests pass, ask the user if questions arise.
