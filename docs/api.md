# API Documentation

## Overview

This document outlines the API integration patterns and best practices for the Aevatar Station Frontend project.

## API Structure

### Directory Organization

```
src/api/
├── endpoints/     # API endpoint definitions
├── types/         # API type definitions
├── utils/         # API utility functions
└── index.ts       # API client configuration
```

## API Client Setup

### Base Configuration

```typescript
// api/index.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
);
```

## API Endpoints

### Endpoint Structure

```typescript
// api/endpoints/user.ts
import { apiClient } from '../index';
import { User, UserResponse } from '../types';

export const userApi = {
  getProfile: () => 
    apiClient.get<UserResponse>('/user/profile'),
  
  updateProfile: (data: Partial<User>) =>
    apiClient.put<UserResponse>('/user/profile', data),
  
  deleteAccount: () =>
    apiClient.delete('/user/account'),
};
```

### Type Definitions

```typescript
// api/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  // ... other user properties
}

export interface UserResponse {
  data: User;
  message: string;
  status: number;
}
```

## Error Handling

### Error Types

```typescript
// api/types/error.ts
export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export class ApiException extends Error {
  constructor(public error: ApiError) {
    super(error.message);
  }
}
```

### Error Handling Pattern

```typescript
// api/utils/error-handler.ts
import { ApiError, ApiException } from '../types/error';

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      status: error.response?.status || 500,
      details: error.response?.data,
    };
    throw new ApiException(apiError);
  }
  throw error;
};
```

## API Hooks

### Custom Hook Pattern

```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { ApiError } from '../api/types/error';

export function useApi<T>(
  apiCall: () => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, error, loading, execute };
}
```

## Best Practices

### API Design

1. **Endpoint Organization**
   - Group related endpoints
   - Use consistent naming
   - Follow RESTful conventions

2. **Type Safety**
   - Define types for all requests/responses
   - Use TypeScript for type checking
   - Document type requirements

3. **Error Handling**
   - Implement consistent error handling
   - Use typed error responses
   - Handle network errors

4. **Security**
   - Implement proper authentication
   - Handle token refresh
   - Sanitize sensitive data

### Code Organization

1. **File Structure**
   - Separate endpoints by feature
   - Keep types in dedicated files
   - Use index files for exports

2. **Naming Conventions**
   - Use consistent naming patterns
   - Prefix API-related types
   - Use descriptive names

3. **Documentation**
   - Document API endpoints
   - Include type definitions
   - Add usage examples

## Testing API Integration

### Mocking API Calls

```typescript
// test/api/user.test.ts
import { userApi } from '../../api/endpoints/user';
import { mockApiResponse } from '../utils/mock-api';

describe('userApi', () => {
  it('should fetch user profile', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    mockApiResponse('/user/profile', mockUser);

    const response = await userApi.getProfile();
    expect(response.data).toEqual(mockUser);
  });
});
```

## Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [REST API Best Practices](https://restfulapi.net/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
