# KnowledgeDeck

A Chrome extension for organizing research and ideas with AI-powered features. Transform your cluttered tabs into clear insights with smart bookmarking, note-taking, and AI-assisted organization.

## Features

- 📚 Smart Bookmarking: Save and organize web pages with auto-generated summaries
- 📝 Note Taking: Create and organize notes with customizable templates
- 🤖 AI-Powered: Automatic tagging, summarization, and content recommendations
- 🗂️ Folder Management: Organize your research with intuitive folder structures
- 🔄 Drag-and-Drop: Easily reorganize your content
- 🧠 Mind Mapping: Visualize relationships between your saved content
- ✂️ Web Clipping: Save specific parts of web pages
- 🔍 Advanced Search: Find your content with powerful search capabilities
- 📱 Offline Support: Access your content without an internet connection

## Development Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd knowledge-deck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory in your project folder

## Project Structure

```
knowledge-deck/
├── docs/                    # Documentation
│   ├── architecture/       # Architecture documentation
│   ├── guidelines/        # Development guidelines
│   └── api/              # API documentation
├── src/
│   ├── background/        # Chrome extension background scripts
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── storage/          # Storage utilities
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── services/         # Service layer (AI, etc.)
│   └── styles/           # Global styles and Tailwind config
├── public/               # Static assets
└── package.json
```

## Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB with Dexie.js
- **Mind Mapping**: React Flow
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **AI Integration**: OpenAI API

## Contributing

Please read [CONTRIBUTING.md](docs/guidelines/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 