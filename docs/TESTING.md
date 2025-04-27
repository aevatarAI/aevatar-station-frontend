# Testing Guidelines

## Overview

This document outlines the testing standards and best practices for the Aevatar Station Frontend project. We use Vitest and React Testing Library for our testing framework.

## Testing Setup

The project uses the following testing tools:

- Vitest for test running and assertions
- React Testing Library for component testing
- Jest DOM for DOM testing utilities
- MSW for API mocking

## Test File Structure

Test files should be placed in the same directory as the component they test, with the following naming convention:

```
ComponentName.tsx
ComponentName.test.tsx
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees and interacts with
   - Avoid testing implementation details
   - Use role-based queries when possible

2. **Test Coverage**
   - Aim for 80%+ test coverage
   - Focus on critical user paths
   - Test edge cases and error states

3. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

4. **Mocking**
   - Use MSW for API mocking
   - Mock external dependencies
   - Keep mocks simple and focused

## Common Testing Patterns

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();
  render(<ComponentName />);
  
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  render(<ComponentName />);
  
  await screen.findByText('Loading...');
  await screen.findByText('Data loaded');
});
```

### Testing Error States

```typescript
it('should handle errors', async () => {
  render(<ComponentName />);
  
  await screen.findByText('Error occurred');
  expect(screen.getByRole('alert')).toHaveTextContent('Error message');
});
```

## Running Tests

### Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Coverage Requirements

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Debugging Tests

1. Use `screen.debug()` to inspect the rendered DOM
2. Use `console.log()` for debugging test values
3. Use the Vitest UI for interactive debugging

## Common Issues and Solutions

1. **Async Timing Issues**
   - Use `findBy` instead of `getBy` for async elements
   - Use `waitFor` for complex async scenarios

2. **Mocking Issues**
   - Ensure mocks are reset between tests
   - Use `vi.clearAllMocks()` in `afterEach`

3. **DOM Testing Issues**
   - Use role-based queries
   - Avoid testing implementation details

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
