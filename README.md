# Simp AI

<div align="center">

**The Future of AI-Powered Conversations**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

*A sophisticated AI chat platform featuring multiple models, advanced tools, and seamless user experience.*

[Live Demo](https://simp-ai.vercel.app) • [Documentation](#features) • [Contributing](#contributing)

</div>

---

## 🚀 Overview

Simp AI is a cutting-edge AI chat platform that combines the power of multiple AI models with an intuitive, professional interface. Built for both casual users and enterprise applications, it offers unparalleled conversational AI capabilities with advanced tooling and research features.

### ✨ Key Highlights

- **Multi-Model Support**: Access to 15+ AI models from leading providers
- **Advanced Tooling**: Integrated search, calculation, and research capabilities
- **Professional UI**: Clean, modern design with dark/light theme support
- **Real-time Streaming**: Instant responses with live typing indicators
- **Enterprise Ready**: Built with scalability and security in mind

## 🎯 Features

### 🤖 AI Models
- **OpenRouter**: Access to 100+ models including GPT-4, Claude, Gemini
- **Grok**: xAI's latest reasoning models
- **Google Gemini**: Google's multimodal AI
- **Perplexity**: Research-focused AI models
- **Local Models**: Support for Ollama and local deployments

### 🛠️ Advanced Tools
- **Web Search**: Real-time information retrieval
- **Deep Research**: Multi-step investigative analysis
- **Code Execution**: Run and test code snippets
- **File Analysis**: Process and analyze uploaded documents
- **Image Generation**: Create visuals with AI

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Theme System**: Automatic dark/light mode with system preference detection
- **Conversation Management**: Save, organize, and search chat history
- **Export Options**: Download conversations in multiple formats
- **Accessibility**: WCAG compliant with keyboard navigation

## 🏗️ Architecture

```
├── app/                 # Next.js 15 App Router
│   ├── api/            # API routes
│   ├── chat/           # Chat interface
│   └── settings/       # User preferences
├── components/         # Reusable UI components
│   ├── ai-elements/    # AI-specific components
│   └── ui/            # Base UI library
├── lib/               # Core business logic
│   ├── models.ts      # AI model configurations
│   ├── tools.ts       # Tool definitions
│   └── prompt.ts      # System prompts
└── hooks/             # Custom React hooks
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/simp-ai.git
cd simp-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Configuration

Add your API keys to `.env.local`:

```bash
# Required for different AI providers
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
PERPLEXITY_API_KEY=your_perplexity_key

# Optional: Database and authentication
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_auth_secret
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit `http://localhost:3000` to see the application.

## 📊 Performance

- **Lightning Fast**: Built with Next.js 15 and Turbopack
- **Optimized Bundle**: Tree-shaking and code splitting
- **Modern Stack**: React 19, TypeScript, Tailwind CSS 4
- **Edge Ready**: Deployable to Vercel, Netlify, or any edge runtime

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Development server with Turbopack
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint checks
pnpm typecheck    # TypeScript validation
pnpm check        # Full quality check
pnpm db:migrate   # Database migrations
pnpm db:studio    # Prisma Studio
```

### Code Quality

- **TypeScript**: Full type safety with strict mode
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build and run
docker build -t simp-ai .
docker run -p 3000:3000 simp-ai
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the quality checks: `pnpm check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Vercel AI SDK](https://vercel.com/docs/ai) - AI integration
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components

## 📞 Contact

- **Website**: [simp-ai.com](https://simp-ai.com)
- **Twitter**: [@simp_ai](https://twitter.com/simp_ai)
- **Email**: hello@simp-ai.com

---

<div align="center">

**Built with ❤️ for the future of AI interaction**

[⭐ Star us on GitHub](https://github.com/your-org/simp-ai) • [🐛 Report Issues](https://github.com/your-org/simp-ai/issues) • [💬 Join Discussions](https://github.com/your-org/simp-ai/discussions)

</div>
