# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server with hot reload
- **Build**: `npm run build` - TypeScript compilation followed by Vite
  production build
- **Lint**: `npm run lint` - ESLint with TypeScript rules, React hooks, and
  React refresh
- **Format**: `npm run prettier` - Auto-format code with Prettier (includes
  import organization and Tailwind sorting)
- **Preview**: `npm run preview` - Preview production build locally
- **Test**: `npm test` - Run tests in watch mode (Vitest)
- **Test (CI)**: `npm test run` - Run tests once
- **Test UI**: `npm run test:ui` - Open Vitest visual test runner
- **Coverage**: `npm run test:coverage` - Generate test coverage report

### Development Workflow

**After making code changes, ALWAYS follow this sequence**:

1. `npm run prettier` - Format code and organize imports
2. `npm run lint` - Check for linting errors and fix them
   - ❌ DO NOT proceed if lint errors exist
   - Fix all errors before continuing
3. `npm test run` - Run tests to ensure nothing broke - REQUIRED for task completion
   - ❌ DO NOT proceed if tests fail
   - Fix failing tests before continuing
4. `npm run build` - Ensure TypeScript compilation succeeds (acts as typecheck)
   - ❌ DO NOT proceed if build fails
   - Build errors indicate type issues that must be fixed
5. **Code Review Checklist** - Before considering work complete:
   - ✅ **All frontend tests passing** (`npm test run` shows 0 failures)
   - ✅ State updates after async operations that return IDs (rounds, questions,
     etc.)
   - ✅ Array copies are created, modified, AND assigned back to state
   - ✅ All code paths update state consistently
   - ✅ No state mutations (always create new objects/arrays)
   - ✅ Async operations that create resources sync IDs back to local state
6. Test your changes in development (`npm run dev`)

**IMPORTANT:** Consider the task incomplete until ALL quality checks pass,
including all tests passing. Type errors, lint errors, and test failures
must be resolved, not ignored or deferred.

**Always run linting after code changes to ensure code quality**. The build step
serves as both production build verification and TypeScript type checking since
there's no separate typecheck command.

## Database and Test Data

### Database Management

The backend uses **Prisma ORM** with PostgreSQL. The database schema includes
cascade delete relationships to maintain referential integrity.

**Database Commands** (run from backend directory):

- `npm run db:seed` - Populate database with test data (users, quizzes,
  questions, sessions)
- `npx prisma studio` - Open Prisma Studio GUI to view and edit database
- `npx prisma migrate dev` - Create and apply new migrations
- `npx prisma migrate reset` - Reset database and re-run migrations + seed

### Test Data Overview

The seed script creates comprehensive test data including:

- Test users with Firebase authentication
- Sample quizzes across multiple categories (Science, History, Sports, etc.)
- Questions with various types (multiple choice, true/false, text input, etc.)
- Quiz sessions for testing gameplay flows
- Sample scoring data for teacher dashboard

### Data Deletion

**Frontend Delete Functionality**:

- Quiz deletion available in "My Quizzes" page
- Requires user authentication and ownership verification
- UI provides delete confirmation dialog

**Backend Delete Endpoint**:

- `DELETE /api/quiz/:id` - Delete quiz and all related data
- Automatically cascades to delete: rounds, questions, sessions, answers
- Protected by authentication middleware
- Returns 403 if user doesn't own the quiz

**Cascade Delete Relationships** (configured in Prisma schema):

- Quiz deletion cascades to: Rounds, QuizSessions
- Round deletion cascades to: Questions
- QuizSession deletion cascades to: PlayerAnswers, RoundProgresses
- Question deletion cascades to: PlayerAnswers

This ensures data integrity when deleting quizzes or sessions.

## Architecture Overview

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: TanStack Router (file-based routing with auto-code splitting)
- **State Management**: Jotai (atomic state management)
- **Data Fetching**: SWR for server state management
- **Forms**: React Hook Form + Zod validation
- **UI Framework**: Material-UI (MUI) + Tailwind CSS v4
- **Build**: Vite with SWC for fast compilation

### Key Architectural Patterns

**State Management Strategy**:

- Jotai atoms for global state (`src/atoms/`)
- SWR for server state caching and synchronization
- React Hook Form for form state
- React Context for:
  - Configuration (`config-context.tsx` - backend URLs, app settings)
  - Authentication (`auth-context.tsx` + `AuthProvider.tsx` - user state, auth
    methods)
  - Search (`search-context.tsx` - search state and filters)

**Routing Structure**:

- File-based routing with TanStack Router
- Routes auto-generated from `src/routes/` directory
- Root layout in `__root.tsx` provides app-wide providers (Theme, Header)
- Type-safe routing with auto-completion

