## Contributing to ChatRoutes SDK

Thank you for your interest in contributing to the ChatRoutes SDK! We welcome contributions from the community.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/chatroutes/chatroutes-sdk/issues)
2. If not, create a new issue using the Bug Report template
3. Provide as much detail as possible:
   - SDK version
   - Node.js version
   - Code snippet to reproduce
   - Expected vs actual behavior

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue using the Feature Request template
3. Describe the use case and proposed solution

### Pull Requests

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chatroutes-sdk.git
   cd chatroutes-sdk
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/my-bug-fix
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Make your changes**
   - Write clear, concise code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

6. **Run tests**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature X"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Adding tests
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `chore:` - Build/tooling changes

8. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

9. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Project Structure

```
src/
├── client.ts          # Main SDK client
├── errors.ts          # Error classes
├── types.ts           # TypeScript types
├── api/              # API modules
│   ├── auth.ts       # Authentication
│   ├── conversations.ts
│   ├── messages.ts
│   └── branches.ts
└── index.ts          # Exports
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Build the package
npm run build

# Build and watch for changes
npm run dev
```

### Linting

```bash
# Run ESLint
npm run lint

# Run type checking
npm run typecheck
```

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules (`.eslintrc.js`)
- Use Prettier for formatting
- Write clear, self-documenting code
- Add JSDoc comments for public APIs

## Testing Guidelines

- Write unit tests for all new features
- Aim for 80%+ code coverage
- Use descriptive test names
- Test error cases and edge cases

## Documentation

- Update README.md for user-facing changes
- Update API documentation for new endpoints
- Add code examples for new features
- Keep CHANGELOG.md up to date

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a GitHub release
4. GitHub Actions automatically publishes to npm

## Getting Help

- [GitHub Issues](https://github.com/chatroutes/chatroutes-sdk/issues)
- [Documentation](https://docs.chatroutes.com)
- Email: support@chatroutes.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
