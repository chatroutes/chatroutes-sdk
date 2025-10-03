# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-XX

### Added
- Initial beta release of ChatRoutes TypeScript/JavaScript SDK
- Authentication API (`register`, `login`, `me`, `refreshToken`, `logout`)
- Conversations API (CRUD operations)
- Messages API (send, stream, list, update, delete)
- Branches API (create, fork, list, update, delete, getMessages)
- Conversation tree visualization support
- Streaming responses via Server-Sent Events (SSE)
- Comprehensive error handling with custom error types
- Automatic retry logic with exponential backoff
- Full TypeScript support with type definitions
- ESM and CommonJS builds
- Comprehensive documentation and examples

### Features
- ✅ API key authentication
- ✅ Real-time streaming responses
- ✅ Conversation branching and forking
- ✅ Error recovery with configurable retries
- ✅ Type-safe API with TypeScript
- ✅ Browser and Node.js support
- ✅ Dual model support (GPT-5 and Claude Opus 4.1)

### Developer Experience
- GitHub Actions CI/CD workflows
- Issue templates for bugs and feature requests
- Pull request template
- Contributing guidelines
- Security policy
- MIT license

## Release Notes

### v0.1.0 - Beta Release

This is the initial beta release of the ChatRoutes SDK. The API is functional but may change before the 1.0.0 stable release.

**Supported Features:**
- User authentication and session management
- Conversation management (create, read, update, delete)
- Message sending with both blocking and streaming modes
- Conversation branching and forking
- Full conversation tree retrieval

**Known Limitations:**
- Parallel responses API (planned for v0.2.0)
- Usage tracking API (planned for v0.2.0)
- Billing API (planned for v0.2.0)
- WebSocket support (planned for future release)

**Breaking Changes:**
- None (initial release)

**Migration Guide:**
- N/A (initial release)

---

[Unreleased]: https://github.com/chatroutes/chatroutes-sdk/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/chatroutes/chatroutes-sdk/releases/tag/v0.1.0