**Data Flow**:

1. Backend API calls configured in `src/config/backend.ts`
2. Custom hooks (e.g., `useQuiz`) handle data fetching with SWR
3. Jotai atoms store fetched data globally
4. Components consume data via hooks

**Component Organization**:

- `src/components/` - Reusable UI components
- `src/forms/` - Form schemas and form-specific components
- `src/hooks/` - Custom React hooks
- `src/services/` - Service layer for external integrations
  - `api/` - REST API service methods
  - `auth/` - Authentication service logic
  - `firebase/` - Firebase configuration and services
- `src/models/` - Domain model TypeScript definitions (Quiz, Question, Round)
- `src/types/` - API and external TypeScript type definitions
- `src/utils/` - Utility functions

### React State Management Best Practices

**Critical Pattern: Syncing Server IDs to Local State**

When creating resources via API that return IDs, you MUST sync those IDs back to
local state immediately:

```typescript
// ❌ WRONG - ID not synced to state
for (const round of state.rounds) {
  if (!round.id) {
    const created = await api.createRound({...});
    roundId = created.id;  // Got ID but state.rounds[i].id still undefined!
  }
}

// ✅ CORRECT - ID synced to state
const updatedRounds = [...state.rounds];  // Copy array
for (let i = 0; i < updatedRounds.length; i++) {
  const round = updatedRounds[i];
  if (!round.id) {
    const created = await api.createRound({...});
    updatedRounds[i] = { ...round, id: created.id };  // Update copy
  }
}
setState(prev => ({ ...prev, rounds: updatedRounds }));  // Sync to state
```

**Why This Matters:**

- Without ID sync, next save thinks resources were deleted
- Results in unexpected DELETE calls and data loss
- State becomes out of sync with database

**Pattern Checklist:**

1. ✅ Create a copy of the state array/object before modification
2. ✅ Update the copy with new IDs from API responses
3. ✅ Call setState to sync the updated copy back to state
4. ✅ Verify every branch (create/update/delete) updates state

**Common Pitfalls:**

