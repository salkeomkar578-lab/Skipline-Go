# Contributing to Skipline Go

First off, thank you for considering contributing to Skipline Go! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming environment. Please be respectful and constructive in all interactions.

---

## 🤔 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs what actually happened
- **Screenshots** if applicable
- **Environment details** (browser, OS, device)

### 💡 Suggesting Features

Feature suggestions are welcome! Please include:

- **Clear description** of the feature
- **Use case** - why is this needed?
- **Possible implementation** approach (optional)

### 🔧 Code Contributions

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to let others know you're working on it
3. Fork the repo and create your branch
4. Make your changes
5. Submit a pull request

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/skipline-go.git
cd skipline-go

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-reviewed the code
- [ ] Added comments for complex logic
- [ ] No new warnings or errors
- [ ] Updated documentation if needed

---

## 📝 Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for all new files
- Use **functional components** with hooks
- Follow **ESLint** rules
- Use **meaningful variable names**

```typescript
// ✅ Good
const handleProductScan = (barcode: string) => { ... }

// ❌ Bad  
const hps = (b: string) => { ... }
```

### Component Structure

```typescript
// 1. Imports
import React, { useState } from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title }) => {
  // Hooks
  const [state, setState] = useState('');
  
  // Handlers
  const handleClick = () => { ... };
  
  // Render
  return <div>{title}</div>;
};
```

### CSS/Styling

- Use **Tailwind CSS** classes
- Follow **mobile-first** approach
- Use **consistent spacing** (4, 8, 16, 24, 32)

### Git Commits

Use clear, descriptive commit messages:

```
feat: add barcode scanning feature
fix: resolve cart total calculation bug
docs: update README installation steps
style: format code with prettier
refactor: simplify payment logic
```

---

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `feature` | New feature request |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `documentation` | Documentation improvements |

---

## 💬 Questions?

Feel free to open an issue with your question or reach out to the maintainers.

---

Thank you for contributing! 🙌
