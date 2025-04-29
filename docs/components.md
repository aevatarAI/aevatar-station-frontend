# Component Documentation

## Overview

This document outlines the component architecture and best practices for the Aevatar Station Frontend project.

## Component Structure

### Directory Organization

```
src/components/
├── common/           # Shared components
├── features/         # Feature-specific components
├── layouts/          # Layout components
└── ui/              # Basic UI components
```

### Component Categories

1. **Common Components**
   - Reusable across multiple features
   - Highly generic and configurable
   - Examples: Button, Input, Modal

2. **Feature Components**
   - Specific to a particular feature
   - May use common components
   - Examples: UserProfile, SettingsPanel

3. **Layout Components**
   - Define page structure
   - Handle responsive design
   - Examples: Header, Footer, Sidebar

4. **UI Components**
   - Basic building blocks
   - Minimal business logic
   - Examples: Icon, Badge, Tooltip

## Component Guidelines

### Naming Conventions

- Use PascalCase for component names
- Use descriptive, purpose-indicating names
- Suffix with type when necessary (e.g., `Button.tsx`, `Modal.tsx`)

### File Structure

```typescript
// ComponentName.tsx
import { FC } from 'react';
import { ComponentNameProps } from './types';
import { styles } from './styles';

export const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};
```

### Props Interface

```typescript
// types.ts
export interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: () => void;
}
```

### Styling

- Use Tailwind CSS for styling
- Follow BEM naming convention for custom classes
- Keep styles modular and reusable

## Best Practices

### Component Design

1. **Single Responsibility**
   - Each component should do one thing well
   - Split complex components into smaller ones

2. **Props Design**
   - Keep props interface simple
   - Use TypeScript for type safety
   - Document required vs optional props

3. **State Management**
   - Use local state for UI-only state
   - Use global state for shared data
   - Implement proper error handling

4. **Performance**
   - Use React.memo for expensive renders
   - Implement proper cleanup in useEffect
   - Optimize re-renders

### Code Organization

1. **Imports**
   - Group imports by type
   - Use absolute imports
   - Remove unused imports

2. **Component Structure**
   - Props destructuring at the top
   - Hooks after props
   - Helper functions before render
   - Return statement at the bottom

3. **Comments**
   - Document complex logic
   - Explain non-obvious decisions
   - Keep comments up to date

## Testing Components

See [Testing Guidelines](./testing.md) for detailed testing practices.

## Common Patterns

### Form Components

```typescript
import { useForm } from 'react-hook-form';

export const FormComponent: FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### Modal Components

```typescript
export const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

### List Components

```typescript
export const List: FC<ListProps> = ({ items, renderItem }) => {
  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};
```

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
