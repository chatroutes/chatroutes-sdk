# ChatRoutes SDK - Basic Example

This is a basic example of using the ChatRoutes SDK to create conversations and send messages.

## ⚠️ StackBlitz Limitation

**Note:** StackBlitz's Web Container environment has CORS restrictions that prevent external API calls. This code is provided as a **reference only** and won't run successfully in StackBlitz.

## ✅ How to Run This Example

### Option 1: Local Setup (Recommended)

```bash
# Clone or download the example
git clone https://github.com/chatroutes/chatroutes-sdk.git
cd chatroutes-sdk/stackblitz/basic-example

# Install dependencies
npm install

# Set your API key
export CHATROUTES_API_KEY="your-api-key-here"

# Run
npm start
```

### Option 2: CodeSandbox

Fork this to CodeSandbox which supports external API calls:
1. Click "Fork" in CodeSandbox
2. Add `CHATROUTES_API_KEY` in Environment Variables
3. Run the example

## Setup

1. Get your API key from [chatroutes.com](https://chatroutes.com) (Dashboard → API Keys)
2. Set your API key as an environment variable
3. Run the example locally or in CodeSandbox

## What This Example Does

- Creates a new conversation
- Sends a message asking about quantum computing
- Displays the AI response

## Next Steps

- Try the streaming example
- Explore conversation branching
- Compare multiple AI models

## Local Development

For the best experience, run the examples locally:

```bash
npm install chatroutes
```

See the [GitHub repository](https://github.com/chatroutes/chatroutes-sdk) for complete examples.
