# Aevatar Station Frontend

A React-based frontend application for the Aevatar Station platform, built with modern web technologies.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Jotai
- **UI Components**: Radix UI + Custom Components
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Testing Library
- **Authentication**: Web3 wallet integration (Portkey, NightElf)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Date Management**: Day.js

## Features

- 🔐 Web3 wallet authentication
- 📊 Project management dashboard
- 🔧 DLL plugin management
- 👥 Organization and member management
- 🔑 API key management
- 📈 Usage analytics and monitoring
- 🌐 Cross-URL configuration
- 🔔 Real-time notifications

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aevatar-station-frontend

# Install dependencies
pnpm install

# Install Git hooks
pnpm run install-hooks

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:dev` - Run tests in watch mode
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome

## Testing

The project uses Vitest for unit testing with comprehensive coverage requirements.

*Coverage metrics for DllTable component - our main tested component*

### Test Structure

- **Unit Tests**: Component-level testing with mocking
- **Integration Tests**: End-to-end workflow testing
- **Coverage Requirements**: Minimum 80% across all metrics
- **Test Categories**:
  - ✅ Positive Test Cases
  - ❌ Negative Test Cases  
  - 🔄 Boundary Test Cases
  - 💥 Exception Test Cases
  - ⏱️ Async Test Cases
  - 🎭 Mock Test Cases

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:dev

# Run specific test file
pnpm test src/components/DllTable/__tests__/index.test.tsx
```

## Project Structure

```
src/
├── api/                 # API layer and utilities
├── app/                 # Page components and routes
├── components/          # Reusable UI components
│   ├── DllTable/       # DLL management table (100% test coverage)
│   ├── ui/             # Base UI components
│   └── ...
├── hooks/              # Custom React hooks
├── state/              # Jotai atoms for state management
├── utils/              # Utility functions
├── constants/          # Application constants
└── assets/             # Static assets
```

## Key Components

### DllTable Component

A comprehensive data table for managing DLL plugins with full CRUD operations:

- ✅ Create, read, update, delete DLL files
- 🔄 Real-time status monitoring  
- ⚡ Async loading states
- 🛡️ Error handling and validation
- 📱 Responsive design
- **Test Coverage**: 100% (23 test cases)

### Features Tested

- Component rendering and data display
- CRUD operations (Create, Read, Update, Delete)
- Loading state management
- Error handling for API failures
- Form data handling and validation
- Different DLL status types
- Boundary conditions and edge cases

## Development Guidelines

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint + Biome**: Code linting and formatting
- **Git Hooks**: Pre-commit validation via Lefthook
- **Test Coverage**: Minimum 80% required

### Testing Best Practices

- Use `describe` blocks for grouping related tests
- Follow Arrange-Act-Assert pattern
- Mock external dependencies properly
- Test positive, negative, and edge cases
- Maintain isolated, independent tests
- Use meaningful test descriptions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write comprehensive tests (80%+ coverage required)
4. Ensure all tests pass
5. Follow code style guidelines
6. Submit a pull request

## License

[License information to be added]
