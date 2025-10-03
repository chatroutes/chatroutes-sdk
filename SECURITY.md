# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in the ChatRoutes SDK, please send an email to:

**security@chatroutes.com**

### What to Include

Please include the following in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Development**: Varies based on severity
- **Disclosure**: Coordinated with reporter

## Security Best Practices

### API Key Security

**DO:**
- ✅ Store API keys in environment variables
- ✅ Use `.gitignore` to exclude `.env` files
- ✅ Rotate API keys regularly
- ✅ Use different API keys for development and production
- ✅ Implement API key access controls

**DON'T:**
- ❌ Hardcode API keys in source code
- ❌ Commit API keys to version control
- ❌ Share API keys publicly
- ❌ Use production keys in development
- ❌ Include API keys in client-side code

### Example: Secure API Key Usage

```typescript
// ✅ GOOD - Use environment variables
import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});
```

```typescript
// ❌ BAD - Hardcoded API key
const client = new ChatRoutesClient({
  apiKey: 'cr_prod_sk_1234567890abcdef' // Never do this!
});
```

### Environment Variables

Create a `.env` file (and add it to `.gitignore`):

```bash
CHATROUTES_API_KEY=your_api_key_here
```

Load it using a package like `dotenv`:

```typescript
import 'dotenv/config';
import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});
```

## Known Security Considerations

### API Key Exposure

- Never expose API keys in client-side JavaScript
- Use a backend server to proxy API requests
- Implement proper CORS and CSP headers

### Data Privacy

- Be mindful of sensitive data in conversation content
- Implement proper data retention policies
- Review ChatRoutes' privacy policy and terms of service

### Rate Limiting

- Implement client-side rate limiting
- Handle 429 Rate Limit errors gracefully
- Use exponential backoff for retries

## Responsible Disclosure

We practice responsible disclosure:

1. We acknowledge receipt of your report within 48 hours
2. We work with you to understand and verify the issue
3. We develop and test a fix
4. We coordinate disclosure timing with you
5. We credit you in our security advisory (if desired)

## Security Updates

Security updates are released as soon as possible after verification. We recommend:

- Subscribe to repository releases
- Enable Dependabot alerts
- Update to the latest version regularly

## Contact

- **Security Issues**: security@chatroutes.com
- **General Support**: support@chatroutes.com
- **Website**: https://chatroutes.com

---

**Thank you for helping keep ChatRoutes and our users safe!**
