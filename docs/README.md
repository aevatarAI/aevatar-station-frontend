# Aevatar Station Frontend

A modern, high-performance frontend application built with React, TypeScript, and Vite.

## Project Structure

```
src/
├── api/          # API integration and services
├── app/          # Application routes and pages
├── assets/       # Static assets (images, fonts, etc.)
├── components/   # Reusable UI components
├── constants/    # Application constants and configuration
├── hooks/        # Custom React hooks
├── layouts/      # Page layouts and templates
├── lib/          # Third-party library configurations
├── services/     # Business logic and services
├── state/        # State management
├── store/        # Global state store
├── styles/       # Global styles and themes
├── test/         # Test utilities and helpers
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
├── App.tsx       # Root application component
├── config.ts     # Application configuration
└── main.tsx      # Application entry point
```

## Technology Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: Tailwind CSS
- **State Management**: Custom state management solution
- **Code Quality**: Biome for linting and formatting

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Building for Production

```bash
pnpm build
```

### Running Tests

```bash
pnpm test
```

## Project Conventions

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments and documentation

### Testing

- Write unit tests for all components
- Use React Testing Library for component testing
- Follow the testing guidelines in `docs/testing.md`

### Git Workflow

- Use conventional commits
- Create feature branches for new development
- Submit PRs for code review

## Documentation

- [Testing Guidelines](./testing.md)
- [Component Documentation](./components.md)
- [API Documentation](./api.md)

## License

[License information to be added]
