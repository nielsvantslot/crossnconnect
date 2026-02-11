# Testing Guide

This project uses **Jest** and **React Testing Library** for unit testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Component Tests
Location: `src/components/**/__tests__/*.test.tsx`

Component tests verify:
- Rendering behavior
- User interactions
- State changes
- Props handling
- Accessibility

Example:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<MyComponent onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### API Route Tests
Location: `src/app/api/**/__tests__/*.test.ts`

API tests verify:
- Request/response handling
- Validation logic
- Error handling
- Authentication/authorization
- Database interactions (mocked)

Example:
```typescript
/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

describe('API Route', () => {
  it('handles GET requests', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toBeDefined();
  });
});
```

### Utility Tests
Location: `src/lib/__tests__/*.test.ts`

Utility tests verify:
- Pure function outputs
- Edge cases
- Type handling

## Test Coverage

View coverage report after running:
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory and shown in the terminal.

## Best Practices

### 1. Test Naming
Use descriptive test names that explain what is being tested:
```typescript
// Good
it('displays error message when email is invalid', () => {})

// Bad
it('works', () => {})
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('updates count on button click', async () => {
  // Arrange
  const user = userEvent.setup();
  render(<Counter />);
  
  // Act
  await user.click(screen.getByRole('button'));
  
  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 3. Clean Up
Always clean up mocks and state between tests:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 4. Mock External Dependencies
Mock Prisma, NextAuth, and other external dependencies to isolate unit tests.

### 5. Test User Interactions
Use `@testing-library/user-event` for realistic user interactions:
```typescript
const user = userEvent.setup();
await user.type(input, 'text');
await user.click(button);
```

### 6. Accessibility Testing
Test with accessible queries:
```typescript
// Prefer
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// Over
screen.getByTestId('submit-button')
```

## Debugging Tests

### Run a Single Test File
```bash
npm test -- waitlist-form.test.tsx
Prefer accessible queries like `getByRole`, `getByLabelText` over `getByTestId`. this configuration to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  pect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(5);

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key', 'value');

// DOM
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveClass('className');
expect(element).toHaveAttribute('attr', 'value');
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event](https://testing-library.com/docs/user-event/intro)