- Forgetting to call `setState` after getting IDs from API
- Mutating state directly instead of creating copies
- Only updating local variables without syncing to state
- Assuming setState is synchronous (it's not - state updates are batched)

### Backend Integration

**Dual Backend Architecture**:

1. **REST API** configured at `http://localhost:8080/api` with endpoints:
   - Users: `/users`
   - Quizzes: `/quiz`
   - Questions: `/questions`
   - API configuration centralized in `src/config/backend.ts`

2. **Firebase Services** for additional functionality:
   - Configuration in `src/services/firebase/config.ts`
   - Authentication services via `src/services/auth/`
   - Integrated with React Context providers

Both backend services are consumed via `ConfigContext` and service layer
abstractions.

## API Integration and Type Safety

When implementing or modifying API integrations:

### Before Writing Frontend Code

1. **Read the backend route handler** to understand the exact response structure
2. **Read the backend TypeBox/Zod schema** to see validation rules
3. **Compare backend types** with frontend TypeScript interfaces

### Type Compatibility Checklist

Before implementing API calls, verify:

- ✅ Field names match exactly (case-sensitive)
- ✅ Enum values match exactly (including case: `'waiting'` ≠ `'WAITING'`)
- ✅ Required vs optional fields align
- ✅ Nested object structures match
- ✅ Array item types match

### Common Type Mismatches to Avoid

- **Field name differences**: `type` vs `playType`, `id` vs `userId`
- **Enum case mismatches**: `'WAITING'` (frontend) vs `'waiting'` (backend)
- **Incomplete enums**: Frontend has 2 values, backend has 4
- **Missing fields**: Frontend interface missing `currentRoundIndex`
- **Wrong nested structure**: `{ id, name }` vs `{ userId, username }`

### Ensuring Complete Type Definitions

When working with API responses:

1. **Check for ALL fields:**
   - Compare your TypeScript interface with backend response schema
   - Don't omit fields just because you don't use them yet
   - Include optional fields with `?` if backend may omit them

2. **Validation approach:**
   - Read the backend TypeBox/Zod schema file
   - Count fields and compare with your interface
   - Check each field name, type, and optional status
   - Verify enum values match exactly (case-sensitive)

3. **Example - Proper interface:**

   ```typescript
   // Backend schema (TypeBox)
   const GameSession = Type.Object({
     id: Type.String(),
     status: Type.Union([
       Type.Literal('waiting'),
       Type.Literal('active'),
       Type.Literal('finished')
     ]),
     playType: PlayType,
     currentRoundIndex: Type.Number()
     // ... more fields
   });

   // Frontend interface - MUST match exactly
   export interface PlaySession {
     id: string;
     status: 'waiting' | 'active' | 'finished'; // ✅ Matches backend
     playType:
       | 'SINGLE_ONLINE'
       | 'SINGLE_OFFLINE'
       | 'MULTI_ONLINE'
       | 'MULTI_OFFLINE';
     currentRoundIndex: number; // ✅ Don't omit this
     // ... all other fields from backend
   }
   ```

### When Type Mismatches Found

1. **Fix the frontend types FIRST** before implementing features
2. **Document why the types differ** if intentional
3. **Consider if backend needs changes** instead
4. **Run `npm run build`** to catch type errors immediately

## Debugging API Errors

When encountering API errors (400, 404, 500, etc.):

### 1. Check Backend Logs FIRST

- ✅ Use `BashOutput` tool to check backend dev server logs
- Backend often provides exact error messages
- Look for validation errors, not found errors, database errors

**Example:**

```bash
# Check backend logs
BashOutput(bash_id: "backend_server_id")
```

### 2. Verify Request Payload

- Check what the frontend is actually sending
- Compare with backend schema expectations
- Add console.log or debugger to inspect request body

### 3. Check Type Compatibility

Common issues to verify:

- ✅ Frontend types match backend response types
- ✅ Enum case matches (`'WAITING'` vs `'waiting'`)
- ✅ Field names match (`type` vs `playType`)
- ✅ All required fields are present
- ✅ Optional fields use `?` correctly

### 4. Test Backend Directly

If possible:

- Test backend endpoint with curl/Postman
- Verify backend works independently
- Rule out backend issues before debugging frontend

### Debugging Workflow Example

```
User reports: "Getting 400 error when starting multiplayer"

Step 1: Check backend logs
→ See: "Session join not found!"

Step 2: Analyze error
→ Backend expects sessionId, receiving "join"
→ Indicates wrong value being passed

Step 3: Check frontend code
→ Using newPlaySession.id
→ Check if id field exists in response

Step 4: Check type definition
→ Compare PlaySession interface with backend schema
→ Find: status enum mismatch, missing fields
→ Fix: Update interface to match backend exactly
```

## Common Development Issues

### Browser Cache vs Code Issues

When code changes don't seem to take effect, distinguish between browser cache
issues and actual code problems:

**Signs of Browser Cache/Stale JavaScript:**

- Code looks correct in files but behavior doesn't match
- Recent changes to utility files (like `common.ts`) not reflected
- Authorization headers missing after header logic changes
- Vite HMR shows file updated but behavior unchanged

**When Vite HMR Doesn't Propagate:**

- Utility files imported in many places (`utils/common.ts`)
- Service layer base classes (`services/api/base-api.ts`)
- Context providers and hooks used throughout app
- Changes to function signatures or exported constants

**Resolution Steps:**

1. **Try Hard Refresh First** (most common fix):
   - **Chrome/Edge**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - **Firefox**: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
   - **Safari**: Cmd+Option+R

2. **If Hard Refresh Doesn't Work**:

   ```bash
   # Kill and restart frontend dev server
   lsof -ti:5173 | xargs kill
   npm run dev
   ```

3. **Verify in Browser DevTools**:
   - Open Network tab
   - Check request headers match expected code
   - Look for Authorization: Bearer <token> on authenticated requests
   - Verify Content-Type headers match method (POST/PUT should have it, DELETE
     shouldn't)

**Before Investigating Code:**

- ✅ Hard refresh browser
- ✅ Check browser console for errors
- ✅ Verify dev server shows file changes
- ✅ Check if other recent changes work (isolated issue vs system issue)

**When It's Actually a Code Issue:**

- Error appears immediately in console/logs
- Hard refresh doesn't change behavior
- Backend logs show different error than expected
- Same issue in incognito/private browsing mode

## Plan Mode for Debugging

### When to Use Plan Mode for Debugging

**Appropriate scenarios requiring user approval:**

- Major architectural changes or refactors
- Implementing new features with multiple approaches
- Breaking changes that affect multiple systems
- Design decisions requiring user input

**When to Proceed Directly (NO plan mode needed):**

- Debugging existing errors or issues
- Investigating logs and error messages
- Analyzing type mismatches or API compatibility
- Following up on user questions about errors
- Continuing work that was already approved

**Example - When Plan Mode IS Appropriate:**

```
User: "I want to refactor the authentication system to use JWT instead of Firebase"

This requires:
- Architecture decision (JWT vs Firebase trade-offs)
- Multiple file changes across auth layer
- Breaking changes to existing code
- User input on implementation approach

→ Use plan mode to present options and get approval
```

**Example - When Plan Mode is NOT Needed:**

```
User: "Why is creating quiz now failing on 401 again?"

This is:
- Debugging an existing error
- Checking backend logs for cause
- Analyzing what changed recently
- Quick investigation and fix

→ Proceed directly with investigation (check logs, analyze, fix)
```

**Key Principle**: If you're investigating/debugging an issue, proceed directly.
If you're proposing architectural changes or new features, use plan mode.

### Form Handling

Forms use React Hook Form + Zod for validation:

- Schemas defined in `src/forms/schemas/`
- Custom form components in `src/forms/components/`
- Validation errors handled automatically

### Styling Approach

Hybrid approach using both MUI and Tailwind:

- MUI components for complex UI elements (buttons, inputs, layouts)
- Tailwind for utility-first styling and custom designs
- Material-UI theme customization in `src/theme.tsx`
- Responsive design patterns throughout

### Development Notes

- TypeScript strict mode enabled
- Auto-formatting with Prettier (includes import sorting)
- ESLint configured for React + TypeScript best practices
- Route tree auto-generated by TanStack Router plugin
- Hot module replacement via Vite for fast development

### Testing

**Testing Stack**: Vitest + React Testing Library + MSW

**Test Commands**:
- `npm test` - Run tests in watch mode (default)
- `npm test run` - Run tests once (CI mode)
- `npm run test:ui` - Open Vitest UI (visual test runner)
- `npm run test:coverage` - Generate coverage report

**Testing Structure**:

1. **Test Setup Files**:
   - `vitest.config.ts` - Vitest configuration with jsdom environment
   - `src/test/setup.ts` - Global test setup with jest-dom matchers and MSW lifecycle
   - `src/test/utils.tsx` - Custom render utilities with all providers
   - `src/test/mocks/handlers.ts` - MSW request handlers for API mocking
   - `src/test/mocks/server.ts` - MSW server setup

2. **Test Files Location**:
   - Co-locate tests with source files (e.g., `QuizCard.test.tsx` next to `QuizCard.tsx`)
   - Use `.test.ts` or `.test.tsx` extension
   - Tests automatically discovered by Vitest

3. **Writing Tests**:

**Testing Utilities (Simple):**
```typescript
import { describe, it, expect } from 'vitest';
import { isIconUrl } from './quiz-placeholders';

describe('isIconUrl', () => {
  it('should identify valid URLs', () => {
    expect(isIconUrl('https://example.com/icon.png')).toBe(true);
  });
});
```

**Testing Hooks (with renderHook):**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useQuizFilters } from './useQuizFilters';

it('should update filters', () => {
  const { result } = renderHook(() => useQuizFilters());

  act(() => {
    result.current.updateFilters({ type: 'SLIDES' });
  });

  expect(result.current.filters.type).toBe('SLIDES');
});
```

**Testing Components (with providers):**
```typescript
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import { CategoriesProvider } from '../../context/categories-context';
import QuizCard from './QuizCard';

it('should render quiz title', () => {
  renderWithProviders(
    <CategoriesProvider>
      <QuizCard quiz={mockQuiz} />
    </CategoriesProvider>
  );

  expect(screen.getByText('Test Quiz')).toBeInTheDocument();
});
```

**Testing with SWR/API Mocking (MSW):**
```typescript
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

it('should handle API response', async () => {
  server.use(
    http.get('*/api/quiz/:id', () => {
      return HttpResponse.json({ id: '1', title: 'Test' });
    })
  );

  // Your test code
});
```

4. **Test Utilities Provided**:
   - `renderWithProviders(ui)` - Render with Router, Theme, Config, SWR providers
   - `createTestRouter(component, path)` - Create memory router for route testing
   - `server` - MSW server for API mocking
   - `mockQuizzes`, `mockCategories` - Mock data from handlers

5. **Coverage**:
   - Coverage reports generated in `coverage/` directory
   - View HTML report: `open coverage/index.html`
   - Excluded from coverage: test files, config files, generated routes

**Best Practices**:
- Use `renderWithProviders` instead of plain `render` for components
- Mock API responses with MSW instead of mocking fetch/axios
- Test user-visible behavior, not implementation details
- Use role-based queries (`getByRole`) for better accessibility
- Co-locate mocks with tests when they're test-specific
- Update global handlers in `src/test/mocks/handlers.ts` for reusable mocks

**Known Limitations**:
- Component tests with TanStack Router may need additional setup for navigation
- Tests use `jsdom` environment (no real browser rendering)
- Firebase auth is mocked in tests (no real authentication)
